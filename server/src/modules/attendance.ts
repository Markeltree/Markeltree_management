import { Router } from "express";
import type { Attendance, AttendanceStatus, Prisma } from "@prisma/client";
import { z } from "zod";
import { PERMISSIONS as P } from "../config/permissions.js";
import { prisma } from "../lib/prisma.js";
import { ah, badRequest, conflict, forbidden, notFound, parse } from "../lib/http.js";
import { audit } from "../lib/audit.js";
import { dateOnly, eachDay, hhmmToMinutes, isoDate, monthRange, todayIn, zonedParts } from "../lib/dates.js";
import { notify, userIdsForEmployees } from "../lib/notify.js";
import { employeeScope, inScope, scopeWhere } from "../lib/scope.js";
import { getSetting } from "../lib/settings.js";
import { assertCan, requireEmployeeId } from "../middleware/auth.js";
import { toCsv } from "../lib/csv.js";

export const attendanceRouter = Router();

export async function loadPolicy() {
  const [timeZone, workStart, workEnd, grace, earlyGrace, workingDays, allowedIps] = await Promise.all([
    getSetting("company.timezone"),
    getSetting("attendance.workStart"),
    getSetting("attendance.workEnd"),
    getSetting("attendance.graceMinutes"),
    getSetting("attendance.earlyLeaveGraceMinutes"),
    getSetting("attendance.workingDays"),
    getSetting("attendance.allowedIps"),
  ]);
  return {
    timeZone,
    workStart,
    workEnd,
    startMin: hhmmToMinutes(workStart),
    endMin: hhmmToMinutes(workEnd),
    grace: Number(grace),
    earlyGrace: Number(earlyGrace),
    workingDays: workingDays as number[],
    allowedIps: allowedIps as string[],
  };
}
type Policy = Awaited<ReturnType<typeof loadPolicy>>;

/** ATT-03: derive status from check-in/out times against the configured policy. */
export function computeStatus(checkIn: Date | null, checkOut: Date | null, policy: Policy): AttendanceStatus {
  if (!checkIn) return "ABSENT";
  const late = zonedParts(checkIn, policy.timeZone).minutes > policy.startMin + policy.grace;
  const early = checkOut ? zonedParts(checkOut, policy.timeZone).minutes < policy.endMin - policy.earlyGrace : false;
  if (late && early) return "LATE_AND_EARLY";
  if (late) return "LATE";
  if (early) return "EARLY_DEPARTURE";
  return "PRESENT";
}

const workedMinutes = (checkIn: Date | null, checkOut: Date | null) =>
  checkIn && checkOut ? Math.max(0, Math.round((checkOut.getTime() - checkIn.getTime()) / 60000)) : null;

function clientIp(req: { ip?: string; headers: Record<string, unknown> }) {
  return (req.ip ?? "").replace(/^::ffff:/, "");
}

type DayInfo = {
  date: string;
  status: AttendanceStatus | "PENDING" | "NOT_JOINED";
  record: Attendance | null;
  holiday?: string;
  leaveType?: string;
  leavePaid?: boolean;
  leaveHalfDay?: boolean;
};

/**
 * Resolves the effective status of each day for each employee: recorded attendance,
 * approved leave, holiday, weekend, or ABSENT for past working days with no record.
 */
export async function buildDays(employeeIds: string[], start: Date, end: Date, policy: Policy) {
  const today = todayIn(policy.timeZone);
  const [employees, records, holidays, leaves] = await Promise.all([
    prisma.employee.findMany({ where: { id: { in: employeeIds } }, select: { id: true, joiningDate: true, exitDate: true } }),
    prisma.attendance.findMany({ where: { employeeId: { in: employeeIds }, date: { gte: start, lte: end } } }),
    prisma.holiday.findMany({ where: { date: { gte: start, lte: end } } }),
    prisma.leaveRequest.findMany({
      where: { employeeId: { in: employeeIds }, status: "APPROVED", startDate: { lte: end }, endDate: { gte: start } },
      include: { leaveType: { select: { name: true, isPaid: true } } },
    }),
  ]);
  const recordMap = new Map(records.map((r) => [`${r.employeeId}:${isoDate(r.date)}`, r]));
  const holidayMap = new Map(holidays.map((h) => [isoDate(h.date), h.name]));
  const result = new Map<string, DayInfo[]>();

  for (const emp of employees) {
    const days: DayInfo[] = [];
    for (const d of eachDay(start, end)) {
      const key = isoDate(d);
      const record = recordMap.get(`${emp.id}:${key}`) ?? null;
      const leave = leaves.find((l) => l.employeeId === emp.id && l.startDate <= d && l.endDate >= d);
      let status: DayInfo["status"];
      if (d < emp.joiningDate || (emp.exitDate && d > emp.exitDate)) status = "NOT_JOINED";
      else if (record) status = record.status;
      else if (leave) status = "ON_LEAVE";
      else if (holidayMap.has(key)) status = "HOLIDAY";
      else if (!policy.workingDays.includes(d.getUTCDay())) status = "WEEKEND";
      else if (d < today) status = "ABSENT";
      else status = "PENDING";
      days.push({
        date: key,
        status,
        record,
        holiday: holidayMap.get(key),
        leaveType: leave?.leaveType.name,
        leavePaid: leave?.leaveType.isPaid,
        leaveHalfDay: leave?.halfDay,
      });
    }
    result.set(emp.id, days);
  }
  return result;
}

function summarize(days: DayInfo[]) {
  const s = { present: 0, late: 0, earlyDeparture: 0, absent: 0, onLeave: 0, holidays: 0, workedMinutes: 0, workingDays: 0 };
  for (const d of days) {
    switch (d.status) {
      case "PRESENT": s.present++; break;
      case "LATE": s.present++; s.late++; break;
      case "EARLY_DEPARTURE": s.present++; s.earlyDeparture++; break;
      case "LATE_AND_EARLY": s.present++; s.late++; s.earlyDeparture++; break;
      case "ABSENT": s.absent++; break;
      case "ON_LEAVE": s.onLeave++; break;
      case "HOLIDAY": s.holidays++; break;
    }
    if (!["WEEKEND", "HOLIDAY", "NOT_JOINED", "PENDING"].includes(d.status)) s.workingDays++;
    s.workedMinutes += d.record?.workedMinutes ?? 0;
  }
  return s;
}

function parseMonth(value: unknown, tz: string) {
  const v = String(value ?? "");
  const m = /^(\d{4})-(\d{2})$/.exec(v);
  if (m) return monthRange(Number(m[1]), Number(m[2]));
  const t = todayIn(tz);
  return monthRange(t.getUTCFullYear(), t.getUTCMonth() + 1);
}

// ── Self service ────────────────────────────────────────────────

attendanceRouter.get(
  "/today",
  ah(async (req, res) => {
    const employeeId = requireEmployeeId(req);
    const policy = await loadPolicy();
    const date = todayIn(policy.timeZone);
    const record = await prisma.attendance.findUnique({ where: { employeeId_date: { employeeId, date } } });
    res.json({
      date: isoDate(date),
      record,
      policy: { workStart: policy.workStart, workEnd: policy.workEnd, graceMinutes: policy.grace, timeZone: policy.timeZone },
    });
  }),
);

function assertIpAllowed(req: Parameters<typeof clientIp>[0], policy: Policy) {
  if (policy.allowedIps.length && !policy.allowedIps.includes(clientIp(req))) {
    throw forbidden("Check-in is only allowed from the office network");
  }
}

attendanceRouter.post(
  "/check-in",
  ah(async (req, res) => {
    const employeeId = requireEmployeeId(req);
    const policy = await loadPolicy();
    assertIpAllowed(req, policy);
    const now = new Date();
    const date = todayIn(policy.timeZone);
    const existing = await prisma.attendance.findUnique({ where: { employeeId_date: { employeeId, date } } });
    if (existing?.checkIn) throw conflict("You have already checked in today");
    const note = parse(z.object({ note: z.string().max(300).optional() }), req.body ?? {}).note;
    const status = computeStatus(now, null, policy);
    const record = await prisma.attendance.upsert({
      where: { employeeId_date: { employeeId, date } },
      create: { employeeId, date, checkIn: now, status, checkInIp: clientIp(req), note },
      update: { checkIn: now, status, checkInIp: clientIp(req), note },
    });
    if (status === "LATE") {
      const emp = await prisma.employee.findUnique({ where: { id: employeeId }, select: { firstName: true, lastName: true, manager: { select: { userId: true } } } });
      await notify([emp?.manager?.userId], {
        type: "ATTENDANCE_EXCEPTION",
        title: "Late check-in",
        body: `${emp?.firstName} ${emp?.lastName} checked in late today.`,
        link: "/attendance?tab=team",
        entityType: "Attendance",
        entityId: record.id,
      });
    }
    res.status(201).json(record);
  }),
);

attendanceRouter.post(
  "/check-out",
  ah(async (req, res) => {
    const employeeId = requireEmployeeId(req);
    const policy = await loadPolicy();
    assertIpAllowed(req, policy);
    const date = todayIn(policy.timeZone);
    const existing = await prisma.attendance.findUnique({ where: { employeeId_date: { employeeId, date } } });
    if (!existing?.checkIn) throw badRequest("You need to check in first");
    if (existing.checkOut) throw conflict("You have already checked out today");
    const now = new Date();
    const record = await prisma.attendance.update({
      where: { id: existing.id },
      data: {
        checkOut: now,
        checkOutIp: clientIp(req),
        workedMinutes: workedMinutes(existing.checkIn, now),
        status: computeStatus(existing.checkIn, now, policy),
      },
    });
    res.json(record);
  }),
);

/** ATT-05: monthly calendar for self (default) or an in-scope employee. */
attendanceRouter.get(
  "/calendar",
  ah(async (req, res) => {
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : requireEmployeeId(req);
    const scope = await employeeScope(req, P.ATTENDANCE_VIEW_ALL, P.ATTENDANCE_VIEW_TEAM);
    if (!inScope(scope, employeeId)) throw forbidden();
    const policy = await loadPolicy();
    const { start, end } = parseMonth(req.query.month, policy.timeZone);
    const days = (await buildDays([employeeId], start, end, policy)).get(employeeId);
    if (!days) throw notFound("Employee");
    res.json({ employeeId, month: isoDate(start).slice(0, 7), days, summary: summarize(days) });
  }),
);

// ── Team / HR views ─────────────────────────────────────────────

/** Daily attendance board for the requester's scope (team or company). */
attendanceRouter.get(
  "/daily",
  ah(async (req, res) => {
    assertCan(req, P.ATTENDANCE_VIEW_TEAM, P.ATTENDANCE_VIEW_ALL);
    const policy = await loadPolicy();
    const date = req.query.date ? dateOnly(String(req.query.date)) : todayIn(policy.timeZone);
    const scope = await employeeScope(req, P.ATTENDANCE_VIEW_ALL, P.ATTENDANCE_VIEW_TEAM);
    // A team-scoped board lists the viewer's reports, not the viewer.
    if (scope.kind === "ids") scope.ids = scope.ids.filter((id) => id !== req.auth!.employeeId);
    const employees = await prisma.employee.findMany({
      where: {
        ...scopeWhere(scope, "id"),
        employmentStatus: { not: "EXITED" },
        ...(req.query.departmentId && { departmentId: String(req.query.departmentId) }),
      },
      select: { id: true, employeeCode: true, firstName: true, lastName: true, designation: true, avatarUrl: true, department: { select: { name: true } } },
      orderBy: [{ firstName: "asc" }],
    });
    const days = await buildDays(employees.map((e) => e.id), date, date, policy);
    const rows = employees.map((e) => ({ employee: e, ...days.get(e.id)![0] }));
    const counts = rows.reduce<Record<string, number>>((acc, r) => ((acc[r.status] = (acc[r.status] ?? 0) + 1), acc), {});
    res.json({ date: isoDate(date), counts, rows });
  }),
);

/** ATT-06 / REP-01: monthly attendance report per employee; ?format=csv to export. */
attendanceRouter.get(
  "/report",
  ah(async (req, res) => {
    assertCan(req, P.ATTENDANCE_VIEW_TEAM, P.ATTENDANCE_VIEW_ALL, P.REPORTS_VIEW_ALL, P.REPORTS_VIEW_TEAM);
    const policy = await loadPolicy();
    const { start, end } = parseMonth(req.query.month, policy.timeZone);
    const scope = await employeeScope(req, P.ATTENDANCE_VIEW_ALL, P.ATTENDANCE_VIEW_TEAM);
    const employees = await prisma.employee.findMany({
      where: {
        ...scopeWhere(scope, "id"),
        ...(req.query.departmentId && { departmentId: String(req.query.departmentId) }),
        OR: [{ exitDate: null }, { exitDate: { gte: start } }],
        joiningDate: { lte: end },
      },
      select: { id: true, employeeCode: true, firstName: true, lastName: true, department: { select: { name: true } } },
      orderBy: [{ firstName: "asc" }],
    });
    const days = await buildDays(employees.map((e) => e.id), start, end, policy);
    const rows = employees.map((e) => ({ employee: e, ...summarize(days.get(e.id)!) }));
    if (req.query.format === "csv") {
      const csv = toCsv(
        ["Employee Code", "Name", "Department", "Working Days", "Present", "Late", "Early Departure", "Absent", "On Leave", "Holidays", "Hours Worked"],
        rows.map((r) => [
          r.employee.employeeCode, `${r.employee.firstName} ${r.employee.lastName}`, r.employee.department?.name ?? "",
          r.workingDays, r.present, r.late, r.earlyDeparture, r.absent, r.onLeave, r.holidays, (r.workedMinutes / 60).toFixed(1),
        ]),
      );
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="attendance-${isoDate(start).slice(0, 7)}.csv"`);
      await audit(req, "report.export", "Attendance", null, { month: isoDate(start).slice(0, 7) });
      return res.send(csv);
    }
    res.json({ month: isoDate(start).slice(0, 7), rows });
  }),
);

/** ATT-04: HR/Admin correction with mandatory reason and audit trail. */
attendanceRouter.put(
  "/adjust",
  ah(async (req, res) => {
    assertCan(req, P.ATTENDANCE_ADJUST);
    const body = parse(
      z.object({
        employeeId: z.string().uuid(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        checkIn: z.string().datetime({ offset: true }).nullable(),
        checkOut: z.string().datetime({ offset: true }).nullable(),
        status: z.enum(["PRESENT", "LATE", "EARLY_DEPARTURE", "LATE_AND_EARLY", "ABSENT", "ON_LEAVE", "HOLIDAY"]).optional(),
        reason: z.string().trim().min(3, "A reason is required for attendance adjustments").max(500),
      }),
      req.body,
    );
    const policy = await loadPolicy();
    const date = dateOnly(body.date);
    const checkIn = body.checkIn ? new Date(body.checkIn) : null;
    const checkOut = body.checkOut ? new Date(body.checkOut) : null;
    if (checkIn && checkOut && checkOut <= checkIn) throw badRequest("Check-out must be after check-in");
    const before = await prisma.attendance.findUnique({ where: { employeeId_date: { employeeId: body.employeeId, date } } });
    const data: Prisma.AttendanceUncheckedUpdateInput = {
      checkIn,
      checkOut,
      workedMinutes: workedMinutes(checkIn, checkOut),
      status: body.status ?? computeStatus(checkIn, checkOut, policy),
      isAdjusted: true,
      adjustmentReason: body.reason,
      adjustedById: req.auth!.userId,
    };
    const record = await prisma.attendance.upsert({
      where: { employeeId_date: { employeeId: body.employeeId, date } },
      create: { ...(data as Prisma.AttendanceUncheckedCreateInput), employeeId: body.employeeId, date },
      update: data,
    });
    await audit(req, "attendance.adjust", "Attendance", record.id, {
      employeeId: body.employeeId,
      date: body.date,
      reason: body.reason,
      before: before && { checkIn: before.checkIn, checkOut: before.checkOut, status: before.status },
      after: { checkIn, checkOut, status: record.status },
    });
    await notify(await userIdsForEmployees([body.employeeId]), {
      type: "ATTENDANCE_EXCEPTION",
      title: "Attendance adjusted",
      body: `Your attendance for ${body.date} was updated by HR: ${body.reason}`,
      link: "/attendance",
      entityType: "Attendance",
      entityId: record.id,
    });
    res.json(record);
  }),
);
