// Sample data for the public, embeddable demo (/demo). Nothing here comes from the API or the database.

const today = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return iso(d);
};

export const DEPARTMENTS = ["Engineering", "Design", "Sales", "Human Resources", "Operations", "Finance"];

const people = [
  ["Sana", "Iqbal", "HR Manager", "Human Resources", "ACTIVE", "MT-001", "2021-03-01"],
  ["Ayesha", "Khan", "Senior Product Designer", "Design", "ACTIVE", "MT-014", "2022-06-15"],
  ["Bilal", "Raza", "Engineering Lead", "Engineering", "ACTIVE", "MT-007", "2021-09-20"],
  ["Sara", "Malik", "Frontend Engineer", "Engineering", "ACTIVE", "MT-023", "2023-01-09"],
  ["Hamza", "Sheikh", "Backend Engineer", "Engineering", "PROBATION", "MT-041", addDays(-40)],
  ["Zainab", "Ahmed", "Sales Executive", "Sales", "ACTIVE", "MT-031", "2023-04-03"],
  ["Usman", "Tariq", "Sales Manager", "Sales", "ACTIVE", "MT-011", "2022-02-14"],
  ["Fatima", "Noor", "Accountant", "Finance", "ACTIVE", "MT-019", "2022-08-01"],
  ["Ali", "Hassan", "Operations Executive", "Operations", "ON_LEAVE", "MT-027", "2023-02-20"],
  ["Mariam", "Javed", "UI Designer", "Design", "ACTIVE", "MT-036", "2024-05-06"],
  ["Omar", "Farooq", "QA Engineer", "Engineering", "ACTIVE", "MT-033", "2023-07-10"],
  ["Hira", "Aslam", "HR Executive", "Human Resources", "ACTIVE", "MT-038", "2024-01-15"],
  ["Daniyal", "Mirza", "DevOps Engineer", "Engineering", "PROBATION", "MT-043", addDays(-12)],
  ["Nimra", "Saeed", "Operations Manager", "Operations", "NOTICE_PERIOD", "MT-009", "2021-11-01"],
];

export const EMPLOYEES = people.map(([firstName, lastName, designation, department, status, employeeCode, joiningDate], i) => ({
  id: `e${i + 1}`,
  firstName,
  lastName,
  designation,
  department,
  status,
  employeeCode,
  joiningDate,
  email: `${firstName}.${lastName}`.toLowerCase() + "@company.com",
}));

export const byId = Object.fromEntries(EMPLOYEES.map((e) => [e.id, e]));
export const ME = byId.e1; // the demo viewer is Sana, the HR manager

export const ROLES = [
  { key: "EMPLOYEE", label: "Employee", person: byId.e4 },
  { key: "MANAGER", label: "Manager", person: byId.e3 },
  { key: "HR", label: "HR Admin", person: byId.e1 },
  { key: "ADMIN", label: "Super Admin", person: { firstName: "Admin", lastName: "", designation: "Super Admin" } },
];

/** Which demo screens each role can open, mirroring the real app's permissions. */
export const ROLE_SCREENS = {
  EMPLOYEE: ["dashboard", "chat", "attendance", "leave", "tasks", "announcements"],
  MANAGER: ["dashboard", "chat", "employees", "attendance", "leave", "tasks", "announcements", "reports"],
  HR: ["dashboard", "chat", "employees", "attendance", "leave", "tasks", "announcements", "reports", "admin"],
  ADMIN: ["dashboard", "chat", "employees", "attendance", "leave", "tasks", "announcements", "reports", "payroll", "admin"],
};

export const LEAVE_BALANCES = [
  { name: "Annual Leave", available: 9, used: 5, pending: 0 },
  { name: "Casual Leave", available: 6, used: 4, pending: 1 },
  { name: "Sick Leave", available: 8, used: 0, pending: 0 },
  { name: "Unpaid Leave", unlimited: true, used: 0, pending: 0 },
];

export const LEAVE_REQUESTS = [
  { id: "l1", employee: byId.e2, type: "Annual Leave", from: addDays(6), to: addDays(8), days: 3, reason: "Family wedding in Lahore", status: "PENDING" },
  { id: "l2", employee: byId.e11, type: "Sick Leave", from: addDays(0), to: addDays(0), days: 1, reason: "Fever", status: "PENDING" },
  { id: "l3", employee: byId.e6, type: "Casual Leave", from: addDays(3), to: addDays(3), days: 1, reason: "Bank and personal errands", status: "PENDING" },
  { id: "l4", employee: byId.e9, type: "Annual Leave", from: addDays(-2), to: addDays(4), days: 5, reason: "Umrah", status: "APPROVED" },
  { id: "l5", employee: byId.e4, type: "Casual Leave", from: addDays(-15), to: addDays(-15), days: 1, reason: "Moving house", status: "APPROVED" },
  { id: "l6", employee: byId.e10, type: "Annual Leave", from: addDays(-25), to: addDays(-24), days: 2, reason: "Travel", status: "REJECTED" },
];

export const HOLIDAYS = [
  { id: "h1", name: "Iqbal Day", date: addDays(1) },
  { id: "h2", name: "Quaid-e-Azam Day", date: `${today.getFullYear()}-12-25` },
  { id: "h3", name: "New Year's Day", date: `${today.getFullYear() + 1}-01-01` },
];

export const TASK_COLUMNS = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

export const TASKS = [
  { id: "t1", title: "Prepare Q4 hiring plan", priority: "HIGH", status: "TODO", assignee: byId.e1, due: addDays(5) },
  { id: "t2", title: "Update leave policy document", priority: "MEDIUM", status: "TODO", assignee: byId.e12, due: addDays(9) },
  { id: "t3", title: "Design onboarding checklist", priority: "LOW", status: "TODO", assignee: byId.e10, due: addDays(14) },
  { id: "t10", title: "Write tests for leave module", priority: "MEDIUM", status: "TODO", assignee: byId.e4, due: addDays(6) },
  { id: "t11", title: "Dark mode polish for dashboard", priority: "LOW", status: "REVIEW", assignee: byId.e4, due: addDays(2) },
  { id: "t4", title: "Onboard 3 new joiners", priority: "URGENT", status: "IN_PROGRESS", assignee: byId.e1, due: addDays(2) },
  { id: "t5", title: "Payroll API integration", priority: "HIGH", status: "IN_PROGRESS", assignee: byId.e3, due: addDays(4) },
  { id: "t6", title: "Fix attendance export bug", priority: "MEDIUM", status: "IN_PROGRESS", assignee: byId.e4, due: addDays(1) },
  { id: "t7", title: "New brand guidelines", priority: "MEDIUM", status: "REVIEW", assignee: byId.e2, due: addDays(3) },
  { id: "t8", title: "September payroll run", priority: "HIGH", status: "DONE", assignee: byId.e8, due: addDays(-7) },
  { id: "t9", title: "Office laptop audit", priority: "LOW", status: "DONE", assignee: byId.e9, due: addDays(-3) },
];

export const ANNOUNCEMENTS = [
  { id: "a1", title: "Office closed for Iqbal Day", body: "The office will be closed tomorrow for the public holiday. Enjoy the long weekend!", author: byId.e1, at: addDays(-1), pinned: true, ack: false, audience: "Everyone" },
  { id: "a2", title: "New health insurance plan", body: "Our new health insurance plan starts next month and now covers parents. Please read the attached policy and acknowledge.", author: byId.e1, at: addDays(-3), pinned: false, ack: true, audience: "Everyone" },
  { id: "a3", title: "Sprint demo on Friday", body: "Engineering will demo the new payroll module at 4 PM in the main meeting room.", author: byId.e3, at: addDays(-5), pinned: false, ack: false, audience: "Engineering" },
];

export const ACTIVITY = [
  { id: "n1", title: "Ayesha Khan requested 3 days of Annual Leave", at: "12 min ago" },
  { id: "n2", title: "Bilal Raza moved “Payroll API integration” to In progress", at: "48 min ago" },
  { id: "n3", title: "Daniyal Mirza joined Engineering", at: "2 hours ago" },
  { id: "n4", title: "September payroll was marked as paid", at: "Yesterday" },
  { id: "n5", title: "New announcement: Office closed for Iqbal Day", at: "Yesterday" },
];

export const CHATS = [
  {
    id: "c1",
    name: "general",
    group: true,
    members: 14,
    messages: [
      { from: byId.e1, text: "Reminder: the office is closed tomorrow for Iqbal Day 🎉", at: "10:12" },
      { from: byId.e4, text: "Thanks! Will the payroll date move too?", at: "10:14" },
      { from: byId.e1, text: "No, salaries go out on the 1st as usual.", at: "10:15" },
    ],
  },
  {
    id: "c2",
    name: "design-team",
    group: true,
    members: 3,
    messages: [
      { from: byId.e2, text: "Uploaded the new onboarding screens to Figma.", at: "09:40" },
      { from: byId.e10, text: "Looks great! I'll start on the mobile version.", at: "09:52" },
    ],
  },
  {
    id: "c3",
    name: "Bilal Raza",
    person: byId.e3,
    unread: 2,
    messages: [
      { from: byId.e3, text: "Hi Sana, can we interview the DevOps candidate on Thursday?", at: "11:02" },
      { from: byId.e3, text: "Morning works best for the team.", at: "11:03" },
    ],
  },
  {
    id: "c4",
    name: "Ayesha Khan",
    person: byId.e2,
    messages: [{ from: byId.e2, text: "I've applied for leave next week, please have a look.", at: "Yesterday" }],
  },
];

/** Attendance for the current month, generated so the calendar always looks current. */
export function monthAttendance() {
  const y = today.getFullYear();
  const m = today.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  const pattern = ["PRESENT", "PRESENT", "LATE", "PRESENT", "PRESENT", "PRESENT", "ON_LEAVE", "PRESENT", "PRESENT", "LATE", "PRESENT"];
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(y, m, i + 1);
    const dow = d.getDay();
    let status;
    if (d > today) status = null;
    else if (dow === 0 || dow === 6) status = "WEEKEND";
    else status = pattern[i % pattern.length];
    return { date: iso(d), day: i + 1, dow, status };
  });
}

export const TEAM_TODAY = [
  [byId.e2, "09:01", "PRESENT"],
  [byId.e3, "08:52", "PRESENT"],
  [byId.e4, "09:27", "LATE"],
  [byId.e6, "09:05", "PRESENT"],
  [byId.e9, null, "ON_LEAVE"],
  [byId.e11, null, "ABSENT"],
  [byId.e10, "09:12", "LATE"],
  [byId.e13, "08:58", "PRESENT"],
];

export const DEPT_ATTENDANCE = [
  ["Engineering", 96],
  ["Design", 92],
  ["Sales", 88],
  ["Human Resources", 98],
  ["Operations", 90],
  ["Finance", 95],
];

const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
export const PAYROLL_RUN = { month: prevMonth.getMonth() + 1, year: prevMonth.getFullYear(), currency: "PKR", status: "PAID" };

const salary = [
  ["e2", 185000, 20000, 0, 14500],
  ["e3", 260000, 30000, 0, 26800],
  ["e4", 140000, 15000, 4500, 6200],
  ["e6", 110000, 25000, 0, 5100],
  ["e8", 125000, 12000, 0, 5900],
  ["e10", 95000, 10000, 3200, 2400],
  ["e11", 120000, 12000, 0, 5600],
];

export const PAYSLIPS = salary.map(([id, basic, allowance, absence, tax]) => {
  const gross = basic + allowance;
  const totalDeductions = absence + tax;
  return {
    id: `p-${id}`,
    employee: { ...byId[id], department: { name: byId[id].department } },
    run: PAYROLL_RUN,
    workingDays: 22,
    eligibleDays: 22,
    absentDays: absence ? 1 : 0,
    unpaidLeaveDays: 0,
    basicSalary: basic,
    earnings: [{ name: "Allowances", amount: allowance }],
    deductions: [],
    adjustments: [],
    absenceDeduction: absence,
    taxAmount: tax,
    grossPay: gross,
    totalDeductions,
    netPay: gross - totalDeductions,
    bankName: "Meezan Bank",
    bankAccount: "•••• 4821",
  };
});

export const PAYROLL_HISTORY = [0, 1, 2].map((n) => {
  const d = new Date(today.getFullYear(), today.getMonth() - 2 - n, 1);
  return { month: d.getMonth() + 1, year: d.getFullYear(), employees: 14 - n, net: 2_480_000 - n * 95_000, status: "PAID" };
});

export const ROLE_MATRIX = {
  modules: ["Attendance", "Leave", "Tasks", "Employees", "Reports", "Payroll", "Settings"],
  roles: [
    ["Employee", ["Own", "Own", "Own", "Own profile", "—", "Own payslips", "—"]],
    ["Team Lead", ["Team", "Approve team", "Team", "Team", "Team", "Own payslips", "—"]],
    ["Manager", ["Team", "Approve team", "Team", "Team", "Team", "Own payslips", "—"]],
    ["HR Admin", ["All", "All + policy", "All", "Manage", "All", "Own payslips", "Users, org, holidays"]],
    ["Super Admin", ["All", "All + policy", "All", "Manage", "All", "Run & approve", "All"]],
  ],
};

export const AUDIT = [
  { id: "au1", action: "payroll.run.paid", entity: "Payroll run", actor: "admin@company.com", at: "Yesterday, 18:20" },
  { id: "au2", action: "employee.create", entity: "Daniyal Mirza", actor: "sana.iqbal@company.com", at: "2 days ago" },
  { id: "au3", action: "role.update", entity: "Team Lead", actor: "admin@company.com", at: "3 days ago" },
  { id: "au4", action: "leave.policy.update", entity: "Annual Leave", actor: "sana.iqbal@company.com", at: "Last week" },
  { id: "au5", action: "settings.update", entity: "Work hours", actor: "admin@company.com", at: "Last week" },
];
