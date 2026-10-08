import { Router, type Request } from "express";
import { Prisma, type SalaryStructure } from "@prisma/client";
import { z } from "zod";
import { PERMISSIONS as P } from "../config/permissions.js";
import { prisma } from "../lib/prisma.js";
import { ah, badRequest, conflict, notFound, parse } from "../lib/http.js";
import { audit } from "../lib/audit.js";
import { dateOnly, isoDate, monthRange } from "../lib/dates.js";
import { notify } from "../lib/notify.js";
import { getSetting } from "../lib/settings.js";
import { assertCan, can, requireEmployeeId } from "../middleware/auth.js";
import { toCsv } from "../lib/csv.js";
import { buildDays, loadPolicy } from "./attendance.js";

/**
 * Payroll (FRD Phase 2). Salaries are confidential: every endpoint here requires payroll.*
 * except an employee's own *paid* payslips. Audit entries never include amounts, because
 * audit-log readers aren't necessarily allowed to see salaries.
 */
export const payrollRouter = Router();

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const r2 = (n: number) => Math.round(n * 100) / 100;
const num = (v: Prisma.Decimal | number | string | null | undefined) => (v == null ? 0 : Number(v));

const componentSchema = z.object({
  name: z.string().trim().min(1).max(60),
  type: z.enum(["EARNING", "DEDUCTION"]),
  amount: z.number().min(0).max(100_000_000),
});
type Component = z.infer<typeof componentSchema>;
type Line = { name: string; amount: number };

const employeeBrief = {
  select: {
    id: true, employeeCode: true, firstName: true, lastName: true, designation: true, avatarUrl: true,
    joiningDate: true, exitDate: true, department: { select: { name: true } },
  },
} as const;

// ── Calculation ──────────────────────────────────────────────────

interface DayStats {
  workingDays: number; // pay basis days for the period (30, days in month, or working days)
  eligibleDays: number; // basis days while employed
  absentDays: number;
  unpaidLeaveDays: number;
}

/**
 * Pay basis days for the period and, per employee, days employed, absences and unpaid leave.
 * Days before joining / after leaving count in the basis unit; each absence or unpaid-leave
 * working day counts as one unpaid day.
 */
async function periodStats(employeeIds: string[], start: Date, end: Date) {
  const [policy, deductAbsences, dayBasis] = await Promise.all([loadPolicy(), getSetting("payroll.deductAbsences"), getSetting("payroll.dayBasis")]);
  const holidays = new Set((await prisma.holiday.findMany({ where: { date: { gte: start, lte: end } }, select: { date: true } })).map((h) => isoDate(h.date)));
  const isWorkingDay = (iso: string) => policy.workingDays.includes(new Date(`${iso}T00:00:00Z`).getUTCDay()) && !holidays.has(iso);
  const days = await buildDays(employeeIds, start, end, policy);
  let companyWorkingDays = 0;
  let calendarDays = 0;
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    calendarDays++;
    if (isWorkingDay(isoDate(d))) companyWorkingDays++;
  }
  const basisDays = dayBasis === "WORKING" ? companyWorkingDays : dayBasis === "CALENDAR" ? calendarDays : 30;

  const stats = new Map<string, DayStats>();
  for (const id of employeeIds) {
    let notEmployed = 0; // in the basis unit: calendar days, or working days for WORKING
    let absentDays = 0;
    let unpaidLeaveDays = 0;
    for (const day of days.get(id) ?? []) {
      const working = isWorkingDay(day.date);
      if (day.status === "NOT_JOINED") {
        if (dayBasis !== "WORKING" || working) notEmployed++;
        continue;
      }
      if (!working) continue;
      if (day.status === "ABSENT" && deductAbsences) absentDays++;
      if (day.status === "ON_LEAVE" && day.leavePaid === false) unpaidLeaveDays += day.leaveHalfDay ? 0.5 : 1;
    }
    // Full month → all basis days (so February still pays 30 on the 30-day basis);
    // partial month → actual days employed, capped at the basis (joining on the 31st pays 1 day).
    const periodDays = dayBasis === "WORKING" ? companyWorkingDays : calendarDays;
    const eligibleDays = notEmployed === 0 ? basisDays : Math.max(0, Math.min(basisDays, periodDays - notEmployed));
    stats.set(id, { workingDays: basisDays, eligibleDays, absentDays, unpaidLeaveDays });
  }
  return { workingDays: basisDays, stats };
}

interface PayslipInput {
  structure: Pick<SalaryStructure, "basicSalary" | "components" | "taxMode" | "taxValue" | "bankName" | "bankAccount">;
  stats: DayStats;
  adjustments: Component[];
  unpaidDaysOverride: number | null;
}

/**
 * Monthly pay: full-month gross, minus a per-day deduction for days not paid
 * (not yet joined / already left, absences, unpaid leave), minus recurring deductions,
 * one-off adjustments and the employee's manual tax setting.
 */
export function computePayslip({ structure, stats, adjustments, unpaidDaysOverride }: PayslipInput) {
  const components = (structure.components as Component[]) ?? [];
  const basic = num(structure.basicSalary);
  const earnings: Line[] = components.filter((c) => c.type === "EARNING").map(({ name, amount }) => ({ name, amount }));
  const deductions: Line[] = components.filter((c) => c.type === "DEDUCTION").map(({ name, amount }) => ({ name, amount }));
  const gross = r2(basic + earnings.reduce((s, e) => s + e.amount, 0));

  const calculatedUnpaid = stats.workingDays - stats.eligibleDays + stats.absentDays + stats.unpaidLeaveDays;
  const unpaidDays = Math.max(0, Math.min(stats.workingDays, unpaidDaysOverride ?? calculatedUnpaid));
  const perDay = stats.workingDays ? gross / stats.workingDays : 0;
  const absenceDeduction = r2(Math.min(gross, perDay * unpaidDays));

  const adjEarnings = adjustments.filter((a) => a.type === "EARNING").reduce((s, a) => s + a.amount, 0);
  const adjDeductions = adjustments.filter((a) => a.type === "DEDUCTION").reduce((s, a) => s + a.amount, 0);
  const taxable = gross - absenceDeduction + adjEarnings;
  const tax = r2(
    structure.taxMode === "FIXED" ? num(structure.taxValue) : structure.taxMode === "PERCENT" ? (Math.max(0, taxable) * num(structure.taxValue)) / 100 : 0,
  );
  const fixedDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  const totalDeductions = r2(absenceDeduction + fixedDeductions + adjDeductions + tax);
  const netPay = r2(Math.max(0, gross + adjEarnings - totalDeductions));

  return {
    basicSalary: basic,
    earnings,
    deductions,
    adjustments,
    workingDays: stats.workingDays,
    eligibleDays: stats.eligibleDays,
    absentDays: stats.absentDays,
    unpaidLeaveDays: stats.unpaidLeaveDays,
    unpaidDaysOverride,
    grossPay: gross,
    absenceDeduction,
    taxAmount: tax,
    totalDeductions,
    netPay,
    bankName: structure.bankName,
    bankAccount: structure.bankAccount,
  };
}

/** Latest salary structure effective on or before `date`, per employee. */
async function structuresAt(employeeIds: string[], date: Date) {
  const rows = await prisma.salaryStructure.findMany({
    where: { employeeId: { in: employeeIds }, effectiveFrom: { lte: date } },
    orderBy: [{ employeeId: "asc" }, { effectiveFrom: "desc" }, { createdAt: "desc" }],
  });
  const map = new Map<string, SalaryStructure>();
  for (const r of rows) if (!map.has(r.employeeId)) map.set(r.employeeId, r);
  return map;
}

/** Employees employed at any point in the period. */
const employedIn = (start: Date, end: Date): Prisma.EmployeeWhereInput => ({
  joiningDate: { lte: end },
  OR: [{ exitDate: null }, { exitDate: { gte: start } }],
});

async function refreshTotals(runId: string) {
  const slips = await prisma.payslip.findMany({ where: { runId }, select: { grossPay: true, adjustments: true, totalDeductions: true, netPay: true } });
  const gross = slips.reduce((s, p) => s + num(p.grossPay) + (p.adjustments as Component[]).filter((a) => a.type === "EARNING").reduce((x, a) => x + a.amount, 0), 0);
  await prisma.payrollRun.update({
    where: { id: runId },
    data: {
      totalGross: r2(gross),
      totalDeductions: r2(slips.reduce((s, p) => s + num(p.totalDeductions), 0)),
      totalNet: r2(slips.reduce((s, p) => s + num(p.netPay), 0)),
    },
  });
}

/** (Re)calculates every payslip of a draft run, keeping manual adjustments and overrides. */
async function calculateRun(runId: string) {
  const run = await prisma.payrollRun.findUniqueOrThrow({ where: { id: runId }, include: { payslips: true } });
  const employees = await prisma.employee.findMany({ where: employedIn(run.periodStart, run.periodEnd), select: { id: true } });
  const ids = employees.map((e) => e.id);
  const [structures, { workingDays, stats }] = await Promise.all([structuresAt(ids, run.periodEnd), periodStats(ids, run.periodStart, run.periodEnd)]);
  const existing = new Map(run.payslips.map((p) => [p.employeeId, p]));

  const ops: Prisma.PrismaPromise<unknown>[] = [];
  for (const id of ids) {
    const structure = structures.get(id);
    if (!structure) continue; // reported as "missing salary" in the run view
    const prev = existing.get(id);
    const data = computePayslip({
      structure,
      stats: stats.get(id)!,
      adjustments: (prev?.adjustments as Component[]) ?? [],
      unpaidDaysOverride: prev?.unpaidDaysOverride != null ? num(prev.unpaidDaysOverride) : null,
    });
    const row = { ...data, earnings: data.earnings, deductions: data.deductions, adjustments: data.adjustments } as unknown as Prisma.PayslipUncheckedCreateInput;
    ops.push(
      prisma.payslip.upsert({
        where: { runId_employeeId: { runId, employeeId: id } },
        create: { ...row, runId, employeeId: id, note: prev?.note ?? null },
        update: row,
      }),
    );
  }
  // Drop payslips for people no longer eligible (e.g. salary removed).
  const keep = ids.filter((id) => structures.has(id));
  ops.push(prisma.payslip.deleteMany({ where: { runId, employeeId: { notIn: keep } } }));
  ops.push(prisma.payrollRun.update({ where: { id: runId }, data: { workingDays } }));
  await prisma.$transaction(ops);
  await refreshTotals(runId);
}

async function loadRun(id: string) {
  const run = await prisma.payrollRun.findUnique({ where: { id } });
  if (!run) throw notFound("Payroll run");
  return run;
}

const requireDraft = (run: { status: string }) => {
  if (run.status !== "DRAFT") throw badRequest("This payroll run is locked. Reopen it to make changes.");
};

// ── Salary structures ────────────────────────────────────────────

/** Current salary for every active employee (or everyone with includeExited). */
payrollRouter.get(
  "/salaries",
  ah(async (req, res) => {
    assertCan(req, P.PAYROLL_MANAGE);
    const q = String(req.query.search ?? "").trim();
    const employees = await prisma.employee.findMany({
      where: {
        employmentStatus: { not: "EXITED" },
        ...(q && {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { employeeCode: { contains: q, mode: "insensitive" } },
          ],
        }),
      },
      ...employeeBrief,
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    });
    const structures = await structuresAt(employees.map((e) => e.id), dateOnly(new Date()));
    res.json(
      employees.map((e) => {
        const s = structures.get(e.id);
        const comps = (s?.components as Component[]) ?? [];
        const gross = s ? num(s.basicSalary) + comps.filter((c) => c.type === "EARNING").reduce((x, c) => x + c.amount, 0) : null;
        return { employee: e, salary: s ?? null, monthlyGross: gross };
      }),
    );
  }),
);

payrollRouter.get(
  "/salaries/:employeeId",
  ah(async (req, res) => {
    assertCan(req, P.PAYROLL_MANAGE);
    const employeeId = String(req.params.employeeId);
    const [employee, history] = await Promise.all([
      prisma.employee.findUnique({ where: { id: employeeId }, ...employeeBrief }),
      prisma.salaryStructure.findMany({ where: { employeeId }, orderBy: [{ effectiveFrom: "desc" }, { createdAt: "desc" }] }),
    ]);
    if (!employee) throw notFound("Employee");
    res.json({ employee, history });
  }),
);

payrollRouter.post(
  "/salaries/:employeeId",
  ah(async (req, res) => {
    assertCan(req, P.PAYROLL_MANAGE);
    const employeeId = String(req.params.employeeId);
    const body = parse(
      z.object({
        effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        basicSalary: z.number().min(0).max(100_000_000),
        components: z.array(componentSchema).max(30).default([]),
        taxMode: z.enum(["NONE", "FIXED", "PERCENT"]).default("NONE"),
        taxValue: z.number().min(0).max(100_000_000).default(0),
        bankName: z.string().trim().max(80).nullable().optional(),
        bankAccount: z.string().trim().max(60).nullable().optional(),
        note: z.string().max(300).nullable().optional(),
      }),
      req.body,
    );
    if (body.taxMode === "PERCENT" && body.taxValue > 100) throw badRequest("Tax percentage can't exceed 100");
    if (!(await prisma.employee.findUnique({ where: { id: employeeId }, select: { id: true } }))) throw notFound("Employee");
    const structure = await prisma.salaryStructure.create({
      data: { ...body, employeeId, effectiveFrom: dateOnly(body.effectiveFrom), components: body.components, createdById: req.auth!.userId },
    });
    // Deliberately no amounts in the audit trail.
    await audit(req, "payroll.salary_set", "Employee", employeeId, { effectiveFrom: body.effectiveFrom });
    res.status(201).json(structure);
  }),
);

// ── Runs ─────────────────────────────────────────────────────────

payrollRouter.get(
  "/runs",
  ah(async (req, res) => {
    assertCan(req, P.PAYROLL_MANAGE, P.PAYROLL_APPROVE);
    const runs = await prisma.payrollRun.findMany({
      orderBy: [{ year: "desc" }, { month: "desc" }],
      include: { _count: { select: { payslips: true } } },
    });
    res.json(runs);
  }),
);

payrollRouter.post(
  "/runs",
  ah(async (req, res) => {
    assertCan(req, P.PAYROLL_MANAGE);
    const body = parse(z.object({ year: z.number().int().min(2000).max(2100), month: z.number().int().min(1).max(12), note: z.string().max(300).optional() }), req.body);
    if (await prisma.payrollRun.findUnique({ where: { year_month: { year: body.year, month: body.month } } })) {
      throw conflict(`Payroll for ${MONTHS[body.month - 1]} ${body.year} already exists`);
    }
    const { start, end } = monthRange(body.year, body.month);
    const run = await prisma.payrollRun.create({
      data: { ...body, periodStart: start, periodEnd: end, workingDays: 0, currency: await getSetting("payroll.currency"), createdById: req.auth!.userId },
    });
    await calculateRun(run.id);
    await audit(req, "payroll.run_create", "PayrollRun", run.id, { period: `${body.year}-${String(body.month).padStart(2, "0")}` });
    res.status(201).json(await prisma.payrollRun.findUnique({ where: { id: run.id } }));
  }),
);

payrollRouter.get(
  "/runs/:id",
  ah(async (req, res) => {
    assertCan(req, P.PAYROLL_MANAGE, P.PAYROLL_APPROVE);
    const run = await prisma.payrollRun.findUnique({
      where: { id: String(req.params.id) },
      include: { payslips: { include: { employee: employeeBrief }, orderBy: { employee: { firstName: "asc" } } } },
    });
    if (!run) throw notFound("Payroll run");
    // Employees in the period with no salary set — they're excluded until one is added.
    const employed = await prisma.employee.findMany({ where: employedIn(run.periodStart, run.periodEnd), ...employeeBrief });
    const included = new Set(run.payslips.map((p) => p.employeeId));
    const missing = employed.filter((e) => !included.has(e.id));
    // Distinguish "no salary at all" from "salary starts after this period" so the fix is obvious.
    const firstSalary = await prisma.salaryStructure.groupBy({
      by: ["employeeId"],
      where: { employeeId: { in: missing.map((e) => e.id) } },
      _min: { effectiveFrom: true },
    });
    const startsOn = new Map(firstSalary.map((s) => [s.employeeId, s._min.effectiveFrom]));
    res.json({ ...run, missingSalary: missing.map((e) => ({ ...e, salaryStartsOn: startsOn.get(e.id) ?? null })) });
  }),
);

payrollRouter.post(
  "/runs/:id/recalculate",
  ah(async (req, res) => {
    assertCan(req, P.PAYROLL_MANAGE);
    const run = await loadRun(String(req.params.id));
    requireDraft(run);
    await calculateRun(run.id);
    await audit(req, "payroll.run_recalculate", "PayrollRun", run.id);
    res.json({ ok: true });
  }),
);

/** Review edits on one payslip: one-off adjustments, unpaid-days override, note. */
payrollRouter.patch(
  "/runs/:id/payslips/:payslipId",
  ah(async (req, res) => {
    assertCan(req, P.PAYROLL_MANAGE);
    const run = await loadRun(String(req.params.id));
    requireDraft(run);
    const slip = await prisma.payslip.findFirst({ where: { id: String(req.params.payslipId), runId: run.id } });
    if (!slip) throw notFound("Payslip");
    const body = parse(
      z.object({
        adjustments: z.array(componentSchema).max(30).optional(),
        unpaidDaysOverride: z.number().min(0).max(31).nullable().optional(),
        note: z.string().max(300).nullable().optional(),
      }),
      req.body,
    );
    const structure = (await structuresAt([slip.employeeId], run.periodEnd)).get(slip.employeeId);
    if (!structure) throw badRequest("This employee no longer has a salary for this period — recalculate the run");
    const data = computePayslip({
      structure,
      stats: { workingDays: slip.workingDays, eligibleDays: num(slip.eligibleDays), absentDays: num(slip.absentDays), unpaidLeaveDays: num(slip.unpaidLeaveDays) },
      adjustments: body.adjustments ?? (slip.adjustments as Component[]),
      unpaidDaysOverride: body.unpaidDaysOverride !== undefined ? body.unpaidDaysOverride : slip.unpaidDaysOverride != null ? num(slip.unpaidDaysOverride) : null,
    });
    const updated = await prisma.payslip.update({
      where: { id: slip.id },
      data: { ...(data as unknown as Prisma.PayslipUncheckedUpdateInput), ...(body.note !== undefined && { note: body.note }) },
      include: { employee: employeeBrief },
    });
    await refreshTotals(run.id);
    await audit(req, "payroll.payslip_adjust", "Payslip", slip.id, { employeeId: slip.employeeId, fields: Object.keys(body) });
    res.json(updated);
  }),
);

payrollRouter.post(
  "/runs/:id/approve",
  ah(async (req, res) => {
    assertCan(req, P.PAYROLL_APPROVE);
    const run = await loadRun(String(req.params.id));
    requireDraft(run);
    const count = await prisma.payslip.count({ where: { runId: run.id } });
    if (!count) throw badRequest("There are no payslips in this run. Add salaries and recalculate first.");
    await calculateRun(run.id); // final calculation with the latest attendance before locking
    const updated = await prisma.payrollRun.update({ where: { id: run.id }, data: { status: "APPROVED", approvedById: req.auth!.userId, approvedAt: new Date() } });
    await audit(req, "payroll.run_approve", "PayrollRun", run.id);
    res.json(updated);
  }),
);

payrollRouter.post(
  "/runs/:id/reopen",
  ah(async (req, res) => {
    assertCan(req, P.PAYROLL_APPROVE);
    const run = await loadRun(String(req.params.id));
    if (run.status !== "APPROVED") throw badRequest(run.status === "PAID" ? "Paid payroll can't be reopened" : "Only approved runs can be reopened");
    const updated = await prisma.payrollRun.update({ where: { id: run.id }, data: { status: "DRAFT", approvedById: null, approvedAt: null } });
    await audit(req, "payroll.run_reopen", "PayrollRun", run.id);
    res.json(updated);
  }),
);

payrollRouter.post(
  "/runs/:id/mark-paid",
  ah(async (req, res) => {
    assertCan(req, P.PAYROLL_APPROVE);
    const run = await loadRun(String(req.params.id));
    if (run.status !== "APPROVED") throw badRequest("Approve the payroll before marking it paid");
    const updated = await prisma.payrollRun.update({ where: { id: run.id }, data: { status: "PAID", paidAt: new Date() } });
    await audit(req, "payroll.run_paid", "PayrollRun", run.id);
    const slips = await prisma.payslip.findMany({ where: { runId: run.id }, select: { id: true, employee: { select: { userId: true } } } });
    const label = `${MONTHS[run.month - 1]} ${run.year}`;
    // One notification per employee so each links to their own payslip.
    for (const s of slips) {
      await notify([s.employee.userId], {
        type: "PAYSLIP",
        title: `Your payslip for ${label} is ready`,
        link: `/profile?tab=payslips&id=${s.id}`,
        entityType: "Payslip",
        entityId: s.id,
      });
    }
    res.json(updated);
  }),
);

payrollRouter.delete(
  "/runs/:id",
  ah(async (req, res) => {
    assertCan(req, P.PAYROLL_MANAGE);
    const run = await loadRun(String(req.params.id));
    requireDraft(run);
    await prisma.payrollRun.delete({ where: { id: run.id } });
    await audit(req, "payroll.run_delete", "PayrollRun", run.id, { period: `${run.year}-${String(run.month).padStart(2, "0")}` });
    res.json({ ok: true });
  }),
);

/** Bank transfer sheet / payroll register as CSV. */
payrollRouter.get(
  "/runs/:id/export",
  ah(async (req, res) => {
    assertCan(req, P.PAYROLL_MANAGE, P.PAYROLL_APPROVE);
    const run = await prisma.payrollRun.findUnique({
      where: { id: String(req.params.id) },
      include: { payslips: { include: { employee: employeeBrief }, orderBy: { employee: { firstName: "asc" } } } },
    });
    if (!run) throw notFound("Payroll run");
    const csv = toCsv(
      ["Employee Code", "Name", "Department", "Designation", "Working Days", "Unpaid Days", "Gross", "Unpaid Days Deduction", "Tax", "Total Deductions", "Net Pay", "Currency", "Bank", "Account"],
      run.payslips.map((p) => {
        const unpaid = p.unpaidDaysOverride != null ? num(p.unpaidDaysOverride) : p.workingDays - num(p.eligibleDays) + num(p.absentDays) + num(p.unpaidLeaveDays);
        return [
          p.employee.employeeCode, `${p.employee.firstName} ${p.employee.lastName}`, p.employee.department?.name ?? "", p.employee.designation,
          p.workingDays, unpaid, num(p.grossPay), num(p.absenceDeduction), num(p.taxAmount), num(p.totalDeductions), num(p.netPay),
          run.currency, p.bankName ?? "", p.bankAccount ?? "",
        ];
      }),
    );
    await audit(req, "payroll.run_export", "PayrollRun", run.id);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="payroll-${run.year}-${String(run.month).padStart(2, "0")}.csv"`);
    res.send(csv);
  }),
);

// ── Payslips (self-service + admin view) ─────────────────────────

const payslipDetail = {
  employee: employeeBrief,
  run: { select: { id: true, year: true, month: true, periodStart: true, periodEnd: true, status: true, currency: true, paidAt: true } },
} satisfies Prisma.PayslipInclude;

payrollRouter.get(
  "/my-payslips",
  ah(async (req, res) => {
    const employeeId = requireEmployeeId(req);
    const rows = await prisma.payslip.findMany({
      where: { employeeId, run: { status: "PAID" } },
      include: payslipDetail,
      orderBy: [{ run: { year: "desc" } }, { run: { month: "desc" } }],
    });
    res.json(rows);
  }),
);

async function canSeePayslip(req: Request, slip: { employeeId: string; run: { status: string } }) {
  if (can(req, P.PAYROLL_MANAGE, P.PAYROLL_APPROVE)) return true;
  // Employees only see their own payslips once payroll is paid (published).
  return slip.employeeId === req.auth!.employeeId && slip.run.status === "PAID";
}

payrollRouter.get(
  "/payslips/:id",
  ah(async (req, res) => {
    const slip = await prisma.payslip.findUnique({ where: { id: String(req.params.id) }, include: payslipDetail });
    if (!slip || !(await canSeePayslip(req, slip))) throw notFound("Payslip");
    res.json({ ...slip, companyName: await getSetting("company.name") });
  }),
);

