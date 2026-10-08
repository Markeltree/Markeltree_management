import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { SidebarProvider } from "./context/SidebarContext";
import { ModalProvider } from "./context/ModalContext";
import Loading from "./components/LazyLoading";
import MainLayout from "./layout/MainLayout";
import ChatLayout from "./layout/ChatLayout";
import RequireAuth from "./components/RequireAuth";
import MessageNotification from "./components/MessageNotification";

// Auth
const Landing = lazy(() => import("./pages/Landing"));
const Demo = lazy(() => import("./pages/demo/Demo"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Reset = lazy(() => import("./pages/Reset"));
const NewPassword = lazy(() => import("./pages/NewPassword"));

// HR platform modules (FRD §9)
const Dashboard = lazy(() => import("./pages/hr/Dashboard"));
const Employees = lazy(() => import("./pages/hr/Employees"));
const EmployeeProfile = lazy(() => import("./pages/hr/EmployeeProfile"));
const Attendance = lazy(() => import("./pages/hr/Attendance"));
const Leave = lazy(() => import("./pages/hr/Leave"));
const Tasks = lazy(() => import("./pages/hr/Tasks"));
const Announcements = lazy(() => import("./pages/hr/Announcements"));
const Notifications = lazy(() => import("./pages/hr/Notifications"));
const Reports = lazy(() => import("./pages/hr/Reports"));
const Admin = lazy(() => import("./pages/hr/Admin"));
const Payroll = lazy(() => import("./pages/hr/Payroll"));
const Help = lazy(() => import("./pages/Help"));
const Chat = lazy(() => import("./pages/hr/Chat"));

const REPORT_PERMS = ["reports.view_all", "reports.view_team", "attendance.view_team", "attendance.view_all", "leave.view_all"];
const ADMIN_PERMS = ["admin.users", "admin.roles", "admin.settings", "admin.audit", "org.manage", "leave.manage_policy", "holidays.manage"];

function App() {
  return (
    <Router>
      <SidebarProvider>
        <ModalProvider>
          <Suspense fallback={<Loading fullscreen />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset" element={<Reset />} />
              <Route path="/password" element={<NewPassword />} />
              {/* Accounts are created by HR (onboarding workflow) — no public sign-up. */}
              <Route path="/signup" element={<Navigate to="/login" replace />} />
              <Route path="/verification" element={<Navigate to="/login" replace />} />

              <Route
                element={
                  <RequireAuth>
                    <MessageNotification />
                    <Outlet />
                  </RequireAuth>
                }
              >
                <Route element={<ChatLayout />}>
                  <Route path="/chat" element={<Chat />} />
                </Route>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/employees/:id" element={<EmployeeProfile />} />
                  <Route path="/profile" element={<EmployeeProfile self />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/leave" element={<Leave />} />
                  <Route path="/task" element={<Tasks />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/reports" element={<RequireAuth permissions={REPORT_PERMS}><Reports /></RequireAuth>} />
                  <Route path="/payroll" element={<RequireAuth permissions={["payroll.manage", "payroll.approve"]}><Payroll /></RequireAuth>} />
                  <Route path="/admin" element={<RequireAuth permissions={ADMIN_PERMS}><Admin /></RequireAuth>} />
                  <Route path="/help" element={<Help />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </ModalProvider>
      </SidebarProvider>
    </Router>
  );
}

export default App;
