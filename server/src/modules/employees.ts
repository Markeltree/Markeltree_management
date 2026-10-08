import { Router } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { PERMISSIONS as P } from "../config/permissions.js";
import { prisma } from "../lib/prisma.js";
import { ah, badRequest, forbidden, notFound, paged, paging, parse } from "../lib/http.js";
import { audit, diff } from "../lib/audit.js";
import { dateOnly, todayIn } from "../lib/dates.js";
import { notify, userIdsWithPermission } from "../lib/notify.js";
import { employeeScope, getReportIds, inScope } from "../lib/scope.js";
import { getSetting } from "../lib/settings.js";
import { assertCan, can } from "../middleware/auth.js";
import { hashPassword, issueResetCode, passwordSchema } from "./auth.js";
import { toCsv } from "../lib/csv.js";
import { cached, TAGS } from "../lib/cache.js";

export const employeesRouter = Router();

/** Fields every authenticated employee may see in the directory (EMP-01). */
const directorySelect = {
  id: true,
  employeeCode: true,
  firstName: true,
  lastName: true,
  designation: true,
  avatarUrl: true,
  phone: true,
  employmentStatus: true,
  department: { select: { id: true, name: true } },
  team: { select: { id: true, name: true } },
  manager: { select: { id: true, firstName: true, lastName: true } },
  user: { select: { email: true, status: true } },
} satisfies Prisma.EmployeeSelect;

/** Full employment record — own profile, team (for managers) or HR. */
const profileSelect = {
  ...directorySelect,
  joiningDate: true,
  exitDate: true,
  employmentType: true,
  createdAt: true,
  updatedAt: true,
  user: { select: { id: true, email: true, status: true, lastLoginAt: true, role: { select: { id: true, name: true } } } },
} satisfies Prisma.EmployeeSelect;

/** Restricted personal data (EMP-05) — own record or employees.view_sensitive. */
const sensitiveSelect = {
  dateOfBirth: true,
  gender: true,
  address: true,
  personalEmail: true,
  emergencyContactName: true,
  emergencyContactPhone: true,
  emergencyContactRelation: true,
} satisfies Prisma.EmployeeSelect;

const optionalDate = z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.null()]).optional();
const nullableStr = (max = 200) => z.string().trim().max(max).nullable().optional();

const selfEditableSchema = z.object({
  phone: nullableStr(30),
  personalEmail: z.string().email().nullable().optional(),
  address: nullableStr(500),
  avatarUrl: z.string().url().nullable().optional(),
  emergencyContactName: nullableStr(),
  emergencyContactPhone: nullableStr(30),
  emergencyContactRelation: nullableStr(60),
});

const hrEditableSchema = selfEditableSchema.extend({
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional(),
  employeeCode: z.string().trim().min(1).max(30).optional(),
  dateOfBirth: optionalDate,
  gender: nullableStr(30),
  joiningDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  designation: z.string().trim().min(1).max(120).optional(),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]).optional(),
  employmentStatus: z.enum(["PROBATION", "ACTIVE", "ON_LEAVE", "NOTICE_PERIOD", "EXITED"]).optional(),
  departmentId: z.string().uuid().nullable().optional(),
  teamId: z.string().uuid().nullable().optional(),
  managerId: z.string().uuid().nullable().optional(),
  roleId: z.string().uuid().optional(),
});

const createSchema = hrEditableSchema.extend({
  email: z.string().email(),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  designation: z.string().trim().min(1).max(120),
  joiningDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  roleId: z.string().uuid().optional(),
  // If omitted the account is created as INVITED and an activation code is issued.
  password: passwordSchema.optional(),
});

const SELF_FIELDS = Object.keys(selfEditableSchema.shape);

async function nextEmployeeCode() {
  const count = await prisma.employee.count();
  for (let n = count + 1; ; n++) {
    const code = `EMP-${String(n).padStart(4, "0")}`;
    if (!(await prisma.employee.findUnique({ where: { employeeCode: code }, select: { id: true } }))) return code;
  }
}

async function assertValidManager(employeeId: string | null, managerId: string | null | undefined) {
  if (!managerId) return;
  if (managerId === employeeId) throw badRequest("An employee cannot report to themselves");
  if (!(await prisma.employee.findUnique({ where: { id: managerId }, select: { id: true } }))) throw badRequest("Manager not found");
  if (employeeId && (await getReportIds(employeeId)).includes(managerId)) {
    throw badRequest("This manager reports to the employee — that would create a reporting loop");
  }
}

function toEmployeeData(input: Partial<z.infer<typeof hrEditableSchema>>) {
  const { roleId: _roleId, dateOfBirth, joiningDate, ...rest } = input;
  const data: Prisma.EmployeeUncheckedUpdateInput = { ...rest };
  if (dateOfBirth !== undefined) data.dateOfBirth = dateOfBirth ? dateOnly(dateOfBirth) : null;
  if (joiningDate !== undefined) data.joiningDate = dateOnly(joiningDate);
  return data;
}

// ── Lookups ─────────────────────────────────────────────────────

/** Lightweight list for pickers (assignee, manager, chat). */
employeesRouter.get(
  "/options",
  ah(async (req, res) => {
    const q = String(req.query.search ?? "").trim();
    const load = () => prisma.employee.findMany({
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
      select: { id: true, firstName: true, lastName: true, designation: true, avatarUrl: true, userId: true, departmentId: true },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
      take: 500,
    });
    // The unfiltered list backs every people picker — cache it.
    res.json(q ? await load() : await cached("employees:options", 5 * 60_000, [TAGS.employees], load));
  }),
);

employeesRouter.get(
  "/org-chart",
  ah(async (_req, res) => {
    const rows = await cached("employees:org-chart", 5 * 60_000, [TAGS.org, TAGS.employees], () =>
      prisma.employee.findMany({
        where: { employmentStatus: { not: "EXITED" } },
        select: { id: true, firstName: true, lastName: true, designation: true, avatarUrl: true, managerId: true, department: { select: { name: true } } },
      }),
    );
    type Node = (typeof rows)[number] & { reports: Node[] };
    const nodes = new Map<string, Node>(rows.map((r) => [r.id, { ...r, reports: [] }]));
    const roots: Node[] = [];
    for (const n of nodes.values()) {
      const parent = n.managerId ? nodes.get(n.managerId) : undefined;
      (parent ? parent.reports : roots).push(n);
    }
    res.json(roots);
  }),
);

/** REP-04: directory export. Sensitive columns only with employees.view_sensitive. */
employeesRouter.get(
  "/export",
  ah(async (req, res) => {
    assertCan(req, P.EMPLOYEES_EXPORT);
    const sensitive = can(req, P.EMPLOYEES_VIEW_SENSITIVE);
    const rows = await prisma.employee.findMany({
      where: req.query.includeExited === "true" ? {} : { employmentStatus: { not: "EXITED" } },
      select: { ...profileSelect, ...(sensitive ? sensitiveSelect : {}) },
      orderBy: [{ employeeCode: "asc" }],
    });
    const headers = ["Employee Code", "First Name", "Last Name", "Email", "Phone", "Designation", "Department", "Team", "Manager", "Employment Type", "Status", "Joining Date", "Exit Date", "Role", "Account Status"];
    if (sensitive) headers.push("Date of Birth", "Personal Email", "Address", "Emergency Contact", "Emergency Phone", "Relation");
    const csv = toCsv(
      headers,
      rows.map((e) => {
        const r: (string | number | null | undefined)[] = [
          e.employeeCode, e.firstName, e.lastName, e.user.email, e.phone, e.designation, e.department?.name, e.team?.name,
          e.manager ? `${e.manager.firstName} ${e.manager.lastName}` : "", e.employmentType, e.employmentStatus,
          e.joiningDate.toISOString().slice(0, 10), e.exitDate?.toISOString().slice(0, 10), e.user.role.name, e.user.status,
        ];
        if (sensitive) {
          const s = e as typeof e & Prisma.EmployeeGetPayload<{ select: typeof sensitiveSelect }>;
          r.push(s.dateOfBirth?.toISOString().slice(0, 10), s.personalEmail, s.address, s.emergencyContactName, s.emergencyContactPhone, s.emergencyContactRelation);
        }
        return r;
      }),
    );
    await audit(req, "report.export", "Employee", null, { count: rows.length, sensitive });
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="employees.csv"`);
    res.send(csv);
  }),
);

// ── Directory ───────────────────────────────────────────────────

employeesRouter.get(
  "/",
  ah(async (req, res) => {
    const { page, pageSize, skip, take } = paging(req.query);
    const q = String(req.query.search ?? "").trim();
    const scope = await employeeScope(req, P.EMPLOYEES_VIEW_ALL, P.EMPLOYEES_VIEW_TEAM);
    // Everyone can browse the active directory; "mine=team" narrows to the requester's scope.
    const onlyTeam = req.query.scope === "team";
    const where: Prisma.EmployeeWhereInput = {
      ...(req.query.departmentId && { departmentId: String(req.query.departmentId) }),
      ...(req.query.teamId && { teamId: String(req.query.teamId) }),
      // Exited employees are hidden unless HR explicitly filters for them.
      employmentStatus:
        req.query.status && (req.query.status !== "EXITED" || can(req, P.EMPLOYEES_VIEW_ALL))
          ? (String(req.query.status) as Prisma.EnumEmploymentStatusFilter["equals"])
          : { not: "EXITED" },
      ...(onlyTeam && scope.kind === "ids" && { id: { in: scope.ids } }),
      ...(q && {
        OR: [
          { firstName: { contains: q, mode: "insensitive" } },
          { lastName: { contains: q, mode: "insensitive" } },
          { employeeCode: { contains: q, mode: "insensitive" } },
          { designation: { contains: q, mode: "insensitive" } },
          { user: { email: { contains: q, mode: "insensitive" } } },
        ],
      }),
    };
    const [items, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        select: { ...directorySelect, joiningDate: true },
        orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
        skip,
        take,
      }),
      prisma.employee.count({ where }),
    ]);
    // Joining date is employment data: only for in-scope rows.
    const shaped = items.map((e) => (inScope(scope, e.id) ? e : { ...e, joiningDate: undefined }));
    res.json(paged(shaped, total, page, pageSize));
  }),
);

employeesRouter.get(
  "/:id",
  ah(async (req, res) => {
    const id = String(req.params.id);
    const scope = await employeeScope(req, P.EMPLOYEES_VIEW_ALL, P.EMPLOYEES_VIEW_TEAM);
    const isSelf = req.auth!.employeeId === id;
    const full = inScope(scope, id);
    const sensitive = isSelf || can(req, P.EMPLOYEES_VIEW_SENSITIVE);
    const employee = await prisma.employee.findUnique({
      where: { id },
      select: { ...(full ? profileSelect : directorySelect), ...(sensitive ? sensitiveSelect : {}) },
    });
    if (!employee) throw notFound("Employee");
    res.json({ ...employee, access: { full, sensitive, canEdit: can(req, P.EMPLOYEES_UPDATE), isSelf } });
  }),
);

employeesRouter.get(
  "/:id/history",
  ah(async (req, res) => {
    const id = String(req.params.id);
    const scope = await employeeScope(req, P.EMPLOYEES_VIEW_ALL, P.EMPLOYEES_VIEW_TEAM);
    if (!inScope(scope, id)) throw forbidden();
    res.json(await prisma.employmentHistory.findMany({ where: { employeeId: id }, orderBy: { effectiveDate: "desc" } }));
  }),
);

// ── Onboarding (workflow 10.1) ──────────────────────────────────

employeesRouter.post(
  "/",
  ah(async (req, res) => {
    assertCan(req, P.EMPLOYEES_CREATE);
    const body = parse(createSchema, req.body);
    await assertValidManager(null, body.managerId);
    const role = body.roleId
      ? await prisma.role.findUnique({ where: { id: body.roleId } })
      : await prisma.role.findUnique({ where: { name: "Employee" } });
    if (!role) throw badRequest("Role not found");
    if (role.name === "Super Admin" && !can(req, P.ADMIN_ROLES)) throw forbidden("Only administrators can grant Super Admin");

    const { email, password, employeeCode, ...rest } = body;
    const created = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          roleId: role.id,
          status: password ? "ACTIVE" : "INVITED",
          passwordHash: password ? await hashPassword(password) : null,
        },
      });
      const employee = await tx.employee.create({
        data: {
          ...(toEmployeeData(rest) as Prisma.EmployeeUncheckedCreateInput),
          userId: user.id,
          employeeCode: employeeCode ?? (await nextEmployeeCode()),
        },
        select: profileSelect,
      });
      await tx.employmentHistory.create({
        data: {
          employeeId: employee.id,
          changeType: "JOINED",
          toValue: `${employee.designation}${employee.department ? ` · ${employee.department.name}` : ""}`,
          effectiveDate: dateOnly(body.joiningDate),
          changedById: req.auth!.userId,
        },
      });
      return { user, employee };
    });

    if (!password) await issueResetCode(created.user.id, created.user.email);
    await audit(req, "employee.create", "Employee", created.employee.id, { email, role: role.name });

    const name = `${created.employee.firstName} ${created.employee.lastName}`;
    const hrUsers = await userIdsWithPermission(P.EMPLOYEES_CREATE);
    const managerUser = body.managerId
      ? (await prisma.employee.findUnique({ where: { id: body.managerId }, select: { userId: true } }))?.userId
      : null;
    await notify([...hrUsers.filter((u) => u !== req.auth!.userId), managerUser], {
      type: "ONBOARDING",
      title: "New employee onboarded",
      body: `${name} joins as ${created.employee.designation}.`,
      link: `/employees/${created.employee.id}`,
      entityType: "Employee",
      entityId: created.employee.id,
    });
    res.status(201).json(created.employee);
  }),
);

// ── Profile editing (EMP-02/03/07) ──────────────────────────────

employeesRouter.patch(
  "/:id",
  ah(async (req, res) => {
    const id = String(req.params.id);
    const isSelf = req.auth!.employeeId === id;
    const isHr = can(req, P.EMPLOYEES_UPDATE);
    if (!isHr && !isSelf) throw forbidden();

    let body: z.infer<typeof hrEditableSchema>;
    if (isHr) {
      body = parse(hrEditableSchema, req.body);
    } else {
      const disallowed = Object.keys(req.body ?? {}).filter((k) => !SELF_FIELDS.includes(k));
      if (disallowed.length) throw forbidden(`You can't change: ${disallowed.join(", ")}`);
      body = parse(selfEditableSchema, req.body);
    }

    const before = await prisma.employee.findUnique({
      where: { id },
      include: { department: true, manager: true, user: { include: { role: true } } },
    });
    if (!before) throw notFound("Employee");
    if (body.managerId !== undefined) await assertValidManager(id, body.managerId);

    const today = todayIn(await getSetting("company.timezone"));
    const history: Prisma.EmploymentHistoryCreateManyInput[] = [];
    const track = async (changeType: string, from: string | null | undefined, to: string | null | undefined) => {
      if ((from ?? null) !== (to ?? null)) {
        history.push({ employeeId: id, changeType, fromValue: from ?? null, toValue: to ?? null, effectiveDate: today, changedById: req.auth!.userId });
      }
    };
    if (body.designation !== undefined) await track("DESIGNATION_CHANGE", before.designation, body.designation);
    if (body.employmentStatus !== undefined) await track("STATUS_CHANGE", before.employmentStatus, body.employmentStatus);
    if (body.departmentId !== undefined) {
      const to = body.departmentId ? (await prisma.department.findUnique({ where: { id: body.departmentId } }))?.name : null;
      await track("DEPARTMENT_CHANGE", before.department?.name, to);
    }
    if (body.managerId !== undefined) {
      const m = body.managerId ? await prisma.employee.findUnique({ where: { id: body.managerId } }) : null;
      await track(
        "MANAGER_CHANGE",
        before.manager ? `${before.manager.firstName} ${before.manager.lastName}` : null,
        m ? `${m.firstName} ${m.lastName}` : null,
      );
    }

    if (body.roleId && body.roleId !== before.user.roleId) {
      const role = await prisma.role.findUnique({ where: { id: body.roleId } });
      if (!role) throw badRequest("Role not found");
      if (!can(req, P.ADMIN_USERS, P.ADMIN_ROLES)) throw forbidden("Changing roles requires user administration rights");
      if (role.name === "Super Admin" && !can(req, P.ADMIN_ROLES)) throw forbidden("Only administrators can grant Super Admin");
      await prisma.user.update({ where: { id: before.userId }, data: { roleId: role.id } });
      await audit(req, "user.role_change", "User", before.userId, { from: before.user.role.name, to: role.name });
    }

    const data = toEmployeeData(body);
    const updated = await prisma.$transaction(async (tx) => {
      const e = await tx.employee.update({ where: { id }, data, select: { ...profileSelect, ...sensitiveSelect } });
      if (history.length) await tx.employmentHistory.createMany({ data: history });
      return e;
    });
    const { roleId: _r, ...fields } = body;
    await audit(req, isSelf && !isHr ? "employee.self_update" : "employee.update", "Employee", id, {
      changes: diff(before as unknown as Record<string, unknown>, fields as Record<string, unknown>),
    });
    res.json(updated);
  }),
);

/** Offboarding: mark exited, deactivate the account and revoke all sessions (security §14). */
employeesRouter.post(
  "/:id/exit",
  ah(async (req, res) => {
    assertCan(req, P.EMPLOYEES_UPDATE);
    const id = String(req.params.id);
    const body = parse(z.object({ exitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), note: z.string().max(500).optional() }), req.body);
    const emp = await prisma.employee.findUnique({ where: { id } });
    if (!emp) throw notFound("Employee");
    if (emp.id === req.auth!.employeeId) throw badRequest("You cannot offboard yourself");
    await prisma.$transaction([
      prisma.employee.update({ where: { id }, data: { employmentStatus: "EXITED", exitDate: dateOnly(body.exitDate) } }),
      prisma.user.update({ where: { id: emp.userId }, data: { status: "DEACTIVATED" } }),
      prisma.session.updateMany({ where: { userId: emp.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
      prisma.employmentHistory.create({
        data: { employeeId: id, changeType: "EXITED", fromValue: emp.employmentStatus, toValue: "EXITED", effectiveDate: dateOnly(body.exitDate), note: body.note, changedById: req.auth!.userId },
      }),
      // Re-point direct reports to the leaver's manager.
      prisma.employee.updateMany({ where: { managerId: id }, data: { managerId: emp.managerId } }),
    ]);
    await audit(req, "employee.exit", "Employee", id, body);
    res.json({ ok: true });
  }),
);

/** Re-sends the activation / reset code for an employee's account. */
employeesRouter.post(
  "/:id/resend-invite",
  ah(async (req, res) => {
    assertCan(req, P.EMPLOYEES_CREATE, P.ADMIN_USERS);
    const emp = await prisma.employee.findUnique({ where: { id: String(req.params.id) }, include: { user: true } });
    if (!emp) throw notFound("Employee");
    if (emp.user.status !== "INVITED") throw badRequest("This account is already activated");
    await issueResetCode(emp.userId, emp.user.email);
    await audit(req, "employee.invite_resent", "Employee", emp.id);
    res.json({ ok: true });
  }),
);

// ── Departments & Teams (EMP-06, ADMIN-04) ──────────────────────

export const orgRouter = Router();

const deptSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().max(500).nullable().optional(),
  headId: z.string().uuid().nullable().optional(),
  isActive: z.boolean().optional(),
});

orgRouter.get(
  "/departments",
  ah(async (_req, res) => {
    const rows = await cached("org:departments", 5 * 60_000, [TAGS.org, TAGS.employees], () =>
      prisma.department.findMany({
        orderBy: { name: "asc" },
        include: {
          head: { select: { id: true, firstName: true, lastName: true } },
          teams: { select: { id: true, name: true, leadId: true }, orderBy: { name: "asc" } },
          _count: { select: { employees: { where: { employmentStatus: { not: "EXITED" } } } } },
        },
      }),
    );
    res.json(rows);
  }),
);

orgRouter.post(
  "/departments",
  ah(async (req, res) => {
    assertCan(req, P.ORG_MANAGE);
    const body = parse(deptSchema, req.body);
    const dept = await prisma.department.create({ data: body });
    await audit(req, "department.create", "Department", dept.id, body);
    res.status(201).json(dept);
  }),
);

orgRouter.patch(
  "/departments/:id",
  ah(async (req, res) => {
    assertCan(req, P.ORG_MANAGE);
    const body = parse(deptSchema.partial(), req.body);
    const dept = await prisma.department.update({ where: { id: String(req.params.id) }, data: body });
    await audit(req, "department.update", "Department", dept.id, body);
    res.json(dept);
  }),
);

orgRouter.delete(
  "/departments/:id",
  ah(async (req, res) => {
    assertCan(req, P.ORG_MANAGE);
    const id = String(req.params.id);
    const members = await prisma.employee.count({ where: { departmentId: id, employmentStatus: { not: "EXITED" } } });
    if (members) throw badRequest(`Department still has ${members} active employee(s). Move them first or deactivate the department.`);
    await prisma.department.delete({ where: { id } });
    await audit(req, "department.delete", "Department", id);
    res.json({ ok: true });
  }),
);

const teamSchema = z.object({
  name: z.string().trim().min(1).max(120),
  departmentId: z.string().uuid(),
  leadId: z.string().uuid().nullable().optional(),
});

orgRouter.get(
  "/teams",
  ah(async (req, res) => {
    const departmentId = req.query.departmentId ? String(req.query.departmentId) : "";
    res.json(
      await cached(`org:teams:${departmentId}`, 5 * 60_000, [TAGS.org, TAGS.employees], () =>
        prisma.team.findMany({
          where: departmentId ? { departmentId } : {},
          include: {
            department: { select: { id: true, name: true } },
            lead: { select: { id: true, firstName: true, lastName: true } },
            _count: { select: { members: true } },
          },
          orderBy: { name: "asc" },
        }),
      ),
    );
  }),
);

orgRouter.post(
  "/teams",
  ah(async (req, res) => {
    assertCan(req, P.ORG_MANAGE);
    const body = parse(teamSchema, req.body);
    const team = await prisma.team.create({ data: body });
    await audit(req, "team.create", "Team", team.id, body);
    res.status(201).json(team);
  }),
);

orgRouter.patch(
  "/teams/:id",
  ah(async (req, res) => {
    assertCan(req, P.ORG_MANAGE);
    const body = parse(teamSchema.partial(), req.body);
    const team = await prisma.team.update({ where: { id: String(req.params.id) }, data: body });
    await audit(req, "team.update", "Team", team.id, body);
    res.json(team);
  }),
);

orgRouter.delete(
  "/teams/:id",
  ah(async (req, res) => {
    assertCan(req, P.ORG_MANAGE);
    const id = String(req.params.id);
    await prisma.employee.updateMany({ where: { teamId: id }, data: { teamId: null } });
    await prisma.team.delete({ where: { id } });
    await audit(req, "team.delete", "Team", id);
    res.json({ ok: true });
  }),
);
