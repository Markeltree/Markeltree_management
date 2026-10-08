/**
 * Date helpers. Calendar dates (attendance day, leave dates, holidays) are stored as
 * Postgres DATE columns, represented in JS as Date at 00:00 UTC.
 */

/** "YYYY-MM-DD" → Date at UTC midnight. */
export function dateOnly(value: string | Date): Date {
  if (value instanceof Date) return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!m) throw new Error(`Invalid date: ${value}`);
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
}

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** Wall-clock parts of an instant in the given IANA timezone. */
export function zonedParts(instant: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(fmt.formatToParts(instant).map((p) => [p.type, p.value]));
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

/** Today's calendar date in the company timezone. */
export const todayIn = (timeZone: string) => dateOnly(zonedParts(new Date(), timeZone).date);

/** "HH:mm" → minutes since midnight. */
export function hhmmToMinutes(value: string) {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + (m || 0);
}

export function addDays(d: Date, days: number) {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + days);
  return r;
}

export function eachDay(start: Date, end: Date): Date[] {
  const out: Date[] = [];
  for (let d = dateOnly(start); d <= end; d = addDays(d, 1)) out.push(d);
  return out;
}

export function monthRange(year: number, month: number) {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));
  return { start, end };
}
