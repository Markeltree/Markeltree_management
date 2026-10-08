import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useModal } from "@/context/ModalContext";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataTable,
  useMemo,
  Column,
  ActionButton,
  DropdownButton,
  ResponsiveTrendChart,
  menuOptions,
  SearchBox,
  FilterCalendar,
  PinWrapper,
  Icon,
  CustomPaginator,
  Skeleton,
  FlexibleCard,
  MenuActionButton,
} from "@/common/imports";

const tabTitles = [
  {
    heading: "Order Details",
    subheading: "Real-time data on product and manage products.",
  },
];

const dataSets = [
  {
    orderId: "#45645645",
    customerName: "Sundar Lal",
    articleNumber: "SKU123",
    orderDate: "2025-2-12",
    status: "Delivered",
    location: "Delivery Notes",
    action: "View Details",
  },
  {
    orderId: "#45645645",
    customerName: "Sundar Lal",
    articleNumber: "SKU123",
    orderDate: "2025-2-13",
    status: "Pending",
    location: "Delivery Notes",
    action: "View Details",
  },
  {
    orderId: "#45645645",
    customerName: "Sundar Lal",
    articleNumber: "SKU123",
    orderDate: "2025-2-13",
    status: "In Transit",
    location: "Delivery Notes",
    action: "View Details",
  },
  {
    orderId: "#45645645",
    customerName: "Sundar Lal",
    articleNumber: "SKU114",
    orderDate: "2025-2-14",
    status: "Cancelled",
    location: "Delivery Notes",
    action: "View Details",
  },
  {
    orderId: "#45645645",
    customerName: "Sundar Lal",
    articleNumber: "SKU115",
    orderDate: "2025-2-15",
    status: "Delivered",
    location: "Delivery Notes",
    action: "View Details",
  },
  {
    orderId: "#45645645",
    customerName: "Sundar Lal",
    articleNumber: "SKU123",
    orderDate: "2025-2-08",
    status: "Pending",
    location: "Delivery Notes",
    action: "View Details",
  },
  {
    orderId: "#45645645",
    customerName: "Sundar Lal",
    articleNumber: "SKU123",
    orderDate: "2025-2-08",
    status: "In Transit",
    location: "Delivery Notes",
    action: "View Details",
  },
  {
    orderId: "#45645645",
    customerName: "Sundar Lal",
    articleNumber: "SKU123",
    orderDate: "2025-2-08",
    status: "Cancelled",
    location: "Delivery Notes",
    action: "View Details",
  },
  {
    orderId: "#45645645",
    customerName: "Sundar Lal",
    articleNumber: "SKU123",
    orderDate: "2025-2-08",
    status: "Delivered",
    location: "Delivery Notes",
    action: "View Details",
  },
  {
    orderId: "#45645645",
    customerName: "Sundar Lal",
    articleNumber: "SKU123",
    orderDate: "2025-2-08",
    status: "Pending",
    location: "Delivery Notes",
    action: "View Details",
  },
  {
    orderId: "#45645645",
    customerName: "Sundar Lal",
    articleNumber: "SKU123",
    orderDate: "2025-2-08",
    status: "In Transit",
    location: "Delivery Notes",
    action: "View Details",
  },
  {
    orderId: "#45645645",
    customerName: "Sundar Lal",
    articleNumber: "SKU123",
    orderDate: "2025-2-08",
    status: "Cancelled",
    location: "Delivery Notes",
    action: "View Details",
  },
];

const filterableColumns = ["status", "dateRange"];

const OrderSuggestedData = [
  { orderId: "SKU123", customerName: "Sundar Lal" },
  { orderId: "SKU123", customerName: "Sundar Lal" },
  { orderId: "SKU123", customerName: "Sundar Lal" },
  { orderId: "SKU123", customerName: "Sundar Lal" },
  { orderId: "SKU123", customerName: "Sundar Lal" },
  { orderId: "SKU123", customerName: "Sundar Lal" },
  { orderId: "SKU123", customerName: "Sundar Lal" },
  { orderId: "SKU123", customerName: "Sundar Lal" },
  { orderId: "SKU123", customerName: "Sundar Lal" },
];

export default function OrderManagementData() {
  const { openModal, closeModal } = useModal();
  const exportMenuOptions = menuOptions(["CSV", "Excel"]);
  const navigate = useNavigate();

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

  // --- local UI / filter state ---
  const [globalFilter, setGlobalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 9;

  // "applied" filters (what is currently active)
  const [filters, setFilters] = useState({}); // e.g. { status: ['Resolved'] }

  // filter panel open state & temporary values while panel is open
  const [tempFilters, setTempFilters] = useState({}); // temporary holder for checkboxes
  const [tempDateRange, setTempDateRange] = useState([
    { startDate: null, endDate: null, key: "selection" },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);

  // applied dateRange (same structure)
  const [dateRange, setDateRange] = useState([
    { startDate: null, endDate: null, key: "selection" },
  ]);

  // reset page when filters/search/date change
  useEffect(() => setCurrentPage(0), [filters, globalFilter, dateRange]);

  const rawData = dataSets;

  // has date-range available?
  const hasDateRangeFilter = filterableColumns.includes("dateRange");

  // unique filter values (status) — computed from rawData
  const uniqueFilterValues = useMemo(
    () => ({
      status: [...new Set(rawData.map((r) => r.status).filter(Boolean))],
    }),
    [rawData]
  );

  // toggle a temp checkbox (status)
  const toggleTempValue = (field, value) => {
    setTempFilters((prev) => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  // order priority
  const OrderrowsPerPage = 7;
  const [OrdercurrentPage, setOrderCurrentPage] = React.useState(1);

  const OrdertotalPages = Math.ceil(
    OrderSuggestedData.length / OrderrowsPerPage
  );

  const indexOfLastRow = OrdercurrentPage * OrderrowsPerPage;
  const indexOfFirstRow = indexOfLastRow - OrderrowsPerPage;
  const currentTableData = OrderSuggestedData.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  // Corrected page change handler:
  const onPageChangeHandler = (pageZeroBased) => {
    setOrderCurrentPage(pageZeroBased + 1);
  };

  // parse date strings (accepts dd/mm/yyyy or ISO)
  const parseDateString = (s) => {
    if (!s) return new Date(NaN);
    if (s.includes("-")) return new Date(s); // ISO
    if (s.includes("/")) {
      const [a, b, c] = s.split("/");
      const day = parseInt(a, 10);
      const month = parseInt(b, 10);
      const year = parseInt(c, 10);
      return new Date(year, month - 1, day);
    }
    return new Date(s);
  };

  const StatusBadge = (rowData) => {
    const statusColors = {
      Delivered: "bg-[#22C55E26] text-[#22C55E]",
      "In Transit": "bg-[#2794DD26] text-[#2794DD]",
      Pending: "bg-[#DDD42726] text-[#DDD427]",
      Cancelled: "bg-[#FF695B26] text-[#FF695B]",
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

  const columns = useMemo(
    () => [
      { field: "orderId", header: "Order ID" },
      { field: "customerName", header: "Customer Name" },
      { field: "articleNumber", header: "Article Number" },
      { field: "orderDate", header: "Order Date" },
      {
        field: "status",
        header: "Status",
        body: (r) => <StatusBadge status={r.status} />,
      },
      {
        field: "location",
        header: "Location",
        body: (rowData) => (
          <button className="w-[100px] h-[28px] flex items-center border border-[#09BF64] gap-1 px-2 py-1 bg-white dark:bg-black text-[#09BF64] text-[12px] rounded">
            Delivery Notes
          </button>
        ),
      },
      {
        field: "action",
        header: "Action",
        body: (rowData) => (
          <button
            className="w-[110px] h-[28px] flex items-center gap-1 px-3 py-1 bg-[#09BF64] hover:bg-[#4b4de0] text-white text-[12px] rounded dark:text-[#0D0D0D] dark:bg-[#81D959]"
            onClick={() => navigate("/orderdetail")}
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
    ],
    []
  );

  //filter logic
  const parseRowDate = (dateStr) => {
    if (!dateStr) return null;

    // Extract only numbers and "-" (ignore letters like "s")
    const cleaned = dateStr.match(/\d+-\d+-\d+/)?.[0];
    if (!cleaned) return null;

    const [year, month, day] = cleaned.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-based
  };

  const filteredData = useMemo(() => {
    // Normalize start/end dates to cover full day
    const startDate = dateRange[0]?.startDate
      ? new Date(dateRange[0].startDate.setHours(0, 0, 0, 0))
      : null;

    const endDate = dateRange[0]?.endDate
      ? new Date(dateRange[0].endDate.setHours(23, 59, 59, 999))
      : null;

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

      // 3️⃣ Date filter (ignore time)
      let passesDateFilter = true;
      if (startDate && endDate && row.orderDate) {
        const rowDate = parseRowDate(row.orderDate); // <-- parse orderDate
        if (!rowDate || rowDate < startDate || rowDate > endDate) {
          passesDateFilter = false;
        }
      }

      return passesCheckboxFilter && passesSearch && passesDateFilter;
    });
  }, [rawData, filters, globalFilter, dateRange]);

  // pagination
  const pagedRows = filteredData.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  // filter panel handlers
  const openFilterPanel = () => {
    setTempFilters(filters || {});
    setTempDateRange(
      dateRange || [{ startDate: null, endDate: null, key: "selection" }]
    );
    setFilterOpen(true);
  };

  const applyTempFilters = () => {
    setFilters(tempFilters || {});
    setDateRange(
      tempDateRange || [{ startDate: null, endDate: null, key: "selection" }]
    );
    setFilterOpen(false);
    setShowCalendar(false);
    setCurrentPage(0);
  };

  const resetAllFilters = () => {
    setTempFilters({});
    setFilters({});
    const empty = [{ startDate: null, endDate: null, key: "selection" }];
    setTempDateRange(empty);
    setDateRange(empty);
    setFilterOpen(false);
    setShowCalendar(false);
    setCurrentPage(0);
  };

  // temp date input helpers (if you need iso string handlers)
  const setTempStart = (isoDateString) => {
    setTempDateRange((prev) => [
      {
        startDate: isoDateString ? new Date(isoDateString) : null,
        endDate: prev?.[0]?.endDate ?? null,
        key: "selection",
      },
    ]);
  };
  const setTempEnd = (isoDateString) => {
    setTempDateRange((prev) => [
      {
        startDate: prev?.[0]?.startDate ?? null,
        endDate: isoDateString ? new Date(isoDateString) : null,
        key: "selection",
      },
    ]);
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const OrderBottomCardSkeleton = () => (
    <div className="flex flex-col lg:flex-row w-full gap-4 mb-2 justify-center pt-4">
      {/* Card 1 (Demand Prediction) */}
      <div className="flex flex-col w-full lg:w-[70%] h-[400px] bg-white dark:bg-black rounded-xl p-4">
        {/* Header */}
        <div className="flex flex-row items-center justify-between">
          <Skeleton
            width="150px"
            height="20px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <div className="flex gap-2">
            <Skeleton
              width="112px"
              height="34px"
              borderRadius="8px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="101px"
              height="34px"
              borderRadius="8px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
        </div>

        {/* Center */}
        <div className="pt-6 flex flex-col gap-2">
          <Skeleton
            width="100px"
            height="12px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="120px"
            height="20px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="160px"
            height="14px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>

        {/* Footer (Graph placeholder) */}
        <div className="flex-1 flex items-center justify-center">
          <Skeleton
            width="100%"
            height="200px"
            className="dark:bg-[#2C2C2CAA]"
          />
        </div>
      </div>

      {/* Card 2 (Order Prioritization) */}
      <div className="flex flex-col w-full lg:w-[30%] h-[400px] bg-white dark:bg-black rounded-xl p-4">
        {/* Header */}
        <Skeleton width="180px" height="18px" className="dark:bg-[#2C2C2CAA]" />

        {/* Table */}
        <div className="pt-3 flex flex-col gap-6 flex-1">
          {[...Array(7)].map((_, idx) => (
            <div key={idx} className="flex flex-row gap-4">
              <Skeleton
                width="80px"
                height="16px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="120px"
                height="16px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          ))}
        </div>

        {/* Paginator */}
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(4)].map((_, idx) => (
            <Skeleton
              key={idx}
              width="32px"
              height="32px"
              borderRadius="8px"
              className="dark:bg-[#2C2C2CAA]"
            />
          ))}
        </div>
      </div>
    </div>
  );

  const OrderTableSkeleton = () => (
    <div className="pt-4">
      <div className="bg-white dark:bg-[#000000] rounded-lg p-4 h-auto">
        <div className="flex flex-col md:flex-row gap-2 items-center w-full">
          {/* Left Section (Title + Subheading) */}
          <div className="flex flex-col gap-1 w-full">
            <Skeleton
              width="150px"
              height="18px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="200px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Right Section (Search + Buttons) */}
          <div className="flex flex-col md:flex-row justify-end items-start lg:items-end gap-4 w-full">
            {/* SearchBox */}
            <Skeleton
              width="250px"
              height="36px"
              borderRadius="9999px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <div className="flex flex-row gap-4">
              <Skeleton
                width="100px"
                height="40px"
                borderRadius="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="104px"
                height="40px"
                borderRadius="12px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>
        </div>

        {/* DataTable */}
        <div className="pt-6 overflow-x-auto w-full">
          {[...Array(7)].map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex flex-row gap-4 border-b border-[#6F7C7426] py-2 justify-between"
            >
              {[...Array(9)].map((_, colIdx) => (
                <Skeleton
                  key={colIdx}
                  width="100px"
                  height="20px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              ))}
            </div>
          ))}
        </div>

        {/* Paginator */}
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(5)].map((_, idx) => (
            <Skeleton
              key={idx}
              width="32px"
              height="32px"
              borderRadius="8px"
              className="dark:bg-[#2C2C2CAA]"
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <>
        <div className="space-y-4 relative">
          {/* Table */}
          <OrderTableSkeleton />

          {/* Cards Section */}
          <OrderBottomCardSkeleton />
        </div>
      </>
    );
  }

  const OrderBottomCharts = () => {
    //graph data
    const [selectedCategory, setSelectedCategory] = useState("Electronics");
    const [selectedRange, setSelectedRange] = useState("This Year");

    const demandPredictionData = {
      Electronics: {
        "This Year": [
          { x: "Jan", y: 70000, cartons: 52 },
          { x: "Feb", y: 40000, cartons: 56 },
          { x: "Mar", y: 100000, cartons: 54 },
          { x: "Apr", y: 50000, cartons: 50 },
          { x: "May", y: 75000, cartons: 48 },
          { x: "Jun", y: 35577, cartons: 45 },
          { x: "Jul", y: 90000, cartons: 38 },
          { x: "Aug", y: 50000, cartons: 40 },
          { x: "Sep", y: 54000, cartons: 44 },
          { x: "Oct", y: 65000, cartons: 44 },
          { x: "Nov", y: 100000, cartons: 44 },
          { x: "Dec", y: 50000, cartons: 44 },
        ],
        "This Month": Array.from({ length: 30 }, (_, i) => ({
          x: i + 1, // day of month (1–30)
          y: Math.floor(Math.random() * 10000) + 2000,
          cartons: Math.floor(Math.random() * 10) + 1,
        })),
        "This Week": [
          { x: "Mon", y: 5000, cartons: 5 },
          { x: "Tue", y: 8000, cartons: 7 },
          { x: "Wed", y: 3000, cartons: 2 },
          { x: "Thu", y: 6000, cartons: 6 },
          { x: "Fri", y: 7000, cartons: 5 },
          { x: "Sat", y: 4000, cartons: 3 },
          { x: "Sun", y: 2000, cartons: 1 },
        ],
      },

      Food: {
        "This Year": [
          { x: "Jan", y: 90000, cartons: 70 },
          { x: "Feb", y: 85000, cartons: 65 },
          { x: "Mar", y: 120000, cartons: 80 },
          { x: "Apr", y: 75000, cartons: 60 },
          { x: "May", y: 95000, cartons: 72 },
          { x: "Jun", y: 88000, cartons: 68 },
          { x: "Jul", y: 102000, cartons: 75 },
          { x: "Aug", y: 97000, cartons: 74 },
          { x: "Sep", y: 110000, cartons: 79 },
          { x: "Oct", y: 105000, cartons: 76 },
          { x: "Nov", y: 115000, cartons: 82 },
          { x: "Dec", y: 100000, cartons: 70 },
        ],
        "This Month": Array.from({ length: 30 }, (_, i) => ({
          x: i + 1,
          y: Math.floor(Math.random() * 6000) + 1000,
          cartons: Math.floor(Math.random() * 6) + 1,
        })),
        "This Week": [
          { x: "Mon", y: 2000, cartons: 2 },
          { x: "Tue", y: 2500, cartons: 2 },
          { x: "Wed", y: 2200, cartons: 2 },
          { x: "Thu", y: 1800, cartons: 2 },
          { x: "Fri", y: 2700, cartons: 3 },
          { x: "Sat", y: 3000, cartons: 4 },
          { x: "Sun", y: 1500, cartons: 1 },
        ],
      },

      Furniture: {
        "This Year": [
          { x: "Jan", y: 40000, cartons: 20 },
          { x: "Feb", y: 30000, cartons: 18 },
          { x: "Mar", y: 60000, cartons: 25 },
          { x: "Apr", y: 45000, cartons: 22 },
          { x: "May", y: 50000, cartons: 23 },
          { x: "Jun", y: 42000, cartons: 20 },
          { x: "Jul", y: 55000, cartons: 26 },
          { x: "Aug", y: 47000, cartons: 21 },
          { x: "Sep", y: 49000, cartons: 22 },
          { x: "Oct", y: 53000, cartons: 24 },
          { x: "Nov", y: 61000, cartons: 28 },
          { x: "Dec", y: 48000, cartons: 22 },
        ],
        "This Month": Array.from({ length: 30 }, (_, i) => ({
          x: i + 1,
          y: Math.floor(Math.random() * 3000) + 500,
          cartons: Math.floor(Math.random() * 4) + 1,
        })),
        "This Week": [
          { x: "Mon", y: 700, cartons: 1 },
          { x: "Tue", y: 900, cartons: 1 },
          { x: "Wed", y: 600, cartons: 1 },
          { x: "Thu", y: 800, cartons: 1 },
          { x: "Fri", y: 1000, cartons: 2 },
          { x: "Sat", y: 500, cartons: 1 },
          { x: "Sun", y: 400, cartons: 1 },
        ],
      },
    };

    const summaryData = {
      Electronics: {
        "This Year": {
          date: "10/01/2025",
          Change: "4% more than last year",
          iconColor: "text-[#0CB91D]",
          icon: "clarity:arrow-line",
        },
        "This Month": {
          date: "12/01/2025",
          Change: "3% less than last year",
          iconColor: "text-[#EF4444]",
          icon: "solar:arrow-down-linear",
        },
        "This Week": {
          date: "14/01/2025",
          Change: "2% more than last year",
          iconColor: "text-[#0CB91D]",
          icon: "clarity:arrow-line",
        },
      },

      Food: {
        "This Year": {
          date: "15/01/2025",
          Change: "2% less than last year",
          iconColor: "text-[#EF4444]",
          icon: "solar:arrow-down-linear",
        },
        "This Month": {
          date: "17/01/2025",
          Change: "6% more than last year",
          iconColor: "text-[#0CB91D]",
          icon: "clarity:arrow-line",
        },
        "This Week": {
          date: "20/01/2025",
          Change: "4% less than last year",
          iconColor: "text-[#EF4444]",
          icon: "solar:arrow-down-linear",
        },
      },

      Furniture: {
        "This Year": {
          date: "21/01/2025",
          Change: "6% more than last year",
          iconColor: "text-[#0CB91D]",
          icon: "clarity:arrow-line",
        },
        "This Month": {
          date: "10/01/2025",
          Change: "7% more than last year",
          iconColor: "text-[#0CB91D]",
          icon: "clarity:arrow-line",
        },
        "This Week": {
          date: "22/01/2025",
          Change: "5% less than last year",
          iconColor: "text-[#EF4444]",
          icon: "solar:arrow-down-linear",
        },
      },
    };

    const currentData = summaryData[selectedCategory][selectedRange];
    return (
      <div className="flex flex-col lg:flex-row w-full gap-4 mb-2 justify-center pt-4">
        {/* Card 1 */}
        <FlexibleCard
          cardClass="flex flex-col w-full lg:w-[70%] h-[400px] bg-white dark:bg-black rounded-xl p-4 hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
          headerClass="flex flex-row items-center justify-between"
          centerClass="items-center pt-2"
          footerClass="flex items-end justify-center h-full"
          header={
            <>
              <div className="flex w-full items-center">
                <h1 className="text-[18px] font-bold text-[#0F2418] dark:text-[#EBF9F0] ">
                  Demand Prediction
                </h1>
              </div>
              <div className="flex gap-2">
                <DropdownButton
                  defaultOption="Electronics"
                  options={["Electronics", "Food", "Furniture"]}
                  buttonClassName="flex items-center rounded-lg justify-center gap-2 px-3 py-2 text-[#09BF64] dark:text-[#09BF64] font-bold text-[11px] h-[34px] w-[123px] bg-white dark:bg-black border border-[#09BF64] focus:outline-none focus:ring-0"
                  dropdownClassName="bg-white dark:bg-[#121212] h-[80px] w-[123px]"
                  optionClassName="dark:text-gray-300 dark:hover:bg-gray-800 text-[11px]"
                  onChange={(value) => setSelectedCategory(value)}
                />

                <DropdownButton
                  defaultOption="This Year"
                  options={["This Week", "This Month", "This Year"]}
                  buttonClassName="flex items-center rounded-lg justify-center gap-2 px-3 py-2 text-white dark:text-black font-bold text-[11px] h-[34px] w-[105px] bg-gradient-to-r from-[#09BF64] to-[#353689] border-none focus:outline-none focus:ring-0"
                  dropdownClassName="bg-white dark:bg-[#121212] h-[80px] w-[105px]"
                  optionClassName="dark:text-gray-300 dark:hover:bg-gray-800 text-[11px]"
                  onChange={(value) => setSelectedRange(value)}
                />
              </div>
            </>
          }
          center={
            <>
              <div className="gap-2 flex flex-col">
                <h2 className="text-[8px] text-[#8E8E9C] dark:text-[#8E8E9C]">
                  Expected peak on
                </h2>
                <h1 className="text-[#2B2B2B] dark:text-[#D4D4D4] font-bold text-[18px]">
                  {currentData.date}
                </h1>
                <h2 className="flex flex-row gap-1 text-[#2B2B2B] dark:text-[#D4D4D4] font-light text-[12px]">
                  <span className={currentData.iconColor}>
                    <Icon
                      icon={currentData.icon}
                      width="16"
                      height="18"
                      className="text-"
                    />
                  </span>
                  {currentData.Change}
                </h2>
              </div>
            </>
          }
          footer={
            <ResponsiveTrendChart
              data={demandPredictionData[selectedCategory][selectedRange]}
            />
          }
        />
        {/* Card 2*/}
        <FlexibleCard
          cardClass="flex flex-col w-full lg:w-[30%] h-[400px] bg-white dark:bg-black rounded-xl p-4 hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
          headerClass="flex justify-between"
          centerClass="flex flex-row gap-4"
          footerClass=""
          header={
            <>
              <div className="flex flex-row w-full justify-between items-center">
                <h1 className="font-medium text-[16px] text-[#6F7C74] dark:text-[#EFFBF3]">
                  Order Prioritization
                </h1>
              </div>
            </>
          }
          center={
            <div className="flex flex-col h-full pt-3">
              <table
                className="w-full text-sm text-left text-[#33333380] dark:text-[#EFFBF380]"
                style={{ tableLayout: "fixed" }}
              >
                <thead className="text-[10px] md:text-[12px] sticky top-0 w-full">
                  <tr>
                    <th className="px-3 py-2 w-1/3">Order ID</th>
                    <th className="px-3 py-2 w-1/3">Customer Name</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTableData.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-[#6F7C7426] dark:border-[#6F7C7426] dark:text-[#EFFBF3] text-[#666666]"
                    >
                      <td className="px-3 py-2 w-1/3">{item.orderId}</td>
                      <td className="px-3 py-2 w-1/3">{item.customerName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-2">
                <CustomPaginator
                  totalPages={OrdertotalPages}
                  currentPage={OrdercurrentPage - 1} // zero-based current page
                  onPageChange={onPageChangeHandler}
                  maxButtons={5}
                />
              </div>
            </div>
          }
        />
      </div>
    );
  };

  return (
    <div className="space-y-4 relative">
      {/* table */}
      <div className="pt-4">
        <div className="bg-white dark:bg-[#000000] rounded-lg p-4 h-auto">
          <div className="flex flex-col md:flex-row gap-2 items-center w-full">
            <div className="flex flex-col gap-1 w-full">
              <h2 className="text-[#333333] dark:text-[#EFFBF3] font-bold text-[16px] lg:text-[18px]">
                {tabTitles[0].heading}
              </h2>
              <p className="text-[12px] lg:text-[14px] text-[#666666] dark:text-[#EFFBF3]">
                {tabTitles[0].subheading}
              </p>
            </div>
            <div className="flex flex-col md:flex-row justify-end items-start lg:items-end gap-4 w-full">
              <div className="ml-0 lg:ml-4">
                <SearchBox
                  styling="w-[250px] h-9 pl-10 pr-4 rounded-2xl text-sm bg-[#F4F6F9] dark:bg-gray-800 text-black dark:text-white border-none focus:outline-none"
                  placeholder="Search stocks, product, etc"
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              </div>
              <div className="flex flex-row gap-4 relative">
                <div ref={filterButtonRef}>
                  <ActionButton
                    label="Filter"
                    iconLight={
                      <Icon
                        icon="cuida:filter-outline"
                        width="18"
                        height="18"
                      />
                    }
                    iconDark={
                      <Icon
                        icon="cuida:filter-outline"
                        width="18"
                        height="18"
                      />
                    }
                    iconPos="left"
                    buttonClass="flex items-center justify-center gap-1 text-sm h-[40px] w-[100px] px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
                    onClick={() => {
                      if (!filterOpen) {
                        setTempFilters(filters || {});
                        setTempDateRange(
                          dateRange || [
                            {
                              startDate: null,
                              endDate: null,
                              key: "selection",
                            },
                          ]
                        );
                      }
                      setFilterOpen((v) => !v);
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
                    {Object.entries(uniqueFilterValues).map(
                      ([field, values]) => {
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
                      }
                    )}

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
                            {
                              startDate: null,
                              endDate: null,
                              key: "selection",
                            },
                          ]);
                          setDateRange([
                            {
                              startDate: null,
                              endDate: null,
                              key: "selection",
                            },
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
            <DataTable
              value={pagedRows}
              paginator={false}
              className="p-datatable-sm w-full my-delete-table [&_.p-datatable-tbody>tr]:dark:!bg-black"
              rowClassName={() =>
                "border-b border-[#6F7C7426] text-[13px] text-[#666666] dark:text-[#EFFBF3] dark:bg-black whitespace-nowrap"
              }
              emptyMessage={
                <div className="py-4 bg-white text-black dark:bg-black dark:text-white">
                  No Data.
                </div>
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
                    idx === columns.length - 2
                      ? { width: "1%" } // last column = very small
                      : { width: `${99 / (columns.length - 1)}%` } // others share space
                  }
                />
              ))}
            </DataTable>
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

      <PinWrapper
        id="order-bottom-card"
        className="w-full"
        meta={{ component: OrderBottomCharts }}
        skeleton={<OrderBottomCardSkeleton />}
      >
        <OrderBottomCharts />
      </PinWrapper>
    </div>
  );
}
