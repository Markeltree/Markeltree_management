# Markeltree — Employee Management & Collaboration Platform

Internal platform for employee records, attendance, leave, tasks, announcements, notifications, reports and administration, built from the FRD/SRS v1.0.

- **Frontend:** React 19 + Vite + PrimeReact + Tailwind (repo root, `src/`)
- **Backend:** Node.js + Express 5 + TypeScript + Prisma (`server/`)
- **Database:** PostgreSQL on **Supabase**

## Getting started

### 1. Database (Supabase)

1. Create a Supabase project.
2. Open **Connect → ORMs → Prisma** in the Supabase dashboard and copy the two connection strings.
3. Paste them into `server/.env`. Use the **session pooler (port 5432)** for both `DATABASE_URL` and `DIRECT_URL` — the transaction pooler (6543) adds ~400 ms to every query with Prisma on a long-running server. See `server/.env.example`.
4. For live chat and notifications, also set `SUPABASE_URL` and `SUPABASE_ANON_KEY` (Project Settings → API Keys). Without them the app still works and falls back to polling.

### 2. API

```bash
npm run setup:api                 # install server dependencies
cd server
npm run db:deploy                 # create the tables (applies prisma/migrations)
npm run db:seed                   # permissions, roles, leave types, first Super Admin
npm run dev                       # http://localhost:4000/api
```

The seed creates `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `server/.env` (default `admin@company.com` / `ChangeMe!2026`). **Change the password after the first login** (My Profile → Security).

### 3. Frontend

```bash
npm install
npm run dev                       # http://localhost:5173 (proxies /api to :4000)
```

To point the frontend at a different API in development, set `VITE_API_PROXY`. For a production build served from another origin, set `VITE_API_URL`.

## What's implemented

| Area | Status | Notes |
|---|---|---|
| Authentication | ✅ | Login, refresh-token rotation (httpOnly cookie), logout / logout everywhere, forgot/reset via 6-digit code, change password, rate limiting, immediate session revocation on suspend/offboard |
| Roles & permissions | ✅ | 5 system roles + custom roles, 35 module/action permissions, own/team/all scoping enforced server-side |
| Employees | ✅ | Directory, profiles with restricted fields, self-service edits, employment history, org chart, onboarding (invite or password), offboarding, CSV export |
| Departments & teams | ✅ | CRUD, heads and leads |
| Attendance | ✅ | Check-in/out, policy-based status (late/early), calendar, team/company board, HR adjustments with reason + audit, monthly report |
| Leave | ✅ | Leave types, balances, working-day calculation, overlap & balance checks, manager → HR fallback approval, request changes/resubmit, cancel, holidays, calendar, report |
| Tasks | ✅ | List + Kanban (drag to change status), priority, due dates, checklists, comments with @mentions, workload report |
| Projects | API ✅ / UI ⏳ | Projects, members, progress, activity (tasks can already be linked to projects) |
| Announcements | ✅ | Audience targeting, pinning, acknowledgement tracking |
| Notifications | ✅ | Notification centre, bell, preferences (critical types can't be muted) |
| Dashboards | ✅ | Employee, Manager, HR and Admin sections by permission |
| Reports | ✅ | Attendance, leave, task workload, employee directory — CSV export |
| Administration | ✅ | Users & account status, roles, leave types, policies, audit log (filter + CSV) |
| Chat | ✅ | Direct messages, groups, channels, history paging, edit/delete, @mentions, typing indicator, read receipts, search, pop-up alerts |
| Payroll | ✅ | Versioned salary structures (allowances, deductions, fixed/% tax), monthly runs with attendance-based unpaid days, review adjustments, approve → paid workflow, bank CSV, employee payslip PDFs. Managed by the Super Admin only (payroll permissions can be granted to a custom role later if needed) |
| Real-time | ✅ | Supabase Realtime Broadcast for chat and notifications; automatic polling fallback |
| Files | ⏳ | Schema ready; planned on Supabase Storage |
| Email delivery | ⏳ | Reset/activation codes are printed to the API log until an email provider is configured |

## Project layout

```
server/
  prisma/schema.prisma        data model (FRD §11)
  prisma/migrations/          SQL migrations (incl. RLS lock-down for Supabase)
  prisma/seed.ts              idempotent seed
  src/config/permissions.ts   permission catalogue + default roles (FRD §12)
  src/modules/*.ts            auth, employees, attendance, leave, tasks, projects,
                              announcements, notifications, admin, dashboard
src/
  lib/api.js                  API client (silent token refresh)
  context/AuthContext.jsx     session + can(permission)
  components/hr/              shared UI kit and HR components
  pages/hr/                   HR module pages
```

## Performance

- **API:** in-process cache (auth context, policies, reporting lines, lookup lists, dashboard aggregates) with tag-based invalidation on every write (`server/src/lib/cache.ts`, `lib/invalidate.ts`); nested relations load with SQL joins (`relationJoins`); gzip compression.
- **Frontend:** `useQuery` (stale-while-revalidate — cached data renders instantly and refreshes in the background), de-duplicated in-flight requests, automatic cache invalidation after writes, debounced search inputs.
- The cache is per process. If the API is scaled to several instances, swap `lib/cache.ts` for Redis.

## Real-time design

The app uses its own authentication, so each user listens on a private, unguessable Supabase Broadcast topic (an HMAC of their user id) that the API hands out after login. Broadcasts carry only signals (e.g. "new message in conversation X"), never message text; the browser then fetches the content through the authenticated API. A guessed or spoofed topic can't read or inject data.

## Security notes

- Authorization is enforced by the API on every request; hiding menu items is only a convenience.
- Passwords use bcrypt (cost 12). Access tokens live in memory (15 min); refresh tokens are httpOnly cookies, stored hashed and revocable.
- Sensitive actions (employee changes, attendance adjustments, approvals, role/permission changes, exports, logins) are written to the audit log.
- Every table has Row Level Security enabled with no policies, so Supabase's public Data API cannot read HR data. The backend connects as the table owner and is unaffected. Don't use the Supabase client SDK with the anon key against these tables.

## Open business decisions (FRD §22)

Configure these in **Administration → Policies** once agreed: company timezone (default UTC), working hours and grace periods, working days, office IP restriction for check-in, leave allowances (Administration → Leave Types), file size/type limits.
