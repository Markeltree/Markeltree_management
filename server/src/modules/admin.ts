import { Router } from "express";
import type { Prisma, UserStatus } from "@prisma/client";
import { z } from "zod";
import { ALL_PERMISSIONS, PERMISSIONS as P } from "../config/permissions.js";
import { prisma } from "../lib/prisma.js";
import { ah, badRequest, forbidden, notFound, paged, paging, parse } from "../lib/http.js";
import { audit } from "../lib/audit.js";
import { getAllSettings, SETTING_DEFAULTS, setSetting, type SettingKey } from "../lib/settings.js";
import { assertCan, can, requirePermission } from "../middleware/auth.js";
import { toCsv } from "../lib/csv.js";
import { cached, TAGS } from "../lib/cache.js";

export const adminRouter = Router();

// ── Users & account status (AUTH-05, ADMIN-01) ──────────────────

adminRouter.get(
  "/users",
  requirePermission(P.ADMIN_USERS),
  ah(async (req, res) => {
    const { page, pageSize, skip, take } = paging(req.query);
    const q = String(req.query.search ?? "").trim();
    const where: Prisma.UserWhereInput = {
      ...(req.query.status && { status: String(req.query.status) as UserStatus }),
      ...(req.query.roleId && { roleId: String(req.query.roleId) }),
      ...(q && {
        OR: [
          { email: { contains: q, mode: "insensitive" } },
          { employee: { firstName: { contains: q, mode: "insensitive" } } },
          { employee: { lastName: { contains: q, mode: "insensitive" } } },
        ],
      }),
    };
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, email: true, status: true, lastLoginAt: true, createdAt: true, mfaEnabled: true,
          role: { select: { id: true, name: true } },
          employee: { select: { id: true, employeeCode: true, firstName: true, lastName: true, designation: true, department: { select: { name: true } } } },
          _count: { select: { sessions: { where: { revokedAt: null, expiresAt: { gt: new Date() } } } } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);
    res.json(paged(items, total, page, pageSize));
  }),
);

adminRouter.patch(
  "/users/:id",
  requirePermission(P.ADMIN_USERS),
  ah(async (req, res) => {
    const id = String(req.params.id);
    const body = parse(
      z.object({ status: z.enum(["ACTIVE", "SUSPENDED", "DEACTIVATED"]).optional(), roleId: z.string().uuid().optional() }),
      req.body,
    );
    if (id === req.auth!.userId && (body.status || body.roleId)) throw badRequest("You cannot change your own status or role");
    const user = await prisma.user.findUnique({ where: { id }, include: { role: true } });
    if (!user) throw notFound("User");
    if (user.role.name === "Super Admin" && !can(req, P.ADMIN_ROLES)) throw forbidden("Only administrators can modify a Super Admin");
    if (body.roleId) {
      const role = await prisma.role.findUnique({ where: { id: body.roleId } });
      if (!role) throw badRequest("Role not found");
      if (role.name === "Super Admin" && !can(req, P.ADMIN_ROLES)) throw forbidden("Only administrators can grant Super Admin");
    }
    if (body.status === "ACTIVE" && user.status === "INVITED" && !user.passwordHash) {
      throw badRequest("This user hasn't set a password yet — resend their invitation instead");
    }
    const updated = await prisma.user.update({ where: { id }, data: body, select: { id: true, email: true, status: true, role: { select: { id: true, name: true } } } });
    if (body.status && body.status !== "ACTIVE") {
      await prisma.session.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
    }
    await audit(req, "user.update", "User", id, {
      ...(body.status && { status: { from: user.status, to: body.status } }),
      ...(body.roleId && { role: { from: user.role.name, to: updated.role.name } }),
    });
    res.json(updated);
  }),
);

adminRouter.post(
  "/users/:id/revoke-sessions",
  requirePermission(P.ADMIN_USERS),
  ah(async (req, res) => {
    const id = String(req.params.id);
    const { count } = await prisma.session.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
    await audit(req, "user.sessions_revoked", "User", id, { count });
    res.json({ ok: true, revoked: count });
  }),
);

// ── Roles & permissions (ADMIN-02/03) ───────────────────────────

adminRouter.get(
  "/permissions",
  requirePermission(P.ADMIN_ROLES, P.ADMIN_USERS),
  ah(async (_req, res) => {
    res.json(await cached("permissions", 60 * 60_000, [TAGS.roles], () => prisma.permission.findMany({ orderBy: [{ module: "asc" }, { action: "asc" }] })));
  }),
);

adminRouter.get(
  "/roles",
  ah(async (req, res) => {
    // Role names are needed by HR when onboarding; full permission detail is admin-only.
    const roles = await cached("roles", 5 * 60_000, [TAGS.roles], () =>
      prisma.role.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { users: true } }, permissions: { select: { permission: { select: { key: true } } } } },
      }),
    );
    const detailed = can(req, P.ADMIN_ROLES);
    res.json(roles.map((r) => ({ ...r, permissions: detailed ? r.permissions.map((p) => p.permission.key) : undefined })));
  }),
);

const roleSchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().max(300).nullable().optional(),
  permissions: z.array(z.enum(ALL_PERMISSIONS as [string, ...string[]])).default([]),
});

async function setRolePermissions(roleId: string, keys: string[]) {
  const perms = await prisma.permission.findMany({ where: { key: { in: keys } }, select: { id: true } });
  await prisma.$transaction([
    prisma.rolePermission.deleteMany({ where: { roleId } }),
    prisma.rolePermission.createMany({ data: perms.map((p) => ({ roleId, permissionId: p.id })) }),
  ]);
}

adminRouter.post(
  "/roles",
  requirePermission(P.ADMIN_ROLES),
  ah(async (req, res) => {
    const body = parse(roleSchema, req.body);
    const role = await prisma.role.create({ data: { name: body.name, description: body.description } });
    await setRolePermissions(role.id, body.permissions);
    await audit(req, "role.create", "Role", role.id, { name: role.name, permissions: body.permissions });
    res.status(201).json(role);
  }),
);

adminRouter.patch(
  "/roles/:id",
  requirePermission(P.ADMIN_ROLES),
  ah(async (req, res) => {
    const id = String(req.params.id);
    const body = parse(roleSchema.partial(), req.body);
    const role = await prisma.role.findUnique({ where: { id }, include: { permissions: { include: { permission: true } } } });
    if (!role) throw notFound("Role");
    if (role.name === "Super Admin" && body.permissions && body.permissions.length !== ALL_PERMISSIONS.length) {
      throw badRequest("Super Admin always has every permission");
    }
    if (role.isSystem && body.name && body.name !== role.name) throw badRequest("System roles cannot be renamed");
    const updated = await prisma.role.update({ where: { id }, data: { name: body.name, description: body.description } });
    if (body.permissions) {
      const before = role.permissions.map((p) => p.permission.key);
      await setRolePermissions(id, body.permissions);
      await audit(req, "role.permissions.update", "Role", id, {
        added: body.permissions.filter((k) => !before.includes(k)),
        removed: before.filter((k) => !body.permissions!.includes(k)),
      });
    }
    res.json(updated);
  }),
);

adminRouter.delete(
  "/roles/:id",
  requirePermission(P.ADMIN_ROLES),
  ah(async (req, res) => {
    const id = String(req.params.id);
    const role = await prisma.role.findUnique({ where: { id }, include: { _count: { select: { users: true } } } });
    if (!role) throw notFound("Role");
    if (role.isSystem) throw badRequest("System roles cannot be deleted");
    if (role._count.users) throw badRequest(`Role is assigned to ${role._count.users} user(s). Reassign them first.`);
    await prisma.role.delete({ where: { id } });
    await audit(req, "role.delete", "Role", id, { name: role.name });
    res.json({ ok: true });
  }),
);

// ── Policies & settings (ADMIN-05) ──────────────────────────────

adminRouter.get(
  "/settings",
  ah(async (_req, res) => {
    // Policy values are readable by every user (needed for attendance/leave UI); editing is restricted.
    res.json(await getAllSettings());
  }),
);

const settingValidators: Partial<Record<SettingKey, z.ZodType>> = {
  "company.name": z.string().min(1).max(120),
  "company.timezone": z.string().refine((tz) => {
    try {
      new Intl.DateTimeFormat("en", { timeZone: tz });
      return true;
    } catch {
      return false;
    }
  }, "Unknown timezone"),
  "attendance.workStart": z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  "attendance.workEnd": z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  "attendance.graceMinutes": z.number().int().min(0).max(240),
  "attendance.earlyLeaveGraceMinutes": z.number().int().min(0).max(240),
  "attendance.workingDays": z.array(z.number().int().min(0).max(6)).max(7),
  "attendance.allowedIps": z.array(z.string().max(60)).max(100),
  "leave.requireHrSecondApproval": z.boolean(),
  "files.maxSizeMb": z.number().int().min(1).max(1024),
  "files.allowedTypes": z.array(z.string().regex(/^[a-z0-9]+$/)).max(100),
  "chat.employeesCanCreateGroups": z.boolean(),
  "payroll.deductAbsences": z.boolean(),
  "payroll.dayBasis": z.enum(["FIXED_30", "CALENDAR", "WORKING"]),
  "payroll.currency": z.string().regex(/^[A-Z]{3}$/, "Use a 3-letter currency code, e.g. PKR"),
};

adminRouter.put(
  "/settings",
  ah(async (req, res) => {
    assertCan(req, P.ADMIN_SETTINGS);
    const body = parse(z.record(z.string(), z.unknown()), req.body);
    const changes: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (!(key in SETTING_DEFAULTS)) throw badRequest(`Unknown setting: ${key}`);
      const validator = settingValidators[key as SettingKey];
      changes[key] = validator ? parse(validator, value) : value;
    }
    for (const [key, value] of Object.entries(changes)) await setSetting(key as SettingKey, value);
    await audit(req, "settings.update", "Setting", null, changes);
    res.json(await getAllSettings());
  }),
);

// ── Audit log (ADMIN-06) ────────────────────────────────────────

adminRouter.get(
  "/audit-logs",
  requirePermission(P.ADMIN_AUDIT),
  ah(async (req, res) => {
    const { page, pageSize, skip, take } = paging(req.query);
    const where: Prisma.AuditLogWhereInput = {
      ...(req.query.actorId && { actorId: String(req.query.actorId) }),
      ...(req.query.entityType && { entityType: String(req.query.entityType) }),
      ...(req.query.entityId && { entityId: String(req.query.entityId) }),
      ...(req.query.action && { action: { startsWith: String(req.query.action) } }),
      ...((req.query.from || req.query.to) && {
        createdAt: {
          ...(req.query.from && { gte: new Date(String(req.query.from)) }),
          ...(req.query.to && { lte: new Date(String(req.query.to)) }),
        },
      }),
    };
    const select = {
      id: true, action: true, entityType: true, entityId: true, metadata: true, ip: true, userAgent: true, createdAt: true,
      actor: { select: { id: true, email: true, employee: { select: { firstName: true, lastName: true } } } },
    } satisfies Prisma.AuditLogSelect;
    if (req.query.format === "csv") {
      const rows = await prisma.auditLog.findMany({ where, select, orderBy: { createdAt: "desc" }, take: 10000 });
      await audit(req, "audit.export", "AuditLog", null, { count: rows.length });
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="audit-log.csv"`);
      return res.send(
        toCsv(
          ["Timestamp", "Actor", "Action", "Entity", "Entity ID", "IP", "Details"],
          rows.map((r) => [r.createdAt.toISOString(), r.actor?.email ?? "system", r.action, r.entityType, r.entityId, r.ip, JSON.stringify(r.metadata ?? {})]),
        ),
      );
    }
    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({ where, select, orderBy: { createdAt: "desc" }, skip, take }),
      prisma.auditLog.count({ where }),
    ]);
    res.json(paged(items, total, page, pageSize));
  }),
);
