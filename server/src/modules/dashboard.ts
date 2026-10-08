import { Router } from "express";
import { PERMISSIONS as P } from "../config/permissions.js";
import { prisma } from "../lib/prisma.js";
import { ah } from "../lib/http.js";
import { addDays, isoDate, todayIn } from "../lib/dates.js";
import { getReportIds } from "../lib/scope.js";
import { getSetting } from "../lib/settings.js";
import { can } from "../middleware/auth.js";
import { computeBalances } from "./leave.js";
import { cached } from "../lib/cache.js";

// Team/company aggregates tolerate brief staleness; personal data on the dashboard is always live.
const AGGREGATE_TTL_MS = 30_000;

export const dashboardRouter = Router();

/**
 * One endpoint, role-aware sections (DASH-01..04). Each section is only computed
 * and returned when the requester holds the relevant permission.
 */
dashboardRouter.get(
  "/",
  ah(async (req, res) => {
    const auth = req.auth!;
    const tz = await getSetting("company.timezone");
    const today = todayIn(tz);
    const now = new Date();
    const empId = auth.employeeId;
    const out: Record<string, unknown> = { date: isoDate(today) };

    // ── Employee (everyone with an employee record) ──
    if (empId) {
      const [attendance, balances, myTasks, overdue, dueSoon] = await Promise.all([
        prisma.attendance.findUnique({ where: { employeeId_date: { employeeId: empId, date: today } } }),
        computeBalances(empId, today.getUTCFullYear()),
        prisma.task.groupBy({ by: ["status"], where: { assigneeId: empId }, _count: true }),
        prisma.task.count({ where: { assigneeId: empId, status: { not: "DONE" }, dueDate: { lt: now } } }),
        prisma.task.findMany({
          where: { assigneeId: empId, status: { not: "DONE" }, dueDate: { gte: now, lte: addDays(now, 7) } },
          select: { id: true, title: true, dueDate: true, priority: true, status: true },
          orderBy: { dueDate: "asc" },
          take: 5,
        }),
      ]);
      out.employee = {
        attendanceToday: attendance,
        leaveBalances: balances,
        tasks: { byStatus: Object.fromEntries(myTasks.map((t) => [t.status, t._count])), overdue, dueSoon },
      };
    }

    // Recent announcements & activity for everyone.
    const [announcements, notifications, upcomingHolidays] = await Promise.all([
      prisma.announcement.findMany({
        where: { publishedAt: { not: null, lte: now }, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }], audienceType: "ALL" },
        select: { id: true, title: true, publishedAt: true, isPinned: true, requiresAcknowledgement: true },
        orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
        take: 5,
      }),
      prisma.notification.findMany({ where: { userId: auth.userId }, orderBy: { createdAt: "desc" }, take: 8 }),
      prisma.holiday.findMany({ where: { date: { gte: today } }, orderBy: { date: "asc" }, take: 3 }),
    ]);
    out.announcements = announcements;
    out.recentActivity = notifications;
    out.upcomingHolidays = upcomingHolidays;

    // ── Manager / Team lead ──
    if (empId && can(req, P.ATTENDANCE_VIEW_TEAM, P.LEAVE_APPROVE_TEAM, P.TASKS_VIEW_TEAM)) {
      out.manager = await cached(`dash:manager:${empId}:${isoDate(today)}`, AGGREGATE_TTL_MS, ["dashboard"], async () => {
        const teamIds = await getReportIds(empId);
        const [present, onLeave, pendingApprovals, teamTasks, teamOverdue] = await Promise.all([
          prisma.attendance.count({ where: { employeeId: { in: teamIds }, date: today, checkIn: { not: null } } }),
          prisma.leaveRequest.count({ where: { employeeId: { in: teamIds }, status: "APPROVED", startDate: { lte: today }, endDate: { gte: today } } }),
          prisma.leaveRequest.count({ where: { employeeId: { in: teamIds }, status: "PENDING" } }),
          prisma.task.groupBy({ by: ["status"], where: { assigneeId: { in: teamIds } }, _count: true }),
          prisma.task.count({ where: { assigneeId: { in: teamIds }, status: { not: "DONE" }, dueDate: { lt: now } } }),
        ]);
        return {
          teamSize: teamIds.length,
          attendanceToday: { present, onLeave, notCheckedIn: Math.max(0, teamIds.length - present - onLeave) },
          pendingLeaveApprovals: pendingApprovals,
          tasks: { byStatus: Object.fromEntries(teamTasks.map((t) => [t.status, t._count])), overdue: teamOverdue },
        };
      });
    }

    // ── HR ──
    if (can(req, P.EMPLOYEES_VIEW_ALL)) {
      out.hr = await cached(`dash:hr:${isoDate(today)}`, AGGREGATE_TTL_MS, ["dashboard"], async () => {
        const monthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
        const [byStatus, byDept, departments, present, late, onLeave, pendingLeave, joiners, leavers] = await Promise.all([
          prisma.employee.groupBy({ by: ["employmentStatus"], _count: true }),
          prisma.employee.groupBy({ by: ["departmentId"], where: { employmentStatus: { not: "EXITED" } }, _count: true }),
          prisma.department.findMany({ select: { id: true, name: true } }),
          prisma.attendance.count({ where: { date: today, checkIn: { not: null } } }),
          prisma.attendance.count({ where: { date: today, status: { in: ["LATE", "LATE_AND_EARLY"] } } }),
          prisma.leaveRequest.count({ where: { status: "APPROVED", startDate: { lte: today }, endDate: { gte: today } } }),
          prisma.leaveRequest.count({ where: { status: "PENDING" } }),
          prisma.employee.findMany({
            where: { joiningDate: { gte: monthStart } },
            select: { id: true, firstName: true, lastName: true, designation: true, joiningDate: true },
            orderBy: { joiningDate: "desc" },
            take: 10,
          }),
          prisma.employee.count({ where: { exitDate: { gte: monthStart } } }),
        ]);
        const headcount = byStatus.filter((s) => s.employmentStatus !== "EXITED").reduce((s, r) => s + r._count, 0);
        return {
          headcount,
          byStatus: Object.fromEntries(byStatus.map((s) => [s.employmentStatus, s._count])),
          byDepartment: byDept.map((d) => ({ department: departments.find((x) => x.id === d.departmentId)?.name ?? "Unassigned", count: d._count })),
          attendanceToday: { present, late, onLeave, notCheckedIn: Math.max(0, headcount - present - onLeave) },
          pendingLeaveRequests: pendingLeave,
          joinersThisMonth: joiners,
          leaversThisMonth: leavers,
        };
      });
    }

    // ── Admin ──
    if (can(req, P.ADMIN_USERS, P.ADMIN_AUDIT)) {
      const withAudit = can(req, P.ADMIN_AUDIT);
      out.admin = await cached(`dash:admin:${withAudit}`, AGGREGATE_TTL_MS, ["dashboard"], async () => {
        const [usersByStatus, roles, activeSessions, recentAudit, failedLogins] = await Promise.all([
          prisma.user.groupBy({ by: ["status"], _count: true }),
          prisma.role.findMany({ select: { name: true, _count: { select: { users: true } } }, orderBy: { name: "asc" } }),
          prisma.session.count({ where: { revokedAt: null, expiresAt: { gt: now } } }),
          withAudit
            ? prisma.auditLog.findMany({
                orderBy: { createdAt: "desc" },
                take: 10,
                select: { id: true, action: true, entityType: true, createdAt: true, actor: { select: { email: true } } },
              })
            : Promise.resolve([]),
          prisma.auditLog.count({ where: { action: "auth.login_failed", createdAt: { gte: addDays(now, -1) } } }),
        ]);
        let dbOk = true;
        try {
          await prisma.$queryRaw`SELECT 1`;
        } catch {
          dbOk = false;
        }
        return {
          users: Object.fromEntries(usersByStatus.map((u) => [u.status, u._count])),
          roles: roles.map((r) => ({ name: r.name, users: r._count.users })),
          activeSessions,
          failedLogins24h: failedLogins,
          recentAudit,
          systemHealth: { database: dbOk ? "ok" : "down", uptimeSeconds: Math.round(process.uptime()) },
        };
      });
    }

    res.json(out);
  }),
);
