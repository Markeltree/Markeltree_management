import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { api, download } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import { downloadPayslipPdf, unpaidDaysOf } from "@/components/hr/payslipPdf";
import { Badge, Btn, Empty, ErrorNote, Field, IconBtn, Input, ModalForm, Page, PageHeader, Panel, PersonCell, SearchInput, Select, StatCard, Table, Tabs, TextArea } from "@/components/hr/ui";
import { confirmAction, fmtDate, fmtDateTime, fmtMoney, fullName, LOOKUP_TTL, MONTHS, toInputDate, useDebounce, useQuery } from "@/components/hr/utils";

const periodLabel = (r) => `${MONTHS[r.month - 1]} ${r.year}`;
const RUN_TONE = { DRAFT: "neutral", APPROVED: "info", PAID: "success" };

/** Editable list of named amounts (allowances, deductions, adjustments). */
function LinesEditor({ lines, onChange, currency, typeLabel = true }) {
  const set = (i, patch) => onChange(lines.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  return (
    <div className="space-y-2">
      {lines.map((l, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input className="h-9 flex-1" placeholder="Name (e.g. House Rent)" value={l.name} onChange={(e) => set(i, { name: e.target.value })} maxLength={60} />
          {typeLabel && (
            <select value={l.type} onChange={(e) => set(i, { type: e.target.value })} className="h-9 text-[12px] border border-[#6F7C7440] rounded-lg px-2 bg-white dark:bg-[#0D0D0D] dark:text-[#EFFBF3]">
              <option value="EARNING">Earning (+)</option>
              <option value="DEDUCTION">Deduction (−)</option>
            </select>
          )}
          <Input className="h-9 w-[140px]" type="number" min="0" step="0.01" placeholder={`Amount (${currency})`} value={l.amount} onChange={(e) => set(i, { amount: e.target.value })} />
          <IconBtn icon="mdi:close" tone="danger" title="Remove" onClick={() => onChange(lines.filter((_, j) => j !== i))} />
        </div>
      ))}
      <button type="button" className="text-[12px] text-[#09BF64] font-semibold hover:underline" onClick={() => onChange([...lines, { name: "", type: "EARNING", amount: "" }])}>
        + Add line
      </button>
    </div>
  );
}

const cleanLines = (lines) => lines.filter((l) => l.name.trim() && l.amount !== "").map((l) => ({ name: l.name.trim(), type: l.type, amount: Number(l.amount) }));

// ── Salary structure ────────────────────────────────────────────

function SalaryModal({ employee, current, currency, onSaved, closeModal }) {
  const toast = useToast();
  const { data: history } = useQuery(`/payroll/salaries/${employee.id}`);
  const [form, setForm] = useState({
    // First salary normally applies from the joining date; later changes from today.
    effectiveFrom: current ? toInputDate() : String(employee.joiningDate ?? "").slice(0, 10) || toInputDate(),
    basicSalary: current ? Number(current.basicSalary) : "",
    components: (current?.components ?? []).map((c) => ({ ...c, amount: String(c.amount) })),
    taxMode: current?.taxMode ?? "NONE",
    taxValue: current ? Number(current.taxValue) : 0,
    bankName: current?.bankName ?? "",
    bankAccount: current?.bankAccount ?? "",
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const comps = cleanLines(form.components);
  const gross = Number(form.basicSalary || 0) + comps.filter((c) => c.type === "EARNING").reduce((s, c) => s + c.amount, 0);

  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.post(`/payroll/salaries/${employee.id}`, {
        effectiveFrom: form.effectiveFrom,
        basicSalary: Number(form.basicSalary),
        components: comps,
        taxMode: form.taxMode,
        taxValue: Number(form.taxValue || 0),
        bankName: form.bankName || null,
        bankAccount: form.bankAccount || null,
        note: form.note || null,
      });
      toast.success(`Salary saved for ${fullName(employee)}.`);
      onSaved?.();
      closeModal();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalForm title={`Salary — ${fullName(employee)}`} subtitle="Saving creates a new version from the effective date; earlier payroll keeps the old figures." onSubmit={submit} onCancel={closeModal} saving={saving} error={error} submitLabel="Save salary">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Field label="Effective from" required hint={employee.joiningDate ? `Joined ${fmtDate(employee.joiningDate)}` : undefined}>
          <Input type="date" value={form.effectiveFrom} onChange={set("effectiveFrom")} required />
        </Field>
        <Field label={`Basic salary (${currency} / month)`} required>
          <Input type="number" min="0" step="0.01" value={form.basicSalary} onChange={set("basicSalary")} required />
        </Field>
        <div className="flex flex-col justify-end">
          <span className="text-[11px] text-[#8E8E9C]">Monthly gross</span>
          <span className="text-[18px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">{fmtMoney(gross, currency)}</span>
        </div>
      </div>
      <Field label="Recurring allowances & deductions">
        <LinesEditor lines={form.components} onChange={(components) => setForm((f) => ({ ...f, components }))} currency={currency} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Income tax">
          <Select value={form.taxMode} onChange={set("taxMode")} options={[{ value: "NONE", label: "No tax" }, { value: "FIXED", label: "Fixed amount per month" }, { value: "PERCENT", label: "Percentage of pay" }]} />
        </Field>
        {form.taxMode !== "NONE" && (
          <Field label={form.taxMode === "PERCENT" ? "Tax %" : `Tax amount (${currency})`}>
            <Input type="number" min="0" max={form.taxMode === "PERCENT" ? 100 : undefined} step="0.01" value={form.taxValue} onChange={set("taxValue")} />
          </Field>
        )}
        <Field label="Bank">
          <Input value={form.bankName} onChange={set("bankName")} maxLength={80} />
        </Field>
        <Field label="Account / IBAN">
          <Input value={form.bankAccount} onChange={set("bankAccount")} maxLength={60} />
        </Field>
      </div>
      <Field label="Note (e.g. annual increment)">
        <Input value={form.note} onChange={set("note")} maxLength={300} />
      </Field>
      {history?.history?.length > 0 && (
        <div>
          <h3 className="text-[12px] font-bold text-[#09BF64] mb-1">History</h3>
          <ul className="text-[12px] text-[#6F7C74] space-y-0.5">
            {history.history.map((h) => (
              <li key={h.id}>
                From {fmtDate(h.effectiveFrom)}: basic {fmtMoney(h.basicSalary, currency)}
                {h.note && ` — ${h.note}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </ModalForm>
  );
}

function Salaries({ currency }) {
  const { openModal } = useModal();
  const [search, setSearch] = useState("");
  const q = useDebounce(search.trim());
  const { data, loading, error, reload } = useQuery(`/payroll/salaries${q ? `?search=${encodeURIComponent(q)}` : ""}`);
  const open = (row) => openModal(SalaryModal, { sizeClass: "w-[95%] md:w-[680px]", employee: row.employee, current: row.salary, currency, onSaved: reload });
  const missing = (data ?? []).filter((r) => !r.salary).length;
  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <p className="text-[12px] text-[#6F7C74]">{missing > 0 ? `${missing} employee(s) have no salary yet and will be left out of payroll.` : "Every active employee has a salary."}</p>
        <SearchInput value={search} onChange={setSearch} placeholder="Search employees…" />
      </div>
      <ErrorNote error={error} onRetry={reload} />
      <Table
        rows={data}
        loading={loading}
        dataKey="employee.id"
        onRowClick={open}
        columns={[
          { header: "Employee", body: (r) => <PersonCell person={r.employee} sub={`${r.employee.employeeCode} · ${r.employee.designation}`} /> },
          { header: "Department", body: (r) => r.employee.department?.name ?? "—" },
          { header: "Basic", body: (r) => (r.salary ? fmtMoney(r.salary.basicSalary, currency) : "—") },
          { header: "Monthly gross", body: (r) => (r.salary ? <b>{fmtMoney(r.monthlyGross, currency)}</b> : <Badge value="PENDING">Not set</Badge>) },
          { header: "Tax", body: (r) => (!r.salary || r.salary.taxMode === "NONE" ? "—" : r.salary.taxMode === "PERCENT" ? `${Number(r.salary.taxValue)}%` : fmtMoney(r.salary.taxValue, currency)) },
          { header: "Since", body: (r) => (r.salary ? fmtDate(r.salary.effectiveFrom) : "—") },
          { header: "", body: (r) => <IconBtn icon="tabler:edit" title="Set salary" onClick={(e) => (e.stopPropagation(), open(r))} /> },
        ]}
      />
    </div>
  );
}

// ── Payslip review ──────────────────────────────────────────────

function Row({ label, value, strong, negative }) {
  return (
    <div className={`flex justify-between text-[13px] py-0.5 ${strong ? "font-bold text-[#0F2418] dark:text-[#EFFBF3]" : "text-[#555] dark:text-[#C9C9D9]"}`}>
      <span>{label}</span>
      <span>{negative ? "− " : ""}{value}</span>
    </div>
  );
}

function PayslipModal({ slip, run, onSaved, closeModal }) {
  const toast = useToast();
  const editable = run.status === "DRAFT";
  const cur = run.currency;
  const [adjustments, setAdjustments] = useState((slip.adjustments ?? []).map((a) => ({ ...a, amount: String(a.amount) })));
  const [override, setOverride] = useState(slip.unpaidDaysOverride != null ? String(Number(slip.unpaidDaysOverride)) : "");
  const [note, setNote] = useState(slip.note ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const calculatedUnpaid = slip.workingDays - Number(slip.eligibleDays) + Number(slip.absentDays) + Number(slip.unpaidLeaveDays);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.patch(`/payroll/runs/${run.id}/payslips/${slip.id}`, {
        adjustments: cleanLines(adjustments),
        unpaidDaysOverride: override === "" ? null : Number(override),
        note: note || null,
      });
      toast.success("Payslip updated.");
      onSaved();
      closeModal();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  const body = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h3 className="text-[12px] font-bold text-[#09BF64] mb-1">Earnings</h3>
          <Row label="Basic salary" value={fmtMoney(slip.basicSalary, cur)} />
          {slip.earnings.map((e) => <Row key={e.name} label={e.name} value={fmtMoney(e.amount, cur)} />)}
          {(slip.adjustments ?? []).filter((a) => a.type === "EARNING").map((a) => <Row key={a.name} label={`${a.name} (one-off)`} value={fmtMoney(a.amount, cur)} />)}
        </div>
        <div>
          <h3 className="text-[12px] font-bold text-[#09BF64] mb-1">Deductions</h3>
          {Number(slip.absenceDeduction) > 0 && <Row label={`Unpaid days (${unpaidDaysOf(slip)})`} value={fmtMoney(slip.absenceDeduction, cur)} />}
          {slip.deductions.map((d) => <Row key={d.name} label={d.name} value={fmtMoney(d.amount, cur)} />)}
          {(slip.adjustments ?? []).filter((a) => a.type === "DEDUCTION").map((a) => <Row key={a.name} label={`${a.name} (one-off)`} value={fmtMoney(a.amount, cur)} />)}
          {Number(slip.taxAmount) > 0 && <Row label="Income tax" value={fmtMoney(slip.taxAmount, cur)} />}
          <Row label="Total deductions" value={fmtMoney(slip.totalDeductions, cur)} strong />
        </div>
      </div>
      <div className="flex justify-between items-center rounded-lg bg-[#09BF6414] px-4 py-3">
        <span className="text-[14px] font-semibold text-[#0F2418] dark:text-[#EFFBF3]">Net pay</span>
        <span className="text-[20px] font-bold text-[#09BF64]">{fmtMoney(slip.netPay, cur)}</span>
      </div>
      <div className="text-[12px] text-[#6F7C74] rounded-lg border border-[#6F7C7426] p-3">
        <b>Days:</b> {slip.workingDays}-day month · {Number(slip.eligibleDays)} employed · {Number(slip.absentDays)} absent · {Number(slip.unpaidLeaveDays)} unpaid leave
        {" → "}
        <b>{unpaidDaysOf(slip)} unpaid</b>
        {slip.unpaidDaysOverride != null && <span className="text-[#D97706]"> (overridden; calculated {calculatedUnpaid})</span>}
      </div>
      {editable && (
        <>
          <Field label="One-off adjustments (bonus, overtime, advance recovery…)">
            <LinesEditor lines={adjustments} onChange={setAdjustments} currency={cur} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Override unpaid days" hint={`Leave blank to use the calculated ${calculatedUnpaid}`}>
              <Input type="number" min="0" max={slip.workingDays} step="0.5" value={override} onChange={(e) => setOverride(e.target.value)} />
            </Field>
            <Field label="Note">
              <TextArea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={300} />
            </Field>
          </div>
        </>
      )}
      {!editable && slip.note && <p className="text-[12px] text-[#6F7C74]"><b>Note:</b> {slip.note}</p>}
    </>
  );

  if (!editable) {
    return (
      <div className="flex flex-col gap-4 max-h-[82vh] overflow-y-auto pr-1">
        <div className="pr-8">
          <h2 className="text-[18px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">{fullName(slip.employee)}</h2>
          <p className="text-[12px] text-[#6F7C74]">{periodLabel(run)} · {slip.employee.employeeCode}</p>
        </div>
        {body}
        <div className="flex justify-end gap-2">
          <Btn variant="outline" icon="mdi:file-pdf-box" label="Download PDF" onClick={() => api.get(`/payroll/payslips/${slip.id}`, { cache: false }).then((s) => downloadPayslipPdf(s, s.companyName)).catch(toast.error)} />
          <Btn label="Close" onClick={closeModal} />
        </div>
      </div>
    );
  }
  return (
    <ModalForm title={fullName(slip.employee)} subtitle={`${periodLabel(run)} · ${slip.employee.employeeCode}`} onSubmit={save} onCancel={closeModal} saving={saving} error={error} submitLabel="Save & recalculate">
      {body}
    </ModalForm>
  );
}

// ── Runs ─────────────────────────────────────────────────────────

function NewRunModal({ onCreated, closeModal }) {
  const now = new Date();
  const [month, setMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      const [y, m] = month.split("-").map(Number);
      const run = await api.post("/payroll/runs", { year: y, month: m });
      onCreated(run.id);
      closeModal();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };
  return (
    <ModalForm title="New payroll run" subtitle="Calculates a draft payslip for everyone employed that month who has a salary." onSubmit={submit} onCancel={closeModal} saving={saving} error={error} submitLabel="Calculate payroll">
      <Field label="Month" required>
        <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} required />
      </Field>
    </ModalForm>
  );
}

function RunDetail({ runId, onBack, setParams }) {
  const { can } = useAuth();
  const { openModal } = useModal();
  const toast = useToast();
  const { data: run, loading, error, reload } = useQuery(`/payroll/runs/${runId}`);
  const { data: settings } = useQuery("/admin/settings", { ttl: LOOKUP_TTL });
  const [busy, setBusy] = useState(null);

  if (loading && !run) return <p className="text-[13px] text-[#8E8E9C]">Loading…</p>;
  if (error) return <ErrorNote error={error} onRetry={reload} />;
  if (!run) return null;
  const cur = run.currency;
  const label = periodLabel(run);

  const act = async (key, path, method, confirm) => {
    if (confirm && !(await confirmAction(confirm))) return;
    setBusy(key);
    try {
      await api[method](`/payroll/runs/${run.id}${path}`);
      if (key === "delete") return onBack();
      toast.success({ recalc: "Payroll recalculated.", approve: "Payroll approved and locked.", reopen: "Payroll reopened for changes.", paid: "Marked as paid. Employees have been notified." }[key]);
    } catch (e) {
      toast.error(e);
    } finally {
      setBusy(null);
    }
  };

  const totalUnpaid = run.payslips.reduce((s, p) => s + unpaidDaysOf(p), 0);
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-[#09BF64]" aria-label="Back to payroll runs">
            <Icon icon="mdi:arrow-left" width={22} />
          </button>
          <div>
            <h2 className="text-[18px] font-bold text-[#0F2418] dark:text-[#EFFBF3] flex items-center gap-2">
              Payroll — {label} <Badge tone={RUN_TONE[run.status]}>{run.status}</Badge>
            </h2>
            <p className="text-[12px] text-[#8E8E9C]">
              {fmtDate(run.periodStart)} – {fmtDate(run.periodEnd)} · per-day pay = salary ÷ {run.workingDays}
              {run.approvedAt && ` · approved ${fmtDateTime(run.approvedAt)}`}
              {run.paidAt && ` · paid ${fmtDateTime(run.paidAt)}`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn variant="ghost" icon="material-symbols-light:download-rounded" label="Export CSV" onClick={() => download(`/payroll/runs/${run.id}/export`, `payroll-${run.year}-${String(run.month).padStart(2, "0")}.csv`).catch(toast.error)} />
          {run.status === "DRAFT" && (
            <>
              <Btn variant="ghost" icon="mdi:trash-can-outline" label="Delete" loading={busy === "delete"} onClick={() => act("delete", "", "delete", { message: `Delete the ${label} draft payroll?`, acceptLabel: "Delete", danger: true })} />
              <Btn variant="outline" icon="mdi:refresh" label="Recalculate" loading={busy === "recalc"} onClick={() => act("recalc", "/recalculate", "post")} />
              {can("payroll.approve") && (
                <Btn icon="mdi:check-decagram" label="Approve" loading={busy === "approve"} onClick={() => act("approve", "/approve", "post", { message: `Approve ${label} payroll? Figures are recalculated one last time and then locked.`, acceptLabel: "Approve" })} />
              )}
            </>
          )}
          {run.status === "APPROVED" && can("payroll.approve") && (
            <>
              <Btn variant="outline" label="Reopen" loading={busy === "reopen"} onClick={() => act("reopen", "/reopen", "post")} />
              <Btn variant="success" icon="mdi:cash-check" label="Mark as paid" loading={busy === "paid"} onClick={() => act("paid", "/mark-paid", "post", { message: `Mark ${label} payroll as paid? Employees will be able to see and download their payslips.`, acceptLabel: "Mark paid" })} />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Employees" value={run.payslips.length} icon="mdi:account-group-outline" />
        <StatCard label="Total gross" value={fmtMoney(run.totalGross, cur)} icon="mdi:cash-plus" tone="info" />
        <StatCard label="Total deductions" value={fmtMoney(run.totalDeductions, cur)} icon="mdi:cash-minus" tone="warning" />
        <StatCard label="Total net pay" value={fmtMoney(run.totalNet, cur)} icon="mdi:cash-multiple" tone="success" />
      </div>

      {run.missingSalary.length > 0 && (
        <div className="rounded-lg border border-[#F59E0B55] bg-[#F59E0B10] px-3 py-2 text-[13px] text-[#B45309] space-y-1">
          <b>{run.missingSalary.length} employee(s) left out of this run:</b>
          <ul className="list-disc ml-5">
            {run.missingSalary.map((e) => (
              <li key={e.id}>
                {fullName(e)} —{" "}
                {e.salaryStartsOn
                  ? `salary starts ${fmtDate(e.salaryStartsOn)}, after this period. Edit their salary's "Effective from" (they joined ${fmtDate(e.joiningDate)}).`
                  : "no salary set."}
              </li>
            ))}
          </ul>
          <p>
            Fix it in the{" "}
            <button className="underline font-semibold" onClick={() => setParams({ tab: "salaries" })}>
              Salaries tab
            </button>
            , then click Recalculate.
          </p>
        </div>
      )}
      {run.status === "DRAFT" && totalUnpaid > 0 && (
        <div className="rounded-lg border border-[#6F7C7440] px-3 py-2 text-[12px] text-[#6F7C74]">
          {totalUnpaid} unpaid day(s) across this run (absences, unpaid leave and days before joining / after leaving).
          {settings?.["payroll.deductAbsences"] !== false && " If attendance isn't tracked yet, turn off “Deduct absences” in Administration → Policies, or override days per payslip."}
        </div>
      )}

      <Table
        rows={run.payslips}
        onRowClick={(p) => openModal(PayslipModal, { sizeClass: "w-[95%] md:w-[720px]", slip: p, run, onSaved: reload })}
        columns={[
          { header: "Employee", body: (p) => <PersonCell person={p.employee} sub={p.employee.employeeCode} /> },
          { header: "Paid days", body: (p) => `${p.workingDays - unpaidDaysOf(p)} / ${p.workingDays}` },
          { header: "Unpaid days", body: (p) => <span className={unpaidDaysOf(p) ? "text-[#D97706] font-semibold" : ""}>{unpaidDaysOf(p)}{p.unpaidDaysOverride != null && " *"}</span> },
          { header: "Gross", body: (p) => fmtMoney(p.grossPay, cur) },
          { header: "Unpaid deduction", body: (p) => (Number(p.absenceDeduction) ? fmtMoney(p.absenceDeduction, cur) : "—") },
          { header: "Tax", body: (p) => (Number(p.taxAmount) ? fmtMoney(p.taxAmount, cur) : "—") },
          { header: "Adjustments", body: (p) => ((p.adjustments ?? []).length ? `${p.adjustments.length} line(s)` : "—") },
          { header: "Net pay", body: (p) => <b>{fmtMoney(p.netPay, cur)}</b> },
        ]}
        emptyText="No payslips — set salaries first."
      />
      {run.status === "DRAFT" && <p className="text-[11px] text-[#8E8E9C]">Click a row to add bonuses or deductions, or override unpaid days. * = overridden.</p>}
    </div>
  );
}

function Runs({ onOpen }) {
  const { openModal } = useModal();
  const { data, loading, error, reload } = useQuery("/payroll/runs");
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Btn icon="material-symbols:add-rounded" label="New payroll run" onClick={() => openModal(NewRunModal, { sizeClass: "w-[95%] md:w-[420px]", onCreated: onOpen })} />
      </div>
      <ErrorNote error={error} onRetry={reload} />
      {!loading && data?.length === 0 ? (
        <Empty icon="mdi:cash-multiple" text="No payroll yet. Set salaries, then create a run for the month." />
      ) : (
        <Table
          rows={data}
          loading={loading}
          onRowClick={(r) => onOpen(r.id)}
          columns={[
            { header: "Period", body: (r) => <b>{periodLabel(r)}</b> },
            { header: "Status", body: (r) => <Badge tone={RUN_TONE[r.status]}>{r.status}</Badge> },
            { header: "Employees", body: (r) => r._count.payslips },
            { header: "Gross", body: (r) => fmtMoney(r.totalGross, r.currency) },
            { header: "Deductions", body: (r) => fmtMoney(r.totalDeductions, r.currency) },
            { header: "Net pay", body: (r) => <b>{fmtMoney(r.totalNet, r.currency)}</b> },
            { header: "Paid on", body: (r) => (r.paidAt ? fmtDate(r.paidAt) : "—") },
          ]}
        />
      )}
    </div>
  );
}

export default function Payroll() {
  const { can } = useAuth();
  const [params, setParams] = useSearchParams();
  const { data: settings } = useQuery("/admin/settings", { ttl: LOOKUP_TTL });
  const currency = settings?.["payroll.currency"] ?? "PKR";
  const runId = params.get("run");
  const tab = params.get("tab") ?? "runs";
  const tabs = [{ key: "runs", label: "Payroll Runs" }, ...(can("payroll.manage") ? [{ key: "salaries", label: "Salaries" }] : [])];

  return (
    <Page>
      <PageHeader title="Payroll" subtitle="Salaries, monthly payroll and payslips — visible only to payroll administrators" />
      <Panel>
        {runId ? (
          <RunDetail runId={runId} onBack={() => setParams({})} setParams={setParams} />
        ) : (
          <>
            <Tabs tabs={tabs} active={tab} onChange={(t) => setParams({ tab: t })} />
            <div className="pt-4">
              {tab === "runs" && <Runs onOpen={(id) => setParams({ run: id })} />}
              {tab === "salaries" && <Salaries currency={currency} />}
            </div>
          </>
        )}
      </Panel>
    </Page>
  );
}
