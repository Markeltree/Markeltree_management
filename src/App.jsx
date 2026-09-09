import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { SidebarProvider } from "./context/SidebarContext";
import { ModalProvider } from "./context/ModalContext";
import Loading from "./components/LazyLoading";
import MainLayout from "./layout/MainLayout";
import ChatLayout from "./layout/ChatLayout";
import MessageNotification from "./components/MessageNotification";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const SignUp = lazy(() => import("./pages/SignUp"));
const CodeVerification = lazy(() => import("./pages/CodeVerification"));
const Login = lazy(() => import("./pages/Login"));
const NewPassword = lazy(() => import("./pages/NewPassword"));
const Reset = lazy(() => import("./pages/Reset"));
const ChatPanel = lazy(() => import("./components/ChatPanel"));
const InventoryManagement = lazy(() => import("./pages/InventoryManagement"));
const Feedback = lazy(() => import("./pages/Feedback"));
const ProductManagement = lazy(() => import("./pages/ProductManagement"));
const LowStockSKU = lazy(() => import("./pages/LowStockSKU"));
const OutOfStockSKU = lazy(() => import("./pages/OutOfStockSKU"));
const NearExpiryStockSKU = lazy(() => import("./pages/NearExpiryStockSKU"));
const Logistics = lazy(() => import("./pages/Logistics"));
const LogisticDetails = lazy(() => import("./pages/LogisticDetails"));
const Help = lazy(() => import("./pages/Help"));
const OrderManagement = lazy(() => import("./pages/OrderManagement"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));
const Reporting = lazy(() => import("./pages/Reporting"));
const ViewReport = lazy(() => import("./pages/ViewReport"));
const Accounts = lazy(() => import("./pages/Accounts"));
const NotificationPage = lazy(() => import("./pages/NotificationPage"));
const Setting = lazy(() => import("./pages/Setting"));
// const Task = lazy(() => import("./pages/Task"));
const Customers = lazy(() => import("./pages/Customers"));
const CustomerDetails = lazy(() => import("./pages/CustomerDetails"));
const ManufacturerOrder = lazy(() => import("./pages/ManufacturerOrder"));
const ManufacturerOrderDetails = lazy(() =>
  import("./pages/ManufacturerOrderDetails")
);
const ManufacturerDetails = lazy(() => import("./pages/ManufacturerDetails"));
const PinSection = lazy(() => import("./pages/PinSection"));

import TaskLayout from "./pages/Task/TaskLayout";
import MyTask from "./pages/Task/innerpage/MyTask";
import Notes from "./pages/Task/innerpage/Notes";

function App() {
  return (
    <SidebarProvider>
      <ModalProvider>
        <Suspense fallback={<Loading fullscreen />}>
          <Router>
            <MessageNotification />
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/verification" element={<CodeVerification />} />
              <Route path="/login" element={<Login />} />
              <Route path="/password" element={<NewPassword />} />
              <Route path="/reset" element={<Reset />} />
              <Route element={<ChatLayout />}>
                <Route path="/chat" element={<ChatPanel />} />
              </Route>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pinsection" element={<PinSection />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inventory" element={<InventoryManagement />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/product" element={<ProductManagement />} />
                <Route path="/lowstock" element={<LowStockSKU />} />
                <Route path="/outofstock" element={<OutOfStockSKU />} />
                <Route path="/nearexpiry" element={<NearExpiryStockSKU />} />
                <Route path="/logistics" element={<Logistics />} />
                <Route path="/logisticdetails" element={<LogisticDetails />} />
                <Route path="/help" element={<Help />} />
                <Route path="/order" element={<OrderManagement />} />
                <Route path="/orderdetail" element={<OrderDetail />} />
                <Route path="/report" element={<Reporting />} />
                <Route path="/viewreport" element={<ViewReport />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/notifications" element={<NotificationPage />} />
                <Route path="/settings" element={<Setting />} />
                {/* <Route path="/task" element={<Task />} /> */}
                <Route path="/customer" element={<Customers />} />
                <Route path="/customerdetail" element={<CustomerDetails />} />
                <Route path="/manufacturer" element={<ManufacturerOrder />} />
                <Route
                  path="/manufacturerorderdetail"
                  element={<ManufacturerOrderDetails />}
                />
                <Route
                  path="/manufacturerdetails"
                  element={<ManufacturerDetails />}
                />
                {/* Task Routes */}
                <Route path="/task" element={<TaskLayout />}>
                  <Route index element={<MyTask />} />
                </Route>

                <Route path="/notes" element={<Notes />} />
              </Route>
            </Routes>
          </Router>
        </Suspense>
      </ModalProvider>
    </SidebarProvider>
  );
}

export default App;
