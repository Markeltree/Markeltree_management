import { EventEmitter } from "node:events";
import { prisma } from "./prisma.js";
import { publish } from "./realtime.js";

export interface NotificationInput {
  type: string;
  title: string;
  body?: string;
  link?: string;
  entityType?: string;
  entityId?: string;
}

/** Emits "notification" events so a real-time layer (WebSocket) can push them to connected clients. */
export const notificationBus = new EventEmitter();

/** Creates in-app notifications, honouring users' preferences for non-critical types (NOT-05). */
export async function notify(userIds: (string | null | undefined)[], input: NotificationInput) {
  const ids = [...new Set(userIds.filter((x): x is string => !!x))];
  if (!ids.length) return;
  try {
    const optedOut = await prisma.notificationPreference.findMany({
      where: { userId: { in: ids }, type: input.type, inApp: false },
      select: { userId: true },
    });
    const skip = new Set(optedOut.map((p) => p.userId));
    const recipients = ids.filter((id) => !skip.has(id));
    if (!recipients.length) return;
    await prisma.notification.createMany({ data: recipients.map((userId) => ({ userId, ...input })) });
    notificationBus.emit("notification", { userIds: recipients, ...input });
    publish(recipients, { event: "notification", payload: { type: input.type } });
  } catch (e) {
    console.error("notification write failed", e);
  }
}

/** Maps employee ids to their user ids. */
export async function userIdsForEmployees(employeeIds: (string | null | undefined)[]) {
  const ids = employeeIds.filter((x): x is string => !!x);
  if (!ids.length) return [];
  const rows = await prisma.employee.findMany({ where: { id: { in: ids } }, select: { userId: true } });
  return rows.map((r) => r.userId);
}

/** Users holding any of the given permissions (e.g. HR approvers). */
export async function userIdsWithPermission(...keys: string[]) {
  const users = await prisma.user.findMany({
    where: { status: "ACTIVE", role: { permissions: { some: { permission: { key: { in: keys } } } } } },
    select: { id: true },
  });
  return users.map((u) => u.id);
}
