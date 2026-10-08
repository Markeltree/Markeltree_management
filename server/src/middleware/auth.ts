import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { PermissionKey } from "../config/permissions.js";
import { prisma } from "../lib/prisma.js";
import { cached, TAGS } from "../lib/cache.js";
import { forbidden, unauthorized } from "../lib/http.js";

export interface AuthContext {
  userId: string;
  sessionId: string;
  email: string;
  roleId: string;
  roleName: string;
  employeeId: string | null;
  permissions: Set<string>;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

interface AccessPayload {
  sub: string;
  sid: string;
}

export function signAccessToken(userId: string, sessionId: string) {
  return jwt.sign({ sub: userId, sid: sessionId } satisfies AccessPayload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"],
  });
}

const AUTH_TTL_MS = 60_000;

/**
 * Auth context for a session, cached for a minute. Revocation stays immediate because every
 * path that revokes a session or changes a user's access invalidates the cache entry.
 */
export function loadAuthContext(userId: string, sessionId: string): Promise<AuthContext | null> {
  return cached(`auth:${sessionId}`, AUTH_TTL_MS, [TAGS.auth, TAGS.user(userId)], () => fetchAuthContext(userId, sessionId));
}

async function fetchAuthContext(userId: string, sessionId: string): Promise<AuthContext | null> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: {
      revokedAt: true,
      expiresAt: true,
      user: {
        select: {
          id: true,
          email: true,
          status: true,
          roleId: true,
          role: { select: { name: true, permissions: { select: { permission: { select: { key: true } } } } } },
          employee: { select: { id: true } },
        },
      },
    },
  });
  if (!session || session.revokedAt || session.expiresAt < new Date()) return null;
  const user = session.user;
  if (user.id !== userId || user.status !== "ACTIVE") return null;
  return {
    userId: user.id,
    sessionId,
    email: user.email,
    roleId: user.roleId,
    roleName: user.role.name,
    employeeId: user.employee?.id ?? null,
    permissions: new Set(user.role.permissions.map((rp) => rp.permission.key)),
  };
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw unauthorized();
    let payload: AccessPayload;
    try {
      payload = jwt.verify(header.slice(7), env.JWT_ACCESS_SECRET) as AccessPayload;
    } catch {
      throw unauthorized("Session expired");
    }
    const ctx = await loadAuthContext(payload.sub, payload.sid);
    if (!ctx) throw unauthorized("Session is no longer valid");
    req.auth = ctx;
    next();
  } catch (e) {
    next(e);
  }
}

export const can = (req: Request, ...keys: PermissionKey[]) => keys.some((k) => req.auth?.permissions.has(k));

/** Requires at least one of the given permissions. */
export const requirePermission =
  (...keys: PermissionKey[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) return next(unauthorized());
    if (!can(req, ...keys)) return next(forbidden());
    next();
  };

/** Throws 403 unless the request holds one of the permissions. */
export function assertCan(req: Request, ...keys: PermissionKey[]) {
  if (!can(req, ...keys)) throw forbidden();
}

/** Employee-linked operations require the user to have an employee record. */
export function requireEmployeeId(req: Request): string {
  const id = req.auth?.employeeId;
  if (!id) throw forbidden("Your account is not linked to an employee profile");
  return id;
}
