import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Field, Input, ModalForm, Select, TextArea } from "./ui";
import { toInputDate, fullName } from "./utils";

const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"].map((v) => ({ value: v, label: v.replace("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) }));
const EMPLOYMENT_STATUSES = ["PROBATION", "ACTIVE", "ON_LEAVE", "NOTICE_PERIOD"].map((v) => ({ value: v, label: v.replace("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) }));
const SELF_FIELDS = ["phone", "personalEmail", "address", "emergencyContactName", "emergencyContactPhone", "emergencyContactRelation"];

const d10 = (v) => (v ? String(v).slice(0, 10) : "");

/**
 * Create / edit an employee. `mode`: "create" | "edit" (HR) | "self" (own permitted fields, EMP-07).
 */
export default function EmployeeFormModal({ mode = "create", employee, onSaved, closeModal }) {
  const { can } = useAuth();
  const toast = useToast();
  const isSelf = mode === "self";
  const canRole = can("admin.users", "admin.roles");
  const showSensitive = isSelf || can("employees.view_sensitive");

  const [lookups, setLookups] = useState({ departments: [], teams: [], roles: [], people: [] });
  const [form, setForm] = useState(() => ({
    firstName: employee?.firstName ?? "",
    lastName: employee?.lastName ?? "",
    email: employee?.user?.email ?? "",
    employeeCode: employee?.employeeCode ?? "",
    designation: employee?.designation ?? "",
    joiningDate: d10(employee?.joiningDate) || toInputDate(),
    employmentType: employee?.employmentType ?? "FULL_TIME",
    employmentStatus: employee?.employmentStatus ?? "ACTIVE",
    departmentId: employee?.department?.id ?? "",
    teamId: employee?.team?.id ?? "",
    managerId: employee?.manager?.id ?? "",
    roleId: employee?.user?.role?.id ?? "",
    phone: employee?.phone ?? "",
    password: "",
    dateOfBirth: d10(employee?.dateOfBirth),
    gender: employee?.gender ?? "",
    personalEmail: employee?.personalEmail ?? "",
    address: employee?.address ?? "",
    emergencyContactName: employee?.emergencyContactName ?? "",
    emergencyContactPhone: employee?.emergencyContactPhone ?? "",
    emergencyContactRelation: employee?.emergencyContactRelation ?? "",
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isSelf) return;
    Promise.all([api.get("/org/departments"), api.get("/org/teams"), api.get("/admin/roles"), api.get("/employees/options")])
      .then(([departments, teams, roles, people]) => {
        setLookups({ departments, teams, roles, people });
        if (mode === "create" && !form.roleId) {
          const emp = roles.find((r) => r.name === "Employee");
          if (emp) setForm((f) => ({ ...f, roleId: emp.id }));
        }
      })
      .catch(setError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value, ...(k === "departmentId" && { teamId: "" }) }));
  const teams = useMemo(() => lookups.teams.filter((t) => !form.departmentId || t.departmentId === form.departmentId), [lookups.teams, form.departmentId]);
  const managers = lookups.people.filter((p) => p.id !== employee?.id);

  const submit = async () => {
    setSaving(true);
    setError(null);
    const nul = (v) => (v === "" ? null : v);
    try {
      let payload;
      if (isSelf) {
        payload = Object.fromEntries(SELF_FIELDS.map((k) => [k, nul(form[k])]));
      } else {
        payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          designation: form.designation,
          joiningDate: form.joiningDate,
          employmentType: form.employmentType,
          departmentId: nul(form.departmentId),
          teamId: nul(form.teamId),
          managerId: nul(form.managerId),
          phone: nul(form.phone),
          ...(form.employeeCode && { employeeCode: form.employeeCode }),
          ...(canRole && form.roleId && { roleId: form.roleId }),
          ...(showSensitive && {
            dateOfBirth: nul(form.dateOfBirth),
            gender: nul(form.gender),
            personalEmail: nul(form.personalEmail),
            address: nul(form.address),
            emergencyContactName: nul(form.emergencyContactName),
            emergencyContactPhone: nul(form.emergencyContactPhone),
            emergencyContactRelation: nul(form.emergencyContactRelation),
          }),
        };
        if (mode === "create") {
          payload.email = form.email;
          if (form.password) payload.password = form.password;
          if (!canRole) delete payload.roleId;
        } else {
          payload.employmentStatus = form.employmentStatus;
        }
      }
      const saved = mode === "create" ? await api.post("/employees", payload) : await api.patch(`/employees/${employee.id}`, payload);
      toast.success(
        mode === "create"
          ? form.password
            ? `${fullName(saved)} can now log in.`
            : `${fullName(saved)} was invited. They activate their account with "Forgot password".`
          : "Profile updated."
      );
      onSaved?.(saved);
      closeModal();
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  const opt = (list, label) => list.map((x) => ({ value: x.id, label: label(x) }));

  return (
    <ModalForm
      title={mode === "create" ? "Add Employee" : isSelf ? "Edit My Details" : `Edit ${fullName(employee)}`}
      subtitle={mode === "create" ? "Creates the employee record and their login account." : isSelf ? "You can update your contact and emergency details." : undefined}
      onSubmit={submit}
      onCancel={closeModal}
      saving={saving}
      error={error}
      submitLabel={mode === "create" ? "Create employee" : "Save changes"}
    >
      {!isSelf && (
        <>
          <h3 className="text-[13px] font-bold text-[#09BF64]">Employment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="First name" required>
              <Input value={form.firstName} onChange={set("firstName")} required maxLength={100} />
            </Field>
            <Field label="Last name" required>
              <Input value={form.lastName} onChange={set("lastName")} required maxLength={100} />
            </Field>
            {mode === "create" && (
              <Field label="Work email" required hint="Used to sign in">
                <Input type="email" value={form.email} onChange={set("email")} required />
              </Field>
            )}
            <Field label="Employee code" hint={mode === "create" ? "Leave blank to auto-generate" : undefined}>
              <Input value={form.employeeCode} onChange={set("employeeCode")} maxLength={30} />
            </Field>
            <Field label="Designation" required>
              <Input value={form.designation} onChange={set("designation")} required maxLength={120} />
            </Field>
            <Field label="Joining date" required>
              <Input type="date" value={form.joiningDate} onChange={set("joiningDate")} required />
            </Field>
            <Field label="Employment type">
              <Select value={form.employmentType} onChange={set("employmentType")} options={EMPLOYMENT_TYPES} />
            </Field>
            {mode === "edit" && (
              <Field label="Employment status" hint="Use 'Offboard' on the profile to record an exit">
                <Select value={form.employmentStatus} onChange={set("employmentStatus")} options={EMPLOYMENT_STATUSES} />
              </Field>
            )}
            <Field label="Department">
              <Select value={form.departmentId} onChange={set("departmentId")} placeholder="— None —" options={opt(lookups.departments, (d) => d.name)} />
            </Field>
            <Field label="Team">
              <Select value={form.teamId} onChange={set("teamId")} placeholder="— None —" options={opt(teams, (t) => t.name)} />
            </Field>
            <Field label="Reports to (manager)">
              <Select value={form.managerId} onChange={set("managerId")} placeholder="— None —" options={opt(managers, (p) => `${fullName(p)} · ${p.designation}`)} />
            </Field>
            {canRole && (
              <Field label="System role" hint="Controls what this person can access">
                <Select value={form.roleId} onChange={set("roleId")} options={opt(lookups.roles, (r) => r.name)} />
              </Field>
            )}
            {mode === "create" && (
              <Field label="Initial password" hint="Optional. If blank, the employee is invited and sets their own password.">
                <Input type="password" value={form.password} onChange={set("password")} autoComplete="new-password" />
              </Field>
            )}
          </div>
        </>
      )}

      <h3 className="text-[13px] font-bold text-[#09BF64] pt-2">Contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Phone">
          <Input value={form.phone} onChange={set("phone")} maxLength={30} />
        </Field>
        {showSensitive && (
          <Field label="Personal email">
            <Input type="email" value={form.personalEmail} onChange={set("personalEmail")} />
          </Field>
        )}
        {showSensitive && !isSelf && (
          <>
            <Field label="Date of birth">
              <Input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
            </Field>
            <Field label="Gender">
              <Input value={form.gender} onChange={set("gender")} maxLength={30} />
            </Field>
          </>
        )}
        {showSensitive && (
          <Field label="Address" className="md:col-span-2">
            <TextArea value={form.address} onChange={set("address")} maxLength={500} rows={2} />
          </Field>
        )}
      </div>

      {showSensitive && (
        <>
          <h3 className="text-[13px] font-bold text-[#09BF64] pt-2">Emergency contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Name">
              <Input value={form.emergencyContactName} onChange={set("emergencyContactName")} />
            </Field>
            <Field label="Phone">
              <Input value={form.emergencyContactPhone} onChange={set("emergencyContactPhone")} maxLength={30} />
            </Field>
            <Field label="Relationship">
              <Input value={form.emergencyContactRelation} onChange={set("emergencyContactRelation")} maxLength={60} />
            </Field>
          </div>
        </>
      )}
    </ModalForm>
  );
}
