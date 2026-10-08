import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, qs } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import { Badge, Btn, Empty, ErrorNote, Field, IconBtn, Input, ModalForm, Page, PageHeader, Panel, PersonCell, Select, Table, Tabs, TextArea } from "@/components/hr/ui";
import { confirmAction, fmtDate, fullName, toInputDate, useQuery, LOOKUP_TTL } from "@/components/hr/utils";

const d10 = (v) => String(v).slice(0, 10);

/** LEAVE-02: new request, or edit/resubmit when changes were requested. */
function RequestLeaveModal({ existing, balances, onSaved, closeModal }) {
  const toast = useToast();
  const { data: types } = useQuery("/leave/types", { ttl: LOOKUP_TTL });
  const [form, setForm] = useState({
    leaveTypeId: existing?.leaveType.id ?? "",
    startDate: existing ? d10(existing.startDate) : toInputDate(),
    endDate: existing ? d10(existing.endDate) : toInputDate(),
    halfDay: existing?.halfDay ?? false,
    reason: existing?.reason ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const bal = balances?.find((b) => b.leaveType.id === form.leaveTypeId);
  const singleDay = form.startDate === form.endDate;

  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      const body = { ...form, halfDay: singleDay && form.halfDay };
      if (existing) await api.patch(`/leave/requests/${existing.id}`, body);
      else await api.post("/leave/requests", body);
      toast.success(existing ? "Request updated and resubmitted." : "Leave request submitted for approval.");
      onSaved();
      closeModal();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalForm title={existing ? "Update Leave Request" : "Request Leave"} subtitle="Weekends and company holidays are not counted." onSubmit={submit} onCancel={closeModal} saving={saving} error={error} submitLabel={existing ? "Resubmit" : "Submit request"}>
      {existing?.decisionNote && (
        <div className="rounded-lg bg-[#F59E0B1A] text-[#B45309] text-[12px] px-3 py-2">
          <b>Approver note:</b> {existing.decisionNote}
        </div>
      )}
      <Field label="Leave type" required hint={bal ? (bal.unlimited ? "No fixed allowance" : `${bal.available} day(s) available`) : undefined}>
        <Select value={form.leaveTypeId} onChange={set("leaveTypeId")} required placeholder="Select leave type" options={(types ?? []).map((t) => ({ value: t.id, label: t.name }))} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="From" required>
          <Input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value, endDate: f.endDate < e.target.value ? e.target.value : f.endDate }))} required />
        </Field>
        <Field label="To" required>
          <Input type="date" value={form.endDate} min={form.startDate} onChange={set("endDate")} required />
        </Field>
      </div>
      {singleDay && (
        <label className="flex items-center gap-2 text-[13px] text-[#6F7C74] dark:text-[#A9C2B3]">
          <input type="checkbox" checked={form.halfDay} onChange={set("halfDay")} className="accent-[#09BF64]" /> Half day
        </label>
      )}
      <Field label="Reason" required>
        <TextArea value={form.reason} onChange={set("reason")} required minLength={3} maxLength={1000} />
      </Field>
    </ModalForm>
  );
}

/** LEAVE-03: approve / reject / request changes. */
function DecisionModal({ request, action, onSaved, closeModal }) {
  const toast = useToast();
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const label = { APPROVE: "Approve", REJECT: "Reject", REQUEST_CHANGES: "Request changes" }[action];
  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.post(`/leave/requests/${request.id}/decision`, { action, note: note || undefined });
      toast.success(`Request ${action === "APPROVE" ? "approved" : action === "REJECT" ? "rejected" : "returned for changes"}. ${fullName(request.employee)} has been notified.`);
      onSaved();
      closeModal();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };
  return (
    <ModalForm
      title={`${label} leave`}
      subtitle={`${fullName(request.employee)} · ${request.leaveType.name} · ${fmtDate(request.startDate)} – ${fmtDate(request.endDate)} (${Number(request.days)} day(s))`}
      onSubmit={submit}
      onCancel={closeModal}
      saving={saving}
      error={error}
      submitLabel={label}
    >
      <div className="rounded-lg bg-[#F4F6F9] dark:bg-gray-800 px-3 py-2 text-[13px] text-[#0F2418] dark:text-[#EFFBF3]">
        <b>Reason:</b> {request.reason}
      </div>
      <Field label={action === "APPROVE" ? "Note (optional)" : "Note"} required={action !== "APPROVE"}>
        <TextArea value={note} onChange={(e) => setNote(e.target.value)} required={action !== "APPROVE"} maxLength={1000} />
      </Field>
    </ModalForm>
  );
}

function HolidayModal({ onSaved, closeModal }) {
  const toast = useToast();
  const [form, setForm] = useState({ date: toInputDate(), name: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const submit = async () => {
    setSaving(true);
    try {
      await api.post("/leave/holidays", form);
      toast.success("Holiday added.");
      onSaved();
      closeModal();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };
  return (
    <ModalForm title="Add Holiday" onSubmit={submit} onCancel={closeModal} saving={saving} error={error}>
      <Field label="Date" required>
        <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required />
      </Field>
      <Field label="Name" required>
        <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required maxLength={120} />
      </Field>
    </ModalForm>
  );
}

const requestColumns = (extra = []) => [
  { header: "Type", body: (r) => <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: r.leaveType.color ?? "#09BF64" }} />{r.leaveType.name}</span> },
  { header: "From", body: (r) => fmtDate(r.startDate) },
  { header: "To", body: (r) => fmtDate(r.endDate) },
  { header: "Days", body: (r) => Number(r.days) },
  { header: "Reason", body: (r) => <span className="block max-w-[260px] truncate" title={r.reason}>{r.reason}</span> },
  { header: "Status", body: (r) => <Badge value={r.status} /> },
  ...extra,
];

function MyLeave() {
  const { openModal } = useModal();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const year = new Date().getFullYear();
  const balances = useQuery(`/leave/balances?year=${year}`);
  const list = useQuery(`/leave/requests${qs({ view: "mine", page, pageSize: 10 })}`);
  const refresh = () => (balances.reload(), list.reload());
  const openRequest = (existing) => openModal(RequestLeaveModal, { sizeClass: "w-[95%] md:w-[520px]", existing, balances: balances.data, onSaved: refresh });

  const cancel = async (r) => {
    if (!(await confirmAction({ message: `Cancel your ${r.leaveType.name} request for ${fmtDate(r.startDate)} – ${fmtDate(r.endDate)}?`, acceptLabel: "Cancel request", danger: true }))) return;
    try {
      await api.post(`/leave/requests/${r.id}/cancel`);
      toast.success("Request cancelled.");
      refresh();
    } catch (e) {
      toast.error(e);
    }
  };

  const today = toInputDate();
  const actions = {
    header: "",
    body: (r) => (
      <div className="flex gap-2">
        {r.status === "CHANGES_REQUESTED" && <IconBtn icon="tabler:edit" title="Update and resubmit" onClick={() => openRequest(r)} />}
        {(["PENDING", "CHANGES_REQUESTED"].includes(r.status) || (r.status === "APPROVED" && d10(r.startDate) > today)) && (
          <IconBtn icon="mdi:close" tone="danger" title="Cancel request" onClick={() => cancel(r)} />
        )}
      </div>
    ),
  };
  const note = { header: "Approver note", body: (r) => (r.decisionNote ? <span className="block max-w-[220px] truncate" title={r.decisionNote}>{r.decisionNote}</span> : "—") };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[13px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">Balances {year}</h3>
        <Btn icon="material-symbols:add-rounded" label="Request Leave" onClick={() => openRequest()} />
      </div>
      <ErrorNote error={balances.error} onRetry={balances.reload} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(balances.data ?? []).map((b) => (
          <div key={b.leaveType.id} className="rounded-lg border border-[#6F7C7426] p-3" style={{ borderLeft: `4px solid ${b.leaveType.color ?? "#09BF64"}` }}>
            <p className="text-[12px] text-[#8E8E9C]">{b.leaveType.name}</p>
            <p className="text-[22px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">{b.unlimited ? "∞" : b.available}</p>
            <p className="text-[11px] text-[#8E8E9C]">
              {b.unlimited ? "No fixed allowance" : `of ${b.allowance + b.adjustment} days`} · {b.used} used{b.pending ? ` · ${b.pending} pending` : ""}
            </p>
          </div>
        ))}
      </div>
      <h3 className="text-[13px] font-bold text-[#0F2418] dark:text-[#EFFBF3] pt-2">My requests</h3>
      <ErrorNote error={list.error} onRetry={list.reload} />
      <Table columns={requestColumns([note, actions])} rows={list.data?.items} loading={list.loading} page={page} totalPages={list.data?.totalPages} onPageChange={setPage} emptyText="You haven't requested any leave yet." />
    </div>
  );
}

function Approvals() {
  const { openModal } = useModal();
  const [status, setStatus] = useState("PENDING");
  const [page, setPage] = useState(1);
  const list = useQuery(`/leave/requests${qs({ view: "approvals", status, page, pageSize: 10 })}`);
  const decide = (request, action) => openModal(DecisionModal, { sizeClass: "w-[95%] md:w-[520px]", request, action, onSaved: list.reload });
  const columns = [
    { header: "Employee", body: (r) => <PersonCell person={r.employee} sub={r.employee.designation} /> },
    ...requestColumns(),
    { header: "Requested", body: (r) => fmtDate(r.createdAt) },
    ...(status === "PENDING"
      ? [
          {
            header: "",
            body: (r) => (
              <div className="flex gap-1.5">
                <Btn size="sm" variant="success" label="Approve" onClick={() => decide(r, "APPROVE")} />
                <Btn size="sm" variant="outline" label="Changes" onClick={() => decide(r, "REQUEST_CHANGES")} />
                <Btn size="sm" variant="danger" label="Reject" onClick={() => decide(r, "REJECT")} />
              </div>
            ),
          },
        ]
      : [{ header: "Decided by", body: (r) => (r.approver ? fullName(r.approver) : "—") }]),
  ];
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Select
          className="md:w-[200px] h-9"
          value={status}
          onChange={(e) => (setStatus(e.target.value), setPage(1))}
          options={["PENDING", "APPROVED", "REJECTED", "CHANGES_REQUESTED", "CANCELLED"].map((s) => ({ value: s, label: s.replace("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) }))}
        />
      </div>
      <ErrorNote error={list.error} onRetry={list.reload} />
      <Table columns={columns} rows={list.data?.items} loading={list.loading} page={page} totalPages={list.data?.totalPages} onPageChange={setPage} emptyText={status === "PENDING" ? "No requests waiting for you." : "No requests."} />
    </div>
  );
}

function TeamCalendar() {
  const [month, setMonth] = useState(toInputDate().slice(0, 7));
  const { data, loading, error, reload } = useQuery(`/leave/calendar?month=${month}`);
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Input type="month" className="md:w-[180px] h-9" value={month} onChange={(e) => setMonth(e.target.value)} />
      </div>
      <ErrorNote error={error} onRetry={reload} />
      {data?.holidays.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.holidays.map((h) => (
            <Badge key={h.id} value="HOLIDAY">
              {fmtDate(h.date)} · {h.name}
            </Badge>
          ))}
        </div>
      )}
      <Table
        columns={[{ header: "Employee", body: (r) => <PersonCell person={r.employee} sub={r.employee.designation} /> }, ...requestColumns()]}
        rows={data?.requests}
        loading={loading}
        emptyText="No leave planned this month."
      />
    </div>
  );
}

function Holidays() {
  const { can } = useAuth();
  const { openModal } = useModal();
  const toast = useToast();
  const [year, setYear] = useState(new Date().getFullYear());
  const { data, loading, error, reload } = useQuery(`/leave/holidays?year=${year}`);
  const manage = can("holidays.manage");
  const remove = async (h) => {
    if (!(await confirmAction({ message: `Delete holiday "${h.name}" on ${fmtDate(h.date)}?`, acceptLabel: "Delete", danger: true }))) return;
    try {
      await api.delete(`/leave/holidays/${h.id}`);
      reload();
    } catch (e) {
      toast.error(e);
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex justify-end gap-2">
        <Select className="w-[120px] h-9" value={year} onChange={(e) => setYear(Number(e.target.value))} options={[-1, 0, 1].map((o) => ({ value: new Date().getFullYear() + o, label: String(new Date().getFullYear() + o) }))} />
        {manage && <Btn icon="material-symbols:add-rounded" label="Add Holiday" onClick={() => openModal(HolidayModal, { sizeClass: "w-[95%] md:w-[420px]", onSaved: reload })} />}
      </div>
      <ErrorNote error={error} onRetry={reload} />
      {!loading && data?.length === 0 ? (
        <Empty icon="mdi:calendar-star" text={`No holidays configured for ${year}.`} />
      ) : (
        <Table
          columns={[
            { header: "Date", body: (h) => fmtDate(h.date) },
            { header: "Day", body: (h) => new Date(h.date).toLocaleDateString(undefined, { weekday: "long", timeZone: "UTC" }) },
            { header: "Holiday", field: "name" },
            ...(manage ? [{ header: "", body: (h) => <IconBtn icon="mdi:trash-can-outline" tone="danger" title="Delete" onClick={() => remove(h)} /> }] : []),
          ]}
          rows={data}
          loading={loading}
        />
      )}
    </div>
  );
}

export default function Leave() {
  const { can, employeeId } = useAuth();
  const [params, setParams] = useSearchParams();
  const canApprove = can("leave.approve_team", "leave.approve_all");
  const canTeam = canApprove || can("leave.view_all");
  // Refetches automatically after any approval decision (writes invalidate the cache).
  const pending = useQuery(canApprove ? "/leave/requests?view=approvals&pageSize=1" : null);
  const pendingCount = pending.data?.total ?? 0;
  const tab = params.get("tab") ?? (employeeId ? "mine" : "approvals");
  const tabs = [
    ...(employeeId ? [{ key: "mine", label: "My Leave" }] : []),
    ...(canApprove ? [{ key: "approvals", label: "Approvals", count: pendingCount }] : []),
    ...(canTeam ? [{ key: "team", label: "Leave Calendar" }] : []),
    { key: "holidays", label: "Holidays" },
  ];
  return (
    <Page>
      <PageHeader title="Leave" subtitle="Request time off, track balances and manage approvals" />
      <Panel>
        <Tabs tabs={tabs} active={tab} onChange={(t) => setParams({ tab: t })} />
        <div className="pt-4">
          {tab === "mine" && employeeId && <MyLeave />}
          {tab === "approvals" && canApprove && <Approvals />}
          {tab === "team" && canTeam && <TeamCalendar />}
          {tab === "holidays" && <Holidays />}
        </div>
      </Panel>
    </Page>
  );
}
