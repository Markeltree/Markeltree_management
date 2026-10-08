import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { download, qs } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import EmployeeFormModal from "@/components/hr/EmployeeFormModal";
import { Badge, Btn, ErrorNote, Page, PageHeader, Panel, PersonCell, SearchInput, Select, Table, Tabs } from "@/components/hr/ui";
import { fmtDate, fullName, useDebounce, useQuery, LOOKUP_TTL } from "@/components/hr/utils";

const STATUS_OPTIONS = ["PROBATION", "ACTIVE", "ON_LEAVE", "NOTICE_PERIOD"].map((v) => ({ value: v, label: v.replace("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) }));

function OrgChartNode({ node, onOpen }) {
  return (
    <li className="ml-4 border-l border-[#6F7C7440] pl-3 py-1">
      <button onClick={() => onOpen(node.id)} className="text-left">
        <span className="text-[13px] font-semibold text-[#0F2418] dark:text-[#EFFBF3]">{fullName(node)}</span>
        <span className="text-[11px] text-[#8E8E9C]"> · {node.designation}{node.department ? ` · ${node.department.name}` : ""}</span>
      </button>
      {node.reports.length > 0 && (
        <ul>
          {node.reports.map((r) => (
            <OrgChartNode key={r.id} node={r} onOpen={onOpen} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Employees() {
  const navigate = useNavigate();
  const { can } = useAuth();
  const { openModal } = useModal();
  const toast = useToast();
  const [tab, setTab] = useState("directory");
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search.trim());
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [debounced, departmentId, status, tab]);

  const { data: departments } = useQuery("/org/departments", { ttl: LOOKUP_TTL });
  const list = useQuery(tab === "org" ? null : `/employees${qs({ search: debounced, departmentId, status, page, pageSize: 15, scope: tab === "team" ? "team" : undefined })}`);
  const chart = useQuery(tab === "org" ? "/employees/org-chart" : null);

  const addEmployee = () => openModal(EmployeeFormModal, { sizeClass: "w-[95%] md:w-[70%] lg:w-[60%]", mode: "create", onSaved: (e) => (list.reload(), navigate(`/employees/${e.id}`)) });

  const columns = [
    { header: "Employee", body: (e) => <PersonCell person={e} sub={e.user?.email} /> },
    { header: "Code", field: "employeeCode" },
    { header: "Designation", field: "designation" },
    { header: "Department", body: (e) => e.department?.name ?? "—" },
    { header: "Manager", body: (e) => (e.manager ? fullName(e.manager) : "—") },
    { header: "Phone", body: (e) => e.phone ?? "—" },
    { header: "Joined", body: (e) => (e.joiningDate ? fmtDate(e.joiningDate) : "—") },
    { header: "Status", body: (e) => (e.user?.status === "INVITED" ? <Badge value="INVITED">Invited</Badge> : <Badge value={e.employmentStatus} />) },
  ];

  const tabs = [
    { key: "directory", label: "Directory" },
    ...(can("employees.view_team", "employees.view_all") ? [{ key: "team", label: "My Team" }] : []),
    { key: "org", label: "Organization Chart" },
  ];

  return (
    <Page>
      <PageHeader
        title="Employees"
        subtitle="Employee directory, team members and reporting structure"
        actions={
          <>
            {can("employees.export") && (
              <Btn variant="ghost" icon="material-symbols-light:download-rounded" label="Export CSV" onClick={() => download("/employees/export", "employees.csv").catch(toast.error)} />
            )}
            {can("employees.create") && <Btn icon="material-symbols:add-rounded" label="Add Employee" onClick={addEmployee} />}
          </>
        }
      />
      <Panel>
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        {tab !== "org" ? (
          <div className="pt-4 space-y-3">
            <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-end">
              <SearchInput value={search} onChange={setSearch} placeholder="Search name, code, email…" />
              <Select className="md:w-[200px] h-9" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} placeholder="All departments" options={(departments ?? []).map((d) => ({ value: d.id, label: d.name }))} />
              <Select
                className="md:w-[170px] h-9"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Current employees"
                options={[...STATUS_OPTIONS, ...(can("employees.view_all") ? [{ value: "EXITED", label: "Exited" }] : [])]}
              />
            </div>
            <ErrorNote error={list.error} onRetry={list.reload} />
            <Table
              columns={columns}
              rows={list.data?.items}
              loading={list.loading}
              page={page}
              totalPages={list.data?.totalPages}
              onPageChange={setPage}
              onRowClick={(e) => navigate(`/employees/${e.id}`)}
              emptyText={tab === "team" ? "No one reports to you yet." : "No employees match your filters."}
            />
            {list.data && <p className="text-[12px] text-[#8E8E9C]">{list.data.total} employee(s)</p>}
          </div>
        ) : (
          <div className="pt-4">
            <ErrorNote error={chart.error} onRetry={chart.reload} />
            {chart.loading ? (
              <p className="text-[13px] text-[#8E8E9C]">Loading…</p>
            ) : (
              <ul className="-ml-4">
                {(chart.data ?? []).map((n) => (
                  <OrgChartNode key={n.id} node={n} onOpen={(id) => navigate(`/employees/${id}`)} />
                ))}
              </ul>
            )}
          </div>
        )}
      </Panel>
    </Page>
  );
}
