import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, qs } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import CheckInCard from "@/components/hr/CheckInCard";
import AttendanceCalendar from "@/components/hr/AttendanceCalendar";
import { Badge, ErrorNote, Field, IconBtn, Input, ModalForm, Page, PageHeader, Panel, PersonCell, Select, StatCard, Table, Tabs, TextArea } from "@/components/hr/ui";
import { fmtMinutes, fmtTime, toInputDate, humanize, useQuery, LOOKUP_TTL } from "@/components/hr/utils";

const ADJUSTABLE = ["PRESENT", "LATE", "EARLY_DEPARTURE", "LATE_AND_EARLY", "ABSENT", "ON_LEAVE", "HOLIDAY"];

/** Local "HH:mm" for a timestamp, for <input type="time">. */
const toTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
/** Combines a calendar date and a local time into an ISO timestamp. */
const toIso = (date, time) => (time ? new Date(`${date}T${time}`).toISOString() : null);

/** ATT-04: HR correction with mandatory reason (audited server-side). */
function AdjustModal({ row, date, onSaved, closeModal }) {
  const toast = useToast();
  const [checkIn, setCheckIn] = useState(toTime(row.record?.checkIn));
  const [checkOut, setCheckOut] = useState(toTime(row.record?.checkOut));
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.put("/attendance/adjust", {
        employeeId: row.employee.id,
        date,
        checkIn: toIso(date, checkIn),
        checkOut: toIso(date, checkOut),
        ...(status && { status }),
        reason,
      });
      toast.success("Attendance adjusted. The employee has been notified.");
      onSaved();
      closeModal();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };
  return (
    <ModalForm title="Adjust attendance" subtitle={`${row.employee.firstName} ${row.employee.lastName} · ${date}`} onSubmit={submit} onCancel={closeModal} saving={saving} error={error}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Check-in (local time)">
          <Input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        </Field>
        <Field label="Check-out (local time)">
          <Input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
        </Field>
      </div>
      <Field label="Status" hint="Leave blank to calculate from the times and attendance policy">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Calculate automatically" options={ADJUSTABLE.map((s) => ({ value: s, label: humanize(s) }))} />
      </Field>
      <Field label="Reason" required hint="Recorded in the audit log and shared with the employee">
        <TextArea value={reason} onChange={(e) => setReason(e.target.value)} required minLength={3} maxLength={500} />
      </Field>
    </ModalForm>
  );
}

function TeamBoard() {
  const { can } = useAuth();
  const { openModal } = useModal();
  const [date, setDate] = useState(toInputDate());
  const [departmentId, setDepartmentId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { data: departments } = useQuery(can("attendance.view_all") ? "/org/departments" : null, { ttl: LOOKUP_TTL });
  const { data, loading, error, reload } = useQuery(`/attendance/daily${qs({ date, departmentId })}`);
  const canAdjust = can("attendance.adjust");
  const c = data?.counts ?? {};
  const rows = (data?.rows ?? []).filter((r) => !statusFilter || r.status === statusFilter);

  const columns = [
    { header: "Employee", body: (r) => <PersonCell person={r.employee} sub={`${r.employee.employeeCode} · ${r.employee.designation}`} /> },
    { header: "Department", body: (r) => r.employee.department?.name ?? "—" },
    { header: "Check-in", body: (r) => fmtTime(r.record?.checkIn) },
    { header: "Check-out", body: (r) => fmtTime(r.record?.checkOut) },
    { header: "Worked", body: (r) => fmtMinutes(r.record?.workedMinutes) },
    {
      header: "Status",
      body: (r) => (
        <span className="flex items-center gap-1">
          <Badge value={r.status}>{r.status === "PENDING" ? "Not checked in" : r.leaveType ?? r.holiday ?? humanize(r.status)}</Badge>
          {r.record?.isAdjusted && <span title={`Adjusted: ${r.record.adjustmentReason}`} className="text-[10px] text-[#8E8E9C]">(adj.)</span>}
        </span>
      ),
    },
    ...(canAdjust ? [{ header: "", body: (r) => <IconBtn icon="tabler:edit" title="Adjust attendance" onClick={() => openModal(AdjustModal, { sizeClass: "w-[95%] md:w-[480px]", row: r, date, onSaved: reload })} /> }] : []),
  ];

  const present = (c.PRESENT ?? 0) + (c.LATE ?? 0) + (c.EARLY_DEPARTURE ?? 0) + (c.LATE_AND_EARLY ?? 0);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <StatCard label="Present" value={present} tone="success" icon="mdi:account-check-outline" />
        <StatCard label="Late" value={(c.LATE ?? 0) + (c.LATE_AND_EARLY ?? 0)} tone="warning" icon="mdi:clock-alert-outline" />
        <StatCard label="Absent" value={c.ABSENT ?? 0} tone="danger" icon="mdi:account-remove-outline" />
        <StatCard label="On leave" value={c.ON_LEAVE ?? 0} tone="info" icon="mdi:beach" />
        <StatCard label="Not checked in" value={c.PENDING ?? 0} tone="neutral" icon="mdi:account-clock-outline" />
      </div>
      <div className="flex flex-col md:flex-row gap-2 md:justify-end">
        <Input type="date" className="md:w-[170px] h-9" value={date} max={toInputDate()} onChange={(e) => setDate(e.target.value)} />
        {departments?.length > 0 && (
          <Select className="md:w-[200px] h-9" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} placeholder="All departments" options={departments.map((d) => ({ value: d.id, label: d.name }))} />
        )}
        <Select className="md:w-[170px] h-9" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} placeholder="All statuses" options={Object.keys(c).map((s) => ({ value: s, label: s === "PENDING" ? "Not checked in" : humanize(s) }))} />
      </div>
      <ErrorNote error={error} onRetry={reload} />
      <Table columns={columns} rows={rows} loading={loading} dataKey="employee.id" emptyText="No team members to show." />
    </div>
  );
}

export default function Attendance() {
  const { can, employeeId } = useAuth();
  const [params, setParams] = useSearchParams();
  const canTeam = can("attendance.view_team", "attendance.view_all");
  const tab = params.get("tab") ?? (employeeId ? "mine" : "team");
  const tabs = [...(employeeId ? [{ key: "mine", label: "My Attendance" }] : []), ...(canTeam ? [{ key: "team", label: can("attendance.view_all") ? "Company Attendance" : "Team Attendance" }] : [])];

  return (
    <Page>
      <PageHeader title="Attendance" subtitle="Check in and out, and review attendance history" />
      {tab === "mine" && employeeId && <CheckInCard />}
      <Panel>
        <Tabs tabs={tabs} active={tab} onChange={(t) => setParams({ tab: t })} />
        <div className="pt-4">
          {tab === "mine" && employeeId && <AttendanceCalendar employeeId={employeeId} />}
          {tab === "team" && canTeam && <TeamBoard />}
        </div>
      </Panel>
    </Page>
  );
}
