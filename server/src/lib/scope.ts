import type { Request } from "express";
import type { PermissionKey } from "../config/permissions.js";
import { prisma } from "./prisma.js";
import { cached, TAGS } from "./cache.js";

/** All direct and indirect reports of an employee (recursive reporting line). */
export function getReportIds(employeeId: string): Promise<string[]> {
  return cached(`reports:${employeeId}`, 5 * 60_000, [TAGS.org], () => fetchReportIds(employeeId));
}

async function fetchReportIds(employeeId: string): Promise<string[]> {
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    WITH RECURSIVE reports AS (
      SELECT id FROM "Employee" WHERE "managerId" = ${employeeId}
      UNION
      SELECT e.id FROM "Employee" e INNER JOIN reports r ON e."managerId" = r.id
    )
    SELECT id FROM reports`;
  return rows.map((r) => r.id);
}

export type Scope = { kind: "all" } | { kind: "ids"; ids: string[] };

/**
 * Resolves which employees the requester may see for a module:
 * "all" with the *_all permission, own + reports with *_team, otherwise own only.
 */
export async function employeeScope(req: Request, allKey: PermissionKey, teamKey?: PermissionKey): Promise<Scope> {
  const auth = req.auth!;
  if (auth.permissions.has(allKey)) return { kind: "all" };
  const ids = auth.employeeId ? [auth.employeeId] : [];
  if (teamKey && auth.permissions.has(teamKey) && auth.employeeId) {
    ids.push(...(await getReportIds(auth.employeeId)));
  }
  return { kind: "ids", ids };
}

export const scopeWhere = (scope: Scope, field = "employeeId") =>
  scope.kind === "all" ? {} : { [field]: { in: scope.ids } };

export const inScope = (scope: Scope, employeeId: string) =>
  scope.kind === "all" || scope.ids.includes(employeeId);
