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
  Lock,
  KeyRound,
  History,
  Gauge,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";

const MODULES = [
  { icon: Users, title: "People & org chart", text: "Employee profiles, departments, teams and reporting lines, with a live org chart." },
  { icon: Clock, title: "Attendance", text: "One-click check-in and check-out, monthly calendars and late-arrival tracking for every employee." },
  { icon: CalendarDays, title: "Leave management", text: "Leave policies, balances and holidays, with request and approval routed to the right manager." },
  { icon: KanbanSquare, title: "Tasks & projects", text: "Drag-and-drop Kanban boards, priorities, due dates and assignees, so everyone knows what's next." },
  { icon: Wallet, title: "Payroll", text: "Monthly payroll runs with attendance-based deductions, per-employee tax and downloadable PDF payslips." },
  { icon: MessagesSquare, title: "Team chat", text: "Real-time direct and group messaging, built into the workspace instead of a separate app." },
  { icon: Megaphone, title: "Announcements", text: "Company-wide or targeted announcements plus instant in-app notifications." },
  { icon: BarChart3, title: "Reports", text: "Attendance, leave and headcount reports for teams or the whole company, exportable to CSV." },
  { icon: ShieldCheck, title: "Admin & audit", text: "Custom roles, granular permissions, system settings and a full audit trail of sensitive actions." },
];

const ROLES = [
  { name: "Employee", points: ["Check in and out", "Apply for leave", "Track own tasks", "Download payslips"] },
  { name: "Team Lead & Manager", points: ["Approve team leave", "Assign and review tasks", "Team attendance view", "Team reports"] },
  { name: "HR Admin", points: ["Onboard employees", "Leave policies & holidays", "Org structure", "Company-wide reports"] },
  { name: "Super Admin", points: ["Roles & permissions", "Payroll runs", "System settings", "Audit log"] },
];

const STACK = ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "TypeScript", "Prisma", "PostgreSQL", "Supabase Realtime", "Vercel"];

const SECURITY = [
  { icon: Lock, title: "Server-side access control", text: "Every endpoint checks the caller's role and permissions. The UI never decides what someone may see." },
  { icon: KeyRound, title: "Secure sessions", text: "Short-lived access tokens with rotating refresh tokens kept in httpOnly cookies." },
  { icon: History, title: "Audit trail", text: "Changes to people, roles, payroll and settings are logged with who did what and when." },
  { icon: Gauge, title: "Rate limiting & hardening", text: "Login throttling, request limits and security headers on every response." },
];

function Section({ id, eyebrow, title, intro, children, className = "" }) {
  return (
    <section id={id} className={`scroll-mt-20 px-4 sm:px-6 py-20 lg:py-28 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#09BF64]">{eyebrow}</p>
          <h2 className="mt-3 text-[30px] sm:text-[38px] leading-[1.15] font-bold tracking-tight text-[#0D0D0D] dark:text-white">{title}</h2>
          {intro && <p className="mt-4 text-[16px] leading-relaxed text-[#5B6660] dark:text-[#A9C2B3]">{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

/** Static product preview for the hero: an illustration of the dashboard, not live data. */
function DashboardPreview() {
  const bars = [62, 78, 70, 88, 94, 81, 90];
  return (
    <div className="relative rounded-2xl border border-[#E3EFE7] dark:border-[#1F2B23] bg-white dark:bg-[#111613] shadow-[0_30px_80px_-20px_rgba(9,191,100,0.35)] overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 h-10 border-b border-[#EEF3EF] dark:border-[#1F2B23]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF695B]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FFC145]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#09BF64]" />
        <span className="ml-3 text-[11px] text-[#8E9A93]">app.markeltree / dashboard</span>
      </div>
      <div className="flex">
        <aside className="hidden sm:flex flex-col gap-2 w-40 p-4 border-r border-[#EEF3EF] dark:border-[#1F2B23]">
          {["Dashboard", "Employees", "Attendance", "Leave", "Tasks", "Payroll", "Chat"].map((l, i) => (
            <span
              key={l}
              className={`text-[12px] px-2.5 py-1.5 rounded-md ${i === 0 ? "bg-[#09BF64] text-white font-medium" : "text-[#6F7C74] dark:text-[#A9C2B3]"}`}
            >
              {l}
            </span>
          ))}
        </aside>
        <div className="flex-1 p-4 sm:p-5 space-y-4 min-w-0">
          <div className="grid grid-cols-3 gap-3">
            {[
              ["Present today", "142", "+4%"],
              ["On leave", "9", "3 pending"],
              ["Open tasks", "37", "12 due"],
            ].map(([k, v, s]) => (
              <div key={k} className="rounded-xl bg-[#F4FBF6] dark:bg-[#16201A] p-3">
                <p className="text-[10px] sm:text-[11px] text-[#6F7C74] dark:text-[#A9C2B3] truncate">{k}</p>
                <p className="text-[18px] sm:text-[22px] font-bold text-[#0D0D0D] dark:text-white">{v}</p>
                <p className="text-[10px] text-[#09BF64] font-medium truncate">{s}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3 rounded-xl border border-[#EEF3EF] dark:border-[#1F2B23] p-3">
              <p className="text-[11px] font-semibold text-[#0D0D0D] dark:text-white">Weekly attendance</p>
              <div className="mt-3 flex items-end gap-2 h-24">
                {bars.map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-[#09BF64] to-[#C4FF73]" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="col-span-2 rounded-xl border border-[#EEF3EF] dark:border-[#1F2B23] p-3 space-y-2">
              <p className="text-[11px] font-semibold text-[#0D0D0D] dark:text-white">Leave requests</p>
              {["Ayesha K.", "Bilal R.", "Sara M."].map((n, i) => (
                <div key={n} className="flex items-center justify-between gap-1">
                  <span className="text-[10px] sm:text-[11px] text-[#5B6660] dark:text-[#A9C2B3] truncate">{n}</span>
                  <span
                    className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      i === 2 ? "bg-[#FFF4DB] text-[#B7791F]" : "bg-[#E6F8EE] text-[#078A49]"
                    }`}
                  >
                    {i === 2 ? "Pending" : "Approved"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
          <div className="hidden md:flex items-center gap-8 text-[14px] text-[#5B6660] dark:text-[#A9C2B3]">
            <a href="#modules" className="hover:text-[#09BF64]">Modules</a>
            <a href="#roles" className="hover:text-[#09BF64]">Roles</a>
            <a href="#security" className="hover:text-[#09BF64]">Security</a>
            <a href="#stack" className="hover:text-[#09BF64]">Tech stack</a>
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
      <section className="relative px-4 sm:px-6 pt-16 sm:pt-24 pb-20">
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(196,255,115,0.45),transparent_70%)] dark:bg-[radial-gradient(60%_60%_at_50%_0%,rgba(9,191,100,0.22),transparent_70%)]" />
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-14 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#CDEEDB] dark:border-[#1F3A2A] bg-[#F4FBF6] dark:bg-[#0F1A13] px-3 py-1 text-[12px] font-medium text-[#078A49] dark:text-[#81D959]">
              <Zap size={13} /> Employee management & collaboration platform
            </span>
            <h1 className="mt-6 text-[38px] sm:text-[52px] leading-[1.05] font-extrabold tracking-tight">
              Your whole team,
              <br />
              <span className="bg-gradient-to-r from-[#09BF64] to-[#81D959] bg-clip-text text-transparent">one workspace.</span>
            </h1>
            <p className="mt-6 text-[17px] leading-relaxed text-[#5B6660] dark:text-[#A9C2B3] max-w-xl">
              Markeltree brings people, attendance, leave, tasks, payroll and team chat into a single platform, with
              role-based access and live updates for everyone from new joiners to the CEO.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={cta.to}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[#09BF64] text-white text-[15px] font-semibold shadow-[0_10px_30px_-10px_rgba(9,191,100,0.8)] hover:bg-[#07A856] transition-colors"
              >
                {cta.label} <ArrowRight size={17} />
              </Link>
              <a
                href="#modules"
                className="inline-flex items-center h-12 px-6 rounded-xl border border-[#DDE7E0] dark:border-[#26322A] text-[15px] font-semibold hover:border-[#09BF64] transition-colors"
              >
                Explore features
              </a>
            </div>
          </div>
          <DashboardPreview />
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 rounded-2xl border border-[#EEF3EF] dark:border-[#1A221D] divide-x divide-y md:divide-y-0 divide-[#EEF3EF] dark:divide-[#1A221D] overflow-hidden">
          {[
            ["9", "integrated modules"],
            ["5", "built-in roles, plus custom ones"],
            ["Real-time", "chat and notifications"],
            ["1", "platform instead of five tools"],
          ].map(([v, l]) => (
            <div key={l} className="p-6 bg-[#FAFDFB] dark:bg-[#0D120F]">
              <p className="text-[28px] font-extrabold text-[#09BF64]">{v}</p>
              <p className="mt-1 text-[14px] text-[#5B6660] dark:text-[#A9C2B3]">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Challenge / solution */}
      <Section
        id="about"
        eyebrow="Why we built it"
        title="From scattered spreadsheets to a single source of truth"
      >
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-7 bg-[#F7F8F7] dark:bg-[#111613] border border-[#EEF0EE] dark:border-[#1A221D]">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-[#8E9A93]">The challenge</p>
            <ul className="mt-5 space-y-3 text-[15px] text-[#3F4843] dark:text-[#C9D6CE]">
              {[
                "Attendance kept in spreadsheets and reconciled by hand every month",
                "Leave requests lost in email and messaging threads",
                "Tasks, announcements and chat spread across separate apps",
                "Payroll calculated manually from several disconnected sources",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#FF695B] shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl p-7 bg-gradient-to-br from-[#0B1F14] to-[#0D2E1C] text-white">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-[#81D959]">The solution</p>
            <ul className="mt-5 space-y-3 text-[15px] text-[#DDF5E6]">
              {[
                "Check-in data flows straight into reports and payroll",
                "Leave requests go to the right approver, and balances update automatically",
                "Tasks, announcements and chat live in the same workspace",
                "Payslips are generated as PDFs and employees download their own",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check size={18} className="mt-0.5 text-[#C4FF73] shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Modules */}
      <Section
        id="modules"
        eyebrow="Modules"
        title="Everything HR and your teams need, connected"
        intro="Each module shares the same employee records, permissions and notifications, so data entered once shows up everywhere it's needed."
        className="bg-[#FAFDFB] dark:bg-[#0D120F]"
      >
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group rounded-2xl p-6 bg-white dark:bg-[#111613] border border-[#EEF3EF] dark:border-[#1A221D] hover:border-[#09BF64] hover:-translate-y-0.5 transition-all"
            >
              <div className="w-11 h-11 rounded-xl grid place-items-center bg-[#E6F8EE] dark:bg-[#12291C] text-[#09BF64] group-hover:bg-[#09BF64] group-hover:text-white transition-colors">
                <Icon size={21} />
              </div>
              <h3 className="mt-5 text-[17px] font-semibold">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#5B6660] dark:text-[#A9C2B3]">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Roles */}
      <Section
        id="roles"
        eyebrow="Role-based access"
        title="Everyone sees exactly what they need"
        intro="Five roles come built in, and admins can create more with any mix of permissions."
      >
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ROLES.map((r, i) => (
            <div key={r.name} className="rounded-2xl p-6 border border-[#EEF3EF] dark:border-[#1A221D]">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full grid place-items-center text-[12px] font-bold bg-[#C4FF73] text-[#0D0D0D]">{i + 1}</span>
                <h3 className="text-[16px] font-semibold">{r.name}</h3>
              </div>
              <ul className="mt-5 space-y-2.5">
                {r.points.map((p) => (
                  <li key={p} className="flex gap-2 text-[14px] text-[#5B6660] dark:text-[#A9C2B3]">
                    <Check size={16} className="mt-0.5 text-[#09BF64] shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Security */}
      <Section
        id="security"
        eyebrow="Security"
        title="Built for sensitive people data"
        intro="Salaries, personal details and attendance records need more than a login screen."
        className="bg-[#FAFDFB] dark:bg-[#0D120F]"
      >
        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {SECURITY.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 rounded-2xl p-6 bg-white dark:bg-[#111613] border border-[#EEF3EF] dark:border-[#1A221D]">
              <div className="w-10 h-10 rounded-lg grid place-items-center bg-[#0D0D0D] dark:bg-[#C4FF73] text-[#C4FF73] dark:text-[#0D0D0D] shrink-0">
                <Icon size={19} />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold">{title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[#5B6660] dark:text-[#A9C2B3]">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Stack */}
      <Section
        id="stack"
        eyebrow="Under the hood"
        title="A modern, typed, full-stack build"
        intro="A React single-page app talks to a TypeScript REST API backed by PostgreSQL, with Supabase Realtime for live chat and notifications."
      >
        <div className="mt-10 flex flex-wrap gap-2.5">
          {STACK.map((s) => (
            <span
              key={s}
              className="px-4 py-2 rounded-full text-[14px] font-medium border border-[#DDE7E0] dark:border-[#26322A] bg-white dark:bg-[#111613]"
            >
              {s}
            </span>
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
              <h2 className="text-[28px] sm:text-[36px] font-bold text-white leading-tight">Ready to get started?</h2>
              <p className="mt-3 text-[16px] text-[#A9C2B3] max-w-lg">
                Sign in with the account your HR team created for you.
              </p>
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
