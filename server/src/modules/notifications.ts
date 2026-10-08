import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { ah, paged, paging, parse } from "../lib/http.js";

export const notificationsRouter = Router();

notificationsRouter.get(
  "/",
  ah(async (req, res) => {
    const { page, pageSize, skip, take } = paging(req.query);
    const where = { userId: req.auth!.userId, ...(req.query.unread === "true" && { readAt: null }) };
    const [items, total, unread] = await Promise.all([
      prisma.notification.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId: req.auth!.userId, readAt: null } }),
    ]);
    res.json({ ...paged(items, total, page, pageSize), unread });
  }),
);

notificationsRouter.get(
  "/unread-count",
  ah(async (req, res) => {
    res.json({ unread: await prisma.notification.count({ where: { userId: req.auth!.userId, readAt: null } }) });
  }),
);

notificationsRouter.post(
  "/read",
  ah(async (req, res) => {
    const { ids } = parse(z.object({ ids: z.array(z.string().uuid()).optional() }), req.body ?? {});
    await prisma.notification.updateMany({
      where: { userId: req.auth!.userId, readAt: null, ...(ids && { id: { in: ids } }) },
      data: { readAt: new Date() },
    });
    res.json({ ok: true });
  }),
);

notificationsRouter.delete(
  "/:id",
  ah(async (req, res) => {
    await prisma.notification.deleteMany({ where: { id: String(req.params.id), userId: req.auth!.userId } });
    res.json({ ok: true });
  }),
);

/** NOT-05: per-type preferences. Critical types (approvals, HR decisions) cannot be muted in-app. */
const CRITICAL = ["LEAVE_SUBMITTED", "LEAVE_DECIDED", "ATTENDANCE_EXCEPTION"];
const TYPES = ["TASK_ASSIGNED", "TASK_UPDATED", "TASK_COMMENT", "TASK_DUE", "MENTION", "ANNOUNCEMENT", "CHAT_MESSAGE", "PROJECT_ADDED", "ONBOARDING", "PAYSLIP", ...CRITICAL];

notificationsRouter.get(
  "/preferences",
  ah(async (req, res) => {
    const saved = await prisma.notificationPreference.findMany({ where: { userId: req.auth!.userId } });
    res.json(
      TYPES.map((type) => {
        const p = saved.find((s) => s.type === type);
        return { type, inApp: p?.inApp ?? true, email: p?.email ?? false, critical: CRITICAL.includes(type) };
      }),
    );
  }),
);

notificationsRouter.put(
  "/preferences",
  ah(async (req, res) => {
    const body = parse(
      z.object({ preferences: z.array(z.object({ type: z.enum(TYPES as [string, ...string[]]), inApp: z.boolean(), email: z.boolean() })) }),
      req.body,
    );
    for (const p of body.preferences) {
      const inApp = CRITICAL.includes(p.type) ? true : p.inApp;
      await prisma.notificationPreference.upsert({
        where: { userId_type: { userId: req.auth!.userId, type: p.type } },
        create: { userId: req.auth!.userId, type: p.type, inApp, email: p.email },
        update: { inApp, email: p.email },
      });
    }
    res.json({ ok: true });
  }),
);
