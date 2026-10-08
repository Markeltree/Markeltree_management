// Public, embeddable product demo (/demo). Uses the real HR UI components with in-memory sample data:
// no login, no API calls, and nothing a visitor does is saved.
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import Logo from "@/components/Logo";
import { Avatar, Badge, Btn, Empty, Field, Input, Page, PageHeader, Panel, PersonCell, SearchInput, Select, StatCard, Table, Tabs } from "@/components/hr/ui";
import { fmtDate, fullName, humanize, MONTHS } from "@/components/hr/utils";
import { downloadPayslipPdf } from "@/components/hr/payslipPdf";
import * as D from "./demoData";

/* ───────────────────────── Shell ───────────────────────── */

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "pi-home" },
  { key: "chat", label: "Chat", icon: "pi-comments" },
  { key: "employees", label: "Employees", icon: "pi-users" },
  { key: "attendance", label: "Attendance", icon: "pi-clock" },
  { key: "leave", label: "Leave", icon: "pi-calendar-minus" },
  { key: "tasks", label: "Tasks", icon: "pi-check-square" },
  { key: "announcements", label: "Announcements", icon: "pi-megaphone" },
  { separator: true },
  { key: "reports", label: "Reports", icon: "pi-chart-line" },
  { key: "payroll", label: "Payroll", icon: "pi-wallet" },
  { key: "admin", label: "Administration", icon: "pi-shield" },
];

function Sidebar({ screen, setScreen, allowed, unread }) {
  const items = NAV.filter((n) => n.separator || allowed.includes(n.key));
  return (
    <nav className="w-[64px] lg:w-[220px] shrink-0 bg-white dark:bg-black border-r border-[#6F7C7414] overflow-y-auto scrollbar-hide p-2.5 lg:p-3">
      {items.map((n, i) =>
        n.separator ? (
          <hr key={`s${i}`} className="border-t border-gray-200 dark:border-gray-700 my-2" />
        ) : (
          <button
            key={n.key}
            type="button"
            title={n.label}
            aria-label={n.key === "chat" && unread > 0 ? `${n.label}, ${unread} unread` : n.label}
            onClick={() => setScreen(n.key)}
            className={`relative w-full flex items-center justify-center lg:justify-start gap-2.5 mb-1.5 p-3 rounded-lg text-[12px] font-medium transition-colors ${
              screen === n.key
                ? "bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-black"
                : "text-[#6F7C74] dark:text-[#8E8E9C] hover:bg-[#09BF641A] dark:hover:bg-[#81D95940]"
            }`}
          >
            <i aria-hidden="true" className={`pi ${n.icon} text-lg`} />
            <span className="hidden lg:inline">{n.label}</span>
            {n.key === "chat" && unread > 0 && (
              <span
                className={`absolute top-1.5 right-1.5 lg:static lg:ml-auto text-[10px] font-bold px-1.5 rounded-full ${
                  screen === n.key ? "bg-white text-[#09BF64]" : "bg-[#09BF64] text-white"
                }`}
              >
                {unread}
              </span>
            )}
          </button>
        ),
      )}
    </nav>
  );
}

function Topbar({ role, setRole, dark, toggleDark }) {
  const r = D.ROLES.find((x) => x.key === role);
  return (
    <header className="h-[60px] shrink-0 flex items-center justify-between gap-3 px-3 sm:px-5 bg-white dark:bg-black border-b border-[#6F7C7414]">
      <div className="flex items-center gap-3 min-w-0">
        <Logo className="h-6 sm:h-7 w-auto" />
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#09BF641A] text-[#078A49] dark:text-[#81D959]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#09BF64] animate-pulse" /> Live demo · sample data
        </span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <label className="flex items-center gap-2 text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]">
          <span className="hidden md:inline">View as</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-label="Switch demo role"
            className="h-9 pl-3 pr-8 rounded-lg border border-[#09BF64] text-[12px] font-semibold text-[#09BF64] bg-white dark:bg-[#0D0D0D] focus:outline-none"
          >
            {D.ROLES.map((x) => (
              <option key={x.key} value={x.key}>
                {x.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={toggleDark}
          aria-label="Toggle dark mode"
          className="w-9 h-9 grid place-items-center rounded-lg text-[#6F7C74] dark:text-[#A9C2B3] hover:bg-[#09BF641A]"
        >
          <Icon icon={dark ? "mdi:white-balance-sunny" : "mdi:weather-night"} width={19} />
        </button>
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#6F7C7426]">
          <Avatar person={r.person} size={32} />
          <div className="hidden xl:block leading-tight">
            <p className="text-[12px] font-semibold text-[#0F2418] dark:text-[#EFFBF3]">{fullName(r.person)}</p>
            <p className="text-[11px] text-[#8E8E9C]">{r.label}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function Toast({ text }) {
  if (!text) return null;
  return (
    <div role="status" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0D0D0D] text-white text-[13px] shadow-xl">
      <Icon icon="mdi:check-circle" className="text-[#81D959]" width={18} /> {text}
    </div>
  );
}

/* ───────────────────────── Shared pieces ───────────────────────── */

const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function CheckInCard({ att, setAtt, toast }) {
  const state = att.out ? "done" : att.in ? "in" : "none";
  return (
    <Panel>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#09BF641A] text-[#09BF64]">
            <Icon icon="mdi:clock-check-outline" width={26} />
          </div>
          <div>
            <p className="text-[15px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">
              {state === "none" ? "You haven't checked in yet" : state === "in" ? `Checked in at ${att.in}` : `Worked ${att.in} – ${att.out}`}
            </p>
            <p className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]">Work hours 09:00 – 18:00 · 15 min grace period</p>
          </div>
        </div>
        {state === "none" && (
          <Btn
            icon="mdi:login"
            label="Check in"
            onClick={() => {
              setAtt({ in: nowTime() });
              toast("Checked in. Your attendance is recorded");
            }}
          />
        )}
        {state === "in" && (
          <Btn
            icon="mdi:logout"
            variant="outline"
            label="Check out"
            onClick={() => {
              setAtt((a) => ({ ...a, out: nowTime() }));
              toast("Checked out. Have a good evening!");
            }}
          />
        )}
        {state === "done" && <Badge value="PRESENT" />}
      </div>
    </Panel>
  );
}

const TASK_COLORS = { TODO: "#A9C2B3", IN_PROGRESS: "#0EA5E9", REVIEW: "#F59E0B", DONE: "#10B981" };

function TaskBar({ tasks }) {
  const total = tasks.length || 1;
  return (
    <div>
      <div className="flex h-2.5 rounded-full overflow-hidden bg-[#F4F6F9] dark:bg-gray-800">
        {D.TASK_COLUMNS.map((k) => (
          <div key={k} style={{ width: `${(tasks.filter((t) => t.status === k).length / total) * 100}%`, background: TASK_COLORS[k] }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]">
        {D.TASK_COLUMNS.map((k) => (
          <span key={k} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: TASK_COLORS[k] }} />
            {humanize(k)} <b className="text-[#0F2418] dark:text-[#EFFBF3]">{tasks.filter((t) => t.status === k).length}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

const link = "text-[12px] text-[#09BF64] font-semibold";

/* ───────────────────────── Screens ───────────────────────── */

function Dashboard({ role, s, go }) {
  const me = D.ROLES.find((r) => r.key === role).person;
  const pending = s.leave.filter((l) => l.status === "PENDING").length;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const present = D.TEAM_TODAY.filter(([, , st]) => st !== "ABSENT" && st !== "ON_LEAVE").length;
  // An employee only sees tasks assigned to them; managers and HR see the team board.
  const myTasks = role === "EMPLOYEE" ? s.tasks.filter((t) => t.assignee.id === me.id) : s.tasks;
  return (
    <Page>
      <PageHeader title="Dashboard" subtitle={`${greet}, ${me.firstName}`} />
      {role !== "ADMIN" && <CheckInCard att={s.att} setAtt={s.setAtt} toast={s.toast} />}

      {role !== "ADMIN" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Panel title="Leave Balance" subtitle={`Year ${new Date().getFullYear()}`} actions={<button className={link} onClick={() => go("leave")}>Request leave →</button>}>
            <div className="grid grid-cols-2 gap-3">
              {D.LEAVE_BALANCES.map((b) => (
                <div key={b.name} className="rounded-lg border border-[#6F7C7426] p-3">
                  <p className="text-[11px] text-[#8E8E9C] truncate">{b.name}</p>
                  <p className="text-[18px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">{b.unlimited ? "∞" : b.available}</p>
                  <p className="text-[11px] text-[#8E8E9C]">
                    {b.used} used{b.pending ? ` · ${b.pending} pending` : ""}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="My Tasks" actions={<button className={link} onClick={() => go("tasks")}>Open tasks →</button>}>
            <TaskBar tasks={myTasks} />
            <h3 className="text-[12px] font-semibold text-[#6F7C74] mt-4 mb-2">Due in the next 7 days</h3>
            <ul className="space-y-2">
              {myTasks
                .filter((t) => t.status !== "DONE")
                .slice(0, 4)
                .map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-2 text-[13px]">
                    <span className="truncate text-[#0F2418] dark:text-[#EFFBF3]">{t.title}</span>
                    <span className="flex items-center gap-2 shrink-0">
                      <Badge value={t.priority} />
                      <span className="text-[11px] text-[#8E8E9C]">{fmtDate(t.due)}</span>
                    </span>
                  </li>
                ))}
            </ul>
          </Panel>
          <Panel title="Announcements" actions={<button className={link} onClick={() => go("announcements")}>View all →</button>}>
            <ul className="space-y-3">
              {D.ANNOUNCEMENTS.map((a) => (
                <li key={a.id}>
                  <p className="text-[13px] font-semibold text-[#0F2418] dark:text-[#EFFBF3] flex items-center gap-1">
                    {a.pinned && <Icon icon="mdi:pin" className="text-[#09BF64]" />}
                    {a.title}
                  </p>
                  <p className="text-[11px] text-[#8E8E9C]">
                    {fmtDate(a.at)}
                    {a.ack && " · acknowledgement required"}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}

      {role === "MANAGER" && (
        <Panel title="My Team" subtitle="8 people report to you">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Present today" value={present} icon="mdi:account-check-outline" tone="success" onClick={() => go("attendance")} />
            <StatCard label="On leave today" value={1} icon="mdi:beach" tone="info" />
            <StatCard label="Not checked in" value={1} icon="mdi:account-clock-outline" tone="warning" onClick={() => go("attendance")} />
            <StatCard label="Pending leave approvals" value={pending} icon="mdi:calendar-clock" tone="primary" onClick={() => go("leave")} />
          </div>
          <h3 className="text-[12px] font-semibold text-[#6F7C74] mt-4 mb-2">Team tasks</h3>
          <TaskBar tasks={s.tasks} />
        </Panel>
      )}

      {(role === "HR" || role === "ADMIN") && (
        <Panel title="Workforce" subtitle="Company-wide HR overview">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <StatCard label="Headcount" value={D.EMPLOYEES.length} icon="mdi:account-group-outline" onClick={() => go("employees")} />
            <StatCard label="Present today" value={11} icon="mdi:account-check-outline" tone="success" onClick={() => go("attendance")} />
            <StatCard label="Late today" value={2} icon="mdi:clock-alert-outline" tone="warning" />
            <StatCard label="On leave today" value={1} icon="mdi:beach" tone="info" />
            <StatCard label="Pending leave" value={pending} icon="mdi:calendar-clock" tone="primary" onClick={() => go("leave")} />
            <StatCard label="Leavers this month" value={1} icon="mdi:account-arrow-right-outline" tone="neutral" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="text-[12px] font-semibold text-[#6F7C74] mb-2">Headcount by department</h3>
              <ul className="space-y-2">
                {D.DEPARTMENTS.map((dep) => [dep, D.EMPLOYEES.filter((e) => e.department === dep).length])
                  .sort((a, b) => b[1] - a[1])
                  .map(([dep, n]) => (
                    <li key={dep} className="text-[12px]">
                      <div className="flex justify-between text-[#0F2418] dark:text-[#EFFBF3]">
                        <span>{dep}</span>
                        <b>{n}</b>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#F4F6F9] dark:bg-gray-800 mt-1">
                        <div className="h-1.5 rounded-full bg-[#09BF64]" style={{ width: `${(n / D.EMPLOYEES.length) * 100}%` }} />
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[12px] font-semibold text-[#6F7C74] mb-2">Joined recently</h3>
              <ul className="space-y-2">
                {D.EMPLOYEES.filter((e) => e.status === "PROBATION").map((e) => (
                  <li key={e.id} className="flex justify-between text-[13px]">
                    <span className="text-[#0F2418] dark:text-[#EFFBF3]">
                      {fullName(e)} <span className="text-[#8E8E9C]">· {e.designation}</span>
                    </span>
                    <span className="text-[11px] text-[#8E8E9C]">{fmtDate(e.joiningDate)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Panel>
      )}

      {role === "ADMIN" && (
        <Panel title="System" subtitle="Users, roles and audit highlights">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Active users" value={14} icon="mdi:account-key-outline" onClick={() => go("admin")} />
            <StatCard label="Pending activation" value={1} icon="mdi:email-fast-outline" tone="info" />
            <StatCard label="Active sessions" value={9} icon="mdi:monitor-account" tone="success" />
            <StatCard label="Failed logins (24h)" value={2} icon="mdi:shield-alert-outline" tone="neutral" hint="Database: ok" />
          </div>
          <h3 className="text-[12px] font-semibold text-[#6F7C74] mt-4 mb-2">Recent administrative activity</h3>
          <ul className="divide-y divide-[#6F7C7426]">
            {D.AUDIT.slice(0, 3).map((a) => (
              <li key={a.id} className="flex justify-between gap-2 py-1.5 text-[12px]">
                <span className="text-[#0F2418] dark:text-[#EFFBF3]">
                  <b>{a.action}</b> <span className="text-[#8E8E9C]">on {a.entity}</span>
                </span>
                <span className="text-[#8E8E9C] shrink-0">{a.at}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Recent Activity">
          <ul className="space-y-2">
            {D.ACTIVITY.map((n) => (
              <li key={n.id} className="text-[13px]">
                <p className="text-[#0F2418] dark:text-[#EFFBF3] font-semibold">{n.title}</p>
                <p className="text-[11px] text-[#8E8E9C]">{n.at}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Upcoming Holidays">
          <ul className="space-y-2">
            {D.HOLIDAYS.map((h) => (
              <li key={h.id} className="flex justify-between text-[13px]">
                <span className="text-[#0F2418] dark:text-[#EFFBF3]">{h.name}</span>
                <span className="text-[#8E8E9C]">{fmtDate(h.date)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Page>
  );
}

function Employees() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("");
  const [sel, setSel] = useState(null);
  const rows = D.EMPLOYEES.filter(
    (e) => (!dept || e.department === dept) && (!q || `${fullName(e)} ${e.designation} ${e.employeeCode}`.toLowerCase().includes(q.toLowerCase())),
  );
  return (
    <Page>
      <PageHeader title="Employees" subtitle={`${D.EMPLOYEES.length} people across ${D.DEPARTMENTS.length} departments`} actions={<Btn icon="mdi:account-plus-outline" label="Add employee" disabled title="Disabled in the demo" />} />
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4 items-start">
        <Panel
          actions={
            <>
              <SearchInput value={q} onChange={setQ} placeholder="Search name, role or code…" />
              <Select value={dept} onChange={(e) => setDept(e.target.value)} placeholder="All departments" options={D.DEPARTMENTS.map((d) => ({ value: d, label: d }))} className="!h-9 md:!w-[180px]" />
            </>
          }
          title="Directory"
        >
          <Table
            rows={rows}
            onRowClick={setSel}
            columns={[
              { header: "Employee", body: (e) => <PersonCell person={e} sub={e.email} /> },
              { header: "Code", field: "employeeCode" },
              { header: "Designation", field: "designation" },
              { header: "Department", field: "department" },
              { header: "Status", body: (e) => <Badge value={e.status} /> },
            ]}
          />
        </Panel>
        <Panel title="Profile">
          {sel ? (
            <div className="flex flex-col items-center text-center">
              <Avatar person={sel} size={64} />
              <p className="mt-3 text-[16px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">{fullName(sel)}</p>
              <p className="text-[12px] text-[#6F7C74] dark:text-[#A9C2B3]">{sel.designation}</p>
              <div className="mt-2">
                <Badge value={sel.status} />
              </div>
              <dl className="mt-5 w-full text-left space-y-2.5 text-[13px]">
                {[
                  ["Employee code", sel.employeeCode],
                  ["Department", sel.department],
                  ["Email", sel.email],
                  ["Joined", fmtDate(sel.joiningDate)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b border-[#6F7C7414] pb-2">
                    <dt className="text-[#8E8E9C]">{k}</dt>
                    <dd className="text-[#0F2418] dark:text-[#EFFBF3] font-medium truncate">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <Empty icon="mdi:account-search-outline" text="Click an employee to see their profile." />
          )}
        </Panel>
      </div>
    </Page>
  );
}

const CAL_TONE = {
  PRESENT: "bg-[#10B9811A] text-[#059669]",
  LATE: "bg-[#F59E0B1A] text-[#D97706]",
  ON_LEAVE: "bg-[#0EA5E91A] text-[#0284C7]",
  WEEKEND: "bg-[#8E8E9C14] text-[#8E8E9C]",
};

function Attendance({ role, s }) {
  const days = useMemo(() => D.monthAttendance(), []);
  const lead = (days[0].dow + 6) % 7; // Monday-first grid
  const now = new Date();
  const counts = days.reduce((m, d) => (d.status ? { ...m, [d.status]: (m[d.status] ?? 0) + 1 } : m), {});
  return (
    <Page>
      <PageHeader title="Attendance" subtitle={`${MONTHS[now.getMonth()]} ${now.getFullYear()}`} />
      {role !== "ADMIN" && <CheckInCard att={s.att} setAtt={s.setAtt} toast={s.toast} />}
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-4 items-start">
        <Panel title="My month" subtitle={`${counts.PRESENT ?? 0} present · ${counts.LATE ?? 0} late · ${counts.ON_LEAVE ?? 0} on leave`}>
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d} className="text-[11px] font-semibold text-[#8E8E9C] pb-1">
                {d}
              </span>
            ))}
            {Array.from({ length: lead }, (_, i) => (
              <span key={`b${i}`} />
            ))}
            {days.map((d) => (
              <div
                key={d.date}
                title={d.status ? humanize(d.status) : ""}
                className={`aspect-square sm:aspect-auto sm:h-14 rounded-lg p-1.5 flex flex-col justify-between text-left ${d.status ? CAL_TONE[d.status] : "border border-dashed border-[#6F7C7426] text-[#8E8E9C]"}`}
              >
                <span className="text-[11px] font-bold">{d.day}</span>
                {d.status && d.status !== "WEEKEND" && <span className="hidden sm:block text-[9px] font-semibold truncate">{humanize(d.status)}</span>}
              </div>
            ))}
          </div>
        </Panel>
        {role !== "EMPLOYEE" && (
          <Panel title="Team today" subtitle="Live check-in status">
            <ul className="divide-y divide-[#6F7C7414]">
              {D.TEAM_TODAY.map(([p, time, st]) => (
                <li key={p.id} className="flex items-center justify-between gap-2 py-2.5">
                  <PersonCell person={p} sub={time ? `Checked in ${time}` : p.designation} />
                  <Badge value={st} />
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </Page>
  );
}

function Leave({ role, s }) {
  const canApprove = role !== "EMPLOYEE";
  const [tab, setTab] = useState(canApprove ? "approvals" : "mine");
  const [form, setForm] = useState({ type: "Annual Leave", from: "", to: "", reason: "" });
  const meId = D.ROLES.find((r) => r.key === role).person.id;
  const mine = s.leave.filter((l) => l.employee.id === meId || l.mine);
  const pending = s.leave.filter((l) => l.status === "PENDING" && !l.mine);
  const decide = (id, status) => {
    s.setLeave((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    s.toast(status === "APPROVED" ? "Leave approved. The employee has been notified" : "Leave rejected. The employee has been notified");
  };
  const apply = () => {
    if (!form.from || !form.to) return s.toast("Pick a start and end date");
    const days = Math.max(1, Math.round((new Date(form.to) - new Date(form.from)) / 86400000) + 1);
    s.setLeave((ls) => [{ id: `l${Date.now()}`, employee: D.ROLES.find((r) => r.key === role).person, type: form.type, from: form.from, to: form.to, days, reason: form.reason || "—", status: "PENDING", mine: true }, ...ls]);
    setForm({ type: "Annual Leave", from: "", to: "", reason: "" });
    setTab("mine");
    s.toast("Leave request sent to your manager");
  };
  const tabs = [
    ...(canApprove ? [{ key: "approvals", label: "Approvals", count: pending.length }] : []),
    { key: "mine", label: "My requests" },
    { key: "apply", label: "Apply for leave" },
  ];
  return (
    <Page>
      <PageHeader title="Leave" subtitle="Requests, approvals and balances" actions={<Btn icon="mdi:plus" label="Apply for leave" onClick={() => setTab("apply")} />} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {D.LEAVE_BALANCES.map((b, i) => (
          <StatCard key={b.name} label={b.name} value={b.unlimited ? "∞" : `${b.available} days`} hint={`${b.used} used`} icon={["mdi:beach", "mdi:coffee-outline", "mdi:medical-bag", "mdi:cash-remove"][i]} tone={["primary", "info", "success", "neutral"][i]} />
        ))}
      </div>
      <Panel>
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        <div className="pt-4">
          {tab === "approvals" &&
            (pending.length === 0 ? (
              <Empty icon="mdi:check-all" text="All caught up. No requests waiting." />
            ) : (
              <ul className="space-y-3">
                {pending.map((l) => (
                  <li key={l.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-lg border border-[#6F7C7426] p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar person={l.employee} size={38} />
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#0F2418] dark:text-[#EFFBF3]">
                          {fullName(l.employee)} · {l.type}
                        </p>
                        <p className="text-[12px] text-[#8E8E9C] truncate">
                          {fmtDate(l.from)} → {fmtDate(l.to)} · {l.days} day{l.days > 1 ? "s" : ""} · “{l.reason}”
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Btn size="sm" variant="outline" icon="mdi:close" label="Reject" onClick={() => decide(l.id, "REJECTED")} />
                      <Btn size="sm" icon="mdi:check" label="Approve" onClick={() => decide(l.id, "APPROVED")} />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          {tab === "mine" && (
            <Table
              rows={[...mine, ...s.leave.filter((l) => l.status !== "PENDING" && !mine.includes(l)).slice(0, 3)]}
              emptyText="No leave requests yet."
              columns={[
                { header: "Employee", body: (l) => <PersonCell person={l.employee} /> },
                { header: "Type", field: "type" },
                { header: "Dates", body: (l) => `${fmtDate(l.from)} → ${fmtDate(l.to)}` },
                { header: "Days", field: "days" },
                { header: "Status", body: (l) => <Badge value={l.status} /> },
              ]}
            />
          )}
          {tab === "apply" && (
            <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
              <Field label="Leave type" required>
                <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} options={D.LEAVE_BALANCES.map((b) => ({ value: b.name, label: b.name }))} />
              </Field>
              <div />
              <Field label="From" required>
                <Input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value, to: form.to || e.target.value })} />
              </Field>
              <Field label="To" required>
                <Input type="date" value={form.to} min={form.from} onChange={(e) => setForm({ ...form, to: e.target.value })} />
              </Field>
              <Field label="Reason" className="sm:col-span-2">
                <Input value={form.reason} placeholder="Optional" onChange={(e) => setForm({ ...form, reason: e.target.value })} />
              </Field>
              <div className="sm:col-span-2">
                <Btn icon="mdi:send" label="Send request" onClick={apply} />
              </div>
            </div>
          )}
        </div>
      </Panel>
    </Page>
  );
}

function Tasks({ s }) {
  const [title, setTitle] = useState("");
  const onDragEnd = ({ draggableId, destination }) => {
    if (!destination) return;
    s.setTasks((ts) => {
      const moved = ts.find((t) => t.id === draggableId);
      if (moved.status !== destination.droppableId) s.toast(`Moved to ${humanize(destination.droppableId)}`);
      const rest = ts.filter((t) => t.id !== draggableId);
      const col = rest.filter((t) => t.status === destination.droppableId);
      const before = col[destination.index];
      const item = { ...moved, status: destination.droppableId };
      const at = before ? rest.indexOf(before) : rest.length;
      return [...rest.slice(0, at), item, ...rest.slice(at)];
    });
  };
  const add = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    s.setTasks((ts) => [{ id: `t${Date.now()}`, title: title.trim(), priority: "MEDIUM", status: "TODO", assignee: D.ME, due: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10) }, ...ts]);
    setTitle("");
    s.toast("Task created");
  };
  return (
    <Page>
      <PageHeader title="Tasks" subtitle="Drag cards between columns to update their status" />
      <form onSubmit={add} className="flex gap-2 max-w-xl">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task and press Enter…" />
        <Btn type="submit" icon="mdi:plus" label="Add" />
      </form>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {D.TASK_COLUMNS.map((col) => {
            const items = s.tasks.filter((t) => t.status === col);
            return (
              <Droppable droppableId={col} key={col}>
                {(p, snap) => (
                  <div ref={p.innerRef} {...p.droppableProps} className={`rounded-lg p-3 min-h-[160px] transition-colors ${snap.isDraggingOver ? "bg-[#09BF641A]" : "bg-white dark:bg-black"}`}>
                    <p className="flex items-center gap-2 text-[13px] font-bold text-[#0F2418] dark:text-[#EFFBF3] mb-3">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: TASK_COLORS[col] }} />
                      {humanize(col)} <span className="text-[#8E8E9C] font-normal">{items.length}</span>
                    </p>
                    {items.map((t, i) => (
                      <Draggable draggableId={t.id} index={i} key={t.id}>
                        {(dp, ds) => (
                          <div
                            ref={dp.innerRef}
                            {...dp.draggableProps}
                            {...dp.dragHandleProps}
                            className={`mb-2.5 rounded-lg border border-[#6F7C7426] bg-gray-50 dark:bg-[#141414] p-3 ${ds.isDragging ? "shadow-xl ring-1 ring-[#09BF64]" : ""}`}
                          >
                            <p className="text-[13px] font-semibold text-[#0F2418] dark:text-[#EFFBF3]">{t.title}</p>
                            <div className="mt-2.5 flex items-center justify-between gap-2">
                              <span className="flex items-center gap-2">
                                <Badge value={t.priority} />
                                <span className="text-[11px] text-[#8E8E9C]">{fmtDate(t.due)}</span>
                              </span>
                              <Avatar person={t.assignee} size={24} />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {p.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </Page>
  );
}

function Announcements({ s }) {
  return (
    <Page>
      <PageHeader title="Announcements" subtitle="Company news and notices" />
      {D.ANNOUNCEMENTS.map((a) => (
        <Panel key={a.id}>
          <div className="flex items-start gap-3">
            <Avatar person={a.author} size={40} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[15px] font-bold text-[#0F2418] dark:text-[#EFFBF3]">{a.title}</h2>
                {a.pinned && <Badge tone="primary">Pinned</Badge>}
                <Badge tone="neutral">{a.audience}</Badge>
              </div>
              <p className="text-[11px] text-[#8E8E9C] mt-0.5">
                {fullName(a.author)} · {fmtDate(a.at)}
              </p>
              <p className="mt-2.5 text-[13px] text-[#333] dark:text-[#C9D6CE] leading-relaxed">{a.body}</p>
              {a.ack &&
                (s.acked.includes(a.id) ? (
                  <p className="mt-3 text-[12px] font-semibold text-[#059669] flex items-center gap-1">
                    <Icon icon="mdi:check-circle" /> You acknowledged this
                  </p>
                ) : (
                  <div className="mt-3">
                    <Btn
                      size="sm"
                      icon="mdi:check"
                      label="Acknowledge"
                      onClick={() => {
                        s.setAcked((x) => [...x, a.id]);
                        s.toast("Acknowledged. HR can see who has read it");
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>
        </Panel>
      ))}
    </Page>
  );
}

function Chat({ s }) {
  const [activeId, setActiveId] = useState("c1");
  const [text, setText] = useState("");
  const endRef = useRef(null);
  const chat = s.chats.find((c) => c.id === activeId);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [chat.messages.length, activeId]);
  const open = (id) => {
    setActiveId(id);
    s.setChats((cs) => cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };
  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    s.setChats((cs) => cs.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, { from: D.ME, text: text.trim(), at: nowTime() }] } : c)));
    setText("");
  };
  return (
    <div className="h-full p-3 bg-gray-50 dark:bg-[#141414]">
      <div className="h-full grid grid-cols-[72px_1fr] md:grid-cols-[260px_1fr] rounded-lg overflow-hidden bg-white dark:bg-black">
        <aside className="border-r border-[#6F7C7414] overflow-y-auto">
          <p className="hidden md:block px-4 pt-4 pb-2 text-[14px] font-semibold text-[#09BF64]">Chats</p>
          {s.chats.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => open(c.id)}
              className={`w-full flex items-center gap-3 px-3 md:px-4 py-3 text-left ${c.id === activeId ? "bg-[#09BF641A]" : "hover:bg-gray-50 dark:hover:bg-[#141414]"}`}
            >
              {c.group ? (
                <span className="w-9 h-9 rounded-full grid place-items-center bg-[#0D0D0D] dark:bg-[#C4FF73] text-[#C4FF73] dark:text-black font-bold shrink-0">#</span>
              ) : (
                <Avatar person={c.person} size={36} />
              )}
              <span className="hidden md:block min-w-0 flex-1">
                <span className="flex justify-between gap-2">
                  <span className="text-[13px] font-semibold text-[#0F2418] dark:text-[#EFFBF3] truncate">{c.group ? `# ${c.name}` : c.name}</span>
                  {c.unread > 0 && <span className="bg-[#09BF64] text-white text-[10px] font-bold px-1.5 rounded-full self-center">{c.unread}</span>}
                </span>
                <span className="block text-[11px] text-[#8E8E9C] truncate">{c.messages.at(-1).text}</span>
              </span>
            </button>
          ))}
        </aside>
        <section className="flex flex-col min-w-0">
          <div className="h-14 shrink-0 flex items-center gap-2 px-4 border-b border-[#6F7C7414]">
            <p className="text-[14px] font-bold text-[#0F2418] dark:text-[#EFFBF3] truncate">{chat.group ? `# ${chat.name}` : chat.name}</p>
            {chat.group && <span className="text-[11px] text-[#8E8E9C]">{chat.members} members</span>}
            <span className="ml-auto flex items-center gap-1.5 text-[11px] text-[#059669]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#09BF64]" /> Live
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chat.messages.map((m, i) => {
              const mine = m.from.id === D.ME.id;
              return (
                <div key={i} className={`flex gap-2 ${mine ? "flex-row-reverse" : ""}`}>
                  {!mine && <Avatar person={m.from} size={28} />}
                  <div className={`max-w-[75%] ${mine ? "text-right" : ""}`}>
                    <p className="text-[11px] text-[#8E8E9C] mb-1">
                      {mine ? "You" : fullName(m.from)} · {m.at}
                    </p>
                    <p className={`inline-block text-left text-[13px] px-3.5 py-2 rounded-2xl ${mine ? "bg-[#09BF64] text-white rounded-tr-sm" : "bg-[#F4F6F9] dark:bg-[#1A1A1A] text-[#0F2418] dark:text-[#EFFBF3] rounded-tl-sm"}`}>{m.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="p-3 border-t border-[#6F7C7414] flex gap-2">
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" aria-label="Message" />
            <Btn type="submit" icon="mdi:send" label="" className="!px-3" title="Send" />
          </form>
        </section>
      </div>
    </div>
  );
}

function Reports({ s }) {
  const exportCsv = () => {
    const csv = ["Department,Attendance %", ...D.DEPT_ATTENDANCE.map(([d, p]) => `${d},${p}`)].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "attendance-by-department.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    s.toast("CSV exported");
  };
  const leaveByType = [
    ["Annual Leave", 22],
    ["Casual Leave", 11],
    ["Sick Leave", 6],
    ["Unpaid Leave", 2],
  ];
  const maxLeave = Math.max(...leaveByType.map(([, n]) => n));
  return (
    <Page>
      <PageHeader title="Reports" subtitle={`Last 30 days · all departments`} actions={<Btn icon="mdi:download" variant="outline" label="Export CSV" onClick={exportCsv} />} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Average attendance" value="93%" icon="mdi:account-check-outline" tone="success" />
        <StatCard label="Leave days taken" value={41} icon="mdi:beach" tone="info" />
        <StatCard label="Late arrivals" value={12} icon="mdi:clock-alert-outline" tone="warning" />
        <StatCard label="Absences" value={3} icon="mdi:account-remove-outline" tone="danger" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Attendance by department">
          <ul className="space-y-3">
            {D.DEPT_ATTENDANCE.map(([d, p]) => (
              <li key={d} className="grid grid-cols-[120px_1fr_44px] items-center gap-3 text-[12px]">
                <span className="text-[#6F7C74] dark:text-[#A9C2B3] truncate">{d}</span>
                <div className="h-2.5 rounded-full bg-[#F4F6F9] dark:bg-gray-800">
                  <div className="h-2.5 rounded-full bg-gradient-to-r from-[#09BF64] to-[#81D959]" style={{ width: `${p}%` }} />
                </div>
                <b className="text-right text-[#0F2418] dark:text-[#EFFBF3]">{p}%</b>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Leave by type" subtitle="Days taken this month">
          <div className="flex items-end gap-4 h-[180px] pt-4">
            {leaveByType.map(([t, n]) => (
              <div key={t} className="flex-1 h-full flex flex-col items-center justify-end gap-2">
                <b className="text-[12px] text-[#0F2418] dark:text-[#EFFBF3]">{n}</b>
                <div className="w-full max-w-[56px] rounded-t-lg bg-gradient-to-t from-[#09BF64] to-[#C4FF73]" style={{ height: `${(n / maxLeave) * 75}%` }} />
                <span className="text-[11px] text-[#8E8E9C] text-center leading-tight">{t.replace(" Leave", "")}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </Page>
  );
}

const money = (n) => `PKR ${Number(n).toLocaleString()}`;

function Payroll({ s }) {
  const run = D.PAYROLL_RUN;
  const total = D.PAYSLIPS.reduce((a, p) => a + p.netPay, 0);
  return (
    <Page>
      <PageHeader title="Payroll" subtitle={`${MONTHS[run.month - 1]} ${run.year} run`} actions={<Btn icon="mdi:play-circle-outline" label="Start next run" disabled title="Disabled in the demo" />} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Employees paid" value={D.PAYSLIPS.length} icon="mdi:account-cash-outline" />
        <StatCard label="Total net pay" value={money(total)} icon="mdi:cash-multiple" tone="success" />
        <StatCard label="Unpaid days deducted" value={2} icon="mdi:calendar-remove-outline" tone="warning" hint="From attendance" />
        <StatCard label="Status" value="Paid" icon="mdi:check-decagram-outline" tone="primary" />
      </div>
      <Panel title="Payslips" subtitle="Click Download to get the PDF payslip each employee receives">
        <Table
          rows={D.PAYSLIPS}
          columns={[
            { header: "Employee", body: (p) => <PersonCell person={p.employee} sub={p.employee.designation} /> },
            { header: "Basic", body: (p) => money(p.basicSalary) },
            { header: "Allowances", body: (p) => money(p.earnings[0].amount) },
            { header: "Deductions", body: (p) => <span className="text-[#E5483A]">− {money(p.totalDeductions)}</span> },
            { header: "Net pay", body: (p) => <b className="text-[#0F2418] dark:text-[#EFFBF3]">{money(p.netPay)}</b> },
            {
              header: "",
              body: (p) => (
                <Btn
                  size="sm"
                  variant="outline"
                  icon="mdi:file-pdf-box"
                  label="Download"
                  onClick={async () => {
                    await downloadPayslipPdf(p);
                    s.toast("Payslip PDF downloaded");
                  }}
                />
              ),
            },
          ]}
        />
      </Panel>
      <Panel title="Previous runs">
        <ul className="divide-y divide-[#6F7C7414]">
          {D.PAYROLL_HISTORY.map((r) => (
            <li key={`${r.year}-${r.month}`} className="flex items-center justify-between py-2.5 text-[13px]">
              <span className="text-[#0F2418] dark:text-[#EFFBF3] font-semibold">
                {MONTHS[r.month - 1]} {r.year}
              </span>
              <span className="text-[#8E8E9C] hidden sm:inline">{r.employees} employees</span>
              <span className="text-[#0F2418] dark:text-[#EFFBF3]">{money(r.net)}</span>
              <Badge value="COMPLETED">Paid</Badge>
            </li>
          ))}
        </ul>
      </Panel>
    </Page>
  );
}

function Admin({ role }) {
  const [tab, setTab] = useState("roles");
  const tabs = [{ key: "roles", label: "Roles & permissions" }, ...(role === "ADMIN" ? [{ key: "audit", label: "Audit log" }] : [])];
  return (
    <Page>
      <PageHeader title="Administration" subtitle="Who can see and do what" />
      <Panel>
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        <div className="pt-4">
          {tab === "roles" && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-[12px]">
                <thead>
                  <tr className="text-left text-[#8E8E9C]">
                    <th className="font-semibold py-2 pr-3">Role</th>
                    {D.ROLE_MATRIX.modules.map((m) => (
                      <th key={m} className="font-semibold py-2 px-2">
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {D.ROLE_MATRIX.roles.map(([r, cells]) => (
                    <tr key={r} className="border-t border-[#6F7C7414]">
                      <td className="py-3 pr-3 font-semibold text-[#0F2418] dark:text-[#EFFBF3] whitespace-nowrap">{r}</td>
                      {cells.map((c, i) => (
                        <td key={i} className="py-3 px-2">
                          {c === "—" ? <span className="text-[#C4C4CC]">—</span> : <Badge tone={c.startsWith("All") || c.startsWith("Run") || c === "Manage" ? "primary" : c.startsWith("Own") ? "neutral" : "info"}>{c}</Badge>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-[12px] text-[#8E8E9C]">Admins can also create custom roles with any combination of permissions.</p>
            </div>
          )}
          {tab === "audit" && (
            <ul className="divide-y divide-[#6F7C7414]">
              {D.AUDIT.map((a) => (
                <li key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-2.5 text-[12px]">
                  <span className="text-[#0F2418] dark:text-[#EFFBF3]">
                    <b>{a.action}</b> <span className="text-[#8E8E9C]">on {a.entity}</span>
                  </span>
                  <span className="text-[#8E8E9C]">
                    {a.actor} · {a.at}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Panel>
    </Page>
  );
}

/* ───────────────────────── Page ───────────────────────── */

export default function Demo() {
  const params = new URLSearchParams(window.location.search);
  const initialRole = D.ROLE_SCREENS[params.get("role")?.toUpperCase()] ? params.get("role").toUpperCase() : "HR";
  const [role, setRole] = useState(initialRole);
  const [screen, setScreen] = useState(params.get("screen") ?? "dashboard");
  const [dark, setDark] = useState(() => (params.get("theme") ? params.get("theme") === "dark" : document.documentElement.classList.contains("dark")));

  // In-memory demo state, shared across screens so actions carry over (e.g. approving leave updates the dashboard).
  const [att, setAtt] = useState({});
  const [leave, setLeave] = useState(D.LEAVE_REQUESTS);
  const [tasks, setTasks] = useState(D.TASKS);
  const [chats, setChats] = useState(D.CHATS);
  const [acked, setAcked] = useState([]);
  const [toastText, setToastText] = useState("");
  const timer = useRef();
  const toast = (t) => {
    setToastText(t);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastText(""), 2600);
  };
  const s = { att, setAtt, leave, setLeave, tasks, setTasks, chats, setChats, acked, setAcked, toast };

  const allowed = D.ROLE_SCREENS[role];
  const current = allowed.includes(screen) ? screen : "dashboard";

  // Theme is applied for this page only and restored on leave, so the demo never changes the real app's preference.
  useEffect(() => {
    const root = document.documentElement;
    const before = root.classList.contains("dark");
    root.classList.toggle("dark", dark);
    return () => root.classList.toggle("dark", before);
  }, [dark]);

  useEffect(() => {
    document.title = "Markeltree · Live demo";
  }, []);

  const unread = chats.reduce((a, c) => a + (c.unread ?? 0), 0);
  const screens = {
    dashboard: <Dashboard role={role} s={s} go={setScreen} />,
    employees: <Employees />,
    attendance: <Attendance role={role} s={s} />,
    leave: <Leave key={role} role={role} s={s} />,
    tasks: <Tasks s={s} />,
    announcements: <Announcements s={s} />,
    chat: <Chat s={s} />,
    reports: <Reports s={s} />,
    payroll: <Payroll s={s} />,
    admin: <Admin key={role} role={role} />,
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-[#141414]">
      <Topbar
        role={role}
        setRole={(r) => {
          setRole(r);
          toast(`Now viewing as ${D.ROLES.find((x) => x.key === r).label}`);
        }}
        dark={dark}
        toggleDark={() => setDark((d) => !d)}
      />
      <div className="flex flex-1 min-h-0">
        <Sidebar screen={current} setScreen={setScreen} allowed={allowed} unread={unread} />
        <main key={`${current}-${role}`} className="flex-1 min-w-0 overflow-auto landing-fade">
          {screens[current]}
        </main>
      </div>
      <Toast text={toastText} />
    </div>
  );
}
