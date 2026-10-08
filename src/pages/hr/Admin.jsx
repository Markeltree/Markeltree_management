import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, download, qs } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import { Badge, Btn, Empty, ErrorNote, Field, IconBtn, Input, ModalForm, Page, PageHeader, Panel, SearchInput, Select, Table, Tabs, TextArea } from "@/components/hr/ui";
import { confirmAction, fmtDateTime, fullName, humanize, useQuery, LOOKUP_TTL, useDebounce } from "@/components/hr/utils";

// ── Departments & teams (ADMIN-04) ───────────────────────────────

function DepartmentModal({ dept, people, onSaved, closeModal }) {
  const [form, setForm] = useState({ name: dept?.name ?? "", description: dept?.description ?? "", headId: dept?.head?.id ?? "", isActive: dept?.isActive ?? true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const submit = async () => {
    setSaving(true);
    try {
      const body = { ...form, headId: form.headId || null, description: form.description || null };
      if (dept) await api.patch(`/org/departments/${dept.id}`, body);
      else await api.post("/org/departments", body);
      onSaved();
      closeModal();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };
  return (
    <ModalForm title={dept ? "Edit Department" : "New Department"} onSubmit={submit} onCancel={closeModal} saving={saving} error={error}>
      <Field label="Name" required>
        <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required maxLength={120} />
      </Field>
      <Field label="Head of department">
        <Select value={form.headId} onChange={(e) => setForm((f) => ({ ...f, headId: e.target.value }))} placeholder="— None —" options={people.map((p) => ({ value: p.id, label: fullName(p) }))} />
      </Field>
      <Field label="Description">
        <TextArea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} maxLength={500} rows={2} />
      </Field>
      {dept && (
        <label className="flex items-center gap-2 text-[13px] text-[#6F7C74]">
          <input type="checkbox" className="accent-[#09BF64]" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} /> Active
        </label>
      )}
    </ModalForm>
  );
}

function TeamModal({ team, departments, people, onSaved, closeModal }) {
  const [form, setForm] = useState({ name: team?.name ?? "", departmentId: team?.departmentId ?? departments[0]?.id ?? "", leadId: team?.leadId ?? "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const submit = async () => {
    setSaving(true);
    try {
      const body = { ...form, leadId: form.leadId || null };
      if (team) await api.patch(`/org/teams/${team.id}`, body);
      else await api.post("/org/teams", body);
      onSaved();
      closeModal();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };
  return (
    <ModalForm title={team ? "Edit Team" : "New Team"} onSubmit={submit} onCancel={closeModal} saving={saving} error={error}>
      <Field label="Name" required>
        <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required maxLength={120} />
      </Field>
      <Field label="Department" required>
        <Select value={form.departmentId} onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))} required options={departments.map((d) => ({ value: d.id, label: d.name }))} />
      </Field>
      <Field label="Team lead">
        <Select value={form.leadId} onChange={(e) => setForm((f) => ({ ...f, leadId: e.target.value }))} placeholder="— None —" options={people.map((p) => ({ value: p.id, label: fullName(p) }))} />
      </Field>
    </ModalForm>
  );
}

function Organization() {
  const { openModal } = useModal();
  const toast = useToast();
  const depts = useQuery("/org/departments", { ttl: LOOKUP_TTL });
  const teams = useQuery("/org/teams", { ttl: LOOKUP_TTL });
  const { data: people } = useQuery("/employees/options", { ttl: LOOKUP_TTL });
  const reload = () => (depts.reload(), teams.reload());
  const remove = async (kind, item) => {
    if (!(await confirmAction({ message: `Delete ${kind} "${item.name}"?`, acceptLabel: "Delete", danger: true }))) return;
    try {
      await api.delete(`/org/${kind === "department" ? "departments" : "teams"}/${item.id}`);
      reload();
    } catch (e) {
      toast.error(e);
    }
  };
  const p = people ?? [];
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-[14px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">Departments</h3>
          <Btn icon="material-symbols:add-rounded" label="Department" onClick={() => openModal(DepartmentModal, { sizeClass: "w-[95%] md:w-[480px]", people: p, onSaved: reload })} />
        </div>
        <ErrorNote error={depts.error} onRetry={depts.reload} />
        <Table
          rows={depts.data}
          loading={depts.loading}
          columns={[
            { header: "Department", body: (d) => <span className="font-semibold">{d.name}</span> },
            { header: "Head", body: (d) => (d.head ? fullName(d.head) : "—") },
            { header: "People", body: (d) => d._count.employees },
            { header: "Teams", body: (d) => d.teams.length },
            { header: "Status", body: (d) => <Badge value={d.isActive ? "ACTIVE" : "DEACTIVATED"}>{d.isActive ? "Active" : "Inactive"}</Badge> },
            {
              header: "",
              body: (d) => (
                <div className="flex gap-2">
                  <IconBtn icon="tabler:edit" title="Edit" onClick={() => openModal(DepartmentModal, { sizeClass: "w-[95%] md:w-[480px]", dept: d, people: p, onSaved: reload })} />
                  <IconBtn icon="mdi:trash-can-outline" tone="danger" title="Delete" onClick={() => remove("department", d)} />
                </div>
              ),
            },
          ]}
        />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-[14px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">Teams</h3>
          <Btn
            icon="material-symbols:add-rounded"
            label="Team"
            disabled={!depts.data?.length}
            onClick={() => openModal(TeamModal, { sizeClass: "w-[95%] md:w-[480px]", departments: depts.data, people: p, onSaved: reload })}
          />
        </div>
        <ErrorNote error={teams.error} onRetry={teams.reload} />
        <Table
          rows={teams.data}
          loading={teams.loading}
          columns={[
            { header: "Team", body: (t) => <span className="font-semibold">{t.name}</span> },
            { header: "Department", body: (t) => t.department.name },
            { header: "Lead", body: (t) => (t.lead ? fullName(t.lead) : "—") },
            { header: "Members", body: (t) => t._count.members },
            {
              header: "",
              body: (t) => (
                <div className="flex gap-2">
                  <IconBtn icon="tabler:edit" title="Edit" onClick={() => openModal(TeamModal, { sizeClass: "w-[95%] md:w-[480px]", team: t, departments: depts.data, people: p, onSaved: reload })} />
                  <IconBtn icon="mdi:trash-can-outline" tone="danger" title="Delete" onClick={() => remove("team", t)} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

// ── Users (ADMIN-01, AUTH-05) ────────────────────────────────────

function Users() {
  const toast = useToast();
  const navigate = useNavigate();
  const { user: me } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search.trim());
  const { data: roles } = useQuery("/admin/roles", { ttl: LOOKUP_TTL });
  const list = useQuery(`/admin/users${qs({ search: debouncedSearch, status, page, pageSize: 15 })}`);

  const update = async (u, body, verb) => {
    if (body.status && body.status !== "ACTIVE") {
      const ok = await confirmAction({ message: `${verb} ${u.email}? They will be signed out immediately.`, acceptLabel: verb, danger: true });
      if (!ok) return;
    }
    try {
      await api.patch(`/admin/users/${u.id}`, body);
      toast.success(`${u.email} updated.`);
      list.reload();
    } catch (e) {
      toast.error(e);
    }
  };
  const revoke = async (u) => {
    try {
      const r = await api.post(`/admin/users/${u.id}/revoke-sessions`);
      toast.success(`Signed out of ${r.revoked} session(s).`);
      list.reload();
    } catch (e) {
      toast.error(e);
    }
  };

  const columns = [
    { header: "User", body: (u) => <div><p className="font-semibold text-[#0F2418] dark:text-[#EFFBF3]">{u.employee ? fullName(u.employee) : "—"}</p><p className="text-[11px] text-[#8E8E9C]">{u.email}</p></div> },
    { header: "Department", body: (u) => u.employee?.department?.name ?? "—" },
    {
      header: "Role",
      body: (u) =>
        u.id === me.id ? (
          u.role.name
        ) : (
          <select
            value={u.role.id}
            onChange={(e) => update(u, { roleId: e.target.value })}
            className="text-[12px] border border-[#6F7C7440] rounded px-2 py-1 bg-white dark:bg-[#0D0D0D] dark:text-[#EFFBF3]"
          >
            {(roles ?? []).map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        ),
    },
    { header: "Status", body: (u) => <Badge value={u.status} /> },
    { header: "Sessions", body: (u) => u._count.sessions },
    { header: "Last login", body: (u) => (u.lastLoginAt ? fmtDateTime(u.lastLoginAt) : "Never") },
    {
      header: "",
      body: (u) =>
        u.id === me.id ? (
          <span className="text-[11px] text-[#8E8E9C]">You</span>
        ) : (
          <div className="flex gap-1.5">
            {u.employee && <IconBtn icon="lsicon:view-outline" tone="solid" title="View profile" onClick={() => navigate(`/employees/${u.employee.id}`)} />}
            {u.status === "ACTIVE" && <Btn size="sm" variant="outline" label="Suspend" onClick={() => update(u, { status: "SUSPENDED" }, "Suspend")} />}
            {["SUSPENDED", "DEACTIVATED"].includes(u.status) && <Btn size="sm" variant="success" label="Reactivate" onClick={() => update(u, { status: "ACTIVE" }, "Reactivate")} />}
            {u.status !== "DEACTIVATED" && u.status !== "INVITED" && <Btn size="sm" variant="danger" label="Deactivate" onClick={() => update(u, { status: "DEACTIVATED" }, "Deactivate")} />}
            {u._count.sessions > 0 && <IconBtn icon="mdi:logout-variant" tone="danger" title="Sign out all sessions" onClick={() => revoke(u)} />}
          </div>
        ),
    },
  ];
  return (
    <div className="space-y-3">
      <p className="text-[12px] text-[#6F7C74]">New users are created from <b>Employees → Add Employee</b>, which creates both the employee record and the login.</p>
      <div className="flex flex-col md:flex-row gap-2 md:justify-end">
        <SearchInput value={search} onChange={(v) => (setSearch(v), setPage(1))} placeholder="Search email or name…" />
        <Select className="md:w-[170px] h-9" value={status} onChange={(e) => (setStatus(e.target.value), setPage(1))} placeholder="All statuses" options={["ACTIVE", "INVITED", "SUSPENDED", "DEACTIVATED"].map((s) => ({ value: s, label: humanize(s) }))} />
      </div>
      <ErrorNote error={list.error} onRetry={list.reload} />
      <Table columns={columns} rows={list.data?.items} loading={list.loading} page={page} totalPages={list.data?.totalPages} onPageChange={setPage} />
    </div>
  );
}

// ── Roles & permissions (ADMIN-02/03) ────────────────────────────

const MODULE_LABELS = {
  employees: "Employees", org: "Organization", attendance: "Attendance", leave: "Leave", holidays: "Holidays", tasks: "Tasks",
  projects: "Projects", chat: "Chat", files: "Files", announcements: "Announcements", reports: "Reports", admin: "Administration",
};

function RoleEditor({ role, permissions, onSaved, closeModal }) {
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [selected, setSelected] = useState(new Set(role?.permissions ?? []));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const locked = role?.name === "Super Admin";
  const grouped = useMemo(() => {
    const g = {};
    for (const p of permissions) (g[p.module] ??= []).push(p);
    return g;
  }, [permissions]);
  const toggle = (key) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  const submit = async () => {
    setSaving(true);
    try {
      const body = { name, description: description || null, permissions: [...selected] };
      if (role) await api.patch(`/admin/roles/${role.id}`, role.isSystem ? { description: body.description, permissions: body.permissions } : body);
      else await api.post("/admin/roles", body);
      onSaved();
      closeModal();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };
  return (
    <ModalForm title={role ? `Edit role: ${role.name}` : "New Role"} subtitle={locked ? "Super Admin always has every permission." : "Users get exactly the permissions ticked here. Own-record access (profile, attendance, leave, assigned tasks) is always available."} onSubmit={submit} onCancel={closeModal} saving={saving} error={error}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Role name" required>
          <Input value={name} onChange={(e) => setName(e.target.value)} disabled={role?.isSystem} required minLength={2} maxLength={60} />
        </Field>
        <Field label="Description">
          <Input value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(grouped).map(([mod, perms]) => (
          <div key={mod} className="rounded-lg border border-[#6F7C7426] p-3">
            <h4 className="text-[12px] font-bold text-[#09BF64] mb-2">{MODULE_LABELS[mod] ?? mod}</h4>
            {perms.map((p) => (
              <label key={p.key} className="flex items-center gap-2 text-[12px] text-[#0F2418] dark:text-[#EFFBF3] py-0.5 cursor-pointer">
                <input type="checkbox" className="accent-[#09BF64]" disabled={locked} checked={locked || selected.has(p.key)} onChange={() => toggle(p.key)} />
                {humanize(p.action)}
                <span className="text-[10px] text-[#8E8E9C] ml-auto">{p.key}</span>
              </label>
            ))}
          </div>
        ))}
      </div>
    </ModalForm>
  );
}

function Roles() {
  const { openModal } = useModal();
  const toast = useToast();
  const roles = useQuery("/admin/roles", { ttl: LOOKUP_TTL });
  const { data: permissions } = useQuery("/admin/permissions", { ttl: LOOKUP_TTL });
  const edit = (role) => openModal(RoleEditor, { sizeClass: "w-[95%] md:w-[80%] lg:w-[70%]", role, permissions: permissions ?? [], onSaved: roles.reload });
  const remove = async (r) => {
    if (!(await confirmAction({ message: `Delete role "${r.name}"?`, acceptLabel: "Delete", danger: true }))) return;
    try {
      await api.delete(`/admin/roles/${r.id}`);
      roles.reload();
    } catch (e) {
      toast.error(e);
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Btn icon="material-symbols:add-rounded" label="New Role" disabled={!permissions} onClick={() => edit()} />
      </div>
      <ErrorNote error={roles.error} onRetry={roles.reload} />
      <Table
        rows={roles.data}
        loading={roles.loading}
        columns={[
          { header: "Role", body: (r) => <span className="font-semibold">{r.name}{r.isSystem && <span className="text-[10px] text-[#8E8E9C] ml-1">(system)</span>}</span> },
          { header: "Description", body: (r) => <span className="block max-w-[340px] truncate" title={r.description}>{r.description ?? "—"}</span> },
          { header: "Permissions", body: (r) => r.permissions?.length ?? "—" },
          { header: "Users", body: (r) => r._count.users },
          {
            header: "",
            body: (r) => (
              <div className="flex gap-2">
                <IconBtn icon="tabler:edit" title="Edit permissions" onClick={() => edit(r)} disabled={!permissions} />
                {!r.isSystem && <IconBtn icon="mdi:trash-can-outline" tone="danger" title="Delete" onClick={() => remove(r)} />}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

// ── Leave types (LEAVE-01) ───────────────────────────────────────

function LeaveTypeModal({ type, onSaved, closeModal }) {
  const [form, setForm] = useState({
    name: type?.name ?? "",
    code: type?.code ?? "",
    annualAllowance: type ? Number(type.annualAllowance) : 0,
    carryForwardMax: type ? Number(type.carryForwardMax) : 0,
    isPaid: type?.isPaid ?? true,
    requiresDocument: type?.requiresDocument ?? false,
    color: type?.color ?? "#09BF64",
    isActive: type?.isActive ?? true,
    policy: type?.policy ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, num) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : num ? Number(e.target.value) : e.target.value }));
  const submit = async () => {
    setSaving(true);
    try {
      const body = { ...form, policy: form.policy || null };
      if (type) await api.patch(`/leave/types/${type.id}`, body);
      else await api.post("/leave/types", body);
      onSaved();
      closeModal();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };
  return (
    <ModalForm title={type ? "Edit Leave Type" : "New Leave Type"} onSubmit={submit} onCancel={closeModal} saving={saving} error={error}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name" required><Input value={form.name} onChange={set("name")} required /></Field>
        <Field label="Code" required><Input value={form.code} onChange={set("code")} required maxLength={20} /></Field>
        <Field label="Annual allowance (days)" hint="0 = no fixed allowance (e.g. unpaid)"><Input type="number" step="0.5" min="0" value={form.annualAllowance} onChange={set("annualAllowance", true)} /></Field>
        <Field label="Max carry forward (days)"><Input type="number" step="0.5" min="0" value={form.carryForwardMax} onChange={set("carryForwardMax", true)} /></Field>
        <Field label="Colour"><Input type="color" value={form.color} onChange={set("color")} className="p-1" /></Field>
        <div className="flex flex-col gap-2 justify-end text-[13px] text-[#6F7C74]">
          <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#09BF64]" checked={form.isPaid} onChange={set("isPaid")} /> Paid</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#09BF64]" checked={form.requiresDocument} onChange={set("requiresDocument")} /> Requires document</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#09BF64]" checked={form.isActive} onChange={set("isActive")} /> Active</label>
        </div>
      </div>
      <Field label="Policy notes"><TextArea value={form.policy} onChange={set("policy")} maxLength={2000} rows={3} /></Field>
    </ModalForm>
  );
}

function LeaveTypes() {
  const { openModal } = useModal();
  const { data, loading, error, reload } = useQuery("/leave/types?all=1");
  const open = (type) => openModal(LeaveTypeModal, { sizeClass: "w-[95%] md:w-[560px]", type, onSaved: reload });
  return (
    <div className="space-y-3">
      <div className="flex justify-end"><Btn icon="material-symbols:add-rounded" label="New Leave Type" onClick={() => open()} /></div>
      <ErrorNote error={error} onRetry={reload} />
      <Table
        rows={data}
        loading={loading}
        columns={[
          { header: "Leave type", body: (t) => <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />{t.name}</span> },
          { header: "Code", field: "code" },
          { header: "Allowance", body: (t) => (Number(t.annualAllowance) ? `${Number(t.annualAllowance)} days` : "Unlimited") },
          { header: "Carry forward", body: (t) => `${Number(t.carryForwardMax)} days` },
          { header: "Paid", body: (t) => (t.isPaid ? "Yes" : "No") },
          { header: "Status", body: (t) => <Badge value={t.isActive ? "ACTIVE" : "DEACTIVATED"}>{t.isActive ? "Active" : "Inactive"}</Badge> },
          { header: "", body: (t) => <IconBtn icon="tabler:edit" title="Edit" onClick={() => open(t)} /> },
        ]}
      />
    </div>
  );
}

// ── Policies (ADMIN-05) ──────────────────────────────────────────

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Policies() {
  const { can } = useAuth();
  const toast = useToast();
  const { data, error, reload } = useQuery("/admin/settings");
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const editable = can("admin.settings");
  useEffect(() => {
    if (data) setForm({ ...data, "attendance.allowedIps": (data["attendance.allowedIps"] ?? []).join(", "), "files.allowedTypes": (data["files.allowedTypes"] ?? []).join(", ") });
  }, [data]);
  if (!form) return <ErrorNote error={error} onRetry={reload} />;
  const set = (k, num) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : num ? Number(e.target.value) : e.target.value }));
  const toggleDay = (d) =>
    setForm((f) => {
      const days = new Set(f["attendance.workingDays"]);
      days.has(d) ? days.delete(d) : days.add(d);
      return { ...f, "attendance.workingDays": [...days].sort() };
    });
  const save = async () => {
    setSaving(true);
    try {
      const list = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);
      await api.put("/admin/settings", { ...form, "attendance.allowedIps": list(form["attendance.allowedIps"]), "files.allowedTypes": list(form["files.allowedTypes"]).map((x) => x.toLowerCase()) });
      toast.success("Policies saved.");
      reload();
    } catch (e) {
      toast.error(e);
    } finally {
      setSaving(false);
    }
  };
  return (
    <fieldset disabled={!editable} className="space-y-5">
      {!editable && <p className="text-[12px] text-[#8E8E9C]">You can view policies but only administrators can change them.</p>}
      <section>
        <h3 className="text-[13px] font-bold text-[#09BF64] mb-2">Company</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Company name"><Input value={form["company.name"]} onChange={set("company.name")} /></Field>
          <Field label="Timezone" hint="IANA name, e.g. Asia/Karachi, Europe/London"><Input value={form["company.timezone"]} onChange={set("company.timezone")} /></Field>
        </div>
      </section>
      <section>
        <h3 className="text-[13px] font-bold text-[#09BF64] mb-2">Attendance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Field label="Work starts"><Input type="time" value={form["attendance.workStart"]} onChange={set("attendance.workStart")} /></Field>
          <Field label="Work ends"><Input type="time" value={form["attendance.workEnd"]} onChange={set("attendance.workEnd")} /></Field>
          <Field label="Late grace (minutes)"><Input type="number" min="0" value={form["attendance.graceMinutes"]} onChange={set("attendance.graceMinutes", true)} /></Field>
          <Field label="Early-leave grace (minutes)"><Input type="number" min="0" value={form["attendance.earlyLeaveGraceMinutes"]} onChange={set("attendance.earlyLeaveGraceMinutes", true)} /></Field>
        </div>
        <div className="mt-3">
          <span className="text-[12px] text-[#6F7C74]">Working days</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {DAYS.map((d, i) => (
              <button
                type="button"
                key={d}
                onClick={() => toggleDay(i)}
                className={`px-3 h-8 rounded-md text-[12px] font-semibold border ${form["attendance.workingDays"].includes(i) ? "bg-[#09BF64] text-white border-[#09BF64]" : "border-[#6F7C7440] text-[#6F7C74]"}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <Field className="mt-3" label="Allowed check-in IPs" hint="Comma-separated office IPs. Leave empty to allow check-in from anywhere.">
          <Input value={form["attendance.allowedIps"]} onChange={set("attendance.allowedIps")} placeholder="e.g. 203.0.113.10, 203.0.113.11" />
        </Field>
      </section>
      <section>
        <h3 className="text-[13px] font-bold text-[#09BF64] mb-2">Payroll</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Currency" hint="3-letter code, e.g. PKR, USD, AED"><Input value={form["payroll.currency"]} onChange={set("payroll.currency")} maxLength={3} /></Field>
          <Field label="Pay days basis" hint="Per-day pay for partial months, absences and unpaid leave" className="md:col-span-2">
            <Select
              value={form["payroll.dayBasis"]}
              onChange={set("payroll.dayBasis")}
              options={[
                { value: "FIXED_30", label: "Fixed 30 days — salary ÷ 30 every month" },
                { value: "CALENDAR", label: "Calendar days — salary ÷ days in the month (28–31)" },
                { value: "WORKING", label: "Working days — salary ÷ working days (excludes weekends & holidays)" },
              ]}
            />
          </Field>
        </div>
        <label className="flex items-start gap-2 text-[13px] text-[#6F7C74] mt-3">
          <input type="checkbox" className="accent-[#09BF64] mt-1" checked={form["payroll.deductAbsences"]} onChange={set("payroll.deductAbsences")} />
          <span>
            Deduct absences in payroll
            <span className="block text-[11px] text-[#8E8E9C]">Working days with no check-in are unpaid. Turn off until everyone uses attendance check-in, or untracked days will be deducted.</span>
          </span>
        </label>
      </section>
      <section>
        <h3 className="text-[13px] font-bold text-[#09BF64] mb-2">Files & collaboration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Max upload size (MB)"><Input type="number" min="1" value={form["files.maxSizeMb"]} onChange={set("files.maxSizeMb", true)} /></Field>
          <Field label="Allowed file types" className="md:col-span-2"><Input value={form["files.allowedTypes"]} onChange={set("files.allowedTypes")} /></Field>
        </div>
        <label className="flex items-center gap-2 text-[13px] text-[#6F7C74] mt-3">
          <input type="checkbox" className="accent-[#09BF64]" checked={form["chat.employeesCanCreateGroups"]} onChange={set("chat.employeesCanCreateGroups")} /> Employees can create group chats
        </label>
      </section>
      {editable && <Btn label="Save policies" loading={saving} onClick={save} />}
    </fieldset>
  );
}

// ── Audit log (ADMIN-06) ─────────────────────────────────────────

function AuditLog() {
  const toast = useToast();
  const [filters, setFilters] = useState({ action: "", entityType: "", from: "", to: "" });
  const [page, setPage] = useState(1);
  const debouncedAction = useDebounce(filters.action.trim());
  const query = { ...filters, action: debouncedAction, from: filters.from && new Date(filters.from).toISOString(), to: filters.to && new Date(`${filters.to}T23:59:59`).toISOString() };
  const { data, loading, error, reload } = useQuery(`/admin/audit-logs${qs({ ...query, page, pageSize: 20 })}`);
  const set = (k) => (e) => (setFilters((f) => ({ ...f, [k]: e.target.value })), setPage(1));
  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-2 md:justify-end">
        <Input className="md:w-[200px] h-9" placeholder="Action starts with…" value={filters.action} onChange={set("action")} />
        <Select className="md:w-[170px] h-9" value={filters.entityType} onChange={set("entityType")} placeholder="All entities" options={["User", "Employee", "Attendance", "LeaveRequest", "LeaveType", "Holiday", "Role", "Department", "Team", "Task", "Project", "Announcement", "Setting"].map((v) => ({ value: v, label: v }))} />
        <Input type="date" className="md:w-[160px] h-9" value={filters.from} onChange={set("from")} title="From" />
        <Input type="date" className="md:w-[160px] h-9" value={filters.to} onChange={set("to")} title="To" />
        <Btn variant="ghost" icon="material-symbols-light:download-rounded" label="CSV" onClick={() => download(`/admin/audit-logs${qs({ ...query, format: "csv" })}`, "audit-log.csv").catch(toast.error)} />
      </div>
      <ErrorNote error={error} onRetry={reload} />
      <Table
        rows={data?.items}
        loading={loading}
        page={page}
        totalPages={data?.totalPages}
        onPageChange={setPage}
        columns={[
          { header: "When", body: (l) => fmtDateTime(l.createdAt) },
          { header: "Actor", body: (l) => (l.actor ? (l.actor.employee ? fullName(l.actor.employee) : l.actor.email) : "System") },
          { header: "Action", body: (l) => <code className="text-[12px] text-[#09BF64]">{l.action}</code> },
          { header: "Entity", body: (l) => l.entityType },
          { header: "Details", body: (l) => <span className="block max-w-[380px] truncate text-[11px]" title={JSON.stringify(l.metadata ?? {}, null, 2)}>{l.metadata ? JSON.stringify(l.metadata) : "—"}</span> },
          { header: "IP", body: (l) => l.ip ?? "—" },
        ]}
      />
    </div>
  );
}

export default function Admin() {
  const { can } = useAuth();
  const [params, setParams] = useSearchParams();
  const tabs = [
    can("org.manage") && { key: "org", label: "Departments & Teams" },
    can("admin.users") && { key: "users", label: "Users" },
    can("admin.roles") && { key: "roles", label: "Roles & Permissions" },
    can("leave.manage_policy") && { key: "leave", label: "Leave Types" },
    can("admin.settings", "leave.manage_policy", "org.manage") && { key: "policies", label: "Policies" },
    can("admin.audit") && { key: "audit", label: "Audit Log" },
  ].filter(Boolean);
  const tab = tabs.some((t) => t.key === params.get("tab")) ? params.get("tab") : tabs[0]?.key;
  return (
    <Page>
      <PageHeader title="Administration" subtitle="Organization structure, access control, policies and audit" />
      <Panel>
        {tabs.length === 0 ? (
          <Empty icon="mdi:shield-lock-outline" text="You don't have access to any administration areas." />
        ) : (
          <>
            <Tabs tabs={tabs} active={tab} onChange={(t) => setParams({ tab: t })} />
            <div className="pt-4">
              {tab === "org" && <Organization />}
              {tab === "users" && <Users />}
              {tab === "roles" && <Roles />}
              {tab === "leave" && <LeaveTypes />}
              {tab === "policies" && <Policies />}
              {tab === "audit" && <AuditLog />}
            </div>
          </>
        )}
      </Panel>
    </Page>
  );
}
