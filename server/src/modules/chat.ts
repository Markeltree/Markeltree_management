import { Router, type Request } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { PERMISSIONS as P } from "../config/permissions.js";
import { prisma } from "../lib/prisma.js";
import { ah, badRequest, forbidden, notFound, parse } from "../lib/http.js";
import { audit } from "../lib/audit.js";
import { notify } from "../lib/notify.js";
import { publish } from "../lib/realtime.js";
import { getSetting } from "../lib/settings.js";
import { can } from "../middleware/auth.js";

export const chatRouter = Router();

const userSelect = {
  id: true,
  employee: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, designation: true } },
} satisfies Prisma.UserSelect;

const messageSelect = {
  id: true,
  conversationId: true,
  senderId: true,
  body: true,
  mentions: true,
  editedAt: true,
  deletedAt: true,
  createdAt: true,
  sender: { select: userSelect },
} satisfies Prisma.MessageSelect;

type MessageRow = Prisma.MessageGetPayload<{ select: typeof messageSelect }>;
// Deleted messages keep their place in the thread but lose their content.
const shapeMessage = (m: MessageRow) => (m.deletedAt ? { ...m, body: null, mentions: [] } : m);

/** Membership check (CHAT-02: only participants can read a conversation — admins included). */
async function requireMember(req: Request, conversationId: string) {
  const member = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId: req.auth!.userId } },
    include: { conversation: { include: { members: { select: { userId: true, isAdmin: true, lastReadAt: true } } } } },
  });
  if (!member) throw notFound("Conversation");
  return member;
}

const memberIds = (c: { members: { userId: string }[] }) => c.members.map((m) => m.userId);

/** Unread counts per conversation for one user, in a single query. */
async function unreadCounts(userId: string) {
  const rows = await prisma.$queryRaw<{ conversationId: string; count: number }[]>`
    SELECT m."conversationId", COUNT(*)::int AS count
    FROM "Message" m
    JOIN "ConversationMember" cm ON cm."conversationId" = m."conversationId" AND cm."userId" = ${userId}
    WHERE m."senderId" <> ${userId}
      AND m."deletedAt" IS NULL
      AND (cm."lastReadAt" IS NULL OR m."createdAt" > cm."lastReadAt")
    GROUP BY m."conversationId"`;
  return new Map(rows.map((r) => [r.conversationId, r.count]));
}

// ── Conversations ────────────────────────────────────────────────

chatRouter.get(
  "/conversations",
  ah(async (req, res) => {
    const me = req.auth!.userId;
    const [conversations, unread] = await Promise.all([
      prisma.conversation.findMany({
        where: { members: { some: { userId: me } } },
        orderBy: { updatedAt: "desc" },
        include: {
          members: { select: { userId: true, isAdmin: true, lastReadAt: true, user: { select: userSelect } } },
          messages: { orderBy: { createdAt: "desc" }, take: 1, select: messageSelect },
        },
      }),
      unreadCounts(me),
    ]);
    res.json(
      conversations.map(({ messages, ...c }) => ({
        ...c,
        lastMessage: messages[0] ? shapeMessage(messages[0]) : null,
        unread: unread.get(c.id) ?? 0,
      })),
    );
  }),
);

chatRouter.get(
  "/unread",
  ah(async (req, res) => {
    const counts = await unreadCounts(req.auth!.userId);
    res.json({ total: [...counts.values()].reduce((s, n) => s + n, 0), conversations: Object.fromEntries(counts) });
  }),
);

/** CHAT-01: open (or create) the one-to-one conversation with another user. */
chatRouter.post(
  "/direct",
  ah(async (req, res) => {
    const { userId } = parse(z.object({ userId: z.string().uuid() }), req.body);
    const me = req.auth!.userId;
    if (userId === me) throw badRequest("You can't start a chat with yourself");
    const other = await prisma.user.findUnique({ where: { id: userId }, select: { status: true } });
    if (!other || other.status !== "ACTIVE") throw badRequest("This person isn't available for chat");

    const existing = await prisma.conversation.findFirst({
      where: { type: "DIRECT", AND: [{ members: { some: { userId: me } } }, { members: { some: { userId } } }] },
      select: { id: true },
    });
    if (existing) return res.json({ id: existing.id, created: false });

    const conversation = await prisma.conversation.create({
      data: { type: "DIRECT", createdById: me, members: { create: [{ userId: me }, { userId }] } },
      select: { id: true },
    });
    publish([me, userId], { event: "chat", payload: { kind: "conversation", conversationId: conversation.id } });
    res.status(201).json({ id: conversation.id, created: true });
  }),
);

/** CHAT-02/03: group conversation or channel. */
chatRouter.post(
  "/conversations",
  ah(async (req, res) => {
    const body = parse(
      z.object({
        type: z.enum(["GROUP", "CHANNEL"]),
        name: z.string().trim().min(1).max(80),
        memberIds: z.array(z.string().uuid()).min(1).max(1000),
      }),
      req.body,
    );
    if (body.type === "CHANNEL" && !can(req, P.CHAT_MANAGE)) throw forbidden("Only chat administrators can create channels");
    if (body.type === "GROUP" && !can(req, P.CHAT_CREATE_GROUP, P.CHAT_MANAGE) && !(await getSetting("chat.employeesCanCreateGroups"))) {
      throw forbidden("You don't have permission to create group chats");
    }
    const me = req.auth!.userId;
    const ids = [...new Set(body.memberIds.filter((id) => id !== me))];
    const active = await prisma.user.findMany({ where: { id: { in: ids }, status: "ACTIVE" }, select: { id: true } });
    const conversation = await prisma.conversation.create({
      data: {
        type: body.type,
        name: body.name,
        createdById: me,
        members: { create: [{ userId: me, isAdmin: true }, ...active.map((u) => ({ userId: u.id }))] },
      },
      select: { id: true },
    });
    await audit(req, "chat.conversation_create", "Conversation", conversation.id, { type: body.type, name: body.name, members: active.length + 1 });
    publish([me, ...active.map((u) => u.id)], { event: "chat", payload: { kind: "conversation", conversationId: conversation.id } });
    res.status(201).json({ id: conversation.id });
  }),
);

async function requireConversationAdmin(req: Request, conversationId: string) {
  const member = await requireMember(req, conversationId);
  if (member.conversation.type === "DIRECT") throw badRequest("Direct conversations can't be changed");
  if (!member.isAdmin && !can(req, P.CHAT_MANAGE)) throw forbidden("Only the group's admins can do this");
  return member;
}

chatRouter.patch(
  "/conversations/:id",
  ah(async (req, res) => {
    const id = String(req.params.id);
    const member = await requireConversationAdmin(req, id);
    const { name } = parse(z.object({ name: z.string().trim().min(1).max(80) }), req.body);
    await prisma.conversation.update({ where: { id }, data: { name } });
    publish(memberIds(member.conversation), { event: "chat", payload: { kind: "conversation", conversationId: id } });
    res.json({ ok: true });
  }),
);

chatRouter.put(
  "/conversations/:id/members",
  ah(async (req, res) => {
    const id = String(req.params.id);
    const member = await requireConversationAdmin(req, id);
    const body = parse(z.object({ add: z.array(z.string().uuid()).default([]), remove: z.array(z.string().uuid()).default([]) }), req.body);
    const add = (await prisma.user.findMany({ where: { id: { in: body.add }, status: "ACTIVE" }, select: { id: true } })).map((u) => u.id);
    await prisma.$transaction([
      prisma.conversationMember.createMany({ data: add.map((userId) => ({ conversationId: id, userId })), skipDuplicates: true }),
      prisma.conversationMember.deleteMany({ where: { conversationId: id, userId: { in: body.remove.filter((u) => u !== req.auth!.userId) } } }),
    ]);
    await audit(req, "chat.members_update", "Conversation", id, { added: add.length, removed: body.remove.length });
    publish([...memberIds(member.conversation), ...add], { event: "chat", payload: { kind: "conversation", conversationId: id } });
    res.json({ ok: true });
  }),
);

chatRouter.post(
  "/conversations/:id/leave",
  ah(async (req, res) => {
    const id = String(req.params.id);
    const member = await requireMember(req, id);
    if (member.conversation.type === "DIRECT") throw badRequest("You can't leave a direct conversation");
    await prisma.conversationMember.delete({ where: { conversationId_userId: { conversationId: id, userId: req.auth!.userId } } });
    // Keep the group manageable: promote the oldest member if the last admin leaves.
    const admins = member.conversation.members.filter((m) => m.isAdmin && m.userId !== req.auth!.userId);
    if (!admins.length) {
      const next = await prisma.conversationMember.findFirst({ where: { conversationId: id }, orderBy: { joinedAt: "asc" } });
      if (next) await prisma.conversationMember.update({ where: { conversationId_userId: { conversationId: id, userId: next.userId } }, data: { isAdmin: true } });
    }
    publish(memberIds(member.conversation), { event: "chat", payload: { kind: "conversation", conversationId: id } });
    res.json({ ok: true });
  }),
);

// ── Messages ─────────────────────────────────────────────────────

/** History, newest page first; pass `before` (ISO timestamp) to load older messages. */
chatRouter.get(
  "/conversations/:id/messages",
  ah(async (req, res) => {
    const id = String(req.params.id);
    const member = await requireMember(req, id);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const before = req.query.before ? new Date(String(req.query.before)) : undefined;
    const rows = await prisma.message.findMany({
      where: { conversationId: id, ...(before && { createdAt: { lt: before } }) },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      select: messageSelect,
    });
    res.json({
      items: rows.slice(0, limit).reverse().map(shapeMessage),
      hasMore: rows.length > limit,
      // Other members' read positions, for read receipts (CHAT-07).
      readState: member.conversation.members.filter((m) => m.userId !== req.auth!.userId).map((m) => ({ userId: m.userId, lastReadAt: m.lastReadAt })),
    });
  }),
);

chatRouter.get(
  "/messages/:id",
  ah(async (req, res) => {
    const message = await prisma.message.findUnique({ where: { id: String(req.params.id) }, select: messageSelect });
    if (!message) throw notFound("Message");
    await requireMember(req, message.conversationId);
    res.json(shapeMessage(message));
  }),
);

chatRouter.post(
  "/conversations/:id/messages",
  ah(async (req, res) => {
    const id = String(req.params.id);
    const member = await requireMember(req, id);
    const body = parse(
      z.object({ body: z.string().trim().min(1).max(5000), mentions: z.array(z.string().uuid()).max(50).default([]) }),
      req.body,
    );
    const me = req.auth!.userId;
    const members = memberIds(member.conversation);
    const mentions = body.mentions.filter((u) => u !== me && members.includes(u));
    const now = new Date();
    const [message] = await prisma.$transaction([
      prisma.message.create({ data: { conversationId: id, senderId: me, body: body.body, mentions, createdAt: now }, select: messageSelect }),
      prisma.conversation.update({ where: { id }, data: { updatedAt: now } }),
      prisma.conversationMember.update({ where: { conversationId_userId: { conversationId: id, userId: me } }, data: { lastReadAt: now } }),
    ]);
    publish(members, { event: "chat", payload: { kind: "message", conversationId: id, messageId: message.id } });
    if (mentions.length) {
      const sender = message.sender.employee ? `${message.sender.employee.firstName} ${message.sender.employee.lastName}` : "Someone";
      await notify(mentions, {
        type: "MENTION",
        title: `${sender} mentioned you${member.conversation.name ? ` in ${member.conversation.name}` : ""}`,
        body: body.body.slice(0, 140),
        link: `/chat?c=${id}`,
        entityType: "Conversation",
        entityId: id,
      });
    }
    res.status(201).json(message);
  }),
);

chatRouter.patch(
  "/messages/:id",
  ah(async (req, res) => {
    const existing = await prisma.message.findUnique({ where: { id: String(req.params.id) } });
    if (!existing || existing.deletedAt) throw notFound("Message");
    const member = await requireMember(req, existing.conversationId);
    if (existing.senderId !== req.auth!.userId) throw forbidden("You can only edit your own messages");
    const { body } = parse(z.object({ body: z.string().trim().min(1).max(5000) }), req.body);
    const message = await prisma.message.update({ where: { id: existing.id }, data: { body, editedAt: new Date() }, select: messageSelect });
    publish(memberIds(member.conversation), { event: "chat", payload: { kind: "edit", conversationId: existing.conversationId, messageId: existing.id } });
    res.json(message);
  }),
);

chatRouter.delete(
  "/messages/:id",
  ah(async (req, res) => {
    const existing = await prisma.message.findUnique({ where: { id: String(req.params.id) } });
    if (!existing || existing.deletedAt) throw notFound("Message");
    const member = await requireMember(req, existing.conversationId);
    const own = existing.senderId === req.auth!.userId;
    if (!own && !can(req, P.CHAT_MANAGE)) throw forbidden("You can only delete your own messages");
    await prisma.message.update({ where: { id: existing.id }, data: { deletedAt: new Date(), body: null } });
    if (!own) await audit(req, "chat.message_moderated", "Message", existing.id, { conversationId: existing.conversationId });
    publish(memberIds(member.conversation), { event: "chat", payload: { kind: "delete", conversationId: existing.conversationId, messageId: existing.id } });
    res.json({ ok: true });
  }),
);

/** CHAT-07: mark the conversation read up to now. */
chatRouter.post(
  "/conversations/:id/read",
  ah(async (req, res) => {
    const id = String(req.params.id);
    const member = await requireMember(req, id);
    await prisma.conversationMember.update({
      where: { conversationId_userId: { conversationId: id, userId: req.auth!.userId } },
      data: { lastReadAt: new Date() },
    });
    publish(memberIds(member.conversation), { event: "chat", payload: { kind: "read", conversationId: id, userId: req.auth!.userId } });
    res.json({ ok: true });
  }),
);

chatRouter.post(
  "/conversations/:id/typing",
  ah(async (req, res) => {
    const id = String(req.params.id);
    const member = await requireMember(req, id);
    const others = memberIds(member.conversation).filter((u) => u !== req.auth!.userId);
    publish(others, { event: "chat", payload: { kind: "typing", conversationId: id, userId: req.auth!.userId } });
    res.json({ ok: true });
  }),
);

/** CHAT-06: search messages in the requester's own conversations. */
chatRouter.get(
  "/search",
  ah(async (req, res) => {
    const q = String(req.query.q ?? "").trim();
    if (q.length < 2) return res.json([]);
    const rows = await prisma.message.findMany({
      where: {
        deletedAt: null,
        body: { contains: q, mode: "insensitive" },
        conversation: { members: { some: { userId: req.auth!.userId } } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { ...messageSelect, conversation: { select: { id: true, type: true, name: true } } },
    });
    res.json(rows);
  }),
);
