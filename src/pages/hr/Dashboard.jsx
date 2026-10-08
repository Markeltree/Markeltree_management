import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import { useAuth } from "@/context/AuthContext";
import CheckInCard from "@/components/hr/CheckInCard";
import { Badge, Empty, ErrorNote, Page, PageHeader, Panel, StatCard } from "@/components/hr/ui";
import { fmtDate, fmtDateTime, humanize, timeAgo, useQuery } from "@/components/hr/utils";

const TASK_STATUSES = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

function TaskBar({ byStatus = {} }) {
  const total = TASK_STATUSES.reduce((s, k) => s + (byStatus[k] ?? 0), 0);
  const colors = { TODO: "#A9BACB", IN_PROGRESS: "#0EA5E9", REVIEW: "#F59E0B", DONE: "#10B981" };
  return (
    <div>
      <div className="flex h-2.5 rounded-full overflow-hidden bg-[#F4F6F9] dark:bg-gray-800">
        {total > 0 &&
          TASK_STATUSES.map((k) => (
            <div key={k} style={{ width: `${((byStatus[k] ?? 0) / total) * 100}%`, background: colors[k] }} title={`${humanize(k)}: ${byStatus[k] ?? 0}`} />
          ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[12px] text-[#6E7A86] dark:text-[#A9BACB]">
        {TASK_STATUSES.map((k) => (
          <span key={k} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: colors[k] }} />
            {humanize(k)} <b className="text-[#0B1B33] dark:text-[#EEF8FD]">{byStatus[k] ?? 0}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { displayName, employeeId } = useAuth();
  const { data: d, error, reload } = useQuery("/dashboard");

  return (
    <Page>
      <PageHeader title="Dashboard" subtitle={`Welcome back, ${displayName}`} />
      <ErrorNote error={error} onRetry={reload} />

      {employeeId && <CheckInCard onChange={reload} />}

      {/* Employee section (DASH-01) */}
      {d?.employee && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Panel title="Leave Balance" subtitle={`Year ${d.date.slice(0, 4)}`} actions={<button className="text-[12px] text-[#0088D1] font-semibold" onClick={() => navigate("/leave")}>Request leave →</button>}>
            <div className="grid grid-cols-2 gap-3">
              {d.employee.leaveBalances.map((b) => (
                <div key={b.leaveType.id} className="rounded-lg border border-[#6E7A8626] p-3">
                  <p className="text-[11px] text-[#8E8E9C] truncate">{b.leaveType.name}</p>
                  <p className="text-[18px] font-bold text-[#0B1B33] dark:text-[#EEF8FD]">{b.unlimited ? "∞" : b.available}</p>
                  <p className="text-[11px] text-[#8E8E9C]">
                    {b.used} used{b.pending ? ` · ${b.pending} pending` : ""}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="My Tasks" actions={<button className="text-[12px] text-[#0088D1] font-semibold" onClick={() => navigate("/task")}>Open tasks →</button>}>
            <TaskBar byStatus={d.employee.tasks.byStatus} />
            {d.employee.tasks.overdue > 0 && (
              <p className="mt-3 text-[12px] text-[#E5483A] font-semibold flex items-center gap-1">
                <Icon icon="mdi:alert-circle-outline" /> {d.employee.tasks.overdue} overdue task(s)
              </p>
            )}
            <h3 className="text-[12px] font-semibold text-[#6E7A86] mt-4 mb-2">Due in the next 7 days</h3>
            {d.employee.tasks.dueSoon.length === 0 ? (
              <p className="text-[12px] text-[#8E8E9C]">Nothing due soon.</p>
            ) : (
              <ul className="space-y-2">
                {d.employee.tasks.dueSoon.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-2 text-[13px] cursor-pointer" onClick={() => navigate(`/task?id=${t.id}`)}>
                    <span className="truncate text-[#0B1B33] dark:text-[#EEF8FD]">{t.title}</span>
                    <span className="flex items-center gap-2 shrink-0">
                      <Badge value={t.priority} />
                      <span className="text-[11px] text-[#8E8E9C]">{fmtDate(t.dueDate)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Announcements" actions={<button className="text-[12px] text-[#0088D1] font-semibold" onClick={() => navigate("/announcements")}>View all →</button>}>
            {d.announcements.length === 0 ? (
              <Empty icon="mdi:bullhorn-outline" text="No announcements." />
            ) : (
              <ul className="space-y-3">
                {d.announcements.map((a) => (
                  <li key={a.id} className="cursor-pointer" onClick={() => navigate(`/announcements?id=${a.id}`)}>
                    <p className="text-[13px] font-semibold text-[#0B1B33] dark:text-[#EEF8FD] flex items-center gap-1">
                      {a.isPinned && <Icon icon="mdi:pin" className="text-[#0088D1]" />}
                      {a.title}
                    </p>
                    <p className="text-[11px] text-[#8E8E9C]">
                      {timeAgo(a.publishedAt)}
                      {a.requiresAcknowledgement && " · acknowledgement required"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}

      {/* Manager section (DASH-02) */}
      {d?.manager?.teamSize > 0 && (
        <Panel title="My Team" subtitle={`${d.manager.teamSize} people report to you`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Present today" value={d.manager.attendanceToday.present} icon="mdi:account-check-outline" tone="success" onClick={() => navigate("/attendance?tab=team")} />
            <StatCard label="On leave today" value={d.manager.attendanceToday.onLeave} icon="mdi:beach" tone="info" />
            <StatCard label="Not checked in" value={d.manager.attendanceToday.notCheckedIn} icon="mdi:account-clock-outline" tone="warning" onClick={() => navigate("/attendance?tab=team")} />
            <StatCard label="Pending leave approvals" value={d.manager.pendingLeaveApprovals} icon="mdi:calendar-clock" tone="primary" onClick={() => navigate("/leave?tab=approvals")} />
          </div>
          <div className="mt-4">
            <h3 className="text-[12px] font-semibold text-[#6E7A86] mb-2">
              Team tasks{d.manager.tasks.overdue ? <span className="text-[#E5483A]"> · {d.manager.tasks.overdue} overdue</span> : null}
            </h3>
            <TaskBar byStatus={d.manager.tasks.byStatus} />
          </div>
        </Panel>
      )}

      {/* HR section (DASH-03) */}
      {d?.hr && (
        <Panel title="Workforce" subtitle="Company-wide HR overview">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <StatCard label="Headcount" value={d.hr.headcount} icon="mdi:account-group-outline" onClick={() => navigate("/employees")} />
            <StatCard label="Present today" value={d.hr.attendanceToday.present} icon="mdi:account-check-outline" tone="success" onClick={() => navigate("/attendance?tab=team")} />
            <StatCard label="Late today" value={d.hr.attendanceToday.late} icon="mdi:clock-alert-outline" tone="warning" />
            <StatCard label="On leave today" value={d.hr.attendanceToday.onLeave} icon="mdi:beach" tone="info" />
            <StatCard label="Pending leave" value={d.hr.pendingLeaveRequests} icon="mdi:calendar-clock" tone="primary" onClick={() => navigate("/leave?tab=approvals")} />
            <StatCard label="Leavers this month" value={d.hr.leaversThisMonth} icon="mdi:account-arrow-right-outline" tone="neutral" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="text-[12px] font-semibold text-[#6E7A86] mb-2">Headcount by department</h3>
              {d.hr.byDepartment.length === 0 ? (
                <p className="text-[12px] text-[#8E8E9C]">No departments yet.</p>
              ) : (
                <ul className="space-y-2">
                  {[...d.hr.byDepartment].sort((a, b) => b.count - a.count).map((r) => (
                    <li key={r.department} className="text-[12px]">
                      <div className="flex justify-between text-[#0B1B33] dark:text-[#EEF8FD]">
                        <span>{r.department}</span>
                        <b>{r.count}</b>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#F4F6F9] dark:bg-gray-800 mt-1">
                        <div className="h-1.5 rounded-full bg-[#0088D1]" style={{ width: `${(r.count / Math.max(1, d.hr.headcount)) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3 className="text-[12px] font-semibold text-[#6E7A86] mb-2">Joined this month</h3>
              {d.hr.joinersThisMonth.length === 0 ? (
                <p className="text-[12px] text-[#8E8E9C]">No new joiners this month.</p>
              ) : (
                <ul className="space-y-2">
                  {d.hr.joinersThisMonth.map((e) => (
                    <li key={e.id} className="flex justify-between text-[13px] cursor-pointer" onClick={() => navigate(`/employees/${e.id}`)}>
                      <span className="text-[#0B1B33] dark:text-[#EEF8FD]">
                        {e.firstName} {e.lastName} <span className="text-[#8E8E9C]">· {e.designation}</span>
                      </span>
                      <span className="text-[11px] text-[#8E8E9C]">{fmtDate(e.joiningDate)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Panel>
      )}

      {/* Admin section (DASH-04) */}
      {d?.admin && (
        <Panel title="System" subtitle="Users, roles and audit highlights">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Active users" value={d.admin.users.ACTIVE ?? 0} icon="mdi:account-key-outline" onClick={() => navigate("/admin?tab=users")} />
            <StatCard label="Pending activation" value={d.admin.users.INVITED ?? 0} icon="mdi:email-fast-outline" tone="info" />
            <StatCard label="Active sessions" value={d.admin.activeSessions} icon="mdi:monitor-account" tone="success" />
            <StatCard
              label="Failed logins (24h)"
              value={d.admin.failedLogins24h}
              icon="mdi:shield-alert-outline"
              tone={d.admin.failedLogins24h > 10 ? "danger" : "neutral"}
              hint={`Database: ${d.admin.systemHealth.database}`}
            />
          </div>
          {d.admin.recentAudit.length > 0 && (
            <>
              <h3 className="text-[12px] font-semibold text-[#6E7A86] mt-4 mb-2">Recent administrative activity</h3>
              <ul className="divide-y divide-[#6E7A8626]">
                {d.admin.recentAudit.map((a) => (
                  <li key={a.id} className="flex justify-between gap-2 py-1.5 text-[12px]">
                    <span className="text-[#0B1B33] dark:text-[#EEF8FD]">
                      <b>{a.action}</b> <span className="text-[#8E8E9C]">on {a.entityType}</span>
                    </span>
                    <span className="text-[#8E8E9C] shrink-0">
                      {a.actor?.email ?? "system"} · {fmtDateTime(a.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>
      )}

      {d && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel title="Recent Activity">
            {d.recentActivity.length === 0 ? (
              <Empty icon="mdi:history" text="No recent activity." />
            ) : (
              <ul className="space-y-2">
                {d.recentActivity.map((n) => (
                  <li key={n.id} className={`text-[13px] ${n.link ? "cursor-pointer" : ""}`} onClick={() => n.link && navigate(n.link)}>
                    <p className="text-[#0B1B33] dark:text-[#EEF8FD] font-semibold">{n.title}</p>
                    <p className="text-[11px] text-[#8E8E9C]">
                      {n.body ? `${n.body.slice(0, 90)} · ` : ""}
                      {timeAgo(n.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Upcoming Holidays">
            {d.upcomingHolidays.length === 0 ? (
              <Empty icon="mdi:calendar-star" text="No upcoming holidays configured." />
            ) : (
              <ul className="space-y-2">
                {d.upcomingHolidays.map((h) => (
                  <li key={h.id} className="flex justify-between text-[13px]">
                    <span className="text-[#0B1B33] dark:text-[#EEF8FD]">{h.name}</span>
                    <span className="text-[#8E8E9C]">{fmtDate(h.date)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}
    </Page>
  );
}
