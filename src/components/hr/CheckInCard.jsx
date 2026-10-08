import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Badge, Btn, ErrorNote, Panel } from "./ui";
import { fmtMinutes, fmtTime, useQuery } from "./utils";

/** ATT-01/02: today's check-in/out for the signed-in employee. */
export default function CheckInCard({ onChange }) {
  const toast = useToast();
  const { data, loading, error, reload } = useQuery("/attendance/today");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const record = data?.record;
  const act = async (kind) => {
    setBusy(true);
    try {
      await api.post(`/attendance/${kind}`, {});
      toast.success(kind === "check-in" ? "Checked in. Have a good day!" : "Checked out. See you tomorrow!");
      await reload();
      onChange?.();
    } catch (e) {
      toast.error(e);
    } finally {
      setBusy(false);
    }
  };

  const elapsed = record?.checkIn && !record?.checkOut ? Math.round((now - new Date(record.checkIn).getTime()) / 60000) : record?.workedMinutes;

  return (
    <Panel title="Today's Attendance" subtitle={data ? `Shift ${data.policy.workStart} – ${data.policy.workEnd} (${data.policy.timeZone})` : undefined}>
      <ErrorNote error={error} onRetry={reload} />
      {loading && !data ? (
        <p className="text-[13px] text-[#8E8E9C]">Loading…</p>
      ) : (
        data && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="grid grid-cols-3 gap-4 text-[13px]">
              <div>
                <p className="text-[#8E8E9C] text-[11px]">Check-in</p>
                <p className="font-semibold text-[#0F2418] dark:text-[#EFFBF3]">{fmtTime(record?.checkIn)}</p>
              </div>
              <div>
                <p className="text-[#8E8E9C] text-[11px]">Check-out</p>
                <p className="font-semibold text-[#0F2418] dark:text-[#EFFBF3]">{fmtTime(record?.checkOut)}</p>
              </div>
              <div>
                <p className="text-[#8E8E9C] text-[11px]">{record?.checkOut ? "Worked" : "Elapsed"}</p>
                <p className="font-semibold text-[#0F2418] dark:text-[#EFFBF3]">{fmtMinutes(elapsed)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {record && <Badge value={record.status} />}
              {!record?.checkIn && <Btn icon="mdi:login" label="Check In" loading={busy} onClick={() => act("check-in")} />}
              {record?.checkIn && !record?.checkOut && (
                <Btn icon="mdi:logout" variant="outline" label="Check Out" loading={busy} onClick={() => act("check-out")} />
              )}
              {record?.checkOut && <span className="text-[12px] text-[#059669] font-semibold">Day complete</span>}
            </div>
          </div>
        )
      )}
    </Panel>
  );
}
