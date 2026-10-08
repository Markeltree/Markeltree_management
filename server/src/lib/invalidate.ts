import type { NextFunction, Request, Response } from "express";
import { invalidate, TAGS } from "./cache.js";

/**
 * Cache tags affected by successful writes under each route prefix. Centralised here so a new
 * write endpoint can't forget to invalidate. Ordered most-specific first.
 */
const RULES: [prefix: string, tags: string[]][] = [
  ["/admin/settings", [TAGS.settings]],
  ["/admin/roles", [TAGS.roles, TAGS.auth]],
  ["/admin/users", [TAGS.roles, TAGS.auth]],
  ["/employees", [TAGS.org, TAGS.employees, TAGS.roles, TAGS.auth]],
  ["/org", [TAGS.org]],
  ["/leave/types", [TAGS.leaveTypes]],
  ["/leave/holidays", [TAGS.holidays]],
];

/** Invalidates before the response is sent, so the client's follow-up reads see fresh data. */
export function invalidateOnWrite(req: Request, res: Response, next: NextFunction) {
  if (req.method === "GET" || req.method === "HEAD") return next();
  const rule = RULES.find(([prefix]) => req.path.startsWith(prefix));
  if (!rule) return next();
  const send = res.json.bind(res);
  res.json = (body: unknown) => {
    if (res.statusCode < 400) invalidate(...rule[1]);
    return send(body);
  };
  next();
}
