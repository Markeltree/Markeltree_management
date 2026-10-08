import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useModal } from "@/context/ModalContext";
import React, { useState, useEffect, useRef } from "react";
import {
  DataTable,
  useMemo,
  Column,
  ActionButton,
  menuOptions,
  SearchBox,
  Icon,
  CustomPaginator,
  FlexibleCard,
  TargetSummaryModal,
  Skeleton,
  MenuActionButton,
  FilterCalendar,
} from "@/common/imports";

const tabTitles = [
  {
    heading: "Tasks Table",
    subheading: "Real-time data on tasks, and status.",
  },
  {
    heading: "Your Target Report",
    subheading: "Real-time data on tasks, and status.",
  },
];

const dataSets = {
  tasks: [
    {
      taskName: "Task A",
      assignedBy: "Manager",
      dueDate: "2025-11-20",
      status: "Completed",
      priority: "High",
      action: 1,
    },
    {
      taskName: "Task B",
      assignedBy: "Manager",
      dueDate: "2025-11-24",
      status: "Pending",
      priority: "High",
      action: 0,
    },
    {
      taskName: "Task A",
      assignedBy: "Admin",
      dueDate: "2025-11-21",
      status: "Completed",
      priority: "Low",
      action: 1,
    },
    {
      taskName: "Task A",
      assignedBy: "Manager",
      dueDate: "2025-11-23",
      status: "Completed",
      priority: "Moderate",
      action: 1,
    },
    {
      taskName: "Task B",
      assignedBy: "Admin",
      dueDate: "2025-11-17",
      status: "Overdue",
      priority: "High",
      action: 0,
    },
    {
      taskName: "Task A",
      assignedBy: "Manager",
      dueDate: "2025-11-16",
      status: "Overdue",
      priority: "High",
      action: 1,
    },
    {
      taskName: "Task A",
      assignedBy: "Manager",
      dueDate: "2025-11-17",
      status: "Pending",
      priority: "Low",
      action: 0,
    },
    {
      taskName: "Task A",
      assignedBy: "Manager",
      dueDate: "2025-11-15",
      status: "Completed",
      priority: "High",
      action: 0,
    },
  ],
  targets: [
    {
      targetAmount: "$34,545",
      assignedBy: "Manager",
      dueDate: "2025-11-24",
      status: "Completed",
      priority: "High",
      action: "View Details",
    },
    {
      targetAmount: "$34,545",
      assignedBy: "Manager",
      dueDate: "2025-11-24",
      status: "Pending",
      priority: "High",
      action: "View Details",
    },
    {
      targetAmount: "$34,545",
      assignedBy: "Manager",
      dueDate: "2025-11-24",
      status: "Completed",
      priority: "Moderate",
      action: "View Details",
    },
    {
      targetAmount: "$34,545",
      assignedBy: "Manager",
      dueDate: "2025-11-24",
      status: "Completed",
      priority: "Low",
      action: "View Details",
    },
    {
      targetAmount: "$34,545",
      assignedBy: "Manager",
      dueDate: "2025-11-24",
      status: "Pending",
      priority: "High",
      action: "View Details",
    },
    {
      targetAmount: "$34,545",
      assignedBy: "Manager",
      dueDate: "2025-11-24",
      status: "Overdue",
      priority: "Low",
      action: "View Details",
    },
  ],
};

const filterFields = {
  tasks: ["assignedBy", "status", "priority", "dateRange"],
  targets: ["assignedBy", "status", "priority", "dateRange"],
};

export default function TaskData() {
  const { openModal, closeModal } = useModal();
  const filterButtonRef = useRef(null);
  const filterPanelRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterOpen &&
        filterButtonRef.current &&
        filterPanelRef.current &&
        !filterButtonRef.current.contains(event.target) &&
        !filterPanelRef.current.contains(event.target)
      ) {
        setFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOpen]);

  const exportMenuOptions = menuOptions(["CSV", "Excel"]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 6;
  const [filters, setFilters] = useState({});

  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);

  const [tempFilters, setTempFilters] = useState({});
  const [tempDateRange, setTempDateRange] = useState([
    // temporary date range while panel open
    { startDate: null, endDate: null, key: "selection" },
  ]);

  const tabKeys = ["tasks", "targets"];
  const activeTabKey = tabKeys[activeIndex];
  const rawData = dataSets[activeTabKey];

  // Reset page on tab/filter/search change
  useEffect(() => {
    setCurrentPage(0);
  }, [activeIndex, filters, globalFilter]);

  // Extract unique filter values for filter checkboxes
  const uniqueFilterValues = useMemo(() => {
    const fields = filterFields[activeTabKey] || [];
    let values = {};
    fields.forEach((field) => {
      values[field] = [...new Set(rawData.map((item) => item[field]))].filter(
        Boolean
      );
    });
    return values;
  }, [activeTabKey, rawData]);

  const parseRowDate = (dateStr) => {
    if (!dateStr) return null;
    // split by "-" and create Date object
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-based
  };

  // Filter data by active filters and global search
  const filteredData = useMemo(() => {
    const startDate = dateRange[0]?.startDate;
    let endDate = dateRange[0]?.endDate;
    if (endDate) {
      endDate = new Date(endDate);
      endDate.setHours(23, 59, 59, 999); // include full day
    }

    const dateFieldMap = {
      tasks: "dueDate",
      targets: "dueDate",
    };
    const dateField = dateFieldMap[activeTabKey];

    return rawData.filter((row) => {
      // 1️⃣ Checkbox filters
      const passesCheckboxFilter = Object.entries(filters).every(
        ([field, selected]) =>
          selected.length ? selected.includes(row[field]) : true
      );

      // 2️⃣ Global search
      const passesSearch = globalFilter
        ? Object.values(row).some(
            (val) =>
              val &&
              val.toString().toLowerCase().includes(globalFilter.toLowerCase())
          )
        : true;

      // 3️⃣ Date filter (only if date is selected)
      let passesDateFilter = true;
      if (dateField && startDate && endDate && row[dateField]) {
        const rowDate = parseRowDate(row[dateField]);
        if (
          isNaN(rowDate.getTime()) ||
          rowDate < startDate ||
          rowDate > endDate
        ) {
          passesDateFilter = false;
        }
      }

      return passesCheckboxFilter && passesSearch && passesDateFilter;
    });
  }, [rawData, filters, globalFilter, dateRange, activeTabKey]);

  // Pagination slice
  const pagedRows = filteredData.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const handleViewDetails = () => {
    closeModal();
    setTimeout(() => {
      openModal(TargetSummaryModal, {
        sizeClass: "w-[85%] md:w-[50%]",
      });
    }, 200);
  };

  // Define columns per tab
  const statusTemplate = (rowData) => {
    const statusColors = {
      Completed: "bg-[#22C55E26] text-[#22C55E]",
      Pending: "bg-[#DDD42726] text-[#DDD427]",
      Overdue: "bg-[#FF695B26] text-[#FF695B]",
    };

    return (
      <span
        className={`flex items-center justify-center w-[100px] h-[28px] rounded text-[11px] font-medium ${
          statusColors[rowData.status] || "bg-gray-200 text-gray-800"
        }`}
      >
        {rowData.status}
      </span>
    );
  };

  const priorityTemplate = (rowData) => {
    const priorityColors = {
      Low: "text-[#0CB91D]",
      Moderate: "text-[#FBBC04]",
      High: "text-[#EF4444]",
    };

    return (
      <span
        className={`text-[12px] font-medium ${
          priorityColors[rowData.priority] || "bg-gray-200 text-gray-800"
        }`}
      >
        {rowData.priority}
      </span>
    );
  };

  const TaskActionTemplate = (rowData) => {
    const isEnabled = rowData.action === 1;

    return (
      <button
        className={`px-3 py-1 w-[100px] h-[28px] rounded text-[11px] font-medium flex items-center justify-center
        border ${
          isEnabled
            ? "border-[#0CB91D] text-[#0CB91D]" // Enabled: bright green
            : "border-[#A3F7B0] text-[#A3F7B0]" // Disabled: light green
        }
        bg-white dark:bg-[#1A1A1A]`}
        disabled={!isEnabled}
      >
        Mark as read
      </button>
    );
  };

  const columns = useMemo(() => {
    switch (activeTabKey) {
      case "tasks":
        return [
          { field: "taskName", header: "Task Name" },
          { field: "assignedBy", header: "Assigned By" },
          { field: "dueDate", header: "Due Date" },
          { field: "status", header: "Status", body: statusTemplate },
          { field: "priority", header: "Priority", body: priorityTemplate },
          { field: "action", header: "Action", body: TaskActionTemplate },
        ];
      case "targets":
        return [
          { field: "targetAmount", header: "Target Amount" },
          { field: "assignedBy", header: "Assigned By" },
          { field: "dueDate", header: "Due Date" },
          { field: "status", header: "Status", body: statusTemplate },
          { field: "priority", header: "Priority", body: priorityTemplate },
          {
            field: "action",
            header: "Action",
            body: (rowData) => (
              <button
                className="w-[110px] h-[28px] flex items-center gap-1 px-3 py-1 bg-[#09BF64] hover:bg-[#4b4de0] text-white text-[12px] rounded dark:text-[#0D0D0D] dark:bg-[#81D959]"
                onClick={handleViewDetails}
              >
                <Icon
                  icon="hugeicons:view"
                  width={14}
                  height={14}
                  className="text-[#ffffff] dark:text-[#0D0D0D]"
                />
                View Details
              </button>
            ),
          },
        ];

        return [
          { field: "userName", header: "User Name" },
          { field: "role", header: "Role" },
          { field: "actionType", header: "Action Type", body: ActionTypeIcon },
          { field: "timeStamp", header: "Timestamp" },
          { field: "description", header: "Description" },
        ];
      default:
        return [];
    }
  }, [activeTabKey]);

  // Toggle filter checkbox value
  const toggleTempValue = (field, value) => {
    setTempFilters((prev) => {
      const current = prev[field] || [];
      const newFieldValues = current.includes(value)
        ? current.filter((v) => v !== value) // remove if exists
        : [...current, value]; // add if not exists
      return { ...prev, [field]: newFieldValues };
    });
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const resetFilters = () => setFilters({});

  const hasDateRangeFilter = filterFields[activeTabKey]?.includes("dateRange");

  if (isLoading) {
    return (
      <div className="pt-4 space-y-4 relative">
        {/* Tabs */}
        <div className="flex gap-6">
          {[...Array(2)].map((_, i) => (
            <Skeleton
              key={i}
              width="130px"
              height="28px"
              className="dark:bg-[#2C2C2CAA]"
              style={{
                borderBottom: i === activeIndex ? "2px solid #09BF64" : "none",
                marginBottom: "4px",
              }}
            />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4 mb-2 justify-center w-full">
          {/* Card 1 */}
          <div className="flex flex-col w-full  col-span-4 md:col-span-2 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl p-4">
            <div className="flex flex-row justify-between items-center h-full">
              <div className="flex flex-col gap-3">
                <Skeleton
                  width="80px"
                  height="12px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="60px"
                  height="24px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
              <Skeleton
                width="56px"
                height="55px"
                borderRadius="8px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col w-full  col-span-4 md:col-span-2 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl p-4">
            <div className="flex flex-row justify-between items-center h-full">
              <div className="flex flex-col gap-3">
                <Skeleton
                  width="90px"
                  height="12px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="60px"
                  height="24px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
              <Skeleton
                width="56px"
                height="55px"
                borderRadius="8px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col w-full  col-span-4 md:col-span-2 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl p-4">
            <div className="flex flex-row justify-between items-center h-full">
              <div className="flex flex-col gap-3">
                <Skeleton
                  width="100px"
                  height="12px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="60px"
                  height="24px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
              <Skeleton
                width="56px"
                height="55px"
                borderRadius="8px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex flex-col w-full col-span-4 md:col-span-2 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl p-4">
            <div className="flex flex-row justify-between items-center h-full">
              <div className="flex flex-col gap-3">
                <Skeleton
                  width="100px"
                  height="12px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="60px"
                  height="24px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
              <Skeleton
                width="56px"
                height="55px"
                borderRadius="8px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>
        </div>

        {/* Filter + Search + Export */}
        <div className="bg-white dark:bg-[#000000] rounded-lg p-4 h-auto">
          <div className="flex flex-col md:flex-row gap-2 items-center w-full">
            {/* Heading and subheading */}
            <div className="flex flex-col gap-1 w-full">
              <Skeleton
                width="180px"
                height="24px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="250px"
                height="16px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-end items-start lg:items-end gap-4 w-full">
              <Skeleton
                width="250px"
                height="36px"
                className="dark:bg-[#2C2C2CAA]"
                style={{ borderRadius: "9999px" }}
              />
              <Skeleton
                width="100px"
                height="40px"
                className="dark:bg-[#2C2C2CAA]"
                style={{ borderRadius: "0.375rem" }}
              />
            </div>
          </div>

          {/* DataTable */}
          <div className="pt-6 overflow-x-auto w-full">
            <div className="w-full space-y-2">
              {[...Array(rowsPerPage)].map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex border-b border-[#6F7C7426] dark:border-[#6F7C7426] text-[13px] dark:bg-black bg-white whitespace-nowrap"
                  style={{ gap: "8px" }}
                >
                  {columns.map((col, colIndex) => (
                    <Skeleton
                      key={colIndex}
                      width={`${100 / columns.length}%`}
                      height="24px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Paginator */}
          <div className="mt-4 flex justify-center">
            <Skeleton
              width="200px"
              height="32px"
              className="dark:bg-[#2C2C2CAA]"
              style={{ borderRadius: "0.375rem" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 space-y-4 relative">
      {/* Tabs */}
      <div className="flex gap-6">
        {["Tasks", "Targets"].map((label, i) => (
          <button
            key={i}
            onClick={() => {
              setIsLoading(true); // show skeleton
              setActiveIndex(i);
              resetFilters();
              setGlobalFilter("");

              // Simulate data fetch delay (can replace with real API call)
              setTimeout(() => {
                setIsLoading(false); // hide skeleton
              }, 2000); // 2 seconds delay
            }}
            className={`pb-2 text-[14px] lg:text-[16px] font-medium transition-all ${
              i === activeIndex
                ? "text-[#09BF64] dark:text-[#EFFBF3] border-b-2 border-[#09BF64] dark:border-[#81D959]"
                : "text-[#0F2418] dark:text-[#B5E6C9] hover:text-[#09BF64] dark:hover:text-[#EFFBF3]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeIndex === 0 && (
        <div className="grid grid-cols-4 gap-4 mb-2 justify-center">
          {/* card 1 */}
          <FlexibleCard
            cardClass="flex flex-col w-full col-span-4 md:col-span-2 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
            headerClass=""
            centerClass=""
            footerClass=""
            header={
              <>
                <div className="flex flex-row gap-2 pl-4 pr-4 pb-2 pt-4 w-full justify-between">
                  <div className="flex flex-col gap-3">
                    <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[11px] whitespace-nowrap">
                      Total Tasks
                    </h2>
                    <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                      512
                    </h1>
                  </div>
                  <div className="pt-2">
                    <img
                      src="/icons/totalTasksIcon.png"
                      alt="Total SKUs"
                      width="50px"
                      height="50px"
                    />
                  </div>
                </div>
              </>
            }
          />
          {/* card 2 */}
          <FlexibleCard
            cardClass="flex flex-col w-full col-span-4  md:col-span-2 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
            headerClass=""
            centerClass=""
            footerClass=""
            header={
              <>
                <div className="flex flex-row gap-2 p-4 w-full justify-between">
                  <div className="flex flex-col gap-3">
                    <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[11px] whitespace-nowrap">
                      Completed Tasks
                    </h2>
                    <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                      1,245
                    </h1>
                  </div>
                  <div className="pt-2">
                    <img
                      src="/icons/completedTasksIcon.png"
                      alt="Total SKUs"
                      width="50px"
                      height="50px"
                    />
                  </div>
                </div>
              </>
            }
          />

          {/* card 3 */}
          <FlexibleCard
            cardClass="flex flex-col w-full col-span-4 md:col-span-2 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
            headerClass=""
            centerClass=""
            footerClass=""
            header={
              <>
                <div className="flex flex-row gap-2 p-4 w-full justify-between">
                  <div className="flex flex-col gap-3">
                    <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[11px] whitespace-nowrap">
                      Pending Tasks
                    </h2>
                    <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                      512
                    </h1>
                  </div>
                  <div className="pt-2">
                    <img
                      src="/icons/pendingTasksIcon.png"
                      alt="Total SKUs"
                      width="50px"
                      height="50px"
                    />
                  </div>
                </div>
              </>
            }
          />

          {/* card 4 */}
          <FlexibleCard
            cardClass="flex flex-col w-full col-span-4 md:col-span-2 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
            headerClass=""
            centerClass=""
            footerClass=""
            header={
              <>
                <div className="flex flex-row gap-2 p-4 w-full justify-between">
                  <div className="flex flex-col gap-3">
                    <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[11px] whitespace-nowrap">
                      Overdue Tasks
                    </h2>
                    <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                      34
                    </h1>
                  </div>
                  <div className="pt-2">
                    <img
                      src="/icons/overDueTaskIcon.png"
                      alt="Total SKUs"
                      width="50px"
                      height="50px"
                    />
                  </div>
                </div>
              </>
            }
          />
        </div>
      )}

      {activeIndex === 1 && (
        <div className="grid grid-cols-4 gap-4 mb-2 justify-center">
          {/* card 1 */}
          <FlexibleCard
            cardClass="flex flex-col w-full col-span-4 md:col-span-2 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
            headerClass=""
            centerClass=""
            footerClass=""
            header={
              <>
                <div className="flex flex-row gap-2 pl-4 pr-4 pb-2 pt-4 w-full justify-between">
                  <div className="flex flex-col gap-3">
                    <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[11px] whitespace-nowrap">
                      Total Targets
                    </h2>
                    <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                      512
                    </h1>
                  </div>
                  <div className="pt-2">
                    <img
                      src="/icons/totalTargetsIcon.png"
                      alt="Total SKUs"
                      width="50px"
                      height="50px"
                    />
                  </div>
                </div>
              </>
            }
          />
          {/* card 2 */}
          <FlexibleCard
            cardClass="flex flex-col w-full col-span-4  md:col-span-2 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
            headerClass=""
            centerClass=""
            footerClass=""
            header={
              <>
                <div className="flex flex-row gap-2 p-4 w-full justify-between">
                  <div className="flex flex-col gap-3">
                    <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[11px] whitespace-nowrap">
                      Completed Targets
                    </h2>
                    <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                      1,245
                    </h1>
                  </div>
                  <div className="pt-2">
                    <img
                      src="/icons/completedTargetsIcon.png"
                      alt="Total SKUs"
                      width="50px"
                      height="50px"
                    />
                  </div>
                </div>
              </>
            }
          />

          {/* card 3 */}
          <FlexibleCard
            cardClass="flex flex-col w-full col-span-4 md:col-span-2 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
            headerClass=""
            centerClass=""
            footerClass=""
            header={
              <>
                <div className="flex flex-row gap-2 p-4 w-full justify-between">
                  <div className="flex flex-col gap-3">
                    <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[11px] whitespace-nowrap">
                      Pending Targets
                    </h2>
                    <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                      512
                    </h1>
                  </div>
                  <div className="pt-2">
                    <img
                      src="/icons/pendingTargetsIcon.png"
                      alt="Total SKUs"
                      width="50px"
                      height="50px"
                    />
                  </div>
                </div>
              </>
            }
          />

          {/* card 4 */}
          <FlexibleCard
            cardClass="flex flex-col w-full col-span-4 md:col-span-2 lg:col-span-1 h-[94px] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
            headerClass=""
            centerClass=""
            footerClass=""
            header={
              <>
                <div className="flex flex-row gap-2 p-4 w-full justify-between">
                  <div className="flex flex-col gap-3">
                    <h2 className="flex text-[#00000066] dark:text-[#FFFFFFCC] text-[11px] whitespace-nowrap">
                      Overdue Targets
                    </h2>
                    <h1 className="text-[24px] text-[#0F2418] dark:text-[#EFFBF3] font-bold">
                      34
                    </h1>
                  </div>
                  <div className="pt-2">
                    <img
                      src="/icons/overDueTargetsIcon.png"
                      alt="Total SKUs"
                      width="50px"
                      height="50spx"
                    />
                  </div>
                </div>
              </>
            }
          />
        </div>
      )}

      {/* Filter + Search + Export */}
      <div className="bg-white dark:bg-[#000000] rounded-lg p-4 h-auto">
        <div className="flex flex-col md:flex-row gap-2 items-center w-full">
          <div className="flex flex-col gap-1 w-full">
            <h2 className="text-[#333333] dark:text-[#EFFBF3] font-bold text-[16px] lg:text-[18px]">
              {tabTitles[activeIndex].heading}
            </h2>
            <p className="text-[12px] lg:text-[14px] text-[#666666] dark:text-[#EFFBF3]">
              {tabTitles[activeIndex].subheading}
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-end items-start lg:items-end gap-4 w-full">
            <div className="ml-0 lg:ml-4">
              <SearchBox
                styling="w-[250px] h-9 pl-10 pr-4 rounded-2xl text-sm bg-[#F4F6F9] dark:bg-gray-800 text-black dark:text-white border-none focus:outline-none"
                placeholder="Search stocks, product, etc"
                value={globalFilter}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-row gap-4 relative">
              <div ref={filterButtonRef}>
                <ActionButton
                  label="Filter"
                  iconLight={
                    <Icon icon="cuida:filter-outline" width="18" height="18" />
                  }
                  iconDark={
                    <Icon icon="cuida:filter-outline" width="18" height="18" />
                  }
                  iconPos="left"
                  buttonClass="flex items-center justify-center gap-1 text-sm h-[40px] w-[100px] px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
                  onClick={() => {
                    if (!filterOpen) {
                      setTempFilters({ ...filters });
                      setTempDateRange([...dateRange]);
                    }
                    setFilterOpen((prev) => !prev); // toggle panel open/close
                  }}
                />
              </div>

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

              {filterOpen && filterButtonRef.current && (
                <div
                  ref={filterPanelRef} // ⬅ here
                  className="absolute bg-white dark:bg-[#0D0D0D] shadow-lg rounded-lg p-4 z-50"
                  style={{
                    top: filterButtonRef.current.offsetHeight + 4,
                    left:
                      window.innerWidth >= 1024
                        ? filterButtonRef.current.offsetLeft - 150
                        : filterButtonRef.current.offsetLeft,
                    minWidth: "16rem",
                  }}
                >
                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setFilterOpen(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Close filter panel"
                  >
                    <Icon
                      icon="mdi:close"
                      width={20}
                      height={20}
                      className="text-[#FF695B] bg-[#FF695B1A] rounded-full"
                    />
                  </button>
                  {/* Checkbox Filters */}
                  {Object.entries(uniqueFilterValues).map(([field, values]) => {
                    if (field === "dateRange") return null;

                    return (
                      <div key={field} className="mb-3">
                        <h4 className="font-semibold text-[12px] text-[#0F2418] dark:text-[#EFFBF3] mb-2 capitalize">
                          {field}
                        </h4>
                        {values.map((val) => (
                          <label
                            key={val}
                            className="flex items-center gap-2 mb-1 text-[12px] text-[#6F7C74CC] dark:text-[#EFFBF3CC] cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={
                                tempFilters[field]?.includes(val) || false
                              }
                              onChange={() => toggleTempValue(field, val)}
                              className="hidden peer"
                            />
                            <span className="w-3.5 h-3.5 rounded border border-[#6F7C74CC] peer-checked:bg-[#09BF64] peer-checked:border-[#09BF64] relative flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white dark:text-[#0D0D0D]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 8 8"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M1 4l2 2 4-4" />
                              </svg>
                            </span>
                            <span>{val}</span>
                          </label>
                        ))}
                      </div>
                    );
                  })}

                  {/* Date Range Filter */}
                  {hasDateRangeFilter && (
                    <div className="mb-3 relative">
                      {/* Use new FilterCalendar component */}
                      <FilterCalendar
                        value={tempDateRange}
                        onChange={setTempDateRange}
                      />
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex flex-row justify-between mt-3 gap-2">
                    <ActionButton
                      label="Reset"
                      labelClass="font-normal"
                      buttonClass="flex items-center justify-center gap-1 text-[10px] h-[35px] w-full px-4 bg-white text-[#09BF64] dark:bg-[#0D0D0D] dark:text-[#09BF64] border border-[#09BF64] focus:outline-none focus:ring-0"
                      onClick={() => {
                        setTempFilters({});
                        setFilters({});
                        setTempDateRange([
                          { startDate: null, endDate: null, key: "selection" },
                        ]);
                        setDateRange([
                          { startDate: null, endDate: null, key: "selection" },
                        ]);
                      }}
                    />

                    <ActionButton
                      label="Apply Filter"
                      labelClass="font-normal"
                      buttonClass="flex items-center justify-center gap-1 text-[10px] w-full h-[35px] px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-black border-none focus:outline-none focus:ring-0"
                      onClick={() => {
                        setFilters(tempFilters); // temp filters ko apply filters me copy karo
                        setDateRange(tempDateRange); // temp date range ko apply date range me copy karo
                        setFilterOpen(false); // panel band karo
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Custom DataTable */}
        <div className="pt-6 overflow-x-auto w-full">
          {isLoading ? (
            <div className="space-y-2">
              {/* Skeleton for table header */}
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full" />
              {/* Skeleton for table rows */}
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full"
                />
              ))}
            </div>
          ) : (
            <DataTable
              value={pagedRows}
              paginator={false}
              className="p-datatable-sm w-full"
              rowClassName={() =>
                "border-b border-[#6F7C7426] text-[13px] text-[#666666] dark:text-[#EFFBF3] dark:bg-black whitespace-nowrap"
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
                  style={
                    idx === 0
                      ? { width: "30%" }
                      : { width: `${70 / (columns.length - 1)}%` }
                  }
                />
              ))}
            </DataTable>
          )}
        </div>

        {/* Your existing CustomPaginator */}
        <CustomPaginator
          totalPages={Math.ceil(filteredData.length / rowsPerPage)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          maxButtons={5} // keep your current prop or adjust as needed
        />
      </div>
    </div>
  );
}
