import { useModal } from "@/context/ModalContext";
import { useNavigate } from "react-router-dom";
import {
  Icon,
  useState,
  useMemo,
  useEffect,
  lazy,
  Suspense,
  Column,
  ActionButton,
  MenuActionButton,
  DropdownButton,
  PinWrapper,
  RangeCalendar,
  FlexibleCard,
  CustomizeDashboard,
  SimpleTabView,
  CustomPaginator,
  SimpleCalendar,
  MiniTrendArrowChart,
  SolidGaugeChart,
  TrendLineChart,
  YearlySalesTrendLines,
  Loading,
  CreateTargetModal,
  TargetReportModal,
  GenerateInvoiceModal,
  menuOptions,
  Skeleton,
  DataTable,
  UpdateInventoryModal,
  CreateTaskModal,
  AddNewOrderModal,
  OrderCreatedModal,
} from "@/common/imports";

const SpeedometerWithStats = lazy(() =>
  import("../components/charts/SpeedometerWithStats")
);

const widgetOptions = [
  "Target",
  "Top Performer",
  "Biggest Bottleneck",
  "Revenue KPI",
  "New Customers KPI",
  "Sales KPI",
  "Orders Overview KPI",
  "Quick Actions & Multichannel View",
  "AI Powered Suggestions",
  "Tasks",
  "Recent Activities",
  "System Health",
  "Sales Trends",
  "Calendar",
  "Activity Feed",
  "Daily Tasks",
];

const aiSuggestedTabs = [
  {
    label: "Stock Alert",
    contentData: [
      {
        title: "Process New Orders",
        text: "Orders are piling up; complete processing today to maintain efficiency.",
      },
      {
        title: "Check Inventory Levels",
        text: "Low stock detected in multiple SKUs.",
      },
      {
        title: "Update Product Info",
        text: "Product descriptions need optimization.",
      },
    ],
  },
  {
    label: "Marketing Campaign",
    contentData: [
      {
        title: "Ad Performance",
        text: "15% more engagement this week!",
      },
    ],
  },
  {
    label: "Operational Suggestions",
    contentData: [
      {
        title: "Optimize supplier orders",
        text: "Reorder ahead of festive season.",
      },
      {
        title: "Review staff allocation",
        text: "Increase warehouse team this weekend.",
      },
    ],
  },
];

const dataSets = {
  all: [
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team A",
      priority: "High",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team B",
      priority: "High",
      deadline: "Due today",
      Status: "Pending",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Dinesh",
      priority: "Low",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Dinesh",
      priority: "High",
      deadline: "Due today",
      Status: "Pending",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team A",
      priority: "High",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team A",
      priority: "High",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team A",
      priority: "High",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
  ],
  completed: [
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team A",
      priority: "High",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team B",
      priority: "Low",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Subhash",
      priority: "High",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Dinesh",
      priority: "Low",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Shraiy Gupta",
      priority: "High",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team A",
      priority: "High",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team A",
      priority: "High",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team A",
      priority: "High",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team A",
      priority: "High",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team A",
      priority: "High",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team A",
      priority: "High",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team A",
      priority: "High",
      deadline: "Due today",
      Status: "Completed",
      action: "Marked as Completed",
    },
  ],
  pending: [
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team A",
      priority: "High",
      deadline: "Due today",
      Status: "Pending",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team B",
      priority: "Low",
      deadline: "Due today",
      Status: "Pending",
      action: "Marked as Completed",
    },
    {
      task: "Complete Ven dor Contract Review",
      assignedTo: "Team A",
      priority: "Low",
      deadline: "Due today",
      Status: "Pending",
      action: "Marked as Completed",
    },
  ],
};

const taskCards = [
  {
    id: 1,
    name: "John Doe",
    role: "Admin",
    assignedOn: "20/01/2025",
    taskTitle: "Need to reorder Product A stock.",
    deadline: "30/02/2025",
    taskName: "Task name",
    profileImage: "/profile.png",
    taskImage: "/medal.png",
  },
  {
    id: 2,
    name: "Alice Smith",
    role: "Manager",
    assignedOn: "22/01/2025",
    taskTitle: "Prepare Q1 financial report.",
    deadline: "05/03/2025",
    profileImage: "/profile.png",
    taskImage: "/medal.png",
  },
];

const recentActivities = [
  {
    id: 1,
    name: "John Doe",
    role: "Admin",
    time: "10 min ago",
    taskTitle: "Need to reorder Product A stock.",
    deadline: "30/02/2025",
    image: "/profile.png",
  },
  {
    id: 2,
    name: "Alice Smith",
    role: "Manager",
    time: "10 min ago",
    taskTitle: "Prepare Q1 financial report.",
    deadline: "05/03/2025",
    taskName: "Q1 Report",
    image: "/profile.png",
  },
  {
    id: 3,
    name: "John Doe",
    role: "Admin",
    time: "10 min ago",
    taskTitle: "Need to reorder Product A stock.",
    deadline: "30/02/2025",
    taskName: "Task name",
    image: "/profile.png",
  },

  {
    id: 4,
    name: "Tesst",
    role: "Admin",
    time: "10 min ago",
    taskTitle: "Need to reorder Product A stock.",
    deadline: "30/02/2025",
    taskName: "Task name",
    image: "/profile.png",
  },
];

const activityFeeds = [
  {
    id: 1,
    name: "Orders",
    detail: "A new joined customer placed a new order (#348798343).",
  },
  {
    id: 2,
    name: "Inventory",
    detail:
      "Sumit Mishra has updated inventory list, new items are successfully added to the list.",
  },
  {
    id: 3,
    name: "Product",
    detail:
      "Orders are piling up; complete processing today to maintain efficiency.",
  },
];

const achievedRevenue = "$234k";
const targetRevenue = "$500K";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const [selectedWidgets, setSelectedWidgets] = useState([...widgetOptions]);

  const [revenuePeriod, setRevenuePeriod] = useState("This Week");
  const [customersPeriod, setCustomersPeriod] = useState("This Week");
  const [salesPeriod, setSalesPeriod] = useState("This Week");
  const [ordersPeriod, setOrdersPeriod] = useState("This Week");

  // revenue KPI Data
  const revenueData = {
    "This Week": {
      revenue: "$13,000",
      change: "50% This Week",
      chart: [1, 3, 5, 5, 4, 7, 6, 8],
      trend: "up",
    },
    "This Month": {
      revenue: "$50,000",
      change: "30% This Month",
      chart: [2, 4, 6, 8, 10, 12, 14, 16],
      trend: "up",
    },
    "This Year": {
      revenue: "$620,000",
      change: "70% This Year",
      chart: [5, 10, 8, 12, 15, 18, 20, 22],
      trend: "up",
    },
  };

  const {
    revenue,
    change: revenueChange,
    chart: revenueChart,
    trend: revenueTrend,
  } = revenueData[revenuePeriod];

  // customer KPI data
  const customersData = {
    "This Week": {
      value: "34,000",
      change: "50% This Week",
      chart: [8, 6, 7, 4, 5, 3, 4, 2],
      trend: "down",
    },
    "This Month": {
      value: "120,000",
      change: "20% This Month",
      chart: [5, 4, 6, 8, 7, 6, 5, 4],
      trend: "down",
    },
    "This Year": {
      value: "1,200,000",
      change: "60% This Year",
      chart: [3, 6, 9, 12, 15, 18, 21, 24],
      trend: "up",
    },
  };

  const {
    value: customerValue,
    change: customerChange,
    chart: customerChart,
    trend: customerTrend,
  } = customersData[customersPeriod];

  // sales data KPI
  const salesData = {
    "This Week": {
      value: "$13,000",
      change: "50% This Week",
      chart: [8, 6, 7, 5, 3, 4, 1, 2],
      trend: "down",
    },
    "This Month": {
      value: "$60,000",
      change: "40% This Month",
      chart: [2, 5, 7, 10, 12, 9, 11, 13],
      trend: "up",
    },
    "This Year": {
      value: "$700,000",
      change: "70% This Year",
      chart: [10, 20, 30, 40, 50, 60, 70, 80],
      trend: "up",
    },
  };

  const {
    value: salesValue,
    change: salesChange,
    chart: salesChart,
    trend: salesTrend,
  } = salesData[salesPeriod];

  // order data KPI
  const ordersData = {
    "This Week": {
      value: "$15,000",
      change: "25% This Week",
      chart: [1, 3, 2, 5, 4, 7, 6, 8],
      trend: "up",
    },
    "This Month": {
      value: "$70,000",
      change: "45% This Month",
      chart: [2, 4, 6, 8, 7, 9, 11, 13],
      trend: "up",
    },
    "This Year": {
      value: "$800,000",
      change: "65% This Year",
      chart: [5, 10, 15, 20, 25, 30, 35, 40],
      trend: "up",
    },
  };

  const {
    value: orderValue,
    change: orderChange,
    chart: orderChart,
    trend: orderTrend,
  } = ordersData[ordersPeriod];

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const navigate = useNavigate();
  const exportMenuOptions = menuOptions();
  const [tableLoading, setTableLoading] = useState(false);
  const rowsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDailyTabIndex, setActiveDailyTabIndex] = useState(1);

  const tabKeys = ["all", "completed", "pending"];
  const [activeDailyTab, setActiveDailyTab] = useState(tabKeys[1]);

  const pagedRows = dataSets[activeDailyTab].slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(dataSets[activeDailyTab].length / rowsPerPage);

  const statusTemplate = (rowData) => {
    const statusColors = {
      Completed: "bg-[#22C55E26] text-[#22C55E]",
      Pending: "bg-[#DDD42726] text-[#DDD427]",
    };

    return (
      <span
        className={`flex items-center justify-center w-[100px] h-[28px] rounded text-[11px] font-medium ${
          statusColors[rowData.Status] || "bg-gray-200 text-gray-800"
        }`}
      >
        {rowData.Status}
      </span>
    );
  };

  const actionTemplate = (rowData) => (
    <span className="bg-[#22C55ECC] text-white px-2 py-1 flex items-center justify-center w-[140px] h-[28px] rounded text-[11px] font-medium gap-1">
      <Icon icon="mingcute:check-fill" className="w-3 h-3" />
      Mark as Completed
    </span>
  );

  const columns = useMemo(() => {
    switch (activeDailyTab) {
      case "all":
        return [
          { field: "task", header: "Task" },
          { field: "assignedTo", header: "Assigned To" },
          { field: "priority", header: "Priority" },
          { field: "deadline", header: "Deadline" },
          { field: "status", header: "Status", body: statusTemplate },
          { field: "action", header: "Action", body: actionTemplate },
        ];
      case "completed":
        return [
          { field: "task", header: "Task" },
          { field: "assignedTo", header: "Assigned To" },
          { field: "priority", header: "Priority" },
          { field: "deadline", header: "Deadline" },
          { field: "status", header: "Status", body: statusTemplate },
          { field: "action", header: "Action", body: actionTemplate },
        ];
      case "pending":
        return [
          { field: "task", header: "Task" },
          { field: "assignedTo", header: "Assigned To" },
          { field: "priority", header: "Priority" },
          { field: "deadline", header: "Deadline" },
          { field: "status", header: "Status", body: statusTemplate },
          { field: "action", header: "Action", body: actionTemplate },
        ];
      default:
        return [];
    }
  }, [activeDailyTab]);

  const [tabLoading, setTabLoading] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  useEffect(() => {
    setTabLoading(true);
    const t = setTimeout(() => setTabLoading(false), 2000);
    return () => clearTimeout(t);
  }, [activeDailyTabIndex]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, [key]);

  const handleTabChange = (index) => {
    setTabLoading(true);
    setActiveTabIndex(index);

    // Simulate loading delay
    setTimeout(() => {
      setTabLoading(false);
    }, 2000); // you can adjust the delay
  };

  const { openModal, closeModal } = useModal();

  const createTarget = () => {
    openModal(CreateTargetModal, {
      sizeClass: "w-[85%] md:w-[50%]",
      onNext: handleTargetNext, // passed here
    });
  };

  const handleTargetNext = (formData) => {
    closeModal(); // close current modal first

    setTimeout(() => {
      openModal(TargetReportModal, {
        sizeClass: "w-[85%] md:w-[70%]",
        previousData: formData,
      });
    }, 250);
  };

  const generateInvoice = () => {
    openModal(GenerateInvoiceModal, {
      sizeClass: "w-[85%] md:w-[50%]",
    });
  };

  const updateInventory = () => {
    openModal(UpdateInventoryModal, {
      sizeClass: "w-[85%] md:w-[50%]",
    });
  };

  const createTask = () => {
    openModal(CreateTaskModal, {
      sizeClass: "w-[85%] md:w-[50%]",
    });
  };

  const addNewOrder = () => {
    openModal(AddNewOrderModal, {
      sizeClass: "w-[85%] md:w-[60%]",
    });
  };

  const AccessDenied = () => {
    closeModal();
    setTimeout(() => {
      openModal(OrderCreatedModal, {
        sizeClass: "w-[85%] md:w-[45%]",
        topHeading: "ACCESS DENIED ",
        centerText:
          "Oops! It looks like you don’t have permission to use this feature. Reach out to your admin for access.",
        firstButtonLable: "Request Access",
        secondButtonLable: "Close",
        icon: "teenyicons:denied-outline",
        iconClass: "text-[#EF4444]",
      });
    }, 200);
  };

  const Row2SkeletonCard1 = () => (
    <div className="w-full lg:flex-[1_1_25%] min-w-0 h-[204px] p-3 bg-white dark:bg-black rounded-xl flex flex-col justify-between">
      <div className="w-[40%] flex mt-3">
        <Skeleton
          height="10px"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
      </div>

      <div className="flex flex-row items-center justify-between gap-x-20 w-full mb-3">
        <Skeleton
          height="10px"
          animation="wave"
          className="rounded-xl w-full dark:bg-[#2C2C2CAA]"
        />
        <Skeleton
          height="10px"
          animation="wave"
          className="rounded-xl w-full dark:bg-[#2C2C2CAA]"
        />
      </div>
    </div>
  );

  const Row2SkeletonCard2 = () => (
    <div className="w-full lg:flex-[1.5_1_37.5%] h-[204px] p-3 bg-white dark:bg-black rounded-xl">
      <div className="flex flex-col gap-6 mt-3">
        <Skeleton
          height="10px"
          width="40%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
        <Skeleton
          height="10px"
          width="30%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
        <Skeleton
          height="10px"
          width="20%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
      </div>
    </div>
  );

  const Row2SkeletonCard3 = () => (
    <div className="w-full lg:flex-[1.5_1_37.5%] h-[204px] p-3 bg-white dark:bg-black rounded-xl">
      <div className="flex flex-col gap-6 mt-3">
        <Skeleton
          height="10px"
          width="40%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
        <Skeleton
          height="10px"
          width="30%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
        <Skeleton
          height="10px"
          width="20%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
      </div>
    </div>
  );

  const Row2Skeleton = () => (
    <div className="flex flex-col lg:flex-row w-full gap-4 mb-2 justify-center lg:items-stretch pt-2">
      {selectedWidgets.includes("Target") && <Row2SkeletonCard1 />}
      {selectedWidgets.includes("Top Performer") && <Row2SkeletonCard2 />}
      {selectedWidgets.includes("Biggest Bottleneck") && <Row2SkeletonCard3 />}
    </div>
  );

  const Row3SkeletonCard1 = () => (
    <div className="flex flex-col w-full h-[135px] bg-white dark:bg-black rounded-xl">
      <div className="flex flex-col gap-6 mt-3 p-3">
        <Skeleton
          height="10px"
          width="40%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
        <Skeleton
          height="10px"
          width="30%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
        <Skeleton
          height="10px"
          width="20%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
      </div>
    </div>
  );

  const Row3SkeletonCard2 = () => (
    <div className="flex flex-col w-full h-[135px] bg-white dark:bg-black rounded-xl">
      <div className="flex flex-col gap-6 mt-3 p-3">
        <Skeleton
          height="10px"
          width="40%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
        <Skeleton
          height="10px"
          width="30%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
        <Skeleton
          height="10px"
          width="20%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
      </div>
    </div>
  );

  const Row3SkeletonCard3 = () => (
    <div className="flex flex-col w-full h-[135px] bg-white dark:bg-black rounded-xl ">
      <div className="flex flex-col gap-6 mt-3 p-3">
        <Skeleton
          height="10px"
          width="40%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
        <Skeleton
          height="10px"
          width="30%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
        <Skeleton
          height="10px"
          width="20%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
      </div>
    </div>
  );

  const Row3SkeletonCard4 = () => (
    <div className="flex flex-col w-full  h-[135px] bg-white dark:bg-black rounded-xl ">
      <div className="flex flex-col gap-6 mt-3 p-3">
        <Skeleton
          height="10px"
          width="40%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
        <Skeleton
          height="10px"
          width="30%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
        <Skeleton
          height="10px"
          width="20%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA]"
        />
      </div>
    </div>
  );

  const Row3Skeleton = () => (
    <div
      className="grid gap-4 mb-2 justify-center 
    [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))] pt-2"
    >
      {selectedWidgets.includes("Revenue KPI") && <Row3SkeletonCard1 />}
      {selectedWidgets.includes("New Customers KPI") && <Row3SkeletonCard2 />}
      {selectedWidgets.includes("Sales KPI") && <Row3SkeletonCard3 />}
      {selectedWidgets.includes("Orders Overview KPI") && <Row3SkeletonCard4 />}
    </div>
  );

  const Row4SkeletonCard1 = () => (
    <div className="flex flex-col w-full flex-1 min-w-0 h-[330px] rounded-xl p-1 bg-white dark:bg-black">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-x-4 mt-3 p-3">
          <Skeleton
            height="50px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            height="50px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            height="50px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA]"
          />
        </div>
        <div className="flex flex-row gap-x-4 mt-3 p-3">
          <Skeleton
            height="180px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            height="180px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            height="180px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA]"
          />
        </div>
      </div>
    </div>
  );

  const Row4SkeletonCard2 = () => (
    <div className="flex flex-col w-full flex-1 min-w-0 h-[330px] rounded-xl p-1 bg-white dark:bg-black">
      <div className="flex flex-col">
        <div className="flex mt-3 p-3">
          <Skeleton
            height="10px"
            width="50%"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA]"
          />
        </div>
        <div className="grid grid-cols-4 gap-x-4 mt-3 p-3">
          <Skeleton
            height="10px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] col-span-1"
          />
          <Skeleton
            height="10px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] col-span-1"
          />
          <Skeleton
            height="10px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] col-span-1"
          />
        </div>
        <div className="flex flex-row gap-x-4 p-3">
          <div className="h-auto w-full bg-gradient-to-r from-[#5D60EF0f] to-[#BAFF860f] dark:from-[#5D60EF0f] dark:to-[#BAFF860f] p-4 rounded-xl">
            <Skeleton
              height="10px"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              height="10px"
              width="100%"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA] mt-2"
            />
            <Skeleton
              height="10px"
              width="75%"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA] mt-2"
            />
          </div>
        </div>
        <div className="flex flex-row gap-x-4 p-3">
          <div className="h-auto w-full bg-gradient-to-r from-[#5D60EF0f] to-[#BAFF860f] dark:from-[#5D60EF0f] dark:to-[#BAFF860f] p-4 rounded-xl">
            <Skeleton
              height="10px"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              height="10px"
              width="100%"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA] mt-2"
            />
            <Skeleton
              height="10px"
              width="75%"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA] mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const Row4Skeleton = () => (
    <div className="flex flex-col lg:flex-row gap-4 mb-2 justify-center lg:items-stretch pt-2">
      {selectedWidgets.includes("Tasks") && <Row4SkeletonCard1 />}
      {selectedWidgets.includes("AI Powered Suggestions") && (
        <Row4SkeletonCard2 />
      )}
    </div>
  );

  const Row5SkeletonCard1 = () => (
    <div className="flex flex-col w-full flex-1 min-w-0 h-[330px] rounded-xl p-1 bg-white dark:bg-black">
      <div className="flex flex-col">
        <div className="flex flex-col gap-2 mt-2 p-3">
          <Skeleton
            height="10px"
            width="50%"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            height="20px"
            animation="wave"
            width="25%"
            className="rounded-xl dark:bg-[#2C2C2CAA]"
          />
        </div>
        <div className="flex flex-col gap-2 p-3">
          <div className="h-auto w-full bg-gradient-to-r from-[#5D60EF0f] to-[#BAFF860f] dark:from-[#5D60EF0f] dark:to-[#BAFF860f] p-4 rounded-xl">
            <div className="flex flex-row gap-2">
              <Skeleton
                // height="10px"
                animation="wave"
                shape="circle"
                size="3rem"
                className="rounded-full dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                height="10px"
                width="50%"
                animation="wave"
                className="rounded-xl dark:bg-[#2C2C2CAA] mt-2"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton
                height="10px"
                width="100%"
                animation="wave"
                className="rounded-xl dark:bg-[#2C2C2CAA] mt-1"
              />
              <Skeleton
                height="10px"
                width="50%"
                animation="wave"
                className="rounded-xl dark:bg-[#2C2C2CAA] mt-1"
              />
            </div>
          </div>
          <div className="h-auto w-full bg-gradient-to-r from-[#5D60EF0f] to-[#BAFF860f] dark:from-[#5D60EF0f] dark:to-[#BAFF860f] p-4 rounded-xl">
            <div className="flex flex-row gap-2">
              <Skeleton
                // height="10px"
                animation="wave"
                shape="circle"
                size="3rem"
                className="rounded-full dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                height="10px"
                width="50%"
                animation="wave"
                className="rounded-xl dark:bg-[#2C2C2CAA] mt-2"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton
                height="10px"
                width="100%"
                animation="wave"
                className="rounded-xl dark:bg-[#2C2C2CAA] mt-1"
              />
              <Skeleton
                height="10px"
                width="50%"
                animation="wave"
                className="rounded-xl dark:bg-[#2C2C2CAA] mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Row5SkeletonCard2 = () => (
    <div className="flex flex-col w-full flex-1 min-w-0 h-[330px] rounded-xl p-1 bg-white dark:bg-black">
      <div className="flex flex-col gap-2 mt-3 p-3">
        <Skeleton
          height="10px"
          width="50%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
        />
        <div className="w-full h-auto bg-[#F2F2FE80] dark:bg-[#14141480] border-none rounded-xl p-3">
          <div className="flex flex-row gap-2">
            <Skeleton
              // height="10px"
              animation="wave"
              shape="circle"
              size="3rem"
              className="rounded-full dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              height="10px"
              width="40%"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA] mt-2"
            />
          </div>
          <div className="flex flex-col">
            <Skeleton
              height="10px"
              width="100%"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA] mt-1"
            />
          </div>
        </div>
        <div className="w-full h-auto bg-[#F2F2FE80] dark:bg-[#14141480] border-none rounded-xl p-3">
          <div className="flex flex-row gap-2">
            <Skeleton
              // height="10px"
              animation="wave"
              shape="circle"
              size="3rem"
              className="rounded-full dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              height="10px"
              width="40%"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA] mt-2"
            />
          </div>
          <div className="flex flex-col">
            <Skeleton
              height="10px"
              width="100%"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA] mt-1"
            />
          </div>
        </div>
        <div className="w-full h-auto bg-[#F2F2FE80] dark:bg-[#14141480] border-none rounded-xl p-3">
          <div className="flex flex-row gap-2">
            <Skeleton
              // height="10px"
              animation="wave"
              shape="circle"
              size="3rem"
              className="rounded-full dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              height="10px"
              width="40%"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA] mt-2"
            />
          </div>
          <div className="flex flex-col">
            <Skeleton
              height="10px"
              width="100%"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA] mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const Row5Skeleton = () => (
    <div className="flex flex-col lg:flex-row gap-4 mb-2 justify-center lg:items-stretch pt-2">
      {selectedWidgets.includes("Tasks") && <Row5SkeletonCard1 />}
      {selectedWidgets.includes("Recent Activities") && <Row5SkeletonCard2 />}
    </div>
  );

  const Row6SkeletonCard1 = () => (
    <div className="flex flex-col w-full flex-1 min-w-0 h-[380px] rounded-xl p-4 bg-white dark:bg-black">
      <div className="flex flex-col gap-2 mt-3">
        <Skeleton
          height="10px"
          width="25%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
        />
      </div>
    </div>
  );

  const Row6SkeletonCard2 = () => (
    <div className="flex flex-col w-full flex-1 min-w-0 h-[380px] rounded-xl p-4 bg-white dark:bg-black">
      <div className="flex flex-col gap-2 mt-3">
        <Skeleton
          height="10px"
          width="25%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
        />
        <Skeleton
          height="10px"
          width="15%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
        />
        <div className="flex flex-row gap-10">
          <Skeleton
            height="280px"
            width="5px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
          />
          <Skeleton
            height="280px"
            width="5px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
          />
          <Skeleton
            height="280px"
            width="5px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
          />
          <Skeleton
            height="280px"
            width="5px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
          />
          <Skeleton
            height="280px"
            width="5px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
          />
          <Skeleton
            height="280px"
            width="5px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
          />
          <Skeleton
            height="280px"
            width="5px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
          />
          <Skeleton
            height="280px"
            width="5px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
          />
          <Skeleton
            height="280px"
            width="5px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
          />
          <Skeleton
            height="280px"
            width="5px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
          />
          <Skeleton
            height="280px"
            width="5px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
          />
          <Skeleton
            height="280px"
            width="5px"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
          />
        </div>
      </div>
    </div>
  );

  const Row6Skeleton = () => (
    <div className="flex flex-col lg:flex-row w-full gap-4 mb-2 justify-center  lg:items-stretch pt-2">
      {selectedWidgets.includes("System Health") && <Row6SkeletonCard1 />}

      {selectedWidgets.includes("Sales Trends") && <Row6SkeletonCard2 />}
    </div>
  );

  const Row7SkeletonCard1 = () => (
    <div className="flex flex-col w-full flex-1 min-w-0 h-[330px] rounded-xl p-1 bg-white dark:bg-black">
      <div className="flex flex-col gap-6 mt-3 p-3">
        <Skeleton
          height="10px"
          width="30%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
        />
        <div className="flex flex-col gap-4 justify-center items-center">
          <Skeleton
            height="10px"
            width="90%"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
          />
          <Skeleton
            height="10px"
            width="90%"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
          />
          <Skeleton
            height="10px"
            width="90%"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
          />
          <Skeleton
            height="10px"
            width="90%"
            animation="wave"
            className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
          />
        </div>
      </div>
    </div>
  );

  const Row7SkeletonCard2 = () => (
    <div className="flex flex-col w-full flex-1 min-w-0 h-[330px] rounded-xl p-1 bg-white dark:bg-black">
      <div className="flex flex-col gap-2 mt-3 p-3">
        <Skeleton
          height="10px"
          width="30%"
          animation="wave"
          className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
        />
        <div className="w-full h-[80px] bg-[#F2F2FE80] dark:bg-[#14141480] border-none rounded-xl p-3">
          <div className="flex flex-col gap-2">
            <Skeleton
              height="10px"
              width="30%"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA] mt-1"
            />
            <Skeleton
              height="10px"
              width="100%"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA] mt-1"
            />
          </div>
        </div>
        <div className="w-full h-[80px] bg-[#F2F2FE80] dark:bg-[#14141480] border-none rounded-xl p-3">
          <div className="flex flex-col gap-2">
            <Skeleton
              height="10px"
              width="30%"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA] mt-1"
            />
            <Skeleton
              height="10px"
              width="100%"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA] mt-1"
            />
          </div>
        </div>
        <div className="w-full h-[80px] bg-[#F2F2FE80] dark:bg-[#14141480] border-none rounded-xl p-3">
          <div className="flex flex-col gap-2">
            <Skeleton
              height="10px"
              width="30%"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA] mt-1"
            />
            <Skeleton
              height="10px"
              width="100%"
              animation="wave"
              className="rounded-xl dark:bg-[#2C2C2CAA] mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const Row7Skeleton = () => (
    <div className="flex flex-col lg:flex-row gap-4 mb-2 justify-center lg:items-stretch">
      {selectedWidgets.includes("Calendar") && <Row7SkeletonCard1 />}
      {selectedWidgets.includes("Activity Feed") && <Row7SkeletonCard2 />}
    </div>
  );

  const Row8Skeleton = () => (
    <div className="pt-2">
      {selectedWidgets.includes("Daily Tasks") && (
        <div className="pt-4 space-y-4 relative">
          <div className="bg-white dark:bg-[#000000] rounded-lg p-4 h-auto">
            {/* Heading + Export */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <Skeleton
                width="150px"
                height="20px"
                borderRadius="6px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100px"
                height="36px"
                borderRadius="8px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>

            <div className="grid grid-cols-6 gap-4 items-center border-b border-gray-200 dark:border-[#333] py-2">
              {[...Array(columns?.length || 6)].map((_, i) => (
                <Skeleton
                  key={i}
                  width="100%"
                  height="20px"
                  borderRadius="6px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              ))}
            </div>

            {/* Skeleton: Table Rows */}
            <div className="space-y-3">
              {[...Array(5)].map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-6 gap-4 items-center border-b border-gray-200 dark:border-[#333] py-2"
                >
                  {[...Array(columns?.length || 6)].map((_, colIndex) => (
                    <Skeleton
                      key={colIndex}
                      width="100%"
                      height="20px"
                      borderRadius="6px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div
        key={key}
        className="flex-1 pl-3 pr-3 pt-4 bg-gray-50 dark:bg-[#141414]"
      >
        {/* Row 1: Main Dashboard */}
        <div className="flex flex-row justify-between items-center mb-4 gap-2">
          <div className="w-full grid grid-cols-6 items-center gap-2">
            <div className="hidden lg:block w-full col-span-1">
              <Skeleton
                height="25px"
                animation="wave"
                className="rounded-xl col-span-1 dark:bg-[#2C2C2CAA]"
              />
            </div>
            <div className="hidden lg:block col-span-1"></div>
            <div className="flex justify-end w-full col-span-6 lg:col-span-4">
              <Skeleton
                height="25px"
                animation="wave"
                className="rounded-xl dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>
        </div>

        {/* row 2 */}
        <Row2Skeleton />

        {/* row 3 */}
        <Row3Skeleton />

        {/* row 4 */}
        <Row4Skeleton />

        {/* row 5 */}
        <Row5Skeleton />

        {/* row 6 */}
        <Row6Skeleton />

        {/* row 7 */}
        <Row7Skeleton />

        {/* row 8 */}
        <Row8Skeleton />
      </div>
    );
  }

  const DashboardRow6 = () => {
    //syetem health data
    const [healthPeriod, setHealthPeriod] = useState("This Year");
    const systemHealthData = {
      "This Week": {
        overall: 68,
        deltaText: "1.1% lower than last week",
        platforms: [
          { name: "Shopify", value: 82, color: "green" },
          { name: "Amazon", value: 49, color: "yellow" },
          { name: "eBay", value: 28, color: "red" },
        ],
      },
      "This Month": {
        overall: 71,
        deltaText: "0.6% higher than last month",
        platforms: [
          { name: "Shopify", value: 85, color: "green" },
          { name: "Amazon", value: 55, color: "yellow" },
          { name: "eBay", value: 33, color: "red" },
        ],
      },
      "This Year": {
        overall: 72,
        deltaText: "0.2% lower than last year",
        platforms: [
          { name: "Shopify", value: 87, color: "green" },
          { name: "Amazon", value: 57, color: "yellow" },
          { name: "eBay", value: 35, color: "red" },
        ],
      },
    };

    const {
      overall: healthOverall,
      deltaText: healthDeltaText,
      platforms: healthPlatforms,
    } = systemHealthData[healthPeriod];

    // sales trend data
    const [selectedMetric, setSelectedMetric] = useState("Sales Trends");
    const [selectedRange, setSelectedRange] = useState("This Year");

    const salesDataGraph = {
      "This Year": {
        "Sales Trends": {
          Jan: { value: 50, status: "High" },
          Feb: { value: 25, status: "Low" },
          Mar: { value: 35, status: "Medium" },
          Apr: { value: 60, status: "High" },
          May: { value: 40, status: "Medium" },
          Jun: { value: 30, status: "Low" },
          Jul: { value: 70, status: "High" },
          Aug: { value: 55, status: "Medium" },
          Sep: { value: 45, status: "Medium" },
          Oct: { value: 35, status: "Low" },
          Nov: { value: 20, status: "Low" },
          Dec: { value: 60, status: "High" },
        },
        Productivity: {
          Jan: { value: 50, status: "High" },
          Feb: { value: 25, status: "Low" },
          Mar: { value: 55, status: "Medium" },
          Apr: { value: 60, status: "High" },
          May: { value: 50, status: "Medium" },
          Jun: { value: 30, status: "Low" },
          Jul: { value: 80, status: "High" },
          Aug: { value: 55, status: "Medium" },
          Sep: { value: 45, status: "Medium" },
          Oct: { value: 35, status: "Low" },
          Nov: { value: 10, status: "Low" },
          Dec: { value: 90, status: "High" },
        },
        Inventory: {
          Jan: { value: 50, status: "High" },
          Feb: { value: 15, status: "Low" },
          Mar: { value: 45, status: "Medium" },
          Apr: { value: 70, status: "High" },
          May: { value: 35, status: "Medium" },
          Jun: { value: 25, status: "Low" },
          Jul: { value: 80, status: "High" },
          Aug: { value: 50, status: "Medium" },
          Sep: { value: 40, status: "Medium" },
          Oct: { value: 30, status: "Low" },
          Nov: { value: 10, status: "Low" },
          Dec: { value: 70, status: "High" },
        },
      },

      "This Month": {
        "Sales Trends": {
          1: { value: 40, status: "Medium" },
          2: { value: 55, status: "High" },
          3: { value: 60, status: "High" },
          4: { value: 45, status: "Medium" },
          5: { value: 70, status: "High" },
          6: { value: 65, status: "High" },
          7: { value: 80, status: "High" },
          8: { value: 75, status: "High" },
          9: { value: 90, status: "High" },
          10: { value: 95, status: "High" },
          11: { value: 40, status: "Medium" },
          12: { value: 55, status: "High" },
          13: { value: 60, status: "High" },
          14: { value: 45, status: "Medium" },
          15: { value: 70, status: "High" },
          16: { value: 25, status: "Low" },
          17: { value: 80, status: "High" },
          18: { value: 75, status: "High" },
          19: { value: 90, status: "High" },
          20: { value: 95, status: "High" },
          21: { value: 40, status: "Medium" },
          22: { value: 25, status: "Low" },
          23: { value: 60, status: "High" },
          24: { value: 45, status: "Medium" },
          25: { value: 70, status: "High" },
          26: { value: 65, status: "High" },
          27: { value: 10, status: "Low" },
          28: { value: 75, status: "High" },
          29: { value: 70, status: "High" },
          30: { value: 15, status: "Low" },
        },
        Productivity: {
          1: { value: 30, status: "Low" },
          2: { value: 45, status: "Medium" },
          3: { value: 55, status: "Medium" },
          4: { value: 65, status: "High" },
          5: { value: 75, status: "High" },
          6: { value: 80, status: "High" },
          7: { value: 85, status: "High" },
          8: { value: 70, status: "High" },
          9: { value: 60, status: "Medium" },
          10: { value: 95, status: "High" },
        },
        Inventory: {
          1: { value: 20, status: "Low" },
          2: { value: 35, status: "Medium" },
          3: { value: 50, status: "Medium" },
          4: { value: 60, status: "High" },
          5: { value: 70, status: "High" },
          6: { value: 55, status: "Medium" },
          7: { value: 45, status: "Medium" },
          8: { value: 65, status: "High" },
          9: { value: 75, status: "High" },
          10: { value: 85, status: "High" },
        },
      },

      "This Week": {
        "Sales Trends": {
          Mon: { value: 50, status: "High" },
          Tue: { value: 70, status: "High" },
          Wed: { value: 65, status: "High" },
          Thu: { value: 80, status: "High" },
          Fri: { value: 90, status: "High" },
          Sat: { value: 60, status: "Medium" },
          Sun: { value: 75, status: "High" },
        },
        Productivity: {
          Mon: { value: 40, status: "Medium" },
          Tue: { value: 55, status: "Medium" },
          Wed: { value: 60, status: "High" },
          Thu: { value: 75, status: "High" },
          Fri: { value: 85, status: "High" },
          Sat: { value: 50, status: "Medium" },
          Sun: { value: 65, status: "High" },
        },
        Inventory: {
          Mon: { value: 30, status: "Low" },
          Tue: { value: 45, status: "Medium" },
          Wed: { value: 55, status: "Medium" },
          Thu: { value: 65, status: "High" },
          Fri: { value: 70, status: "High" },
          Sat: { value: 40, status: "Medium" },
          Sun: { value: 50, status: "Medium" },
        },
      },
    };

    const finalData = useMemo(() => {
      return salesDataGraph[selectedRange]?.[selectedMetric] || {};
    }, [selectedMetric, selectedRange]);
    return (
      <div className="flex flex-col lg:flex-row w-full gap-4 mb-2 justify-center  lg:items-stretch pt-2">
        {/* Card 1 */}
        {selectedWidgets.includes("System Health") && (
          <FlexibleCard
            cardClass="flex flex-col w-full flex-1 min-w-0 h-[380px] bg-white dark:bg-black rounded-xl p-4 hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
            headerClass="flex flex-row items-center justify-between"
            centerClass="flex flex-row items-center pt-2"
            footerClass="flex items-end justify-center h-full"
            header={
              <>
                <div className="flex w-full items-center">
                  <h1 className="text-[18px] font-bold text-[#151D48] dark:text-[#EEF1FF] ">
                    System Health
                  </h1>
                </div>
                <div className="flex gap-2">
                  <DropdownButton
                    defaultOption={healthPeriod}
                    options={["This Week", "This Month", "This Year"]}
                    buttonClassName="flex items-center rounded-lg justify-center gap-2 px-3 py-2 text-white dark:text-black font-bold text-[11px] h-[34px] w-[105px] bg-gradient-to-r from-[#5D5FEF] to-[#353689] border-none focus:outline-none focus:ring-0"
                    dropdownClassName="bg-white dark:bg-[#121212] h-[80px] w-[105px]"
                    optionClassName="dark:text-gray-300 dark:hover:bg-gray-800 text-[11px]"
                    onChange={(value) => setHealthPeriod(value)}
                  />
                </div>
              </>
            }
            center={
              <>
                <div className="flex flex-row items-center justify-center gap-2">
                  <Icon
                    icon="fluent:arrow-down-20-filled"
                    width="14"
                    height="14"
                    className="text-[#EF4444]"
                  />
                  <h2 className="text-[10px] text-[#2B2B2B] dark:text-[#D4D4D4]">
                    {healthDeltaText}
                  </h2>
                </div>
              </>
            }
            footer={
              <Suspense fallback={<Loading />}>
                <SpeedometerWithStats
                  overallValue={healthOverall}
                  overallLabel="Overall Health"
                  overallColor="green"
                  platforms={healthPlatforms}
                />
              </Suspense>
            }
          />
        )}

        {/* Card 2*/}
        {selectedWidgets.includes("Sales Trends") && (
          <FlexibleCard
            cardClass="flex flex-col w-full flex-1 min-w-0 h-[380px] bg-white dark:bg-black rounded-xl p-4 hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
            headerClass="flex justify-between"
            centerClass="flex flex-row gap-4"
            footerClass=""
            header={
              <>
                <div className="">
                  <h1 className="font-extrabold text-[20px] text-[#151D48] dark:text-[#EEF1FF]">
                    Sales Trends
                  </h1>
                </div>
                <div className="flex flex-row justify-end gap-4">
                  <DropdownButton
                    defaultOption={selectedMetric}
                    options={["Sales Trends", "Productivity", "Inventory"]}
                    buttonClassName="flex items-center rounded-lg justify-center gap-2 px-3 py-2 text-[#5D5FEF] dark:text-[#5D5FEF] font-bold text-[11px] h-[34px] w-[123px] bg-white dark:bg-black border border-[#5D5FEF] focus:outline-none focus:ring-0"
                    dropdownClassName="bg-white dark:bg-[#121212] h-[80px] w-[123px]"
                    optionClassName="dark:text-gray-300 dark:hover:bg-gray-800 text-[11px]"
                    onChange={(value) => setSelectedMetric(value)}
                  />
                  <DropdownButton
                    defaultOption={selectedRange}
                    options={["This Week", "This Month", "This Year"]}
                    buttonClassName="flex items-center rounded-lg justify-center gap-2 px-3 py-2 text-white dark:text-black font-bold text-[11px] h-[34px] w-[105px] bg-gradient-to-r from-[#5D5FEF] to-[#353689] border-none focus:outline-none focus:ring-0"
                    dropdownClassName="bg-white dark:bg-[#121212] h-[80px] w-[105px]"
                    optionClassName="dark:text-gray-300 dark:hover:bg-gray-800 text-[11px]"
                    onChange={(value) => setSelectedRange(value)}
                  />
                </div>
              </>
            }
            center={
              <>
                <div>
                  <h1 className="text-[#0CB91D] font-extrabold text-[28px]">
                    75.08%
                  </h1>
                  <h2 className="flex flex-row gap-1 text-[#2B2B2B] dark:text-[#D4D4D4] font-light text-[12px]">
                    <span className="text-[#0CB91D]">
                      <Icon
                        icon="clarity:arrow-line"
                        width="16"
                        height="18"
                        className="text-"
                      />
                    </span>
                    2% more than year
                  </h2>
                </div>
                <div className="h-[60px] w-[2px] bg-[#E3E4E9]" />
                <div className="flex flex-col gap-2">
                  <h2 className="flex items-center gap-1 text-[11px] text-[#727677] dark:text[#727677] text-normal">
                    <span>
                      <Icon
                        icon="ic:round-circle"
                        width="10"
                        height="10"
                        className="text-[#0CB91D]"
                      />
                    </span>
                    High
                  </h2>
                  <h2 className="flex items-center gap-1 text-[11px] text-[#727677] dark:text[#727677] text-normal">
                    <span>
                      <Icon
                        icon="ic:round-circle"
                        width="10"
                        height="10"
                        className="text-[#DDD427]"
                      />
                    </span>
                    Medium
                  </h2>
                  <h2 className="flex items-center gap-1 text-[11px] text-[#727677] dark:text[#727677] text-normal">
                    <span>
                      <Icon
                        icon="ic:round-circle"
                        width="10"
                        height="10"
                        className="text-[#FF695B]"
                      />
                    </span>
                    Low
                  </h2>
                </div>
              </>
            }
            footer={
              <>
                <YearlySalesTrendLines data={finalData} height={240} />
              </>
            }
          />
        )}
      </div>
    );
  };

  return (
    <>
      {/* Main Dashboard */}
      <div
        key={key}
        className="flex-1 pl-3 pr-3 pt-4 bg-gray-50 dark:bg-[#141414]"
      >
        {/* Row 1: Main Dashboard */}
        <div className="flex flex-row justify-between items-center mb-4 gap-2">
          {/* Title (Hidden below lg) */}
          <h1 className="hidden lg:block text-[14px] font-semibold text-[#5D5FEF] dark:text-[#5D5FEF]">
            Dashboard
          </h1>

          {/* Buttons Container */}
          <div className="flex flex-wrap justify-between lg:justify-end items-center gap-1 sm:gap-4 w-full">
            {/* Export Button */}
            <MenuActionButton
              label="Export"
              iconLight="./exportIconLight.png"
              iconDark="./exportIconDark.png"
              iconPos="left"
              menuOptions={exportMenuOptions}
              labelClass="font-normal md:font-bold"
              buttonClass="flex items-center justify-center gap-2 text-[7px] xs:text-[10px] sm:text-[12px] md:text-sm h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] w-auto px-2 sm:px-3 md:px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
              menuClass="mt-2 w-[104px] p-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C]"
              iconClass="w-[12px] h-[10px] xs:w-[13px] xs:h-[11px] sm:w-[14px] sm:h-[12px] md:w-[16px] md:h-[14px]"
            />

            {/* RangeCalendar */}
            <div className="w-auto h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] flex items-center justify-center">
              <RangeCalendar
                icon="pi pi-calendar"
                placeholder="Select date range"
                labelClass="font-normal md:font-bold"
              />
            </div>

            {/* Refresh Button */}
            <ActionButton
              label="Refresh"
              iconLight="./refreshIcon.png"
              iconDark="./refreshIcon.png"
              iconPos="left"
              labelClass="font-normal md:font-bold"
              buttonClass="flex items-center justify-center gap-2 text-[7px] xs:text-[10px] sm:text-[12px] md:text-sm h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] w-auto px-2 sm:px-3 md:px-4 bg-white text-[#5D5FEF] dark:bg-[#0D0D0D] dark:text-[#5D5FEF] border border-[#5D5FEF] focus:outline-none focus:ring-0"
              iconClass="w-[10px] h-[10px] xs:w-[11px] xs:h-[11px] sm:w-[14px] sm:h-[14px] md:w-[16px] md:h-[16px]"
              onClick={handleRefresh}
            />

            {/* Customize Dashboard Button */}
            <CustomizeDashboard
              selectedWidgets={selectedWidgets}
              setSelectedWidgets={setSelectedWidgets}
            />
          </div>
        </div>

        {/* Row 2: Cards */}
        <div className="flex flex-col lg:flex-row w-full gap-4 mb-2 justify-center lg:items-stretch pt-2">
          {/* card 1 */}
          {selectedWidgets.includes("Target") && (
            <FlexibleCard
              cardClass="w-full lg:flex-[1_1_25%] min-w-0 h-[204px] p-3 bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
              headerClass="flex justify-between items-start"
              centerClass="flex items-center justify-center h-[100px]"
              footerClass="flex justify-between items-end"
              header={
                <>
                  <h2 className="text-lg font-bold text-[#121212] dark:text-white">
                    Target
                  </h2>
                  <div className="flex flex-col items-end">
                    <ActionButton
                      label="Create Target"
                      iconLight={
                        <Icon icon="formkit:add" width="16" height="16" />
                      }
                      iconDark={
                        <Icon icon="formkit:add" width="16" height="16" />
                      }
                      iconPos="left"
                      buttonClass="hover:shadow-md flex items-center justify-center px-2 gap-2 text-[10px] h-[32px] w-[110px] bg-white text-[#5D5FEF] dark:bg-[#0D0D0D] dark:text-[#5D5FEF] border border-[#5D5FEF] focus:outline-none focus:ring-0"
                      onClick={createTarget}
                    />
                    <span className="text-[8px] text-[#5D5FEF] mt-1 cursor-pointer hover:underline">
                      View target report
                    </span>
                  </div>
                </>
              }
              center={
                // <Suspense fallback={<Loading />}>
                <SolidGaugeChart value={72} />
                // </Suspense>
              }
              footer={
                <>
                  <div className="flex flex-col items-center justify-center -mt-2">
                    <div className="text-lg font-bold text-[#0CB91D]">
                      {achievedRevenue}
                    </div>
                    <div className="text-xs lg:text-[10px] xl:text-xs text-[#737791]">
                      Achieved Revenue
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center -mt-2">
                    <div className="text-lg font-bold text-[#5D5FEF]">
                      {targetRevenue}
                    </div>
                    <div className="text-xs lg:text-[10px] xl:text-xs text-[#737791]">
                      Target Revenue
                    </div>
                  </div>
                </>
              }
            />
          )}

          {/* card 2 */}
          {selectedWidgets.includes("Top Performer") && (
            <FlexibleCard
              cardClass="flex flex-row w-full lg:flex-[1.5_1_37.5%] min-w-0 overflow-hidden h-[204px] bg-gradient-to-r from-[#C2FFCA] via-[#D7FFDC] to-[#C2FFCA] dark:bg-gradient-to-r dark:from-[#012A06] dark:via-[#0D5715] dark:to-[#012A06] rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
              headerClass="flex-1 w-[40%] lg:w-[50%]"
              centerClass="flex items-center justify-center w-[60%] lg:w-[50%] h-[100%] overflow-hidden pr-3"
              footerClass=""
              header={
                <>
                  <div className="flex flex-col justify-evenly pt-2 pb-2 m-4 gap-6">
                    <h2 className="w-full text-[12px] font-semibold text-[#151D48] dark:text-white">
                      Top Performer Today!
                    </h2>
                    <h1 className="text-[22px] font-bold bg-gradient-to-r from-[#000000] to-[#00FF40] bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-[#00DA37] dark:to-[#048A12]">
                      Electronics
                    </h1>
                    <div className="flex flex-col gap-2">
                      <div className="text-[22px] font-bold text-[#151D48] dark:text-white">
                        $ 356K
                      </div>
                      <div className="text-[12px] text-[#151D48] dark:text-white">
                        of total sales
                      </div>
                    </div>
                  </div>
                </>
              }
              center={
                // <Suspense fallback={<Loading />}>
                <TrendLineChart data={[0, 3, 1, 4]} height={200} width={200} />
                // </Suspense>
              }
            />
          )}

          {/* card 3 */}
          {selectedWidgets.includes("Biggest Bottleneck") && (
            <FlexibleCard
              cardClass="flex flex-row w-full lg:flex-[1.5_1_37.5%] min-w-0 overflow-hidden] h-[204px] bg-gradient-to-r from-[#FFC7C8] via-[#FFDBDC] to-[#FFC7C8] dark:bg-gradient-to-r dark:from-[#610002] dark:via-[#9D0609] dark:to-[#610002] rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
              headerClass="flex-1 w-[60%]"
              centerClass="flex flex-col w-[40%]"
              footerClass=""
              header={
                <>
                  <div className="flex flex-col justify-evenly pt-6 pb-1 pl-4 gap-4">
                    <h2 className="text-[12px] font-semibold text-[#151D48] dark:text-white">
                      Biggest Bottleneck Today!
                    </h2>
                    <h1 className="text-[18px] lg:text-[21px] font-bold bg-gradient-to-r from-[#151D48] to-[#FF0000] bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-[#FF0000] dark:to-[#899CFF]">
                      Delayed Shipments
                    </h1>
                    <h2 className="text-[26px] font-extrabold text-[#151D48] dark:text-white">
                      12 Orders
                    </h2>
                    <h1 className="text-[13px] font-semibold text-[#AE0003] dark:text-[#C70003] mt-0 lg:-mt-4 xl:mt-0">
                      Delayed
                    </h1>
                  </div>
                </>
              }
              center={
                <div className="flex flex-col pr-4 pt-6 gap-8">
                  <div className="flex justify-end ">
                    <img
                      src="/red-exclamation-mark-symbol.png"
                      alt="Delayed Shipments"
                      className="w-[80px] h-[80px] object-contain"
                    />
                  </div>
                  <div className="flex justify-end">
                    <ActionButton
                      label="Contact supplier!"
                      onClick={AccessDenied}
                      buttonClass="flex items-center justify-center px-2 text-[12px] h-[40px] w-[150px] bg-[#151D48] text-white dark:bg-black dark:text-white border-none focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
              }
            />
          )}
        </div>

        {/* Row 3: Cards */}
        <div
          className="grid gap-4 mb-2 justify-center 
    [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))] pt-2"
        >
          {/* card 1 */}
          {selectedWidgets.includes("Revenue KPI") && (
            <FlexibleCard
              cardClass="flex flex-col w-full  h-[135px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
              headerClass="flex-1 "
              centerClass=" "
              footerClass=""
              header={
                <>
                  <div className="flex flex-row justify-between pt-3 pl-4 pr-4">
                    <h2 className="flex text-[#737791] dark:text-[#FFFFFF] text-[12px]">
                      Revenue
                    </h2>

                    <DropdownButton
                      defaultOption={revenuePeriod}
                      options={["This Week", "This Month", "This Year"]}
                      className="ml-4"
                      buttonClassName="text-[#5D5FEF] hover:underline"
                      dropdownClassName="bg-gray-50 border border-gray-200 w-[85px]"
                      optionClassName="hover:bg-[#f0f0ff]"
                      onChange={(value) => setRevenuePeriod(value)}
                    />
                  </div>
                </>
              }
              center={
                <div className="flex flex-row justify-between pl-4 pr-4">
                  <div className="flex flex-col gap-5 pb-3">
                    <h1 className="font-extrabold text-[28px] text-[#151D48] dark:text-[#EEF1FF]">
                      {revenue}
                    </h1>
                    <h2 className="text-[#737791] text-[12px] dark:text-[#FFFFFF]">
                      {revenueChange}
                    </h2>
                  </div>
                  <MiniTrendArrowChart
                    data={revenueChart}
                    trend={revenueTrend}
                  />
                </div>
              }
            />
          )}

          {/* card 2 */}
          {selectedWidgets.includes("New Customers KPI") && (
            <FlexibleCard
              cardClass="flex flex-col w-full  h-[135px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
              headerClass="flex-1"
              centerClass=""
              footerClass=""
              header={
                <>
                  <div className="flex flex-row justify-between pr-4 pt-3 pl-4">
                    <h2 className="text-[#737791] dark:text-[#FFFFFF] text-[12px]">
                      New Customers
                    </h2>

                    <DropdownButton
                      defaultOption={customersPeriod}
                      options={["This Week", "This Month", "This Year"]}
                      className="ml-4"
                      buttonClassName="text-[#5D5FEF] hover:underline"
                      dropdownClassName="bg-gray-50 border border-gray-200 w-[85px]"
                      optionClassName="hover:bg-[#f0f0ff]"
                      onChange={(value) => setCustomersPeriod(value)}
                    />
                  </div>
                </>
              }
              center={
                <div className="flex flex-row justify-between pl-4 pr-4 ">
                  <div className="flex flex-col gap-5 pb-3">
                    <h1 className="font-extrabold text-[28px] text-[#151D48] dark:text-[#EEF1FF]">
                      {customerValue}
                    </h1>
                    <h2 className="text-[#737791] text-[12px] dark:text-[#FFFFFF]">
                      {customerChange}
                    </h2>
                  </div>
                  <MiniTrendArrowChart
                    data={customerChart}
                    trend={customerTrend}
                  />
                </div>
              }
            />
          )}

          {/* card 3 */}
          {selectedWidgets.includes("Sales KPI") && (
            <FlexibleCard
              cardClass="flex flex-col w-full h-[135px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
              headerClass="flex-1"
              centerClass=""
              footerClass=""
              header={
                <>
                  <div className="flex flex-row justify-between pt-3 pl-4 pr-4">
                    <h2 className="text-[#737791] dark:text-[#FFFFFF] text-[12px]">
                      Sales
                    </h2>

                    <DropdownButton
                      defaultOption={salesPeriod}
                      options={["This Week", "This Month", "This Year"]}
                      className="ml-4"
                      buttonClassName="text-[#5D5FEF] hover:underline"
                      dropdownClassName="bg-gray-50 border border-gray-200 w-[85px]"
                      optionClassName="hover:bg-[#f0f0ff]"
                      onChange={(value) => setSalesPeriod(value)}
                    />
                  </div>
                </>
              }
              center={
                <div className="flex flex-row justify-between pl-4 pr-4">
                  <div className="flex flex-col gap-5 pb-3">
                    <h1 className="font-extrabold text-[28px] text-[#151D48] dark:text-[#EEF1FF]">
                      {salesValue}
                    </h1>
                    <h2 className="text-[#737791] text-[12px] dark:text-[#FFFFFF]">
                      {salesChange}
                    </h2>
                  </div>

                  <MiniTrendArrowChart data={salesChart} trend={salesTrend} />
                </div>
              }
            />
          )}

          {/* card 4 */}
          {selectedWidgets.includes("Orders Overview KPI") && (
            <FlexibleCard
              cardClass="flex flex-col w-full  h-[135px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
              headerClass="flex-1"
              centerClass=""
              footerClass=""
              header={
                <>
                  <div className="flex flex-row justify-between pt-3 pl-4 pr-4">
                    <h2 className="text-[#737791] dark:text-[#FFFFFF] text-[12px]">
                      Orders Overview
                    </h2>

                    <DropdownButton
                      defaultOption={ordersPeriod}
                      options={["This Week", "This Month", "This Year"]}
                      className="ml-4"
                      buttonClassName="text-[#5D5FEF] hover:underline"
                      dropdownClassName="bg-gray-50 border border-gray-200 w-[85px]"
                      optionClassName="hover:bg-[#f0f0ff]"
                      onChange={(value) => setOrdersPeriod(value)}
                    />
                  </div>
                </>
              }
              center={
                <div className="flex flex-row justify-between pl-4 pr-4">
                  <div className="flex flex-col gap-5 pb-3">
                    <h1 className="font-extrabold text-[28px] text-[#151D48] dark:text-[#EEF1FF]">
                      {orderValue}
                    </h1>
                    <h2 className="text-[#737791] text-[12px] dark:text-[#FFFFFF]">
                      {orderChange}
                    </h2>
                  </div>

                  <MiniTrendArrowChart data={orderChart} trend={orderTrend} />
                </div>
              }
            />
          )}
        </div>

        {/* Row 4: Cards */}
        <div className="flex flex-col lg:flex-row gap-4 mb-2 justify-center lg:items-stretch pt-2">
          {/* Card 1 */}
          {selectedWidgets.includes("Quick Actions & Multichannel View") && (
            <FlexibleCard
              cardClass="flex flex-col w-full flex-1 min-w-0 h-[330px] rounded-xl p-1"
              headerClass="w-full"
              centerClass="mt-4"
              footerClass=""
              header={
                <>
                  <div className="p-1">
                    <h1 className="text-[14px] text-[#737791] dark:text-[#FFFFFF] ">
                      Quick Actions
                    </h1>
                  </div>
                  <div className="flex flex-row justify-between gap-3 p-1">
                    <ActionButton
                      label="Add New Order"
                      iconLight={
                        <Icon icon="ic:round-add" width="20" height="20" />
                      }
                      iconDark={
                        <Icon icon="ic:round-add" width="20" height="20" />
                      }
                      iconPos="left"
                      buttonClass="flex items-center justify-center px-3 gap-1 font-normal text-[12px] h-[50px] w-[160px] text-white bg-gradient-to-r from-[#5D5FEF] to-[#353689] dark:text-black border-none focus:outline-none focus:ring-0"
                      onClick={addNewOrder}
                    />
                    <ActionButton
                      label="Generate Invoices"
                      iconLight={
                        <Icon
                          icon="basil:invoice-outline"
                          width="20"
                          height="20"
                        />
                      }
                      iconDark={
                        <Icon
                          icon="basil:invoice-outline"
                          width="20"
                          height="20"
                        />
                      }
                      iconPos="left"
                      // styling="col-span-4"
                      buttonClass="flex items-center justify-center px-3 gap-1 font-normal text-[12px] h-[50px] w-[160px] text-white bg-gradient-to-r from-[#5D5FEF] to-[#353689] dark:text-black border-none focus:outline-none focus:ring-0"
                      onClick={generateInvoice}
                    />
                    <ActionButton
                      label="Updated Inventory"
                      iconLight={
                        <Icon
                          icon="octicon:checklist-24"
                          width="20"
                          height="20"
                        />
                      }
                      iconDark={
                        <Icon
                          icon="octicon:checklist-24"
                          width="20"
                          height="20"
                        />
                      }
                      iconPos="left"
                      // styling="col-span-4"
                      buttonClass="flex items-center justify-center px-3 gap-1 font-normal text-[12px] h-[50px] w-[160px] text-white bg-gradient-to-r from-[#5D5FEF] to-[#353689] dark:text-black border-none focus:outline-none focus:ring-0"
                      onClick={updateInventory}
                    />
                  </div>
                </>
              }
              center={
                <>
                  <div className="p-1">
                    <h1 className="text-[14px] text-[#737791] dark:text-[#FFFFFF] ">
                      Multichannel View
                    </h1>
                  </div>

                  <div className="flex flex-row justify-between gap-3 p-1 ">
                    <FlexibleCard
                      cardClass="flex flex-col justify-center w-[160px] h-[180px] p-2 bg-[#95BF4726] dark:bg-[#95BF4759] rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                      headerClass=""
                      centerClass="flex mt-4"
                      footerClass=""
                      header={
                        <>
                          <div className="flex flex-col gap-2 pl-2">
                            <img
                              src="/shopifyIcon.png"
                              alt="Shopify"
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                            <h1 className="text-[24px] font-extrabold text-[#151D48] dark:text-white">
                              $1K
                            </h1>
                            <h2 className="text-[16px] font-normal text-[#4E4E4E] dark:text-white">
                              Shopify
                            </h2>
                            <h2 className="text-[12px] font-light text-[#5D5FEF] dark:text-white">
                              +8% from yesterday
                            </h2>
                          </div>
                        </>
                      }
                    />
                    <FlexibleCard
                      cardClass="flex flex-col justify-center p-2 w-[160px] h-[180px] bg-[#F8B31D26] dark:bg-[#F8B31D59] rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                      headerClass=""
                      centerClass="flex mt-4"
                      footerClass=""
                      header={
                        <>
                          <div className="flex flex-col gap-2 pl-2">
                            <img
                              src="/amazonIcon.png"
                              alt="Amazon"
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                            <h1 className="text-[24px] font-extrabold text-[#151D48] dark:text-white">
                              $1K
                            </h1>
                            <h2 className="text-[16px] font-normal text-[#4E4E4E] dark:text-white">
                              Amazon
                            </h2>
                            <h2 className="text-[12px] font-light text-[#5D5FEF] dark:text-white">
                              +5% from yesterday
                            </h2>
                          </div>
                        </>
                      }
                    />
                    <FlexibleCard
                      cardClass="flex flex-col justify-center p-2 w-[160px] h-[180px] bg-[#36A8F426] dark:bg-[#36A8F459] rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                      headerClass=""
                      centerClass="flex mt-4"
                      footerClass=""
                      header={
                        <>
                          <div className="flex flex-col gap-2 pl-2">
                            <img
                              src="/ebayIcon.png"
                              alt="eBay"
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                            <h1 className="text-[24px] font-extrabold text-[#151D48] dark:text-white">
                              $1K
                            </h1>
                            <h2 className="text-[16px] font-normal text-[#4E4E4E] dark:text-white">
                              eBay
                            </h2>
                            <h2 className="text-[12px] font-light text-[#5D5FEF] dark:text-white">
                              +12% from yesterday
                            </h2>
                          </div>
                        </>
                      }
                    />
                  </div>
                </>
              }
            />
          )}

          {/* Card 2*/}
          {selectedWidgets.includes("AI Powered Suggestions") && (
            <FlexibleCard
              cardClass="flex flex-col w-full flex-1 min-w-0 h-[330px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
              headerClass=" pb-2"
              centerClass="px-4 flex items-center w-full"
              footerClass=""
              header={
                <>
                  <div className="flex flex-row p-4 justify-between">
                    <div className="flex flex-row justify-start items-center gap-4">
                      <Icon
                        icon="mingcute:ai-line"
                        width="20"
                        height="20"
                        className=" text-[#5D5FEF]"
                      />
                      <h1 className="text-[14px] text-[#737791] dark:text-[#EEF1FF] font-medium">
                        AI Powered Suggestions
                      </h1>
                    </div>
                    <div className="">
                      <ActionButton
                        label="View All"
                        buttonClass="flex text-[12px] h-[24px] font-normal text-[#5D5FEF] dark:text-[#7476F1] border-none focus:outline-none focus:ring-0 !shadow-none hover:underline"
                      />
                    </div>
                  </div>
                </>
              }
              center={
                tabLoading ? (
                  // Skeleton for tab content only
                  <div className="w-full h-[205px] overflow-hidden space-y-4">
                    {[
                      ...Array(
                        aiSuggestedTabs[activeTabIndex]?.contentData?.length ||
                          2
                      ),
                    ].map((_, i) => (
                      <div
                        key={i}
                        className="w-full h-[70px] bg-gradient-to-r from-[#5D60EF0f] to-[#BAFF860f] dark:from-[#5D60EF0f] dark:to-[#BAFF860f] p-4 rounded-xl"
                      >
                        <Skeleton
                          height="10px"
                          width="40%"
                          animation="wave"
                          className="rounded-xl dark:bg-[#2C2C2CAA] mb-2"
                        />
                        <Skeleton
                          height="12px"
                          width="80%"
                          animation="wave"
                          className="rounded-xl dark:bg-[#2C2C2CAA]"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <SimpleTabView
                    activeIndex={activeTabIndex}
                    tabs={aiSuggestedTabs}
                    renderItem={(item) => (
                      <div className="h-auto w-full bg-gradient-to-r from-[#5D60EF0f] to-[#BAFF860f] dark:from-[#5D60EF0f] dark:to-[#BAFF860f] p-4 rounded-xl">
                        <h2 className="text-[11px] dark:text-[#FFFFFF66] text-[#00000066]">
                          {item.title}
                        </h2>
                        <p className="text-[15px] dark:text-[#EEF1FF] text-[#151D48]">
                          {item.text}
                        </p>
                      </div>
                    )}
                    tabLabelClass="text-[12px] font-normal pb-1"
                    activeTabClass="text-[#5D5FEF] border-b-[2px] border-[#5D5FEF]"
                    inactiveTabClass="text-[#737791] dark:text-[#EEF1FF]"
                    tabHeaderClass="gap-5"
                    contentContainerClass="mt-4 w-full"
                    panelClass="w-full h-[205px] overflow-y-auto overflow-x-hidden space-y-4 pr-2 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#F2F2FE] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]"
                    onTabChange={handleTabChange}
                  />
                )
              }
            />
          )}
        </div>

        {/* Row 5: Cards */}
        <div className="flex flex-col lg:flex-row gap-4 mb-2 justify-center lg:items-stretch pt-2">
          {/* Card 1 */}
          {selectedWidgets.includes("Tasks") && (
            <FlexibleCard
              cardClass="flex flex-col w-full flex-1 min-w-0 h-[330px] bg-white dark:bg-black rounded-xl p-4 hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
              headerClass="flex flex-row items-center justify-between"
              centerClass="flex flex-row items-center pt-2"
              footerClass="w-full"
              header={
                <>
                  <div className="flex w-full items-center">
                    <h1 className="text-[18px] font-bold text-[#151D48] dark:text-[#EEF1FF] ">
                      Tasks
                    </h1>
                  </div>
                  <div className="flex gap-3 ml-auto">
                    <ActionButton
                      label=""
                      iconLight={
                        <Icon
                          icon="mi:message"
                          width="18"
                          height="18"
                          className="text-[#5932EA]"
                        />
                      }
                      iconDark={
                        <Icon
                          icon="mi:message"
                          width="18"
                          height="18"
                          className="text-[#5932EA]"
                        />
                      }
                      iconPos="left"
                      buttonClass="flex items-center justify-center h-[32px] w-[32px]  bg-[#F7F5FF] dark:bg-[#121212] border-none focus:outline-none focus:ring-0"
                      onClick={() => {
                        navigate("/chat");
                      }}
                    />
                    <ActionButton
                      label="Create Task"
                      iconLight={
                        <Icon icon="formkit:add" width="16" height="16" />
                      }
                      iconDark={
                        <Icon icon="formkit:add" width="16" height="16" />
                      }
                      iconPos="left"
                      buttonClass="flex items-center justify-center px-3 gap-1 font-normal text-[12px] h-[32px] w-[119px] text-white bg-[#5D5FEF] dark:text-[#0D0D0D] border-none focus:outline-none focus:ring-0"
                      onClick={createTask}
                    />
                  </div>
                </>
              }
              center={
                <>
                  <div className="relative flex w-full items-center">
                    <div className="flex flex-row items-center gap-2">
                      <img src="/multipleProfile.png" alt="Profiles" />
                      <h3 className="text-[12px] text-[#131330] dark:text-[#CFCFEC]">
                        + 15 more
                      </h3>
                      {/* </div> */}
                      {/* <div className="flex items-center absolute left-1/2 -translate-x-1/2"> */}
                      <Icon
                        icon="ph:dot"
                        width="20"
                        height="20"
                        className="text-[#0CB91D]"
                      />
                      <h1 className="text-[12px] text-[#0CB91D] -translate-x-2">
                        Active
                      </h1>
                    </div>
                    <div className="ml-auto">
                      <ActionButton
                        label="View All"
                        buttonClass="flex text-[12px] h-[24px] font-normal text-[#5D5FEF] dark:text-[#7476F1] border-none focus:outline-none focus:ring-0 !shadow-none hover:underline"
                        onClick={() => {
                          navigate("/task");
                        }}
                      />
                    </div>
                  </div>
                </>
              }
              footer={
                <div className="h-[235px] w-full overflow-y-auto overflow-x-hidden space-y-4 pr-2 mt-2 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#F2F2FE] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
                  {taskCards.map((task) => (
                    <FlexibleCard
                      key={task.id}
                      cardClass="w-full h-auto bg-gradient-to-r from-[#7B7BFF0F] to-[#11FF2C0F] border-none rounded-xl p-3"
                      headerClass=""
                      centerClass=""
                      footerClass="flex flex-row items-center justify-between"
                      header={
                        <div className="relative flex w-full items-center">
                          <div className="flex flex-row items-center gap-2">
                            <img
                              src={task.profileImage}
                              alt={task.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <h3 className="text-[12px] text-[#151D48] dark:text-[#EEF1FF] ">
                              {task.name}
                            </h3>
                            <Icon
                              icon="ph:dot"
                              width="20"
                              height="20"
                              className="text-[#00000066] dark:text-[#FFFFFF66] ml-2"
                            />
                            <h1 className="text-[10px] text-[#00000066] dark:text-[#FFFFFF66] ml-1 -translate-x-4">
                              {task.role}
                            </h1>
                          </div>
                          <div className="flex flex-row items-center gap-1 ml-auto">
                            <h1 className="text-[10px] text-[#131330] text-right">
                              <span className="text-[#00000066] dark:text-[#FFFFFF66] font-normal pr-1 ">
                                Assigned on:
                              </span>
                              {task.assignedOn}
                            </h1>
                          </div>
                        </div>
                      }
                      center={
                        <h2 className="text-[#00000066] dark:text-[#FFFFFF66] text-[10px] pt-1">
                          {task.taskName}
                        </h2>
                      }
                      footer={
                        <>
                          <div className="flex flex-col gap-1 pt-1">
                            <h1 className="text-[15px] text-[#151D48] dark:text-[#EEF1FF] font-extrabold">
                              {task.taskTitle}
                            </h1>
                            <h2 className="text-[10px] text-[#131330]">
                              <span className="text-[#EF4444] pr-1 font-normal">
                                Deadline:
                              </span>
                              {task.deadline}
                            </h2>
                          </div>
                          <div className="flex items-center gap-4">
                            <img
                              src={task.taskImage}
                              alt={task.name}
                              className="w-[57px] h-[51px] object-cover"
                            />
                          </div>
                        </>
                      }
                    />
                  ))}
                </div>
              }
            />
          )}

          {/* Card 2*/}
          {selectedWidgets.includes("Recent Activities") && (
            <FlexibleCard
              cardClass="flex flex-col w-full flex-1 min-w-0 h-[330px] bg-white dark:bg-black rounded-xl p-4 hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
              headerClass="w-full"
              centerClass="w-full"
              footerClass="w-full"
              header={
                <>
                  <h1 className="text-[#151D48] text-[20px] dark:text-[#EEF1FF] font-extrabold">
                    Recent Activities
                  </h1>
                </>
              }
              center={
                <div className="h-[275px] w-full overflow-y-auto overflow-x-hidden space-y-4 pr-2 mt-2 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#F2F2FE] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
                  {recentActivities.map((activity) => (
                    <FlexibleCard
                      key={activity.id}
                      cardClass="w-full h-auto bg-[#F2F2FE80] dark:bg-[#14141480] border-none rounded-xl p-3"
                      headerClass=""
                      centerClass=""
                      footerClass="flex flex-row items-center"
                      header={
                        <div className="relative flex w-full items-center">
                          <div className="flex items-center gap-4">
                            <img
                              src={activity.image}
                              alt={activity.taskName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <h3 className="text-[12px] text-[#151D48] dark:text-[#EEF1FF]">
                              {activity.name}
                            </h3>
                          </div>
                          <Icon
                            icon="ph:dot"
                            width="20"
                            height="20"
                            className="text-[#00000066] dark:text-[#FFFFFF66] ml-2"
                          />
                          <h1 className="text-[10px] text-[#00000066] dark:text-[#FFFFFF66] ml-1">
                            {activity.role}
                          </h1>
                          <div className="flex items-center ml-auto">
                            <h1 className="text-[10px] text-[#00000066] dark:text-[#FFFFFF66]">
                              {activity.time}
                            </h1>
                          </div>
                        </div>
                      }
                      footer={
                        <div className="flex flex-col gap-1 pt-1">
                          <h1 className="text-[15px] text-[#151D48] dark:text-[#EEF1FF] font-semibold">
                            {activity.taskTitle}
                          </h1>
                        </div>
                      }
                    />
                  ))}
                </div>
              }
            />
          )}
        </div>

        {/* Row 6: Cards */}
        <PinWrapper
          id="dashboard-row-6"
          meta={{ component: DashboardRow6 }}
          skeleton={<Row6Skeleton />}
        >
          <DashboardRow6 />
        </PinWrapper>

        {/* Row 7: Cards */}
        <div className="flex flex-col lg:flex-row gap-4 mb-2 justify-center lg:items-stretch pt-2">
          {/* Card 1 */}
          {selectedWidgets.includes("Calendar") && (
            <FlexibleCard
              cardClass="flex flex-col w-full flex-1 min-w-0 h-[330px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
              headerClass="flex flex-1"
              centerClass=""
              footerClass=""
              header={<SimpleCalendar className="w-full h-full" />}
            />
          )}

          {/* Card 2*/}
          {selectedWidgets.includes("Activity Feed") && (
            <FlexibleCard
              cardClass="flex flex-col w-full flex-1 min-w-0s h-[330px] rounded-xl p-4 "
              headerClass=""
              centerClass=" "
              footerClass=""
              header={
                <>
                  <div className="flex justify-between">
                    <h2 className="text-[14px] font-semibold text-[#737791] dark:text-[#F2F2FE]">
                      Activity Feed
                    </h2>
                    <ActionButton
                      label="View All"
                      buttonClass="flex text-[12px] h-[24px] font-normal text-[#5D5FEF] dark:text-[#7476F1] border-none focus:outline-none focus:ring-0 !shadow-none hover:underline"
                      onClick={() => {
                        navigate("/notifications");
                      }}
                    />
                  </div>
                </>
              }
              center={
                <div className="h-[275px] w-full overflow-y-auto overflow-x-hidden space-y-4 pr-2 mt-2 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#F2F2FE] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
                  {activityFeeds.map((activityFeed) => (
                    <FlexibleCard
                      key={activityFeed.id}
                      cardClass="w-full h-[88px] bg-[#FFFFFF] dark:bg-black border-none rounded-xl p-3 hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
                      headerClass=""
                      centerClass=""
                      footerClass="flex flex-row items-center"
                      header={
                        <div className="relative flex w-full items-center">
                          <div className="flex items-center gap-4">
                            <h3 className="text-[12px] text-[#151D48] dark:text-[#EEF1FF] font-semibold">
                              {activityFeed.name}
                            </h3>
                          </div>
                        </div>
                      }
                      footer={
                        <div className="flex flex-col gap-1 pt-1">
                          <h1 className="text-[14px] text-[#737791] dark:text-[#737791]">
                            {activityFeed.detail}
                          </h1>
                        </div>
                      }
                    />
                  ))}
                </div>
              }
            />
          )}
        </div>

        {/* Row 8: Cards */}
        {selectedWidgets.includes("Daily Tasks") && (
          <div className="pt-4 space-y-4 relative">
            <div className="bg-white dark:bg-[#000000] rounded-lg p-4 h-auto">
              {/* Heading + Export */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h2 className="text-[#333333] dark:text-[#F2F2FE] font-bold text-[16px] lg:text-[18px]">
                  Daily Tasks
                </h2>
                <MenuActionButton
                  label="Export"
                  iconLight="./exportIconLight.png"
                  iconDark="./exportIconDark.png"
                  iconPos="left"
                  menuOptions={exportMenuOptions}
                  buttonClass="flex items-center justify-center gap-1 text-sm h-[40px] w-[104px] px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
                  menuClass="mt-2 w-[104px] p-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C]"
                  iconClass="w-[16px] h-[14px]"
                />
              </div>

              {/* Tabs */}
              <div className="flex gap-6 mb-4">
                {loading
                  ? [...Array(3)].map((_, i) => (
                      <Skeleton
                        key={i}
                        width="80px"
                        height="20px"
                        borderRadius="6px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                    ))
                  : ["All", "Completed", "Pending"].map((label, i) => {
                      // Example: Replace with your actual data counts
                      const counts = {
                        All: dataSets["all"]?.length || 0,
                        Completed: dataSets["completed"]?.length || 0,
                        Pending: dataSets["pending"]?.length || 0,
                      };
                      const count = counts[label] ?? 0;

                      return (
                        <button
                          key={i}
                          onClick={() => {
                            setTableLoading(true);
                            setActiveDailyTabIndex(i);
                            setActiveDailyTab(tabKeys[i]);
                            setCurrentPage(1);
                            setTimeout(() => setTableLoading(false), 2000);
                          }}
                          className={`pb-2 flex items-center gap-2 text-[12px] font-medium transition-all ${
                            i === activeDailyTabIndex
                              ? "text-[#151D48] dark:text-[#F2F2FE] border-b-2 border-[#5D5FEF] dark:border-[#7476F1]"
                              : "text-[#151D48] dark:text-[#B7BFEA] hover:text-[#5D5FEF] dark:hover:text-[#F2F2FE]"
                          }`}
                        >
                          <span>{label}</span>
                          {i !== activeDailyTabIndex && (
                            <span
                              className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-semibold 
            bg-[#5D5FEF1A] dark:bg-[#7476F11A] text-[#5D5FEF] dark:text-[#7476F1]`}
                            >
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
              </div>

              {/* Table */}
              <div className="overflow-x-auto w-full">
                {loading || tableLoading ? (
                  <>
                    {/* Skeleton: Table Header */}
                    <div className="grid grid-cols-6 gap-4 items-center border-b border-gray-200 dark:border-[#333] py-2">
                      {[...Array(columns?.length || 6)].map((_, i) => (
                        <Skeleton
                          key={i}
                          width="100%"
                          height="20px"
                          borderRadius="6px"
                          className="dark:bg-[#2C2C2CAA]"
                        />
                      ))}
                    </div>

                    {/* Skeleton: Table Rows */}
                    <div className="space-y-3">
                      {[...Array(5)].map((_, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="grid grid-cols-6 gap-4 items-center border-b border-gray-200 dark:border-[#333] py-2"
                        >
                          {[...Array(columns?.length || 6)].map(
                            (_, colIndex) => (
                              <Skeleton
                                key={colIndex}
                                width="100%"
                                height="20px"
                                borderRadius="6px"
                                className="dark:bg-[#2C2C2CAA]"
                              />
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <DataTable
                    value={pagedRows}
                    paginator={false}
                    className="p-datatable-sm w-full my-delete-table"
                    rowClassName={() =>
                      "border-b border-[#73779126] text-[13px] text-[#666666] dark:text-[#F2F2FE] dark:bg-black whitespace-nowrap"
                    }
                  >
                    {columns.map((col, idx) => (
                      <Column
                        key={idx}
                        field={col.field}
                        header={col.header}
                        body={(rowData) =>
                          col.body ? col.body(rowData) : rowData[col.field]
                        }
                        headerClassName="text-[12px] text-[#33333380] dark:text-[#8E8E9C] dark:bg-black font-semibold bg-white whitespace-nowrap"
                        // style={{ width: `${10 / columns.length}%` }}
                      />
                    ))}
                  </DataTable>
                )}
              </div>

              {/* Paginator */}
              {loading || tableLoading ? (
                <div className="flex justify-center gap-2 mt-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton
                      key={i}
                      width="32px"
                      height="32px"
                      borderRadius="50%"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  ))}
                </div>
              ) : (
                <CustomPaginator
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  maxButtons={5}
                />
              )}
            </div>
          </div>
        )}

        <div className="pb-5"></div>
      </div>
    </>
  );
}
