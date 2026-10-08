import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Clock,
  CalendarDays,
  KanbanSquare,
  Wallet,
  MessagesSquare,
  Megaphone,
  BarChart3,
  ShieldCheck,
  Check,
  X,
  Lock,
  KeyRound,
  History,
  Gauge,
  UserPlus,
  MousePointerClick,
  BadgeCheck,
  FileText,
  ChevronDown,
  Globe,
  Download,
  Send,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";

/* ───────────────────────── Content ───────────────────────── */

const BEFORE_AFTER = [
  ["Attendance", "Paper registers or spreadsheets, totalled by hand", "Employees check in and out with one click and the hours are counted automatically"],
  ["Leave", "Requests sent by WhatsApp or email and easily lost", "Online request, manager approves, and the leave balance updates on its own"],
  ["Tasks", "Verbal instructions and scattered to-do lists", "A shared task board showing who is doing what and when it's due"],
  ["Payroll", "Salaries worked out manually from several sheets", "Payroll uses attendance data and creates a PDF payslip for each employee"],
  ["Communication", "Personal chat apps mixed with work", "Built-in team chat and company announcements"],
];

const STEPS = [
  { icon: UserPlus, title: "HR adds employees", text: "HR creates an account for each employee and sets their department, manager and role." },
  { icon: MousePointerClick, title: "Employees use it daily", text: "Each employee checks in and out, applies for leave and updates their tasks." },
  { icon: BadgeCheck, title: "Managers approve", text: "Managers get a notification, approve leave and track their team's attendance and work." },
  { icon: FileText, title: "Reports & payroll are ready", text: "At month end, attendance reports and salary slips are generated from the data already collected." },
];

const ROLES = [
  { name: "Employee", desc: "Every staff member", points: ["Check in and out", "Apply for leave", "See and update own tasks", "Download own payslips"] },
  { name: "Manager / Team Lead", desc: "Heads of teams", points: ["Approve team leave", "Assign tasks", "View team attendance", "Team reports"] },
  { name: "HR Admin", desc: "HR department", points: ["Add and manage employees", "Leave policies and holidays", "Departments and teams", "Company-wide reports"] },
  { name: "Super Admin", desc: "Owner / management", points: ["Run payroll", "Create roles and permissions", "Company settings", "Audit log of every change"] },
];

const MODULES = [
  { icon: Users, title: "Employees", text: "Profiles, departments, teams and an org chart." },
  { icon: Clock, title: "Attendance", text: "Check-in and check-out with late-arrival tracking." },
  { icon: CalendarDays, title: "Leave", text: "Requests, approvals, balances and holidays." },
  { icon: KanbanSquare, title: "Tasks", text: "Drag-and-drop task board with due dates." },
  { icon: Wallet, title: "Payroll", text: "Monthly salary runs and PDF payslips." },
  { icon: MessagesSquare, title: "Team chat", text: "Real-time direct and group messages." },
  { icon: Megaphone, title: "Announcements", text: "Company-wide or for selected teams." },
  { icon: BarChart3, title: "Reports", text: "Attendance and leave reports, CSV export." },
  { icon: ShieldCheck, title: "Admin", text: "Roles, permissions, settings and audit log." },
];

const SECURITY = [
  { icon: Lock, title: "Permission checks on the server", text: "Each request is checked against the user's role, so nobody can see data they're not allowed to." },
  { icon: KeyRound, title: "Secure login sessions", text: "Short-lived access tokens plus rotating refresh tokens stored in httpOnly cookies." },
  { icon: History, title: "Audit trail", text: "Changes to employees, roles, payroll and settings are recorded with who made them and when." },
  { icon: Gauge, title: "Abuse protection", text: "Login attempt limits, request rate limits and security headers." },
];

const STACK = ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "TypeScript", "Prisma", "PostgreSQL", "Supabase Realtime", "Vercel"];

const FAQ = [
  ["What is Markeltree?", "It's a web-based employee management system. It handles a company's daily HR work, such as attendance, leave, tasks, payroll and internal communication, all in one place."],
  ["Who uses it?", "Everyone in the company. Employees use it every day, managers use it to approve and track their teams, and HR and management use it for records, reports and payroll."],
  ["Do we need to install anything?", "No. It runs in a web browser. Each person signs in with the account HR created for them."],
  ["Can employees see each other's salaries?", "No. Every screen and every request is limited by role. Employees see only their own payslips, and payroll is managed only by the Super Admin."],
  ["Can we change roles and permissions?", "Yes. Five roles come built in, and admins can create new roles with any combination of permissions."],
];

/* ───────────────────────── Feature tour mock screens ───────────────────────── */

const card = "rounded-xl border border-[#EEF3EF] dark:border-[#1F2B23] bg-white dark:bg-[#111613]";
const muted = "text-[#6F7C74] dark:text-[#A9C2B3]";

function Pill({ tone = "green", children }) {
  const tones = {
    green: "bg-[#E6F8EE] text-[#078A49] dark:bg-[#12291C] dark:text-[#81D959]",
    amber: "bg-[#FFF4DB] text-[#B7791F] dark:bg-[#2A2210] dark:text-[#F5C451]",
    red: "bg-[#FFECEA] text-[#D2453A] dark:bg-[#2A1513] dark:text-[#FF8A80]",
    gray: "bg-[#F1F3F2] text-[#5B6660] dark:bg-[#1A221D] dark:text-[#A9C2B3]",
  };
  return <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${tones[tone]}`}>{children}</span>;
}

function AttendanceMock() {
  const rows = [
    ["Mon", "09:02", "18:10", "On time", "green"],
    ["Tue", "09:24", "18:05", "Late", "amber"],
    ["Wed", "08:55", "18:30", "On time", "green"],
    ["Thu", "—", "—", "On leave", "gray"],
  ];
  return (
    <div className="grid sm:grid-cols-[220px_1fr] gap-4">
      <div className={`${card} p-5 flex flex-col items-center text-center`}>
        <p className={`text-[12px] ${muted}`}>Today</p>
        <p className="mt-1 text-[30px] font-bold tabular-nums">09:02</p>
        <Pill>Checked in</Pill>
        <button type="button" tabIndex={-1} className="mt-5 w-full h-10 rounded-lg bg-[#0D0D0D] dark:bg-white text-white dark:text-[#0D0D0D] text-[13px] font-semibold">
          Check out
        </button>
      </div>
      <div className={`${card} p-4 overflow-x-auto`}>
        <p className="text-[13px] font-semibold mb-3">This week</p>
        <table className="w-full text-[12px] min-w-[300px]">
          <thead className={muted}>
            <tr className="text-left">
              <th className="font-medium pb-2">Day</th>
              <th className="font-medium pb-2">In</th>
              <th className="font-medium pb-2">Out</th>
              <th className="font-medium pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([d, i, o, s, t]) => (
              <tr key={d} className="border-t border-[#EEF3EF] dark:border-[#1F2B23]">
                <td className="py-2.5 font-medium">{d}</td>
                <td className="tabular-nums">{i}</td>
                <td className="tabular-nums">{o}</td>
                <td><Pill tone={t}>{s}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeaveMock() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className={`${card} p-5 space-y-3`}>
        <p className="text-[13px] font-semibold">Apply for leave</p>
        {[
          ["Leave type", "Annual Leave"],
          ["From", "14 Oct 2026"],
          ["To", "16 Oct 2026"],
        ].map(([l, v]) => (
          <div key={l}>
            <p className={`text-[11px] ${muted}`}>{l}</p>
            <div className="mt-1 h-9 px-3 flex items-center rounded-lg border border-[#DDE7E0] dark:border-[#26322A] text-[13px]">{v}</div>
          </div>
        ))}
        <button type="button" tabIndex={-1} className="w-full h-10 rounded-lg bg-[#09BF64] text-white text-[13px] font-semibold flex items-center justify-center gap-2">
          <Send size={14} /> Send to manager
        </button>
      </div>
      <div className="space-y-4">
        <div className={`${card} p-5`}>
          <p className="text-[13px] font-semibold">Leave balance</p>
          {[
            ["Annual", 9, 14],
            ["Casual", 6, 10],
            ["Sick", 8, 8],
          ].map(([n, left, total]) => (
            <div key={n} className="mt-3">
              <div className="flex justify-between text-[12px]">
                <span className={muted}>{n}</span>
                <span className="font-medium tabular-nums">{left} / {total} days left</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-[#EEF3EF] dark:bg-[#1F2B23]">
                <div className="h-2 rounded-full bg-[#09BF64]" style={{ width: `${(left / total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className={`${card} p-4 flex items-center justify-between gap-3`}>
          <div>
            <p className="text-[13px] font-medium">Annual Leave · 3 days</p>
            <p className={`text-[11px] ${muted}`}>Waiting for your manager</p>
          </div>
          <Pill tone="amber">Pending</Pill>
        </div>
      </div>
    </div>
  );
}

function TasksMock() {
  const cols = [
    ["To do", [["Prepare Q4 hiring plan", "High", "red"], ["Update leave policy", "Medium", "amber"]]],
    ["In progress", [["Onboard 3 new joiners", "High", "red"], ["Office laptop audit", "Low", "gray"]]],
    ["Done", [["September payroll", "High", "green"]]],
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cols.map(([name, tasks]) => (
        <div key={name} className="rounded-xl bg-[#F4F7F5] dark:bg-[#0F1411] p-3">
          <p className="text-[12px] font-semibold px-1 mb-3 flex items-center justify-between">
            {name} <span className={`${muted} font-normal`}>{tasks.length}</span>
          </p>
          <div className="space-y-2.5">
            {tasks.map(([t, p, tone]) => (
              <div key={t} className={`${card} p-3`}>
                <p className="text-[13px] font-medium">{t}</p>
                <div className="mt-2.5 flex items-center justify-between">
                  <Pill tone={tone}>{p}</Pill>
                  <span className="w-6 h-6 rounded-full bg-[#C4FF73] text-[#0D0D0D] text-[10px] font-bold grid place-items-center">AK</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PayrollMock() {
  const lines = [
    ["Basic salary", "120,000"],
    ["Allowances", "15,000"],
    ["Unpaid leave (1 day)", "− 4,500"],
    ["Income tax", "− 6,200"],
  ];
  return (
    <div className="grid sm:grid-cols-[1fr_240px] gap-4">
      <div className={`${card} p-5`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold">Payslip · September 2026</p>
            <p className={`text-[11px] ${muted}`}>Ayesha Khan · Design</p>
          </div>
          <Pill>Paid</Pill>
        </div>
        <div className="mt-4 divide-y divide-[#EEF3EF] dark:divide-[#1F2B23]">
          {lines.map(([l, v]) => (
            <div key={l} className="flex justify-between py-2.5 text-[13px]">
              <span className={muted}>{l}</span>
              <span className="tabular-nums">PKR {v}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 text-[15px] font-bold">
            <span>Net pay</span>
            <span className="tabular-nums text-[#09BF64]">PKR 124,300</span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className={`${card} p-5`}>
          <p className={`text-[12px] ${muted}`}>Unpaid days are taken from</p>
          <p className="mt-1 text-[14px] font-semibold">Attendance records</p>
          <p className={`mt-3 text-[12px] ${muted}`}>No manual calculation needed.</p>
        </div>
        <button type="button" tabIndex={-1} className="w-full h-11 rounded-lg border border-[#DDE7E0] dark:border-[#26322A] text-[13px] font-semibold flex items-center justify-center gap-2">
          <Download size={15} /> Download PDF
        </button>
      </div>
    </div>
  );
}

function ChatMock() {
  return (
    <div className={`${card} grid sm:grid-cols-[200px_1fr] overflow-hidden`}>
      <div className="hidden sm:block border-r border-[#EEF3EF] dark:border-[#1F2B23] p-3 space-y-1">
        {[
          ["# general", true],
          ["# design-team", false],
          ["Bilal Raza", false],
          ["Sara Malik", false],
        ].map(([n, a]) => (
          <p key={n} className={`text-[13px] px-2.5 py-2 rounded-lg ${a ? "bg-[#E6F8EE] dark:bg-[#12291C] text-[#078A49] dark:text-[#81D959] font-medium" : muted}`}>{n}</p>
        ))}
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="max-w-[80%]">
          <p className={`text-[11px] ${muted} mb-1`}>HR · 10:12</p>
          <p className="text-[13px] rounded-2xl rounded-tl-sm bg-[#F4F7F5] dark:bg-[#1A221D] px-3.5 py-2.5">Reminder: office is closed on Friday for the public holiday 🎉</p>
        </div>
        <div className="max-w-[80%] self-end text-right">
          <p className={`text-[11px] ${muted} mb-1`}>You · 10:14</p>
          <p className="text-[13px] rounded-2xl rounded-tr-sm bg-[#09BF64] text-white px-3.5 py-2.5 text-left">Thanks! Will the payroll date move too?</p>
        </div>
        <div className="max-w-[80%]">
          <p className={`text-[11px] ${muted} mb-1`}>HR · 10:15</p>
          <p className="text-[13px] rounded-2xl rounded-tl-sm bg-[#F4F7F5] dark:bg-[#1A221D] px-3.5 py-2.5">No, salaries go out on the 1st as usual.</p>
        </div>
        <div className="mt-1 h-10 rounded-lg border border-[#DDE7E0] dark:border-[#26322A] px-3 flex items-center justify-between text-[13px]">
          <span className={muted}>Type a message…</span>
          <Send size={15} className="text-[#09BF64]" />
        </div>
      </div>
    </div>
  );
}

function ReportsMock() {
  const depts = [
    ["Engineering", 96],
    ["Design", 92],
    ["Sales", 88],
    ["Operations", 94],
  ];
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {[
        ["Average attendance", "93%"],
        ["Leave days this month", "41"],
        ["Late arrivals", "12"],
      ].map(([k, v]) => (
        <div key={k} className={`${card} p-5`}>
          <p className={`text-[12px] ${muted}`}>{k}</p>
          <p className="mt-1 text-[26px] font-bold tabular-nums">{v}</p>
        </div>
      ))}
      <div className={`${card} p-5 sm:col-span-3`}>
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold">Attendance by department</p>
          <span className="text-[12px] font-medium text-[#09BF64] flex items-center gap-1"><Download size={13} /> Export CSV</span>
        </div>
        <div className="mt-4 space-y-3">
          {depts.map(([d, p]) => (
            <div key={d} className="grid grid-cols-[100px_1fr_40px] items-center gap-3 text-[12px]">
              <span className={muted}>{d}</span>
              <div className="h-2.5 rounded-full bg-[#EEF3EF] dark:bg-[#1F2B23]">
                <div className="h-2.5 rounded-full bg-gradient-to-r from-[#09BF64] to-[#81D959]" style={{ width: `${p}%` }} />
              </div>
              <span className="tabular-nums text-right font-medium">{p}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TOUR = [
  { key: "attendance", icon: Clock, label: "Attendance", title: "Check in with one click", text: "Employees press Check in when they arrive and Check out when they leave. The system records the time, marks late arrivals and builds the monthly record, so nobody fills in a register.", Mock: AttendanceMock },
  { key: "leave", icon: CalendarDays, label: "Leave", title: "Apply for leave and get it approved online", text: "The employee picks dates and sends the request. Their manager is notified and approves or rejects it. The remaining balance updates automatically.", Mock: LeaveMock },
  { key: "tasks", icon: KanbanSquare, label: "Tasks", title: "See who is working on what", text: "Managers create tasks and assign them. Everyone moves their cards across the board as work progresses, so status is always visible without asking.", Mock: TasksMock },
  { key: "payroll", icon: Wallet, label: "Payroll", title: "Payroll built from real attendance", text: "Each month the Super Admin runs payroll. Unpaid days come straight from attendance and leave records, and every employee can download their own PDF payslip.", Mock: PayrollMock },
  { key: "chat", icon: MessagesSquare, label: "Chat", title: "Team chat inside the same app", text: "Direct messages and group channels update in real time, so work conversations stay separate from personal chat apps.", Mock: ChatMock },
  { key: "reports", icon: BarChart3, label: "Reports", title: "Reports without spreadsheets", text: "HR and management see attendance, leave and late arrivals for each team or the whole company, and can export everything to CSV.", Mock: ReportsMock },
];

/* ───────────────────────── Layout pieces ───────────────────────── */

function Section({ id, eyebrow, title, intro, children, className = "", center = false }) {
  return (
    <section id={id} className={`scroll-mt-20 px-4 sm:px-6 py-20 lg:py-24 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#09BF64]">{eyebrow}</p>
          <h2 className="mt-3 text-[28px] sm:text-[38px] leading-[1.15] font-bold tracking-tight text-[#0D0D0D] dark:text-white">{title}</h2>
          {intro && <p className={`mt-4 text-[16px] leading-relaxed ${muted}`}>{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

/** Static illustration of the dashboard for the hero, not live data. */
function DashboardPreview() {
  const bars = [62, 78, 70, 88, 94, 81, 90];
  return (
    <div className="relative rounded-2xl border border-[#E3EFE7] dark:border-[#1F2B23] bg-white dark:bg-[#111613] shadow-[0_40px_100px_-30px_rgba(9,191,100,0.45)] overflow-hidden text-left">
      <div className="flex items-center gap-1.5 px-4 h-10 border-b border-[#EEF3EF] dark:border-[#1F2B23]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF695B]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FFC145]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#09BF64]" />
        <span className="ml-3 text-[11px] text-[#8E9A93]">Markeltree · HR dashboard</span>
      </div>
      <div className="flex">
        <aside className="hidden md:flex flex-col gap-1.5 w-44 p-4 border-r border-[#EEF3EF] dark:border-[#1F2B23]">
          {["Dashboard", "Employees", "Attendance", "Leave", "Tasks", "Payroll", "Chat", "Reports"].map((l, i) => (
            <span key={l} className={`text-[12px] px-2.5 py-1.5 rounded-md ${i === 0 ? "bg-[#09BF64] text-white font-medium" : muted}`}>{l}</span>
          ))}
        </aside>
        <div className="flex-1 p-4 sm:p-6 space-y-4 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-bold">Good morning, Sana 👋</p>
              <p className={`text-[11px] ${muted}`}>Here's your company today</p>
            </div>
            <Pill>Checked in · 09:02</Pill>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ["Employees", "156", "4 joined this month"],
              ["Present today", "142", "91% attendance"],
              ["On leave", "9", "3 requests pending"],
              ["Open tasks", "37", "12 due this week"],
            ].map(([k, v, s]) => (
              <div key={k} className="rounded-xl bg-[#F4FBF6] dark:bg-[#16201A] p-3">
                <p className={`text-[11px] ${muted} truncate`}>{k}</p>
                <p className="text-[22px] font-bold tabular-nums">{v}</p>
                <p className="text-[10px] text-[#078A49] dark:text-[#81D959] font-medium truncate">{s}</p>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-5 gap-3">
            <div className="sm:col-span-3 rounded-xl border border-[#EEF3EF] dark:border-[#1F2B23] p-3">
              <p className="text-[12px] font-semibold">Attendance this week</p>
              <div className="mt-3 flex items-end gap-2 h-24">
                {bars.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full rounded-t-md bg-gradient-to-t from-[#09BF64] to-[#C4FF73]" style={{ height: `${h}%` }} />
                    <span className="text-[9px] text-[#8E9A93]">{"MTWTFSS"[i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2 rounded-xl border border-[#EEF3EF] dark:border-[#1F2B23] p-3 space-y-2.5">
              <p className="text-[12px] font-semibold">Leave requests</p>
              {[
                ["Ayesha Khan", "Approved", "green"],
                ["Bilal Raza", "Approved", "green"],
                ["Sara Malik", "Pending", "amber"],
              ].map(([n, s, t]) => (
                <div key={n} className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] ${muted} truncate`}>{n}</span>
                  <Pill tone={t}>{s}</Pill>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureTour() {
  const [active, setActive] = useState(0);
  const { title, text, Mock } = TOUR[active];
  return (
    <div className="mt-12">
      <div role="tablist" aria-label="Product tour" className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {TOUR.map(({ key, icon: Icon, label }, i) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`shrink-0 inline-flex items-center gap-2 h-10 px-4 rounded-full text-[14px] font-medium border transition-colors ${
              i === active
                ? "bg-[#0D0D0D] text-white border-[#0D0D0D] dark:bg-[#C4FF73] dark:text-[#0D0D0D] dark:border-[#C4FF73]"
                : "border-[#DDE7E0] dark:border-[#26322A] hover:border-[#09BF64]"
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-6 grid lg:grid-cols-[1fr_1.7fr] gap-8 lg:gap-12 items-start rounded-3xl bg-[#FAFDFB] dark:bg-[#0D120F] border border-[#EEF3EF] dark:border-[#1A221D] p-5 sm:p-8">
        <div className="lg:pt-4">
          <p className="text-[13px] font-semibold text-[#09BF64]">
            {active + 1} / {TOUR.length}
          </p>
          <h3 className="mt-2 text-[24px] sm:text-[28px] font-bold leading-tight">{title}</h3>
          <p className={`mt-4 text-[15px] leading-relaxed ${muted}`}>{text}</p>
          <button
            type="button"
            onClick={() => setActive((active + 1) % TOUR.length)}
            className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-[#09BF64] hover:gap-3 transition-all"
          >
            Next: {TOUR[(active + 1) % TOUR.length].label} <ArrowRight size={16} />
          </button>
        </div>
        <div key={active} className="landing-fade">
          <Mock />
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  return (
    <details className="group rounded-2xl border border-[#EEF3EF] dark:border-[#1A221D] bg-white dark:bg-[#111613] px-5 open:pb-5">
      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-5 text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
        {q}
        <ChevronDown size={18} className="shrink-0 text-[#09BF64] transition-transform group-open:rotate-180" />
      </summary>
      <p className={`text-[15px] leading-relaxed ${muted}`}>{a}</p>
    </details>
  );
}

/* ───────────────────────── Page ───────────────────────── */

export default function Landing() {
  const { user } = useAuth();
  const cta = user ? { to: "/dashboard", label: "Open dashboard" } : { to: "/login", label: "Sign in" };

  return (
    <div className="landing min-h-screen bg-white dark:bg-[#0A0D0B] text-[#0D0D0D] dark:text-white overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-[#0A0D0B]/80 border-b border-[#EEF3EF] dark:border-[#1A221D]">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" aria-label="Markeltree home">
            <Logo className="h-7 w-auto" />
          </Link>
          <div className={`hidden md:flex items-center gap-8 text-[14px] ${muted}`}>
            <a href="#how" className="hover:text-[#09BF64]">How it works</a>
            <a href="#tour" className="hover:text-[#09BF64]">Features</a>
            <a href="#roles" className="hover:text-[#09BF64]">Who uses it</a>
            <a href="#faq" className="hover:text-[#09BF64]">FAQ</a>
          </div>
          <Link
            to={cta.to}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#0D0D0D] dark:bg-white text-white dark:text-[#0D0D0D] text-[14px] font-medium hover:bg-[#09BF64] dark:hover:bg-[#C4FF73] transition-colors"
          >
            {cta.label} <ArrowRight size={15} />
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative px-4 sm:px-6 pt-16 sm:pt-20 pb-16">
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-[560px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(196,255,115,0.45),transparent_70%)] dark:bg-[radial-gradient(60%_60%_at_50%_0%,rgba(9,191,100,0.22),transparent_70%)]" />
        <div className="relative max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#CDEEDB] dark:border-[#1F3A2A] bg-[#F4FBF6] dark:bg-[#0F1A13] px-3.5 py-1.5 text-[13px] font-medium text-[#078A49] dark:text-[#81D959]">
            <Users size={14} /> Employee Management System
          </span>
          <h1 className="mt-6 mx-auto max-w-4xl text-[36px] sm:text-[56px] leading-[1.06] font-extrabold tracking-tight">
            Attendance, leave, tasks and payroll,{" "}
            <span className="bg-gradient-to-r from-[#09BF64] to-[#81D959] bg-clip-text text-transparent">all in one app.</span>
          </h1>
          <p className={`mt-6 mx-auto max-w-2xl text-[17px] sm:text-[18px] leading-relaxed ${muted}`}>
            Markeltree is a web app that runs a company's day-to-day HR. Employees check in and apply for leave, managers
            approve, and HR gets reports and payslips automatically, with no spreadsheets or paper forms.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to={cta.to}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[#09BF64] text-white text-[15px] font-semibold shadow-[0_10px_30px_-10px_rgba(9,191,100,0.8)] hover:bg-[#07A856] transition-colors"
            >
              {cta.label} <ArrowRight size={17} />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center h-12 px-6 rounded-xl border border-[#DDE7E0] dark:border-[#26322A] bg-white/60 dark:bg-transparent text-[15px] font-semibold hover:border-[#09BF64] transition-colors"
            >
              Try the live demo
            </Link>
          </div>
          <div className={`mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] ${muted}`}>
            {["Nothing to install, runs in the browser", "Separate access for every role", "Live chat and notifications"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <Check size={15} className="text-[#09BF64]" /> {t}
              </span>
            ))}
          </div>
          <div className="mt-14">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Before / after */}
      <Section
        id="problem"
        eyebrow="The problem it solves"
        title="What changes when a company uses Markeltree"
        intro="Most small and mid-size companies manage HR with registers, spreadsheets and chat groups. Here's what each job looks like before and after."
        className="bg-[#FAFDFB] dark:bg-[#0D120F]"
      >
        <div className="mt-10 rounded-2xl border border-[#EEF3EF] dark:border-[#1A221D] overflow-hidden bg-white dark:bg-[#111613]">
          <div className="hidden md:grid grid-cols-[160px_1fr_1fr] text-[13px] font-semibold uppercase tracking-wider bg-[#F4F7F5] dark:bg-[#0F1411]">
            <div className="px-6 py-4 text-[#8E9A93]">Task</div>
            <div className="px-6 py-4 text-[#D2453A] dark:text-[#FF8A80]">Before</div>
            <div className="px-6 py-4 text-[#078A49] dark:text-[#81D959]">With Markeltree</div>
          </div>
          {BEFORE_AFTER.map(([task, before, after]) => (
            <div key={task} className="grid md:grid-cols-[160px_1fr_1fr] border-t border-[#EEF3EF] dark:border-[#1A221D] first:border-t-0 md:first:border-t">
              <div className="px-6 pt-5 md:py-5 text-[15px] font-bold">{task}</div>
              <div className={`px-6 py-2 md:py-5 flex gap-3 text-[14px] ${muted}`}>
                <X size={17} className="mt-0.5 shrink-0 text-[#FF695B]" /> {before}
              </div>
              <div className="px-6 pb-5 pt-1 md:py-5 flex gap-3 text-[14px]">
                <Check size={17} className="mt-0.5 shrink-0 text-[#09BF64]" /> {after}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section
        id="how"
        eyebrow="How it works"
        title="Four steps, from setup to month-end"
        intro="Here is how work moves through the system over a normal month."
        center
      >
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-px bg-gradient-to-r from-[#C4FF73] via-[#09BF64] to-[#C4FF73]" />
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="relative text-center">
              <div className="relative mx-auto w-14 h-14 rounded-2xl grid place-items-center bg-[#09BF64] text-white shadow-[0_10px_30px_-10px_rgba(9,191,100,0.8)]">
                <Icon size={24} />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#C4FF73] text-[#0D0D0D] text-[12px] font-bold grid place-items-center">{i + 1}</span>
              </div>
              <h3 className="mt-5 text-[17px] font-semibold">{title}</h3>
              <p className={`mt-2 text-[14px] leading-relaxed ${muted}`}>{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Feature tour */}
      <Section
        id="tour"
        eyebrow="Product tour"
        title="See what each screen does"
        intro="Click a feature to see a simplified version of the screen and what it's for."
        className="border-t border-[#EEF3EF] dark:border-[#1A221D]"
      >
        <FeatureTour />
      </Section>

      {/* Roles */}
      <Section
        id="roles"
        eyebrow="Who uses it"
        title="One app, a different view for each role"
        intro="People only see what their role allows. An employee sees their own records, a manager sees their team, and HR sees the whole company."
        className="bg-[#FAFDFB] dark:bg-[#0D120F]"
      >
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ROLES.map((r, i) => (
            <div key={r.name} className="rounded-2xl p-6 bg-white dark:bg-[#111613] border border-[#EEF3EF] dark:border-[#1A221D]">
              <span className="w-9 h-9 rounded-xl grid place-items-center text-[14px] font-bold bg-[#C4FF73] text-[#0D0D0D]">{i + 1}</span>
              <h3 className="mt-4 text-[17px] font-semibold">{r.name}</h3>
              <p className={`text-[13px] ${muted}`}>{r.desc}</p>
              <ul className="mt-5 space-y-2.5">
                {r.points.map((p) => (
                  <li key={p} className={`flex gap-2 text-[14px] ${muted}`}>
                    <Check size={16} className="mt-0.5 text-[#09BF64] shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* All modules */}
      <Section id="modules" eyebrow="Everything included" title="9 modules that share the same data" intro="An employee is added once and then appears in attendance, leave, tasks, payroll, chat and reports.">
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4 rounded-2xl p-5 border border-[#EEF3EF] dark:border-[#1A221D] hover:border-[#09BF64] transition-colors">
              <div className="w-10 h-10 rounded-xl grid place-items-center bg-[#E6F8EE] dark:bg-[#12291C] text-[#09BF64] shrink-0">
                <Icon size={19} />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold">{title}</h3>
                <p className={`mt-1 text-[14px] ${muted}`}>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Security + stack */}
      <Section
        id="security"
        eyebrow="Security & technology"
        title="Built to protect salary and personal data"
        className="bg-[#FAFDFB] dark:bg-[#0D120F]"
      >
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {SECURITY.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 rounded-2xl p-6 bg-white dark:bg-[#111613] border border-[#EEF3EF] dark:border-[#1A221D]">
              <div className="w-10 h-10 rounded-lg grid place-items-center bg-[#0D0D0D] dark:bg-[#C4FF73] text-[#C4FF73] dark:text-[#0D0D0D] shrink-0">
                <Icon size={19} />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold">{title}</h3>
                <p className={`mt-1.5 text-[14px] leading-relaxed ${muted}`}>{text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-2.5">
          <span className={`mr-2 text-[13px] font-semibold ${muted} inline-flex items-center gap-1.5`}>
            <Globe size={15} /> Built with
          </span>
          {STACK.map((s) => (
            <span key={s} className="px-3.5 py-1.5 rounded-full text-[13px] font-medium border border-[#DDE7E0] dark:border-[#26322A] bg-white dark:bg-[#111613]">
              {s}
            </span>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" eyebrow="FAQ" title="Common questions" center>
        <div className="mt-10 max-w-3xl mx-auto space-y-3">
          {FAQ.map(([q, a]) => (
            <FaqItem key={q} q={q} a={a} />
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden bg-[#0D0D0D] px-6 sm:px-12 py-14 sm:py-16">
          <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#09BF64]/30 blur-3xl" />
          <div className="pointer-events-none absolute right-24 bottom-0 w-60 h-60 rounded-full bg-[#C4FF73]/20 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-bold text-white leading-tight">Already have an account?</h2>
              <p className="mt-3 text-[16px] text-[#A9C2B3] max-w-lg">Sign in with the email and password your HR team sent you.</p>
            </div>
            <Link
              to={cta.to}
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-[#C4FF73] text-[#0D0D0D] text-[15px] font-semibold hover:bg-white transition-colors shrink-0"
            >
              {cta.label} <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-4 sm:px-6 py-10 border-t border-[#EEF3EF] dark:border-[#1A221D]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo className="h-6 w-auto" />
          <p className="text-[13px] text-[#8E9A93]">© {new Date().getFullYear()} Markeltree. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
