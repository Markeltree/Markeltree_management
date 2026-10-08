import { Router, type Request } from "express";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { PERMISSIONS as P } from "../config/permissions.js";
import { prisma } from "../lib/prisma.js";
import { ah, badRequest, forbidden, notFound, paged, paging, parse } from "../lib/http.js";
import { audit } from "../lib/audit.js";
import { notify } from "../lib/notify.js";
import { assertCan, can } from "../middleware/auth.js";

export const announcementsRouter = Router();

const schema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(20000),
  audienceType: z.enum(["ALL", "DEPARTMENT", "TEAM", "USERS"]).default("ALL"),
  audienceIds: z.array(z.string().uuid()).max(1000).default([]),
  requiresAcknowledgement: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  publish: z.boolean().default(true),
  expiresAt: z.string().datetime({ offset: true }).nullable().optional(),
});

/** ANN-02: announcements visible to the requester based on audience targeting. */
async function audienceWhere(req: Request): Promise<Prisma.AnnouncementWhereInput> {
  const me = req.auth!.employeeId
    ? await prisma.employee.findUnique({ where: { id: req.auth!.employeeId }, select: { departmentId: true, teamId: true } })
    : null;
  return {
    OR: [
      { audienceType: "ALL" },
      ...(me?.departmentId ? [{ audienceType: "DEPARTMENT" as const, audienceIds: { has: me.departmentId } }] : []),
      ...(me?.teamId ? [{ audienceType: "TEAM" as const, audienceIds: { has: me.teamId } }] : []),
      { audienceType: "USERS", audienceIds: { has: req.auth!.userId } },
      { authorId: req.auth!.userId },
    ],
  };
}

async function recipientUserIds(audienceType: string, audienceIds: string[]) {
  const active = { status: "ACTIVE" as const };
  if (audienceType === "ALL") return (await prisma.user.findMany({ where: active, select: { id: true } })).map((u) => u.id);
  if (audienceType === "USERS") return audienceIds;
  const field = audienceType === "DEPARTMENT" ? "departmentId" : "teamId";
  const emps = await prisma.employee.findMany({ where: { [field]: { in: audienceIds }, user: active }, select: { userId: true } });
  return emps.map((e) => e.userId);
}

/** Managers may only target their own department/team unless they hold announcements.manage. */
async function assertAudienceAllowed(req: Request, audienceType: string, audienceIds: string[]) {
  if (audienceType !== "ALL" && !audienceIds.length) throw badRequest("Select at least one recipient group");
  if (can(req, P.ANNOUNCEMENTS_MANAGE)) return;
  const me = req.auth!.employeeId
    ? await prisma.employee.findUnique({ where: { id: req.auth!.employeeId }, select: { departmentId: true, teamId: true } })
    : null;
  if (audienceType === "ALL") throw forbidden("Company-wide announcements require HR or admin rights");
  if (audienceType === "DEPARTMENT" && audienceIds.some((id) => id !== me?.departmentId)) throw forbidden("You can only announce to your own department");
  if (audienceType === "TEAM" && audienceIds.some((id) => id !== me?.teamId)) throw forbidden("You can only announce to your own team");
}

const include = {
  author: { select: { id: true, employee: { select: { firstName: true, lastName: true, avatarUrl: true, designation: true } } } },
  _count: { select: { acknowledgements: { where: { acknowledgedAt: { not: null } } } } },
} satisfies Prisma.AnnouncementInclude;

announcementsRouter.get(
  "/",
  ah(async (req, res) => {
    const { page, pageSize, skip, take } = paging(req.query);
    const now = new Date();
    const where: Prisma.AnnouncementWhereInput = {
      AND: [
        await audienceWhere(req),
        req.query.drafts === "true" ? { authorId: req.auth!.userId, publishedAt: null } : { publishedAt: { not: null, lte: now } },
        req.query.drafts === "true" ? {} : { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
      ],
    };
    const [items, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        include: { ...include, acknowledgements: { where: { userId: req.auth!.userId } } },
        orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
        skip,
        take,
      }),
      prisma.announcement.count({ where }),
    ]);
    const shaped = items.map(({ acknowledgements, ...a }) => ({
      ...a,
      readAt: acknowledgements[0]?.readAt ?? null,
      acknowledgedAt: acknowledgements[0]?.acknowledgedAt ?? null,
    }));
    res.json(paged(shaped, total, page, pageSize));
  }),
);

announcementsRouter.post(
  "/",
  ah(async (req, res) => {
    assertCan(req, P.ANNOUNCEMENTS_CREATE, P.ANNOUNCEMENTS_MANAGE);
    const body = parse(schema, req.body);
    await assertAudienceAllowed(req, body.audienceType, body.audienceIds);
    const { publish, expiresAt, ...data } = body;
    const announcement = await prisma.announcement.create({
      data: { ...data, authorId: req.auth!.userId, publishedAt: publish ? new Date() : null, expiresAt: expiresAt ? new Date(expiresAt) : null },
      include,
    });
    await audit(req, "announcement.create", "Announcement", announcement.id, { title: body.title, audience: body.audienceType });
    if (publish) {
      const recipients = (await recipientUserIds(body.audienceType, body.audienceIds)).filter((u) => u !== req.auth!.userId);
      await notify(recipients, {
        type: "ANNOUNCEMENT",
        title: body.requiresAcknowledgement ? `Action required: ${body.title}` : body.title,
        body: body.body.slice(0, 160),
        link: `/announcements?id=${announcement.id}`,
        entityType: "Announcement",
        entityId: announcement.id,
      });
    }
    res.status(201).json(announcement);
  }),
);

announcementsRouter.patch(
  "/:id",
  ah(async (req, res) => {
    const existing = await prisma.announcement.findUnique({ where: { id: String(req.params.id) } });
    if (!existing) throw notFound("Announcement");
    if (existing.authorId !== req.auth!.userId && !can(req, P.ANNOUNCEMENTS_MANAGE)) throw forbidden();
    const body = parse(schema.partial(), req.body);
    if (body.audienceType || body.audienceIds) {
      await assertAudienceAllowed(req, body.audienceType ?? existing.audienceType, body.audienceIds ?? existing.audienceIds);
    }
    const { publish, expiresAt, ...data } = body;
    const announcement = await prisma.announcement.update({
      where: { id: existing.id },
      data: {
        ...data,
        ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
        ...(publish && !existing.publishedAt && { publishedAt: new Date() }),
      },
      include,
    });
    await audit(req, "announcement.update", "Announcement", announcement.id, { fields: Object.keys(body) });
    res.json(announcement);
  }),
);

announcementsRouter.delete(
  "/:id",
  ah(async (req, res) => {
    const existing = await prisma.announcement.findUnique({ where: { id: String(req.params.id) } });
    if (!existing) throw notFound("Announcement");
    if (existing.authorId !== req.auth!.userId && !can(req, P.ANNOUNCEMENTS_MANAGE)) throw forbidden();
    await prisma.announcement.delete({ where: { id: existing.id } });
    await audit(req, "announcement.delete", "Announcement", existing.id, { title: existing.title });
    res.json({ ok: true });
  }),
);

/** ANN-04: mark read / acknowledge. */
announcementsRouter.post(
  "/:id/acknowledge",
  ah(async (req, res) => {
    const id = String(req.params.id);
    const visible = await prisma.announcement.findFirst({ where: { AND: [{ id }, await audienceWhere(req)] } });
    if (!visible) throw notFound("Announcement");
    const { acknowledge } = parse(z.object({ acknowledge: z.boolean().default(true) }), req.body ?? {});
    const now = new Date();
    const ack = await prisma.announcementAck.upsert({
      where: { announcementId_userId: { announcementId: id, userId: req.auth!.userId } },
      create: { announcementId: id, userId: req.auth!.userId, readAt: now, acknowledgedAt: acknowledge ? now : null },
      update: acknowledge ? { acknowledgedAt: now } : {},
    });
    res.json(ack);
  }),
);

/** Acknowledgement tracking for the author / HR. */
announcementsRouter.get(
  "/:id/acknowledgements",
  ah(async (req, res) => {
    const existing = await prisma.announcement.findUnique({ where: { id: String(req.params.id) } });
    if (!existing) throw notFound("Announcement");
    if (existing.authorId !== req.auth!.userId && !can(req, P.ANNOUNCEMENTS_MANAGE)) throw forbidden();
    const [recipients, acks] = await Promise.all([
      recipientUserIds(existing.audienceType, existing.audienceIds),
      prisma.announcementAck.findMany({ where: { announcementId: existing.id } }),
    ]);
    const users = await prisma.user.findMany({
      where: { id: { in: recipients } },
      select: { id: true, email: true, employee: { select: { firstName: true, lastName: true, department: { select: { name: true } } } } },
    });
    const rows = users.map((u) => {
      const a = acks.find((x) => x.userId === u.id);
      return { user: u, readAt: a?.readAt ?? null, acknowledgedAt: a?.acknowledgedAt ?? null };
    });
    res.json({ total: rows.length, acknowledged: rows.filter((r) => r.acknowledgedAt).length, rows });
  }),
);
