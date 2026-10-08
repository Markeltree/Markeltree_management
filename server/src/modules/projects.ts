import { Router, type Request } from "express";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { PERMISSIONS as P } from "../config/permissions.js";
import { prisma } from "../lib/prisma.js";
import { ah, forbidden, notFound, parse } from "../lib/http.js";
import { audit } from "../lib/audit.js";
import { dateOnly } from "../lib/dates.js";
import { notify, userIdsForEmployees } from "../lib/notify.js";
import { assertCan, can } from "../middleware/auth.js";

export const projectsRouter = Router();

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const projectSchema = z.object({
  name: z.string().trim().min(1).max(160),
  code: z.string().trim().max(30).nullable().optional(),
  description: z.string().max(10000).nullable().optional(),
  ownerId: z.string().uuid().optional(),
  status: z.enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]).optional(),
  startDate: dateStr.nullable().optional(),
  endDate: dateStr.nullable().optional(),
  manualProgress: z.number().int().min(0).max(100).nullable().optional(),
});

const memberSelect = { select: { id: true, firstName: true, lastName: true, avatarUrl: true, designation: true } } as const;

function visibleWhere(req: Request): Prisma.ProjectWhereInput {
  if (can(req, P.PROJECTS_VIEW_ALL, P.PROJECTS_MANAGE_ALL)) return {};
  const empId = req.auth!.employeeId ?? "__none__";
  return { OR: [{ ownerId: empId }, { members: { some: { employeeId: empId } } }] };
}

async function loadForManage(req: Request, id: string) {
  const project = await prisma.project.findUnique({ where: { id }, include: { members: true } });
  if (!project) throw notFound("Project");
  const empId = req.auth!.employeeId;
  const isManager = project.ownerId === empId || project.members.some((m) => m.employeeId === empId && ["OWNER", "MANAGER"].includes(m.role));
  if (!isManager && !can(req, P.PROJECTS_MANAGE_ALL)) throw forbidden();
  return project;
}

/** PROJ-04: progress from task completion, unless a manual value is set. */
async function withProgress<T extends { id: string; manualProgress: number | null }>(projects: T[]) {
  if (!projects.length) return [];
  const counts = await prisma.task.groupBy({ by: ["projectId", "status"], where: { projectId: { in: projects.map((p) => p.id) } }, _count: true });
  return projects.map((p) => {
    const rows = counts.filter((c) => c.projectId === p.id);
    const total = rows.reduce((s, r) => s + r._count, 0);
    const done = rows.filter((r) => r.status === "DONE").reduce((s, r) => s + r._count, 0);
    return { ...p, taskCounts: { total, done }, progress: p.manualProgress ?? (total ? Math.round((done / total) * 100) : 0) };
  });
}

projectsRouter.get(
  "/",
  ah(async (req, res) => {
    const where: Prisma.ProjectWhereInput = {
      AND: [visibleWhere(req), req.query.status ? { status: String(req.query.status) as Prisma.EnumProjectStatusFilter["equals"] } : {}],
    };
    const projects = await prisma.project.findMany({
      where,
      include: { owner: memberSelect, _count: { select: { members: true } } },
      orderBy: { updatedAt: "desc" },
    });
    res.json(await withProgress(projects));
  }),
);

projectsRouter.get(
  "/:id",
  ah(async (req, res) => {
    const project = await prisma.project.findFirst({
      where: { AND: [{ id: String(req.params.id) }, visibleWhere(req)] },
      include: {
        owner: memberSelect,
        members: { include: { employee: memberSelect }, orderBy: { addedAt: "asc" } },
        activities: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });
    if (!project) throw notFound("Project");
    res.json((await withProgress([project]))[0]);
  }),
);

projectsRouter.post(
  "/",
  ah(async (req, res) => {
    assertCan(req, P.PROJECTS_CREATE, P.PROJECTS_MANAGE_ALL);
    const body = parse(projectSchema, req.body);
    const ownerId = body.ownerId ?? req.auth!.employeeId;
    if (!ownerId) throw forbidden("Project owner must be an employee");
    const project = await prisma.project.create({
      data: {
        ...body,
        ownerId,
        startDate: body.startDate ? dateOnly(body.startDate) : null,
        endDate: body.endDate ? dateOnly(body.endDate) : null,
        members: { create: [{ employeeId: ownerId, role: "OWNER" }] },
        activities: { create: [{ actorId: req.auth!.userId, action: "project.created", detail: body.name }] },
      },
    });
    await audit(req, "project.create", "Project", project.id, { name: project.name });
    res.status(201).json(project);
  }),
);

projectsRouter.patch(
  "/:id",
  ah(async (req, res) => {
    const existing = await loadForManage(req, String(req.params.id));
    const body = parse(projectSchema.partial(), req.body);
    const project = await prisma.project.update({
      where: { id: existing.id },
      data: {
        ...body,
        ...(body.startDate !== undefined && { startDate: body.startDate ? dateOnly(body.startDate) : null }),
        ...(body.endDate !== undefined && { endDate: body.endDate ? dateOnly(body.endDate) : null }),
      },
    });
    await prisma.projectActivity.create({ data: { projectId: project.id, actorId: req.auth!.userId, action: "project.updated", detail: Object.keys(body).join(", ") } });
    await audit(req, "project.update", "Project", project.id, body);
    res.json(project);
  }),
);

projectsRouter.put(
  "/:id/members",
  ah(async (req, res) => {
    const existing = await loadForManage(req, String(req.params.id));
    const body = parse(
      z.object({ members: z.array(z.object({ employeeId: z.string().uuid(), role: z.enum(["MANAGER", "MEMBER", "VIEWER"]) })).max(500) }),
      req.body,
    );
    const keep = body.members.filter((m) => m.employeeId !== existing.ownerId);
    const before = new Set(existing.members.map((m) => m.employeeId));
    await prisma.$transaction([
      prisma.projectMember.deleteMany({ where: { projectId: existing.id, employeeId: { not: existing.ownerId } } }),
      prisma.projectMember.createMany({ data: keep.map((m) => ({ projectId: existing.id, ...m })) }),
    ]);
    const added = keep.filter((m) => !before.has(m.employeeId)).map((m) => m.employeeId);
    await prisma.projectActivity.create({ data: { projectId: existing.id, actorId: req.auth!.userId, action: "project.members", detail: `${keep.length + 1} members` } });
    await audit(req, "project.members.update", "Project", existing.id, { count: keep.length + 1 });
    await notify(await userIdsForEmployees(added), {
      type: "PROJECT_ADDED",
      title: "Added to a project",
      body: `You were added to ${existing.name}.`,
      link: `/projects/${existing.id}`,
      entityType: "Project",
      entityId: existing.id,
    });
    res.json({ ok: true });
  }),
);

projectsRouter.delete(
  "/:id",
  ah(async (req, res) => {
    const existing = await loadForManage(req, String(req.params.id));
    await prisma.project.delete({ where: { id: existing.id } });
    await audit(req, "project.delete", "Project", existing.id, { name: existing.name });
    res.json({ ok: true });
  }),
);
