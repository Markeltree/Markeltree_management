import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { downloadPayslipPdf } from "@/components/hr/payslipPdf";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import EmployeeFormModal from "@/components/hr/EmployeeFormModal";
import AttendanceCalendar from "@/components/hr/AttendanceCalendar";
import { Avatar, Badge, Btn, Empty, ErrorNote, Field, Input, ModalForm, Page, Panel, Tabs, TextArea } from "@/components/hr/ui";
import { fmtDate, fmtDateTime, fullName, humanize, toInputDate, useQuery, fmtMoney, MONTHS } from "@/components/hr/utils";

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[11px] text-[#8E8E9C]">{label}</p>
      <p className="text-[13px] text-[#0B1B33] dark:text-[#EEF8FD] font-medium break-words">{value || "—"}</p>
    </div>
  );
}

function OffboardModal({ employee, onDone, closeModal }) {
  const toast = useToast();
  const [exitDate, setExitDate] = useState(toInputDate());
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const submit = async () => {
    setSaving(true);
    try {
      await api.post(`/employees/${employee.id}/exit`, { exitDate, note: note || undefined });
      toast.success(`${fullName(employee)} has been offboarded and their access revoked.`);
      onDone();
      closeModal();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };
  return (
    <ModalForm
      title={`Offboard ${fullName(employee)}`}
      subtitle="Marks the employee as exited, deactivates their account and signs them out everywhere. Their direct reports move to their manager."
      onSubmit={submit}
      onCancel={closeModal}
      saving={saving}
      error={error}
      submitLabel="Offboard"
    >
      <Field label="Exit date" required>
        <Input type="date" value={exitDate} onChange={(e) => setExitDate(e.target.value)} required />
      </Field>
      <Field label="Note">
        <TextArea value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} placeholder="e.g. Resigned — last working day" />
      </Field>
    </ModalForm>
  );
}

function ChangePassword() {
  const toast = useToast();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const submit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) return setError(new Error("New passwords do not match."));
    setSaving(true);
    setError(null);
    try {
      await api.post("/auth/change-password", { currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success("Password changed. Other devices have been signed out.");
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <form onSubmit={submit} className="max-w-[420px] space-y-3">
      <Field label="Current password" required>
        <Input type="password" autoComplete="current-password" value={form.currentPassword} onChange={set("currentPassword")} required />
      </Field>
      <Field label="New password" required hint="At least 8 characters with a letter and a number">
        <Input type="password" autoComplete="new-password" value={form.newPassword} onChange={set("newPassword")} required />
      </Field>
      <Field label="Confirm new password" required>
        <Input type="password" autoComplete="new-password" value={form.confirm} onChange={set("confirm")} required />
      </Field>
      <ErrorNote error={error} />
      <Btn type="submit" label="Change password" loading={saving} />
    </form>
  );
}

/** Own payslips once payroll is paid (self-service). */
function MyPayslips({ focusId }) {
  const toast = useToast();
  const { data, loading, error, reload } = useQuery("/payroll/my-payslips");
  const pdf = (id) => api.get(`/payroll/payslips/${id}`, { cache: false }).then((s) => downloadPayslipPdf(s, s.companyName)).catch(toast.error);
  if (error) return <ErrorNote error={error} onRetry={reload} />;
  if (!loading && !data?.length) return <Empty icon="mdi:file-document-outline" text="No payslips yet. They appear here once payroll is paid." />;
  return (
    <ul className="divide-y divide-[#6E7A8626]">
      {(data ?? []).map((p) => (
        <li key={p.id} className={`flex items-center justify-between gap-3 py-3 px-2 rounded ${focusId === p.id ? "bg-[#0088D114]" : ""}`}>
          <div>
            <p className="text-[14px] font-semibold text-[#0B1B33] dark:text-[#EEF8FD]">
              {MONTHS[p.run.month - 1]} {p.run.year}
            </p>
            <p className="text-[12px] text-[#8E8E9C]">
              Net pay <b className="text-[#0B1B33] dark:text-[#EEF8FD]">{fmtMoney(p.netPay, p.run.currency)}</b> · paid {fmtDate(p.run.paidAt)}
            </p>
          </div>
          <Btn size="sm" variant="outline" icon="mdi:file-pdf-box" label="Download PDF" onClick={() => pdf(p.id)} />
        </li>
      ))}
    </ul>
  );
}

/** Employee profile (EMP-02/03/05). Rendered at /employees/:id and /profile (self). */
export default function EmployeeProfile({ self = false }) {
  const params = useParams();
  const navigate = useNavigate();
  const { employeeId: myId, can, logout } = useAuth();
  const { openModal } = useModal();
  const toast = useToast();
  const id = self ? myId : params.id;
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") ?? "overview");

  const { data: e, loading, error, reload } = useQuery(id ? `/employees/${id}` : null);
  const history = useQuery(tab === "history" ? `/employees/${id}/history` : null);
  const balances = useQuery(tab === "leave" ? `/leave/balances?employeeId=${id}` : null);

  if (!id) {
    return (
      <Page>
        <Panel>
          <Empty icon="mdi:account-off-outline" text="Your account isn't linked to an employee profile." />
          <div className="pt-2">
            <h3 className="text-[14px] font-bold mb-3 text-[#0B1B33] dark:text-[#EEF8FD]">Change password</h3>
            <ChangePassword />
          </div>
        </Panel>
      </Page>
    );
  }
  if (loading && !e) return <Page><p className="text-[13px] text-[#8E8E9C]">Loading…</p></Page>;
  if (error) return <Page><ErrorNote error={error} onRetry={reload} /></Page>;
  if (!e) return null;

  const isHr = can("employees.update");
  const isSelf = e.access.isSelf;
  const edit = () =>
    openModal(EmployeeFormModal, { sizeClass: "w-[95%] md:w-[70%] lg:w-[60%]", mode: isHr ? "edit" : "self", employee: e, onSaved: reload });

  const resendInvite = async () => {
    try {
      await api.post(`/employees/${e.id}/resend-invite`);
      toast.success("A new activation code has been issued.");
    } catch (err) {
      toast.error(err);
    }
  };
  const signOutEverywhere = async () => {
    await api.post("/auth/logout-all");
    await logout();
    navigate("/login", { replace: true });
  };

  const tabs = [
    { key: "overview", label: "Overview" },
    ...(e.access.full ? [{ key: "attendance", label: "Attendance" }, { key: "leave", label: "Leave" }, { key: "history", label: "Employment History" }] : []),
    ...(isSelf ? [{ key: "payslips", label: "Payslips" }, { key: "security", label: "Security" }] : []),
  ];

  return (
    <Page>
      <Panel>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Avatar person={e} size={72} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[20px] font-bold text-[#0B1B33] dark:text-[#EEF8FD]">{fullName(e)}</h1>
              <Badge value={e.employmentStatus} />
              {e.user?.status && e.user.status !== "ACTIVE" && <Badge value={e.user.status} />}
            </div>
            <p className="text-[13px] text-[#6E7A86] dark:text-[#A9BACB]">
              {e.designation}
              {e.department && ` · ${e.department.name}`}
              {e.team && ` · ${e.team.name}`}
            </p>
            <p className="text-[12px] text-[#8E8E9C]">
              {e.employeeCode} · {e.user?.email}
              {e.phone && ` · ${e.phone}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(isHr || isSelf) && <Btn icon="tabler:edit" variant="outline" label={isHr ? "Edit" : "Edit my details"} onClick={edit} />}
            {can("employees.create") && e.user?.status === "INVITED" && <Btn variant="ghost" icon="mdi:email-fast-outline" label="Resend invite" onClick={resendInvite} />}
            {isHr && !isSelf && e.employmentStatus !== "EXITED" && (
              <Btn variant="danger" icon="mdi:account-arrow-right-outline" label="Offboard" onClick={() => openModal(OffboardModal, { sizeClass: "w-[95%] md:w-[480px]", employee: e, onDone: reload })} />
            )}
          </div>
        </div>
      </Panel>

      <Panel>
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        <div className="pt-4">
          {tab === "overview" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Info label="Reports to" value={e.manager && fullName(e.manager)} />
                <Info label="Department" value={e.department?.name} />
                <Info label="Team" value={e.team?.name} />
                <Info label="Phone" value={e.phone} />
                {e.access.full && (
                  <>
                    <Info label="Joining date" value={fmtDate(e.joiningDate)} />
                    <Info label="Employment type" value={humanize(e.employmentType)} />
                    <Info label="System role" value={e.user?.role?.name} />
                    <Info label="Last login" value={e.user?.lastLoginAt ? fmtDateTime(e.user.lastLoginAt) : "Never"} />
                    {e.exitDate && <Info label="Exit date" value={fmtDate(e.exitDate)} />}
                  </>
                )}
              </div>
              {e.access.sensitive && (
                <>
                  <h3 className="text-[13px] font-bold text-[#0088D1] flex items-center gap-2">
                    Personal & emergency <span className="text-[11px] font-normal text-[#8E8E9C]">(restricted)</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Info label="Date of birth" value={e.dateOfBirth && fmtDate(e.dateOfBirth)} />
                    <Info label="Gender" value={e.gender} />
                    <Info label="Personal email" value={e.personalEmail} />
                    <Info label="Address" value={e.address} />
                    <Info label="Emergency contact" value={e.emergencyContactName} />
                    <Info label="Emergency phone" value={e.emergencyContactPhone} />
                    <Info label="Relationship" value={e.emergencyContactRelation} />
                  </div>
                </>
              )}
            </div>
          )}

          {tab === "attendance" && <AttendanceCalendar employeeId={e.id} />}

          {tab === "leave" && (
            <>
              <ErrorNote error={balances.error} onRetry={balances.reload} />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(balances.data ?? []).map((b) => (
                  <div key={b.leaveType.id} className="rounded-lg border border-[#6E7A8626] p-3">
                    <p className="text-[12px] text-[#8E8E9C]">{b.leaveType.name}</p>
                    <p className="text-[22px] font-bold text-[#0B1B33] dark:text-[#EEF8FD]">{b.unlimited ? "∞" : b.available}</p>
                    <p className="text-[11px] text-[#8E8E9C]">
                      {b.unlimited ? "No fixed allowance" : `of ${b.allowance + b.adjustment}`} · {b.used} used · {b.pending} pending
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "history" && (
            <>
              <ErrorNote error={history.error} onRetry={history.reload} />
              {history.data?.length === 0 && <Empty text="No history recorded." />}
              <ol className="relative border-l border-[#6E7A8640] ml-2 space-y-4">
                {(history.data ?? []).map((h) => (
                  <li key={h.id} className="ml-4">
                    <span className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-[#0088D1]" />
                    <p className="text-[13px] font-semibold text-[#0B1B33] dark:text-[#EEF8FD]">{humanize(h.changeType)}</p>
                    <p className="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]">
                      {h.fromValue ? `${h.fromValue} → ` : ""}
                      {h.toValue ?? "—"}
                    </p>
                    <p className="text-[11px] text-[#8E8E9C]">
                      Effective {fmtDate(h.effectiveDate)}
                      {h.note && ` · ${h.note}`}
                    </p>
                  </li>
                ))}
              </ol>
            </>
          )}

          {tab === "payslips" && isSelf && <MyPayslips focusId={searchParams.get("id")} />}

          {tab === "security" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-[14px] font-bold mb-3 text-[#0B1B33] dark:text-[#EEF8FD]">Change password</h3>
                <ChangePassword />
              </div>
              <div>
                <h3 className="text-[14px] font-bold mb-1 text-[#0B1B33] dark:text-[#EEF8FD]">Sessions</h3>
                <p className="text-[12px] text-[#6E7A86] mb-3">Signed in on a shared or lost device? Sign out of every session, including this one.</p>
                <Btn variant="danger" icon="mdi:logout-variant" label="Sign out everywhere" onClick={signOutEverywhere} />
              </div>
            </div>
          )}
        </div>
      </Panel>
    </Page>
  );
}
