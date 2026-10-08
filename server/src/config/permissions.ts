/**
 * Permission catalogue (module.action). Server-side authorization is always
 * enforced against these keys — the frontend only uses them to hide UI.
 * Scope suffixes: *_own (implicit for every user), *_team (direct + indirect reports), *_all.
 */
export const PERMISSIONS = {
  // Employees / organization
  EMPLOYEES_VIEW_TEAM: "employees.view_team",
  EMPLOYEES_VIEW_ALL: "employees.view_all",
  EMPLOYEES_CREATE: "employees.create",
  EMPLOYEES_UPDATE: "employees.update",
  EMPLOYEES_DELETE: "employees.delete",
  EMPLOYEES_VIEW_SENSITIVE: "employees.view_sensitive",
  EMPLOYEES_EXPORT: "employees.export",
  ORG_MANAGE: "org.manage", // departments & teams

  // Attendance
  ATTENDANCE_VIEW_TEAM: "attendance.view_team",
  ATTENDANCE_VIEW_ALL: "attendance.view_all",
  ATTENDANCE_ADJUST: "attendance.adjust",

  // Leave
  LEAVE_APPROVE_TEAM: "leave.approve_team",
  LEAVE_APPROVE_ALL: "leave.approve_all",
  LEAVE_VIEW_ALL: "leave.view_all",
  LEAVE_MANAGE_POLICY: "leave.manage_policy", // leave types, balances
  HOLIDAYS_MANAGE: "holidays.manage",

  // Tasks & projects
  TASKS_CREATE: "tasks.create",
  TASKS_VIEW_TEAM: "tasks.view_team",
  TASKS_VIEW_ALL: "tasks.view_all",
  TASKS_MANAGE_ALL: "tasks.manage_all",
  PROJECTS_CREATE: "projects.create",
  PROJECTS_VIEW_ALL: "projects.view_all",
  PROJECTS_MANAGE_ALL: "projects.manage_all",

  // Collaboration
  CHAT_CREATE_GROUP: "chat.create_group",
  CHAT_MANAGE: "chat.manage",
  FILES_COMPANY_MANAGE: "files.company_manage",
  FILES_HR_ACCESS: "files.hr_access",
  ANNOUNCEMENTS_CREATE: "announcements.create",
  ANNOUNCEMENTS_MANAGE: "announcements.manage",

  // Payroll — held only by Super Admin by default (salary data is confidential)
  PAYROLL_MANAGE: "payroll.manage", // salary structures, draft runs, adjustments, payslips
  PAYROLL_APPROVE: "payroll.approve", // approve / reopen runs and mark them paid

  // Reports
  REPORTS_VIEW_TEAM: "reports.view_team",
  REPORTS_VIEW_ALL: "reports.view_all",

  // Administration
  ADMIN_USERS: "admin.users",
  ADMIN_ROLES: "admin.roles",
  ADMIN_SETTINGS: "admin.settings",
  ADMIN_AUDIT: "admin.audit",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS) as PermissionKey[];

const P = PERMISSIONS;

/** Default system roles (FRD §6 / §12). Admins can create further roles in the UI. */
export const DEFAULT_ROLES: { name: string; description: string; permissions: PermissionKey[] }[] = [
  {
    name: "Super Admin",
    description: "Full system configuration, users, roles, permissions, audit and all modules",
    permissions: ALL_PERMISSIONS,
  },
  {
    name: "HR Admin",
    description: "Employee records, attendance, leave, documents and HR reports",
    permissions: [
      P.EMPLOYEES_VIEW_ALL, P.EMPLOYEES_CREATE, P.EMPLOYEES_UPDATE, P.EMPLOYEES_DELETE,
      P.EMPLOYEES_VIEW_SENSITIVE, P.EMPLOYEES_EXPORT, P.ORG_MANAGE,
      P.ATTENDANCE_VIEW_ALL, P.ATTENDANCE_ADJUST,
      P.LEAVE_APPROVE_ALL, P.LEAVE_VIEW_ALL, P.LEAVE_MANAGE_POLICY, P.HOLIDAYS_MANAGE,
      P.TASKS_CREATE, P.PROJECTS_CREATE, P.CHAT_CREATE_GROUP,
      P.FILES_HR_ACCESS, P.ANNOUNCEMENTS_CREATE, P.ANNOUNCEMENTS_MANAGE,
      P.REPORTS_VIEW_ALL, P.ADMIN_USERS,
    ],
  },
  {
    name: "Manager",
    description: "Team members, attendance visibility, leave approvals, tasks, projects, reports",
    permissions: [
      P.EMPLOYEES_VIEW_TEAM, P.ATTENDANCE_VIEW_TEAM, P.LEAVE_APPROVE_TEAM,
      P.TASKS_CREATE, P.TASKS_VIEW_TEAM, P.PROJECTS_CREATE,
      P.CHAT_CREATE_GROUP, P.ANNOUNCEMENTS_CREATE, P.REPORTS_VIEW_TEAM,
    ],
  },
  {
    name: "Team Lead",
    description: "Assigned team operations, task/project management, team communication",
    permissions: [
      P.EMPLOYEES_VIEW_TEAM, P.ATTENDANCE_VIEW_TEAM, P.LEAVE_APPROVE_TEAM,
      P.TASKS_CREATE, P.TASKS_VIEW_TEAM, P.CHAT_CREATE_GROUP, P.REPORTS_VIEW_TEAM,
    ],
  },
  {
    name: "Employee",
    description: "Own profile, attendance, leave, assigned tasks, projects, chat, permitted files",
    permissions: [P.TASKS_CREATE],
  },
];

export const describePermission = (key: string) => {
  const [module, action] = key.split(".");
  return { module, action };
};
