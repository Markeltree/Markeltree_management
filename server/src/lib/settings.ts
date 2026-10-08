import { Prisma } from "@prisma/client";
import { prisma } from "./prisma.js";
import { cached, invalidate, TAGS } from "./cache.js";

/**
 * Company policy settings (ADMIN-05). Defaults apply until an admin saves a value.
 * FRD §22 lists these as open business decisions — confirm with HR before go-live.
 */
export const SETTING_DEFAULTS = {
  "company.name": "Markeltree",
  "company.timezone": "UTC",
  "attendance.workStart": "09:00",
  "attendance.workEnd": "18:00",
  "attendance.graceMinutes": 15,
  "attendance.earlyLeaveGraceMinutes": 0,
  "attendance.workingDays": [1, 2, 3, 4, 5], // 0 = Sunday … 6 = Saturday
  "attendance.allowedIps": [] as string[], // empty = no IP restriction
  "leave.requireHrSecondApproval": false,
  "files.maxSizeMb": 25,
  "files.allowedTypes": ["pdf", "doc", "docx", "xls", "xlsx", "csv", "ppt", "pptx", "txt", "png", "jpg", "jpeg", "gif", "webp", "zip"],
  "chat.employeesCanCreateGroups": true,
  "payroll.currency": "PKR",
  // Deduct days with no check-in. Turn off until attendance is used consistently, or every
  // un-tracked working day counts as unpaid.
  "payroll.deductAbsences": true,
  // Per-day pay = monthly salary ÷ basis days. FIXED_30: always 30 (default);
  // CALENDAR: days in the month; WORKING: company working days in the month.
  "payroll.dayBasis": "FIXED_30",
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;
type SettingValue<K extends SettingKey> = (typeof SETTING_DEFAULTS)[K] extends readonly (infer U)[]
  ? U[]
  : (typeof SETTING_DEFAULTS)[K] extends number
    ? number
    : (typeof SETTING_DEFAULTS)[K] extends boolean
      ? boolean
      : string;

/** All settings in one cached read; policies are read on almost every attendance/leave request. */
export function getAllSettings() {
  return cached("settings:all", 10 * 60_000, [TAGS.settings], async () => {
    const rows = await prisma.setting.findMany();
    const saved = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...SETTING_DEFAULTS, ...saved } as Record<string, unknown>;
  });
}

export async function getSetting<K extends SettingKey>(key: K): Promise<SettingValue<K>> {
  return (await getAllSettings())[key] as SettingValue<K>;
}

export async function setSetting(key: SettingKey, value: unknown) {
  const row = await prisma.setting.upsert({
    where: { key },
    create: { key, value: value as Prisma.InputJsonValue },
    update: { value: value as Prisma.InputJsonValue },
  });
  invalidate(TAGS.settings);
  return row;
}
