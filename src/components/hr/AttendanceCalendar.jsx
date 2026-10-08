import { useState } from "react";
import { Icon } from "@iconify/react";
import { qs } from "@/lib/api";
import { ErrorNote, StatCard } from "./ui";
import { fmtMinutes, fmtTime, humanize, useQuery } from "./utils";

const COLORS = {
  PRESENT: "bg-[#10B98126] text-[#059669]",
  LATE: "bg-[#F59E0B26] text-[#D97706]",
  EARLY_DEPARTURE: "bg-[#F59E0B26] text-[#D97706]",
  LATE_AND_EARLY: "bg-[#F59E0B40] text-[#B45309]",
  ABSENT: "bg-[#FF695B26] text-[#E5483A]",
  ON_LEAVE: "bg-[#0EA5E926] text-[#0284C7]",
  HOLIDAY: "bg-[#09BF6426] text-[#09BF64]",
  WEEKEND: "bg-[#8E8E9C14] text-[#A9C2B3]",
  PENDING: "bg-transparent text-[#6F7C74] dark:text-[#A9C2B3]",
  NOT_JOINED: "bg-transparent text-[#C4C4D4]",
};
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

/** ATT-05: month view of an employee's attendance with derived statuses. */
export default function AttendanceCalendar({ employeeId }) {
  const [cursor, setCursor] = useState(() => new Date());
  const month = monthKey(cursor);
  const { data, loading, error, reload } = useQuery(`/attendance/calendar${qs({ employeeId, month })}`);

  const shift = (n) => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + n, 1));
  const firstDow = data ? new Date(`${data.days[0].date}T00:00:00Z`).getUTCDay() : 0;
  const s = data?.summary;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={() => shift(-1)} className="p-1 rounded hover:bg-[#09BF641A] text-[#09BF64]" aria-label="Previous month">
          <Icon icon="mdi:chevron-left" width={22} />
        </button>
        <h3 className="text-[14px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">
          {cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </h3>
        <button onClick={() => shift(1)} className="p-1 rounded hover:bg-[#09BF641A] text-[#09BF64]" aria-label="Next month">
          <Icon icon="mdi:chevron-right" width={22} />
        </button>
      </div>
      <ErrorNote error={error} onRetry={reload} />
      {s && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <StatCard label="Present" value={s.present} tone="success" />
          <StatCard label="Late" value={s.late} tone="warning" />
          <StatCard label="Absent" value={s.absent} tone="danger" />
          <StatCard label="On leave" value={s.onLeave} tone="info" />
          <StatCard label="Hours worked" value={(s.workedMinutes / 60).toFixed(1)} tone="primary" />
        </div>
      )}
      <div className={`grid grid-cols-7 gap-1 ${loading ? "opacity-50" : ""}`}>
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-[11px] font-semibold text-[#8E8E9C] py-1">
            {w}
          </div>
        ))}
        {[...Array(firstDow)].map((_, i) => (
          <div key={`pad${i}`} />
        ))}
        {data?.days.map((d) => (
          <div
            key={d.date}
            title={`${d.date} · ${humanize(d.status)}${d.holiday ? ` (${d.holiday})` : ""}${d.leaveType ? ` (${d.leaveType})` : ""}${d.record?.checkIn ? ` · in ${fmtTime(d.record.checkIn)}` : ""}${d.record?.checkOut ? ` · out ${fmtTime(d.record.checkOut)}` : ""}${d.record?.isAdjusted ? ` · adjusted: ${d.record.adjustmentReason}` : ""}`}
            className={`rounded-md min-h-[58px] p-1.5 text-[11px] flex flex-col ${COLORS[d.status] ?? ""}`}
          >
            <span className="font-bold">{Number(d.date.slice(8))}</span>
            {!["WEEKEND", "PENDING", "NOT_JOINED"].includes(d.status) && <span className="truncate">{d.holiday ?? d.leaveType ?? humanize(d.status)}</span>}
            {d.record?.workedMinutes != null && <span className="truncate opacity-80">{fmtMinutes(d.record.workedMinutes)}</span>}
            {d.record?.isAdjusted && <Icon icon="mdi:pencil-circle" className="mt-auto" title="Adjusted by HR" />}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-[11px] text-[#6F7C74]">
        {["PRESENT", "LATE", "ABSENT", "ON_LEAVE", "HOLIDAY"].map((k) => (
          <span key={k} className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded ${COLORS[k]}`} /> {humanize(k)}
          </span>
        ))}
      </div>
    </div>
  );
}
