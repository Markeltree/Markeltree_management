import { Router, type Request } from "express";
import { Prisma, type Task, type TaskStatus } from "@prisma/client";
import { z } from "zod";
import { PERMISSIONS as P } from "../config/permissions.js";
import { prisma } from "../lib/prisma.js";
import { ah, forbidden, notFound, paged, paging, parse } from "../lib/http.js";
import { audit } from "../lib/audit.js";
import { notify, userIdsForEmployees } from "../lib/notify.js";
import { employeeScope, inScope } from "../lib/scope.js";
import { assertCan, can } from "../middleware/auth.js";
import { toCsv } from "../lib/csv.js";

export const tasksRouter = Router();

const taskInclude = {
  assignee: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, userId: true } },
  createdBy: { select: { id: true, email: true, employee: { select: { id: true, firstName: true, lastName: true } } } },
  project: { select: { id: true, name: true } },
  subtasks: { orderBy: { position: "asc" } },
  _count: { select: { comments: true, attachments: true } },
} satisfies Prisma.TaskInclude;

const taskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(10000).nullable().optional(),
  assigneeId: z.string().uuid().nullable().optional(),
  projectId: z.string().uuid().nullable().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).optional(),
  dueDate: z.string().datetime({ offset: true }).nullable().optional(),
  position: z.number().int().optional(),
  subtasks: z.array(z.object({ title: z.string().trim().min(1).max(200), done: z.boolean().optional() })).max(50).optional(),
});

/** Project membership check for project-linked tasks. */
async function isProjectMember(projectId: string, employeeId: string | null) {
  if (!employeeId) return false;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true, members: { where: { employeeId }, select: { role: true } } },
  });
  return !!project && (project.ownerId === employeeId || project.members.length > 0);
}

/** Visibility: own/assigned/created, team (with tasks.view_team), project members, or everything (tasks.view_all). */
async function visibilityWhere(req: Request): Promise<Prisma.TaskWhereInput> {
  if (can(req, P.TASKS_VIEW_ALL, P.TASKS_MANAGE_ALL)) return {};
  const scope = await employeeScope(req, P.TASKS_VIEW_ALL, P.TASKS_VIEW_TEAM);
  const empId = req.auth!.employeeId;
  return {
    OR: [
      { createdById: req.auth!.userId },
      ...(scope.kind === "ids" && scope.ids.length ? [{ assigneeId: { in: scope.ids } }] : []),
      ...(empId ? [{ project: { OR: [{ ownerId: empId }, { members: { some: { employeeId: empId } } }] } }] : []),
    ],
  };
}

async function canView(req: Request, task: Task) {
  const where = await visibilityWhere(req);
  return !!(await prisma.task.findFirst({ where: { AND: [{ id: task.id }, where] }, select: { id: true } }));
}

/** Full edit rights: creator, manage_all, assignee's manager chain (view_team), or project owner. */
async function canManage(req: Request, task: Task) {
  if (can(req, P.TASKS_MANAGE_ALL) || task.createdById === req.auth!.userId) return true;
  if (task.assigneeId && can(req, P.TASKS_VIEW_TEAM)) {
    const scope = await employeeScope(req, P.TASKS_VIEW_ALL, P.TASKS_VIEW_TEAM);
    if (inScope(scope, task.assigneeId) && task.assigneeId !== req.auth!.employeeId) return true;
  }
  if (task.projectId) {
    const p = await prisma.project.findUnique({ where: { id: task.projectId }, select: { ownerId: true } });
    if (p?.ownerId === req.auth!.employeeId) return true;
  }
  return false;
}

/** Assigning to someone else requires them to be in your team scope (or tasks.manage_all / shared project). */
async function assertCanAssign(req: Request, assigneeId: string | null | undefined, projectId: string | null | undefined) {
  if (!assigneeId || assigneeId === req.auth!.employeeId || can(req, P.TASKS_MANAGE_ALL)) return;
  const scope = await employeeScope(req, P.TASKS_VIEW_ALL, P.TASKS_VIEW_TEAM);
  if (inScope(scope, assigneeId)) return;
  if (projectId && (await isProjectMember(projectId, assigneeId)) && (await isProjectMember(projectId, req.auth!.employeeId))) return;
  throw forbidden("You can only assign tasks to members of your team or project");
}

async function notifyAssignee(req: Request, task: { id: string; title: string; assigneeId: string | null; dueDate: Date | null }) {
  if (!task.assigneeId || task.assigneeId === req.auth!.employeeId) return;
  await notify(await userIdsForEmployees([task.assigneeId]), {
    type: "TASK_ASSIGNED",
    title: "New task assigned to you",
    body: `${task.title}${task.dueDate ? ` — due ${task.dueDate.toISOString().slice(0, 10)}` : ""}`,
    link: `/task?id=${task.id}`,
    entityType: "Task",
    entityId: task.id,
  });
}

tasksRouter.get(
  "/",
  ah(async (req, res) => {
    const { page, pageSize, skip, take } = paging(req.query);
    const q = String(req.query.search ?? "").trim();
    const view = String(req.query.view ?? "visible"); // mine | created | visible
    const filters: Prisma.TaskWhereInput[] = [await visibilityWhere(req)];
    if (view === "mine") filters.push({ assigneeId: req.auth!.employeeId ?? "__none__" });
    if (view === "created") filters.push({ createdById: req.auth!.userId });
    if (req.query.status) filters.push({ status: { in: String(req.query.status).split(",") as TaskStatus[] } });
    if (req.query.priority) filters.push({ priority: String(req.query.priority) as Task["priority"] });
    if (req.query.projectId) filters.push({ projectId: String(req.query.projectId) });
    if (req.query.assigneeId) filters.push({ assigneeId: String(req.query.assigneeId) });
    if (req.query.overdue === "true") filters.push({ dueDate: { lt: new Date() }, status: { not: "DONE" } });
    if (q) filters.push({ OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] });
    const where = { AND: filters };
    const [items, total] = await Promise.all([
      prisma.task.findMany({ where, include: taskInclude, orderBy: [{ status: "asc" }, { position: "asc" }, { dueDate: "asc" }], skip, take }),
      prisma.task.count({ where }),
    ]);
    res.json(paged(items, total, page, pageSize));
  }),
);

/** Counts for dashboards / task header cards. */
tasksRouter.get(
  "/stats",
  ah(async (req, res) => {
    const base = req.query.view === "mine" ? { assigneeId: req.auth!.employeeId ?? "__none__" } : await visibilityWhere(req);
    const [byStatus, overdue] = await Promise.all([
      prisma.task.groupBy({ by: ["status"], where: base, _count: true }),
      prisma.task.count({ where: { AND: [base, { dueDate: { lt: new Date() }, status: { not: "DONE" } }] } }),
    ]);
    const counts = Object.fromEntries(byStatus.map((s) => [s.status, s._count]));
    res.json({ total: byStatus.reduce((s, r) => s + r._count, 0), byStatus: counts, overdue });
  }),
);

tasksRouter.get(
  "/:id",
  ah(async (req, res) => {
    const task = await prisma.task.findUnique({
      where: { id: String(req.params.id) },
      include: {
        ...taskInclude,
        comments: {
          orderBy: { createdAt: "asc" },
          include: { user: { select: { id: true, employee: { select: { firstName: true, lastName: true, avatarUrl: true } } } } },
        },
      },
    });
    if (!task || !(await canView(req, task))) throw notFound("Task");
    res.json({ ...task, canManage: await canManage(req, task) });
  }),
);

tasksRouter.post(
  "/",
  ah(async (req, res) => {
    assertCan(req, P.TASKS_CREATE);
    const body = parse(taskSchema, req.body);
    if (body.projectId && !can(req, P.PROJECTS_MANAGE_ALL) && !(await isProjectMember(body.projectId, req.auth!.employeeId))) {
      throw forbidden("You are not a member of this project");
    }
    await assertCanAssign(req, body.assigneeId, body.projectId);
    const { subtasks, dueDate, ...rest } = body;
    const task = await prisma.task.create({
      data: {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdById: req.auth!.userId,
        completedAt: body.status === "DONE" ? new Date() : null,
        subtasks: subtasks?.length ? { create: subtasks.map((s, i) => ({ ...s, position: i })) } : undefined,
      },
      include: taskInclude,
    });
    await audit(req, "task.create", "Task", task.id, { title: task.title, assigneeId: task.assigneeId });
    if (task.projectId) {
      await prisma.projectActivity.create({ data: { projectId: task.projectId, actorId: req.auth!.userId, action: "task.created", detail: task.title } });
    }
    await notifyAssignee(req, task);
    res.status(201).json(task);
  }),
);

tasksRouter.patch(
  "/:id",
  ah(async (req, res) => {
    const existing = await prisma.task.findUnique({ where: { id: String(req.params.id) } });
    if (!existing || !(await canView(req, existing))) throw notFound("Task");
    const manager = await canManage(req, existing);
    const isAssignee = !!existing.assigneeId && existing.assigneeId === req.auth!.employeeId;
    const body = parse(taskSchema.omit({ subtasks: true }).partial(), req.body);
    if (!manager) {
      // Assignees can move their task through the workflow but not re-scope it.
      const allowed = ["status", "position"];
      const extra = Object.keys(body).filter((k) => !allowed.includes(k));
      if (!isAssignee || extra.length) throw forbidden(isAssignee ? `You can only change the status of this task` : undefined);
    }
    if (body.assigneeId !== undefined && body.assigneeId !== existing.assigneeId) {
      await assertCanAssign(req, body.assigneeId, body.projectId ?? existing.projectId);
    }
    const { dueDate, ...rest } = body;
    const data: Prisma.TaskUncheckedUpdateInput = { ...rest };
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
    if (body.status && body.status !== existing.status) data.completedAt = body.status === "DONE" ? new Date() : null;
    const task = await prisma.task.update({ where: { id: existing.id }, data, include: taskInclude });
    await audit(req, "task.update", "Task", task.id, { fields: Object.keys(body) });

    if (body.assigneeId && body.assigneeId !== existing.assigneeId) await notifyAssignee(req, task);
    if (body.status && body.status !== existing.status) {
      if (task.projectId) {
        await prisma.projectActivity.create({ data: { projectId: task.projectId, actorId: req.auth!.userId, action: "task.status", detail: `${task.title}: ${existing.status} → ${body.status}` } });
      }
      // Let the creator know when the assignee moves the task forward (e.g. submitted for review).
      if (existing.createdById !== req.auth!.userId) {
        await notify([existing.createdById], {
          type: "TASK_UPDATED",
          title: body.status === "REVIEW" ? "Task submitted for review" : `Task moved to ${body.status.replace("_", " ").toLowerCase()}`,
          body: task.title,
          link: `/task?id=${task.id}`,
          entityType: "Task",
          entityId: task.id,
        });
      }
    }
    res.json(task);
  }),
);

tasksRouter.delete(
  "/:id",
  ah(async (req, res) => {
    const existing = await prisma.task.findUnique({ where: { id: String(req.params.id) } });
    if (!existing || !(await canView(req, existing))) throw notFound("Task");
    if (!(await canManage(req, existing))) throw forbidden();
    await prisma.task.delete({ where: { id: existing.id } });
    await audit(req, "task.delete", "Task", existing.id, { title: existing.title });
    res.json({ ok: true });
  }),
);

// ── Subtasks (TASK-04) ──────────────────────────────────────────

tasksRouter.post(
  "/:id/subtasks",
  ah(async (req, res) => {
    const task = await prisma.task.findUnique({ where: { id: String(req.params.id) } });
    if (!task || !(await canView(req, task))) throw notFound("Task");
    if (!(await canManage(req, task)) && task.assigneeId !== req.auth!.employeeId) throw forbidden();
    const { title } = parse(z.object({ title: z.string().trim().min(1).max(200) }), req.body);
    const position = await prisma.subtask.count({ where: { taskId: task.id } });
    res.status(201).json(await prisma.subtask.create({ data: { taskId: task.id, title, position } }));
  }),
);

tasksRouter.patch(
  "/:id/subtasks/:subtaskId",
  ah(async (req, res) => {
    const task = await prisma.task.findUnique({ where: { id: String(req.params.id) } });
    if (!task || !(await canView(req, task))) throw notFound("Task");
    if (!(await canManage(req, task)) && task.assigneeId !== req.auth!.employeeId) throw forbidden();
    const body = parse(z.object({ title: z.string().trim().min(1).max(200).optional(), done: z.boolean().optional() }), req.body);
    const sub = await prisma.subtask.findFirst({ where: { id: String(req.params.subtaskId), taskId: task.id } });
    if (!sub) throw notFound("Subtask");
    res.json(await prisma.subtask.update({ where: { id: sub.id }, data: body }));
  }),
);

tasksRouter.delete(
  "/:id/subtasks/:subtaskId",
  ah(async (req, res) => {
    const task = await prisma.task.findUnique({ where: { id: String(req.params.id) } });
    if (!task || !(await canView(req, task))) throw notFound("Task");
    if (!(await canManage(req, task))) throw forbidden();
    await prisma.subtask.deleteMany({ where: { id: String(req.params.subtaskId), taskId: task.id } });
    res.json({ ok: true });
  }),
);

// ── Comments & mentions (TASK-06) ───────────────────────────────

tasksRouter.post(
  "/:id/comments",
  ah(async (req, res) => {
    const task = await prisma.task.findUnique({ where: { id: String(req.params.id) }, include: { assignee: { select: { userId: true } } } });
    if (!task || !(await canView(req, task))) throw notFound("Task");
    const body = parse(
      z.object({ comment: z.string().trim().min(1).max(5000), mentions: z.array(z.string().uuid()).max(20).default([]) }),
      req.body,
    );
    const comment = await prisma.taskComment.create({
      data: { taskId: task.id, userId: req.auth!.userId, comment: body.comment, mentions: body.mentions },
      include: { user: { select: { id: true, employee: { select: { firstName: true, lastName: true, avatarUrl: true } } } } },
    });
    const author = comment.user.employee ? `${comment.user.employee.firstName} ${comment.user.employee.lastName}` : "Someone";
    // `mentions` are user ids.
    await notify(body.mentions.filter((u) => u !== req.auth!.userId), {
      type: "MENTION",
      title: `${author} mentioned you`,
      body: `On task "${task.title}": ${body.comment.slice(0, 140)}`,
      link: `/task?id=${task.id}`,
      entityType: "Task",
      entityId: task.id,
    });
    const watchers = [task.createdById, task.assignee?.userId].filter((u) => u && u !== req.auth!.userId && !body.mentions.includes(u));
    await notify(watchers, {
      type: "TASK_COMMENT",
      title: `New comment on "${task.title}"`,
      body: `${author}: ${body.comment.slice(0, 140)}`,
      link: `/task?id=${task.id}`,
      entityType: "Task",
      entityId: task.id,
    });
    res.status(201).json(comment);
  }),
);

tasksRouter.delete(
  "/:id/comments/:commentId",
  ah(async (req, res) => {
    const comment = await prisma.taskComment.findFirst({ where: { id: String(req.params.commentId), taskId: String(req.params.id) } });
    if (!comment) throw notFound("Comment");
    if (comment.userId !== req.auth!.userId && !can(req, P.TASKS_MANAGE_ALL)) throw forbidden();
    await prisma.taskComment.delete({ where: { id: comment.id } });
    res.json({ ok: true });
  }),
);

/** REP-03: task completion, overdue and workload per assignee. */
tasksRouter.get(
  "/reports/workload",
  ah(async (req, res) => {
    assertCan(req, P.REPORTS_VIEW_TEAM, P.REPORTS_VIEW_ALL, P.TASKS_VIEW_TEAM, P.TASKS_VIEW_ALL);
    const visible = await visibilityWhere(req);
    const now = new Date();
    const tasks = await prisma.task.findMany({
      where: { AND: [visible, { assigneeId: { not: null } }] },
      select: { status: true, dueDate: true, completedAt: true, assignee: { select: { id: true, employeeCode: true, firstName: true, lastName: true } } },
    });
    const map = new Map<string, { employee: NonNullable<(typeof tasks)[number]["assignee"]>; total: number; open: number; done: number; overdue: number; completedLate: number }>();
    for (const t of tasks) {
      const a = t.assignee!;
      const row = map.get(a.id) ?? { employee: a, total: 0, open: 0, done: 0, overdue: 0, completedLate: 0 };
      row.total++;
      if (t.status === "DONE") {
        row.done++;
        if (t.dueDate && t.completedAt && t.completedAt > t.dueDate) row.completedLate++;
      } else {
        row.open++;
        if (t.dueDate && t.dueDate < now) row.overdue++;
      }
      map.set(a.id, row);
    }
    const rows = [...map.values()].sort((a, b) => b.open - a.open);
    if (req.query.format === "csv") {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="task-workload.csv"`);
      return res.send(
        toCsv(
          ["Employee Code", "Name", "Total", "Open", "Done", "Overdue", "Completed Late"],
          rows.map((r) => [r.employee.employeeCode, `${r.employee.firstName} ${r.employee.lastName}`, r.total, r.open, r.done, r.overdue, r.completedLate]),
        ),
      );
    }
    res.json({ rows });
  }),
);

