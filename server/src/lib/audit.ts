import type { Request } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma.js";

/** Records a sensitive action (FRD ADMIN-06). Never throws — auditing must not break the request. */
export async function audit(
  req: Request | null,
  action: string,
  entityType: string,
  entityId?: string | null,
  metadata?: Record<string, unknown>,
  actorId?: string,
) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: actorId ?? req?.auth?.userId ?? null,
        action,
        entityType,
        entityId: entityId ?? null,
        metadata: (metadata as Prisma.InputJsonValue) ?? undefined,
        ip: req?.ip ?? null,
        userAgent: req?.headers["user-agent"]?.slice(0, 300) ?? null,
      },
    });
  } catch (e) {
    console.error("audit log write failed", e);
  }
}

/** Returns only the fields that changed, for compact audit metadata. */
export function diff(before: Record<string, unknown>, after: Record<string, unknown>) {
  const changes: Record<string, { from: unknown; to: unknown }> = {};
  for (const key of Object.keys(after)) {
    const a = before[key];
    const b = after[key];
    const norm = (v: unknown) => (v instanceof Date ? v.toISOString() : v);
    if (b !== undefined && JSON.stringify(norm(a)) !== JSON.stringify(norm(b))) changes[key] = { from: a, to: b };
  }
  return changes;
}
