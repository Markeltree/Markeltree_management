import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { download, qs } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Btn, ErrorNote, Input, Page, PageHeader, Panel, Select, Table, Tabs } from "@/components/hr/ui";
import { fullName, toInputDate, useQuery, LOOKUP_TTL } from "@/components/hr/utils";

function Filters({ children, onExport }) {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:justify-end">
      {children}
      <Btn variant="ghost" icon="material-symbols-light:download-rounded" label="Export CSV" onClick={onExport} />
    </div>
  );
}

function DepartmentSelect({ value, onChange }) {
  const { can } = useAuth();
  const { data } = useQuery(can("reports.view_all", "attendance.view_all", "leave.view_all") ? "/org/departments" : null, { ttl: LOOKUP_TTL });
  if (!data?.length) return null;
  return <Select className="md:w-[200px] h-9" value={value} onChange={(e) => onChange(e.target.value)} placeholder="All departments" options={data.map((d) => ({ value: d.id, label: d.name }))} />;
}

/** REP-01: monthly attendance per employee. */
function AttendanceReport() {
  const toast = useToast();
  const [month, setMonth] = useState(toInputDate().slice(0, 7));
  const [departmentId, setDepartmentId] = useState("");
  const { data, loading, error, reload } = useQuery(`/attendance/report${qs({ month, departmentId })}`);
  return (
    <div className="space-y-3">
      <Filters onExport={() => download(`/attendance/report${qs({ month, departmentId, format: "csv" })}`, `attendance-${month}.csv`).catch(toast.error)}>
        <Input type="month" className="md:w-[170px] h-9" value={month} onChange={(e) => setMonth(e.target.value)} />
        <DepartmentSelect value={departmentId} onChange={setDepartmentId} />
      </Filters>
      <ErrorNote error={error} onRetry={reload} />
      <Table
        rows={data?.rows}
        loading={loading}
        dataKey="employee.id"
        columns={[
          { header: "Employee", body: (r) => <span><b>{fullName(r.employee)}</b> <span className="text-[11px] text-[#8E8E9C]">{r.employee.employeeCode}</span></span> },
          { header: "Department", body: (r) => r.employee.department?.name ?? "—" },
          { header: "Working days", field: "workingDays" },
          { header: "Present", field: "present" },
          { header: "Late", body: (r) => <span className={r.late ? "text-[#D97706] font-semibold" : ""}>{r.late}</span> },
          { header: "Early leave", field: "earlyDeparture" },
          { header: "Absent", body: (r) => <span className={r.absent ? "text-[#E5483A] font-semibold" : ""}>{r.absent}</span> },
          { header: "On leave", field: "onLeave" },
          { header: "Hours", body: (r) => (r.workedMinutes / 60).toFixed(1) },
        ]}
      />
    </div>
  );
}

/** REP-02: leave utilisation and balances for a year. */
function LeaveReport() {
  const toast = useToast();
  const [year, setYear] = useState(new Date().getFullYear());
  const [departmentId, setDepartmentId] = useState("");
  const { data, loading, error, reload } = useQuery(`/leave/report${qs({ year, departmentId })}`);
  const types = data?.rows[0]?.balances.map((b) => b.leaveType) ?? [];
  return (
    <div className="space-y-3">
      <Filters onExport={() => download(`/leave/report${qs({ year, departmentId, format: "csv" })}`, `leave-${year}.csv`).catch(toast.error)}>
        <Select className="w-[120px] h-9" value={year} onChange={(e) => setYear(Number(e.target.value))} options={[-1, 0, 1].map((o) => ({ value: new Date().getFullYear() + o, label: String(new Date().getFullYear() + o) }))} />
        <DepartmentSelect value={departmentId} onChange={setDepartmentId} />
      </Filters>
      <ErrorNote error={error} onRetry={reload} />
      <Table
        rows={data?.rows}
        loading={loading}
        dataKey="employee.id"
        columns={[
          { header: "Employee", body: (r) => <b>{fullName(r.employee)}</b> },
          { header: "Department", body: (r) => r.employee.department?.name ?? "—" },
          ...types.map((t) => ({
            header: t.name,
            body: (r) => {
              const b = r.balances.find((x) => x.leaveType.id === t.id);
              return b ? <span title={`${b.used} used, ${b.pending} pending`}>{b.used} used / {b.unlimited ? "∞" : b.available} left</span> : "—";
            },
          })),
        ]}
      />
    </div>
  );
}

/** REP-03: task completion, overdue and workload. */
function TaskReport() {
  const toast = useToast();
  const { data, loading, error, reload } = useQuery("/tasks/reports/workload");
  return (
    <div className="space-y-3">
      <Filters onExport={() => download("/tasks/reports/workload?format=csv", "task-workload.csv").catch(toast.error)} />
      <ErrorNote error={error} onRetry={reload} />
      <Table
        rows={data?.rows}
        loading={loading}
        dataKey="employee.id"
        columns={[
          { header: "Employee", body: (r) => <b>{fullName(r.employee)}</b> },
          { header: "Total", field: "total" },
          { header: "Open", field: "open" },
          { header: "Done", field: "done" },
          { header: "Completion", body: (r) => `${r.total ? Math.round((r.done / r.total) * 100) : 0}%` },
          { header: "Overdue", body: (r) => <span className={r.overdue ? "text-[#E5483A] font-semibold" : ""}>{r.overdue}</span> },
          { header: "Completed late", field: "completedLate" },
        ]}
        emptyText="No assigned tasks in your scope."
      />
    </div>
  );
}

export default function Reports() {
  const { can } = useAuth();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const tabs = [
    can("attendance.view_team", "attendance.view_all", "reports.view_all", "reports.view_team") && { key: "attendance", label: "Attendance" },
    can("leave.view_all", "reports.view_all", "reports.view_team", "leave.approve_team") && { key: "leave", label: "Leave" },
    can("reports.view_team", "reports.view_all", "tasks.view_team", "tasks.view_all") && { key: "tasks", label: "Tasks & Workload" },
  ].filter(Boolean);
  const tab = tabs.some((t) => t.key === params.get("tab")) ? params.get("tab") : tabs[0]?.key;
  return (
    <Page>
      <PageHeader
        title="Reports"
        subtitle="Attendance, leave and workload reports for your team or company"
        actions={can("employees.export") && <Btn variant="ghost" icon="material-symbols-light:download-rounded" label="Employee directory CSV" onClick={() => download("/employees/export", "employees.csv").catch(toast.error)} />}
      />
      <Panel>
        <Tabs tabs={tabs} active={tab} onChange={(t) => setParams({ tab: t })} />
        <div className="pt-4">
          {tab === "attendance" && <AttendanceReport />}
          {tab === "leave" && <LeaveReport />}
          {tab === "tasks" && <TaskReport />}
        </div>
      </Panel>
    </Page>
  );
}
