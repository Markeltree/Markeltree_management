import { Router, type Request } from "express";
import { Prisma, type LeaveStatus } from "@prisma/client";
import { z } from "zod";
import { PERMISSIONS as P } from "../config/permissions.js";
import { prisma } from "../lib/prisma.js";
import { ah, badRequest, conflict, forbidden, notFound, paged, paging, parse } from "../lib/http.js";
import { audit } from "../lib/audit.js";
import { dateOnly, eachDay, isoDate, monthRange, todayIn } from "../lib/dates.js";
import { notify, userIdsForEmployees, userIdsWithPermission } from "../lib/notify.js";
import { employeeScope, getReportIds, inScope, scopeWhere } from "../lib/scope.js";
import { getSetting } from "../lib/settings.js";
import { assertCan, can, requireEmployeeId } from "../middleware/auth.js";
import { toCsv } from "../lib/csv.js";
import { cached, TAGS } from "../lib/cache.js";

const activeLeaveTypes = () =>
  cached("leaveTypes:active", 10 * 60_000, [TAGS.leaveTypes], () => prisma.leaveType.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }));

export const leaveRouter = Router();

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
const num = (v: Prisma.Decimal | number | null | undefined) => (v == null ? 0 : Number(v));

const employeeBrief = { select: { id: true, firstName: true, lastName: true, employeeCode: true, avatarUrl: true, designation: true } } as const;
const requestInclude = {
  employee: employeeBrief,
  approver: { select: { id: true, firstName: true, lastName: true } },
  leaveType: { select: { id: true, name: true, code: true, color: true } },
} satisfies Prisma.LeaveRequestInclude;

/** Number of working days in a range, excluding weekends and company holidays. */
async function countLeaveDays(start: Date, end: Date, halfDay: boolean) {
  const workingDays = (await getSetting("attendance.workingDays")) as number[];
  const holidays = await prisma.holiday.findMany({ where: { date: { gte: start, lte: end } }, select: { date: true } });
  const holidaySet = new Set(holidays.map((h) => isoDate(h.date)));
  const days = eachDay(start, end).filter((d) => workingDays.includes(d.getUTCDay()) && !holidaySet.has(isoDate(d))).length;
  return halfDay && days === 1 ? 0.5 : days;
}

/** LEAVE-04: allowance, used, pending and available days per leave type for one year. */
export async function computeBalances(employeeId: string, year: number) {
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year, 11, 31));
  const [types, overrides, requests] = await Promise.all([
    activeLeaveTypes(),
    prisma.leaveBalance.findMany({ where: { employeeId, year } }),
    prisma.leaveRequest.findMany({
      where: { employeeId, status: { in: ["APPROVED", "PENDING"] }, startDate: { lte: end }, endDate: { gte: start } },
      select: { leaveTypeId: true, status: true, days: true },
    }),
  ]);
  return types.map((t) => {
    const o = overrides.find((b) => b.leaveTypeId === t.id);
    const allowance = o ? num(o.allowance) : num(t.annualAllowance);
    const adjustment = o ? num(o.adjustment) : 0;
    const used = requests.filter((r) => r.leaveTypeId === t.id && r.status === "APPROVED").reduce((s, r) => s + num(r.days), 0);
    const pending = requests.filter((r) => r.leaveTypeId === t.id && r.status === "PENDING").reduce((s, r) => s + num(r.days), 0);
    const unlimited = num(t.annualAllowance) === 0 && !o; // e.g. unpaid leave
    return {
      leaveType: { id: t.id, name: t.name, code: t.code, color: t.color, isPaid: t.isPaid },
      year,
      allowance,
      adjustment,
      used,
      pending,
      available: unlimited ? null : allowance + adjustment - used - pending,
      unlimited,
    };
  });
}

/** Whether the requester can decide on a given employee's leave. */
async function canApproveFor(req: Request, employeeId: string) {
  if (employeeId === req.auth!.employeeId) return false;
  if (can(req, P.LEAVE_APPROVE_ALL)) return true;
  if (can(req, P.LEAVE_APPROVE_TEAM) && req.auth!.employeeId) {
    return (await getReportIds(req.auth!.employeeId)).includes(employeeId);
  }
  return false;
}

async function validateRequest(employeeId: string, body: { leaveTypeId: string; startDate: string; endDate: string; halfDay?: boolean }, excludeId?: string) {
  const start = dateOnly(body.startDate);
  const end = dateOnly(body.endDate);
  if (end < start) throw badRequest("End date must be on or after the start date");
  if (body.halfDay && isoDate(start) !== isoDate(end)) throw badRequest("Half-day leave must be a single day");
  const type = await prisma.leaveType.findUnique({ where: { id: body.leaveTypeId } });
  if (!type || !type.isActive) throw badRequest("Leave type not available");

  const days = await countLeaveDays(start, end, !!body.halfDay);
  if (days <= 0) throw badRequest("The selected dates contain no working days");

  const overlap = await prisma.leaveRequest.findFirst({
    where: {
      employeeId,
      status: { in: ["PENDING", "APPROVED"] },
      startDate: { lte: end },
      endDate: { gte: start },
      ...(excludeId && { id: { not: excludeId } }),
    },
  });
  if (overlap) throw conflict(`Overlaps an existing ${overlap.status.toLowerCase()} request (${isoDate(overlap.startDate)} – ${isoDate(overlap.endDate)})`);

  // Balance is checked against the year the leave starts in.
  const balances = await computeBalances(employeeId, start.getUTCFullYear());
  const bal = balances.find((b) => b.leaveType.id === type.id);
  if (bal && !bal.unlimited) {
    const alreadyPending = excludeId
      ? num((await prisma.leaveRequest.findUnique({ where: { id: excludeId }, select: { days: true, status: true } }))?.days)
      : 0;
    const available = (bal.available ?? 0) + (excludeId ? alreadyPending : 0);
    if (days > available) throw badRequest(`Insufficient ${type.name} balance: ${available} day(s) available, ${days} requested`);
  }
  return { start, end, days, type };
}

async function approverFor(employeeId: string) {
  const emp = await prisma.employee.findUnique({ where: { id: employeeId }, select: { managerId: true } });
  return emp?.managerId ?? null;
}

// ── Leave types (LEAVE-01) ──────────────────────────────────────

const leaveTypeSchema = z.object({
  name: z.string().trim().min(1).max(80),
  code: z.string().trim().min(1).max(20).toUpperCase(),
  annualAllowance: z.number().min(0).max(365),
  isPaid: z.boolean().optional(),
  requiresDocument: z.boolean().optional(),
  carryForwardMax: z.number().min(0).max(365).optional(),
  color: z.string().max(20).nullable().optional(),
  isActive: z.boolean().optional(),
  policy: z.string().max(2000).nullable().optional(),
});

leaveRouter.get(
  "/types",
  ah(async (req, res) => {
    res.json(req.query.all ? await prisma.leaveType.findMany({ orderBy: { name: "asc" } }) : await activeLeaveTypes());
  }),
);

leaveRouter.post(
  "/types",
  ah(async (req, res) => {
    assertCan(req, P.LEAVE_MANAGE_POLICY);
    const body = parse(leaveTypeSchema, req.body);
    const type = await prisma.leaveType.create({ data: body });
    await audit(req, "leave_type.create", "LeaveType", type.id, body);
    res.status(201).json(type);
  }),
);

leaveRouter.patch(
  "/types/:id",
  ah(async (req, res) => {
    assertCan(req, P.LEAVE_MANAGE_POLICY);
    const body = parse(leaveTypeSchema.partial(), req.body);
    const type = await prisma.leaveType.update({ where: { id: String(req.params.id) }, data: body });
    await audit(req, "leave_type.update", "LeaveType", type.id, body);
    res.json(type);
  }),
);

// ── Holidays (LEAVE-05) ─────────────────────────────────────────

leaveRouter.get(
  "/holidays",
  ah(async (req, res) => {
    const year = Number(req.query.year) || new Date().getUTCFullYear();
    res.json(
      await cached(`holidays:${year}`, 10 * 60_000, [TAGS.holidays], () =>
        prisma.holiday.findMany({
          where: { date: { gte: new Date(Date.UTC(year, 0, 1)), lte: new Date(Date.UTC(year, 11, 31)) } },
          orderBy: { date: "asc" },
        }),
      ),
    );
  }),
);

leaveRouter.post(
  "/holidays",
  ah(async (req, res) => {
    assertCan(req, P.HOLIDAYS_MANAGE);
    const body = parse(z.object({ date: dateStr, name: z.string().trim().min(1).max(120), region: z.string().max(60).nullable().optional() }), req.body);
    const holiday = await prisma.holiday.create({ data: { ...body, date: dateOnly(body.date) } });
    await audit(req, "holiday.create", "Holiday", holiday.id, body);
    res.status(201).json(holiday);
  }),
);

leaveRouter.delete(
  "/holidays/:id",
  ah(async (req, res) => {
    assertCan(req, P.HOLIDAYS_MANAGE);
    const holiday = await prisma.holiday.delete({ where: { id: String(req.params.id) } });
    await audit(req, "holiday.delete", "Holiday", holiday.id, { date: isoDate(holiday.date), name: holiday.name });
    res.json({ ok: true });
  }),
);

// ── Balances ────────────────────────────────────────────────────

leaveRouter.get(
  "/balances",
  ah(async (req, res) => {
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : requireEmployeeId(req);
    const scope = await employeeScope(req, P.LEAVE_VIEW_ALL, P.LEAVE_APPROVE_TEAM);
    if (!inScope(scope, employeeId)) throw forbidden();
    const year = Number(req.query.year) || todayIn(await getSetting("company.timezone")).getUTCFullYear();
    res.json(await computeBalances(employeeId, year));
  }),
);

leaveRouter.put(
  "/balances",
  ah(async (req, res) => {
    assertCan(req, P.LEAVE_MANAGE_POLICY);
    const body = parse(
      z.object({
        employeeId: z.string().uuid(),
        leaveTypeId: z.string().uuid(),
        year: z.number().int().min(2000).max(2100),
        allowance: z.number().min(0).max(365),
        adjustment: z.number().min(-365).max(365).default(0),
        note: z.string().max(300).optional(),
      }),
      req.body,
    );
    const { employeeId, leaveTypeId, year, ...data } = body;
    const row = await prisma.leaveBalance.upsert({
      where: { employeeId_leaveTypeId_year: { employeeId, leaveTypeId, year } },
      create: body,
      update: data,
    });
    await audit(req, "leave_balance.update", "LeaveBalance", row.id, body);
    res.json(row);
  }),
);

// ── Requests (LEAVE-02/03/06, workflow 10.3) ────────────────────

const requestSchema = z.object({
  leaveTypeId: z.string().uuid(),
  startDate: dateStr,
  endDate: dateStr,
  halfDay: z.boolean().optional(),
  reason: z.string().trim().min(3, "Please give a reason").max(1000),
});

leaveRouter.post(
  "/requests",
  ah(async (req, res) => {
    const employeeId = requireEmployeeId(req);
    const body = parse(requestSchema, req.body);
    const { start, end, days, type } = await validateRequest(employeeId, body);
    const approverId = await approverFor(employeeId);
    const request = await prisma.leaveRequest.create({
      data: { employeeId, leaveTypeId: type.id, startDate: start, endDate: end, halfDay: !!body.halfDay, days, reason: body.reason, approverId },
      include: requestInclude,
    });
    await audit(req, "leave.request", "LeaveRequest", request.id, { type: type.name, start: body.startDate, end: body.endDate, days });
    // Route to the manager; fall back to HR approvers when there is no manager.
    const recipients = approverId ? await userIdsForEmployees([approverId]) : await userIdsWithPermission(P.LEAVE_APPROVE_ALL);
    await notify(recipients.filter((u) => u !== req.auth!.userId), {
      type: "LEAVE_SUBMITTED",
      title: "Leave request awaiting approval",
      body: `${request.employee.firstName} ${request.employee.lastName} requested ${days} day(s) of ${type.name} (${body.startDate} – ${body.endDate}).`,
      link: "/leave?tab=approvals",
      entityType: "LeaveRequest",
      entityId: request.id,
    });
    res.status(201).json(request);
  }),
);

/**
 * List requests. view=mine (default) | approvals (pending items I can decide) | all (scope-limited history).
 */
leaveRouter.get(
  "/requests",
  ah(async (req, res) => {
    const { page, pageSize, skip, take } = paging(req.query);
    const view = String(req.query.view ?? "mine");
    const status = req.query.status ? (String(req.query.status) as LeaveStatus) : undefined;
    let where: Prisma.LeaveRequestWhereInput;
    if (view === "mine") {
      where = { employeeId: requireEmployeeId(req) };
    } else if (view === "approvals") {
      assertCan(req, P.LEAVE_APPROVE_TEAM, P.LEAVE_APPROVE_ALL);
      const scope = await employeeScope(req, P.LEAVE_APPROVE_ALL, P.LEAVE_APPROVE_TEAM);
      where = { ...scopeWhere(scope), employeeId: { ...(scope.kind === "ids" && { in: scope.ids }), not: req.auth!.employeeId ?? undefined }, status: status ?? "PENDING" };
    } else {
      assertCan(req, P.LEAVE_VIEW_ALL, P.LEAVE_APPROVE_TEAM, P.LEAVE_APPROVE_ALL);
      where = scopeWhere(await employeeScope(req, P.LEAVE_VIEW_ALL, P.LEAVE_APPROVE_TEAM));
    }
    if (status && view !== "approvals") where.status = status;
    if (req.query.employeeId && view !== "mine") where.employeeId = String(req.query.employeeId);
    const [items, total] = await Promise.all([
      prisma.leaveRequest.findMany({ where, include: requestInclude, orderBy: { createdAt: "desc" }, skip, take }),
      prisma.leaveRequest.count({ where }),
    ]);
    res.json(paged(items, total, page, pageSize));
  }),
);

leaveRouter.get(
  "/requests/:id",
  ah(async (req, res) => {
    const request = await prisma.leaveRequest.findUnique({ where: { id: String(req.params.id) }, include: requestInclude });
    if (!request) throw notFound("Leave request");
    const scope = await employeeScope(req, P.LEAVE_VIEW_ALL, P.LEAVE_APPROVE_TEAM);
    if (!inScope(scope, request.employeeId) && !can(req, P.LEAVE_APPROVE_ALL)) throw forbidden();
    res.json({ ...request, canDecide: request.status === "PENDING" && (await canApproveFor(req, request.employeeId)) });
  }),
);

/** Employee edits and resubmits a request after changes were requested. */
leaveRouter.patch(
  "/requests/:id",
  ah(async (req, res) => {
    const employeeId = requireEmployeeId(req);
    const existing = await prisma.leaveRequest.findUnique({ where: { id: String(req.params.id) } });
    if (!existing || existing.employeeId !== employeeId) throw notFound("Leave request");
    if (!["PENDING", "CHANGES_REQUESTED"].includes(existing.status)) throw badRequest("Only pending requests can be edited");
    const body = parse(requestSchema, req.body);
    const { start, end, days, type } = await validateRequest(employeeId, body, existing.id);
    const request = await prisma.leaveRequest.update({
      where: { id: existing.id },
      data: { leaveTypeId: type.id, startDate: start, endDate: end, halfDay: !!body.halfDay, days, reason: body.reason, status: "PENDING", decisionNote: null, decidedAt: null },
      include: requestInclude,
    });
    await audit(req, "leave.resubmit", "LeaveRequest", request.id);
    if (existing.status === "CHANGES_REQUESTED") {
      await notify(existing.approverId ? await userIdsForEmployees([existing.approverId]) : await userIdsWithPermission(P.LEAVE_APPROVE_ALL), {
        type: "LEAVE_SUBMITTED",
        title: "Leave request resubmitted",
        body: `${request.employee.firstName} ${request.employee.lastName} updated their ${type.name} request.`,
        link: "/leave?tab=approvals",
        entityType: "LeaveRequest",
        entityId: request.id,
      });
    }
    res.json(request);
  }),
);

leaveRouter.post(
  "/requests/:id/cancel",
  ah(async (req, res) => {
    const employeeId = requireEmployeeId(req);
    const existing = await prisma.leaveRequest.findUnique({ where: { id: String(req.params.id) }, include: requestInclude });
    if (!existing || existing.employeeId !== employeeId) throw notFound("Leave request");
    const today = todayIn(await getSetting("company.timezone"));
    const cancellable = ["PENDING", "CHANGES_REQUESTED"].includes(existing.status) || (existing.status === "APPROVED" && existing.startDate > today);
    if (!cancellable) throw badRequest("This request can no longer be cancelled");
    const request = await prisma.leaveRequest.update({ where: { id: existing.id }, data: { status: "CANCELLED" }, include: requestInclude });
    await audit(req, "leave.cancel", "LeaveRequest", request.id, { previousStatus: existing.status });
    if (existing.status === "APPROVED" && existing.approverId) {
      await notify(await userIdsForEmployees([existing.approverId]), {
        type: "LEAVE_DECIDED",
        title: "Approved leave cancelled",
        body: `${existing.employee.firstName} ${existing.employee.lastName} cancelled leave ${isoDate(existing.startDate)} – ${isoDate(existing.endDate)}.`,
        link: "/leave?tab=team",
        entityType: "LeaveRequest",
        entityId: request.id,
      });
    }
    res.json(request);
  }),
);

leaveRouter.post(
  "/requests/:id/decision",
  ah(async (req, res) => {
    const body = parse(
      z.object({ action: z.enum(["APPROVE", "REJECT", "REQUEST_CHANGES"]), note: z.string().trim().max(1000).optional() }),
      req.body,
    );
    const existing = await prisma.leaveRequest.findUnique({ where: { id: String(req.params.id) }, include: requestInclude });
    if (!existing) throw notFound("Leave request");
    if (existing.status !== "PENDING") throw badRequest(`This request is already ${existing.status.toLowerCase().replace("_", " ")}`);
    if (!(await canApproveFor(req, existing.employeeId))) throw forbidden("You are not an approver for this employee");
    if (body.action !== "APPROVE" && !body.note) throw badRequest("Please add a note explaining the decision");

    if (body.action === "APPROVE") {
      // Re-validate balance at approval time; balance only changes after approval (acceptance criteria §19).
      const balances = await computeBalances(existing.employeeId, existing.startDate.getUTCFullYear());
      const bal = balances.find((b) => b.leaveType.id === existing.leaveTypeId);
      // `available` already deducts this pending request, so it must not have gone negative.
      if (bal && !bal.unlimited && (bal.available ?? 0) < 0) {
        throw badRequest("The employee no longer has enough balance for this request");
      }
    }
    const status: LeaveStatus = body.action === "APPROVE" ? "APPROVED" : body.action === "REJECT" ? "REJECTED" : "CHANGES_REQUESTED";
    const request = await prisma.leaveRequest.update({
      where: { id: existing.id },
      data: { status, decisionNote: body.note ?? null, decidedAt: new Date(), approverId: req.auth!.employeeId ?? existing.approverId },
      include: requestInclude,
    });
    await audit(req, `leave.${body.action.toLowerCase()}`, "LeaveRequest", request.id, { note: body.note });
    const label = { APPROVED: "approved", REJECTED: "rejected", CHANGES_REQUESTED: "returned for changes" }[status as "APPROVED"];
    await notify(await userIdsForEmployees([existing.employeeId]), {
      type: "LEAVE_DECIDED",
      title: `Leave request ${label}`,
      body: `Your ${existing.leaveType.name} request (${isoDate(existing.startDate)} – ${isoDate(existing.endDate)}) was ${label}.${body.note ? ` Note: ${body.note}` : ""}`,
      link: "/leave",
      entityType: "LeaveRequest",
      entityId: request.id,
    });
    res.json(request);
  }),
);

/** Team leave calendar: approved/pending leave overlapping the month, within the requester's scope. */
leaveRouter.get(
  "/calendar",
  ah(async (req, res) => {
    const m = /^(\d{4})-(\d{2})$/.exec(String(req.query.month ?? ""));
    const t = todayIn(await getSetting("company.timezone"));
    const { start, end } = m ? monthRange(Number(m[1]), Number(m[2])) : monthRange(t.getUTCFullYear(), t.getUTCMonth() + 1);
    const scope = await employeeScope(req, P.LEAVE_VIEW_ALL, P.LEAVE_APPROVE_TEAM);
    const [requests, holidays] = await Promise.all([
      prisma.leaveRequest.findMany({
        where: { ...scopeWhere(scope), status: { in: ["APPROVED", "PENDING"] }, startDate: { lte: end }, endDate: { gte: start } },
        include: requestInclude,
        orderBy: { startDate: "asc" },
      }),
      prisma.holiday.findMany({ where: { date: { gte: start, lte: end } }, orderBy: { date: "asc" } }),
    ]);
    res.json({ month: isoDate(start).slice(0, 7), requests, holidays });
  }),
);

/** REP-02: leave utilisation and remaining balance per employee for a year. */
leaveRouter.get(
  "/report",
  ah(async (req, res) => {
    assertCan(req, P.LEAVE_VIEW_ALL, P.REPORTS_VIEW_ALL, P.REPORTS_VIEW_TEAM, P.LEAVE_APPROVE_TEAM);
    const year = Number(req.query.year) || todayIn(await getSetting("company.timezone")).getUTCFullYear();
    const scope = await employeeScope(req, P.LEAVE_VIEW_ALL, P.LEAVE_APPROVE_TEAM);
    const employees = await prisma.employee.findMany({
      where: { ...scopeWhere(scope, "id"), employmentStatus: { not: "EXITED" }, ...(req.query.departmentId && { departmentId: String(req.query.departmentId) }) },
      select: { id: true, employeeCode: true, firstName: true, lastName: true, department: { select: { name: true } } },
      orderBy: { firstName: "asc" },
    });
    const rows = [];
    for (const e of employees) rows.push({ employee: e, balances: await computeBalances(e.id, year) });
    if (req.query.format === "csv") {
      const csv = toCsv(
        ["Employee Code", "Name", "Department", "Leave Type", "Allowance", "Adjustment", "Used", "Pending", "Available"],
        rows.flatMap((r) =>
          r.balances.map((b) => [
            r.employee.employeeCode, `${r.employee.firstName} ${r.employee.lastName}`, r.employee.department?.name ?? "",
            b.leaveType.name, b.unlimited ? "Unlimited" : b.allowance, b.adjustment, b.used, b.pending, b.available ?? "Unlimited",
          ]),
        ),
      );
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="leave-${year}.csv"`);
      await audit(req, "report.export", "Leave", null, { year });
      return res.send(csv);
    }
    res.json({ year, rows });
  }),
);
