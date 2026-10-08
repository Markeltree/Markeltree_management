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
  DropdownButton,
  DonutChart,
  PinWrapper,
  FlexibleCard,
  BarChart,
  InitiateTransferModal,
  Skeleton,
  MenuActionButton,
  FilterCalendar,
} from "@/common/imports";
import Tab from "@mui/material/Tab";

const tabTitles = [
  {
    heading: "Stock Overview Table",
    subheading: "Real-time data on stock levels, location, and status.",
  },
  {
    heading: "Reorder Suggestion",
    subheading:
      "AI generated suggestion to maintain stock levels and avoid shortages.",
  },
  {
    heading: "Stock Transfer",
    subheading: "Initiate and track stock movements between warehouses.",
  },
  {
    heading: "Audit Logs",
    subheading:
      "Records of all inventory-related actions, changes, and user activities.",
  },
];

const AISuggestedData = [
  { productName: "Electronics", currentStock: 100, suggestedQuantity: 1000 },
  { productName: "Apparel", currentStock: 100, suggestedQuantity: 1000 },
  { productName: "Appliances", currentStock: 100, suggestedQuantity: 1000 },
  { productName: "Furniture", currentStock: 100, suggestedQuantity: 1000 },
  { productName: "Toys", currentStock: 50, suggestedQuantity: 500 },
  { productName: "Books", currentStock: 75, suggestedQuantity: 750 },
  { productName: "Groceries", currentStock: 30, suggestedQuantity: 300 },
  { productName: "Sports", currentStock: 20, suggestedQuantity: 200 },
];

const dataSets = {
  stockOverview: [
    {
      productName: "Product A",
      sku: "SKU123",
      quantity: 100,
      lastUpdated: "2025-2-24",
      location: "Walker",
      status: "In Stock",
    },
    {
      productName: "Product B",
      sku: "SKU123",
      quantity: 0,
      lastUpdated: "2025-2-20",
      location: "Walker",
      status: "Out of Stock",
    },
    {
      productName: "Product C",
      sku: "SKU123",
      quantity: 20,
      lastUpdated: "2024-2-24",
      location: "Walker",
      status: "Low Stock",
    },
    {
      productName: "Product D",
      sku: "SKU123",
      quantity: 60,
      lastUpdated: "2024-2-21",
      location: "Walker",
      status: "In Stock",
    },
    {
      productName: "Product E",
      sku: "SKU123",
      quantity: 0,
      lastUpdated: "2024-2-18",
      location: "DHL",
      status: "Out of Stock",
    },
    {
      productName: "Product F",
      sku: "SKU123",
      quantity: 10,
      lastUpdated: "2024-2-24",
      location: "GreatBear",
      status: "Low Stock",
    },
    {
      productName: "Product G",
      sku: "SKU123",
      quantity: 150,
      lastUpdated: "2024-2-16",
      location: "DHL",
      status: "In Stock",
    },
    {
      productName: "Product G",
      sku: "SKU123",
      quantity: 150,
      lastUpdated: "2024-2-24",
      location: "DHL",
      status: "In Stock",
    },
    {
      productName: "Product G",
      sku: "SKU123",
      quantity: 150,
      lastUpdated: "2024-5-18",
      location: "DHL",
      status: "In Stock",
    },
    {
      productName: "Product G",
      sku: "SKU123",
      quantity: 150,
      lastUpdated: "2024-2-16",
      location: "DHL",
      status: "In Stock",
    },
    {
      productName: "Product G",
      sku: "SKU123",
      quantity: 150,
      lastUpdated: "2024-5-24",
      location: "DHL",
      status: "In Stock",
    },
    {
      productName: "Product G",
      sku: "SKU123",
      quantity: 150,
      lastUpdated: "2024-5-24",
      location: "DHL",
      status: "In Stock",
    },
    {
      productName: "Product C",
      sku: "SKU123",
      quantity: 20,
      lastUpdated: "2024-5-24",
      location: "Walker",
      status: "Low Stock",
    },
    {
      productName: "Product C",
      sku: "SKU123",
      quantity: 20,
      lastUpdated: "2024-2-24",
      location: "Walker",
      status: "Low Stock",
    },
    {
      productName: "Product C",
      sku: "SKU123",
      quantity: 20,
      lastUpdated: "2024-2-24",
      location: "Walker",
      status: "Low Stock",
    },
    {
      productName: "Product C",
      sku: "SKU123",
      quantity: 20,
      lastUpdated: "2024-2-24",
      location: "Walker",
      status: "Low Stock",
    },
    {
      productName: "Product C",
      sku: "SKU123",
      quantity: 20,
      lastUpdated: "2024-2-24",
      location: "Walker",
      status: "Low Stock",
    },
    {
      productName: "Product C",
      sku: "SKU123",
      quantity: 20,
      lastUpdated: "2024-2-24",
      location: "Walker",
      status: "Low Stock",
    },
    {
      productName: "Product C",
      sku: "SKU123",
      quantity: 20,
      lastUpdated: "2024-2-24",
      location: "Walker",
      status: "Low Stock",
    },
    {
      productName: "Product C",
      sku: "SKU123",
      quantity: 20,
      lastUpdated: "2024-2-24",
      location: "Walker",
      status: "Low Stock",
    },
    {
      productName: "Product C",
      sku: "SKU123",
      quantity: 20,
      lastUpdated: "2024-2-24",
      location: "Walker",
      status: "Low Stock",
    },
    {
      productName: "Product C",
      sku: "SKU123",
      quantity: 20,
      lastUpdated: "2024-2-24",
      location: "Walker",
      status: "Low Stock",
    },
    {
      productName: "Product C",
      sku: "SKU123",
      quantity: 20,
      lastUpdated: "2024-2-24",
      location: "Walker",
      status: "Low Stock",
    },
    {
      productName: "Product G",
      sku: "SKU123",
      quantity: 150,
      lastUpdated: "2024-2-24",
      location: "DHL",
      status: "In Stock",
    },
    {
      productName: "Product G",
      sku: "SKU123",
      quantity: 150,
      lastUpdated: "2024-2-24",
      location: "DHL",
      status: "In Stock",
    },
    {
      productName: "Product G",
      sku: "SKU123",
      quantity: 150,
      lastUpdated: "2024-2-24",
      location: "DHL",
      status: "In Stock",
    },
    {
      productName: "Product G",
      sku: "SKU123",
      quantity: 150,
      lastUpdated: "2024-2-24",
      location: "DHL",
      status: "In Stock",
    },
    {
      productName: "Product G",
      sku: "SKU123",
      quantity: 150,
      lastUpdated: "2024-2-24",
      location: "DHL",
      status: "In Stock",
    },
    {
      productName: "Product G",
      sku: "SKU123",
      quantity: 150,
      lastUpdated: "2024-2-24",
      location: "DHL",
      status: "In Stock",
    },
    {
      productName: "Product G",
      sku: "SKU123",
      quantity: 150,
      lastUpdated: "2024-2-24",
      location: "DHL",
      status: "In Stock",
    },
    {
      productName: "Product G",
      sku: "SKU123",
      quantity: 150,
      lastUpdated: "2024-2-24",
      location: "DHL",
      status: "In Stock",
    },
    {
      productName: "Product G",
      sku: "SKU123",
      quantity: 150,
      lastUpdated: "2024-2-24",
      location: "DHL",
      status: "In Stock",
    },
  ],
  reorderSuggestion: [
    {
      productName: "Product X",
      sku: "SKU123",
      currentStock: 100,
      reorderLevel: 100,
      leadTime: 5,
      suggestedQuantity: 1000,
      urgencyLevel: "Low",
      action: "Reorder Now",
    },
    {
      productName: "Product X",
      sku: "SKU123",
      currentStock: 100,
      reorderLevel: 100,
      leadTime: 5,
      suggestedQuantity: 1000,
      urgencyLevel: "Low",
      action: "Reorder Now",
    },
    {
      productName: "Product X",
      sku: "SKU123",
      currentStock: 100,
      reorderLevel: 100,
      leadTime: 5,
      suggestedQuantity: 1000,
      urgencyLevel: "Moderate",
      action: "Reorder Now",
    },
    {
      productName: "Product X",
      sku: "SKU123",
      currentStock: 100,
      reorderLevel: 100,
      leadTime: 5,
      suggestedQuantity: 1000,
      urgencyLevel: "Moderate",
      action: "Reorder Now",
    },
    {
      productName: "Product X",
      sku: "SKU123",
      currentStock: 100,
      reorderLevel: 100,
      leadTime: 5,
      suggestedQuantity: 1000,
      urgencyLevel: "Critical",
      action: "Reorder Now",
    },
    {
      productName: "Product X",
      sku: "SKU123",
      currentStock: 100,
      reorderLevel: 100,
      leadTime: 5,
      suggestedQuantity: 1000,
      urgencyLevel: "Critical",
      action: "Reorder Now",
    },
    {
      productName: "Product X",
      sku: "SKU123",
      currentStock: 100,
      reorderLevel: 100,
      leadTime: 5,
      suggestedQuantity: 1000,
      urgencyLevel: "Critical",
      action: "Reorder Now",
    },
  ],
  stockTransfer: [
    {
      productName: "Product A",
      quantity: 200,
      transferId: "TX4534",
      sourceWarehouse: "Warehouse A",
      destinationWarehouse: "Warehouse B",
      requestDate: "2025-11-25",
      urgencyLevel: "In transit",
    },
    {
      productName: "Product A",
      quantity: 200,
      transferId: "TX4534",
      sourceWarehouse: "Warehouse A",
      destinationWarehouse: "Warehouse B",
      requestDate: "2025-11-25",
      urgencyLevel: "Completed",
    },
    {
      productName: "Product A",
      quantity: 200,
      transferId: "TX4534",
      sourceWarehouse: "Warehouse A",
      destinationWarehouse: "Warehouse B",
      requestDate: "2025-11-14",
      urgencyLevel: "Cancelled",
    },
    {
      productName: "Product A",
      quantity: 200,
      transferId: "TX4534",
      sourceWarehouse: "Warehouse A",
      destinationWarehouse: "Warehouse B",
      requestDate: "2025-10-25",
      urgencyLevel: "Pending Approval",
    },
    {
      productName: "Product A",
      quantity: 200,
      transferId: "TX4534",
      sourceWarehouse: "Warehouse A",
      destinationWarehouse: "Warehouse B",
      requestDate: "2024-11-25",
      urgencyLevel: "In transit",
    },
  ],
  auditLogs: [
    {
      userName: "John Doe",
      role: "Admin",
      actionType: "Updated",
      timeStamp: "2025-01-24 10:35 AM",
      description: "Reduced 20 units of SKU123",
    },
    {
      userName: "John Doe",
      role: "Admin",
      actionType: "Deleted",
      timeStamp: "2025-01-24 10:35 AM",
      description: "Reduced 20 units of SKU123",
    },
    {
      userName: "John Doe",
      role: "Admin",
      actionType: "Moved",
      timeStamp: "2025-01-24 10:35 AM",
      description: "Reduced 20 units of SKU123",
    },
    {
      userName: "John Doe",
      role: "Admin",
      actionType: "Created",
      timeStamp: "2025-01-24 10:35 AM",
      description: "Reduced 20 units of SKU123",
    },
  ],
};

const filterFields = {
  stockOverview: ["location", "status", "dateRange"],
  reorderSuggestion: ["urgencyLevel"],
  stockTransfer: ["urgencyLevel", "dateRange"],
  auditLogs: ["actionType", "role"],
};

export default function InventoryManagementData() {
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

  const handleStockTransfer = () => {
    closeModal();
    setTimeout(() => {
      openModal(InitiateTransferModal, {
        sizeClass: "w-[85%] md:w-[60%]",
      });
    }, 200);
  };

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

  const tabKeys = [
    "stockOverview",
    "reorderSuggestion",
    "stockTransfer",
    "auditLogs",
  ];
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
      stockOverview: "lastUpdated",
      stockTransfer: "requestDate",
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

  // Define columns per tab
  const statusTemplate = (rowData) => {
    const statusColors = {
      "In Stock": "bg-[#22C55E26] text-[#22C55E]",
      "Out of Stock": "bg-[#FF695B26] text-[#FF695B]",
      "Low Stock": "bg-[#DDD42726] text-[#DDD427]",
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

  const urgencyTemplate = (rowData) => {
    const urgencyColors = {
      Low: "bg-[#22C55E40] text-[#22C55E]",
      Moderate: "bg-[#DDD42740] text-[#DDD427]",
      Critical: "bg-[#FF695B40] text-[#FF695B]",
      "In transit": "bg-[#228CC540] text-[#228CC5]",
      "Pending Approval": "bg-[#DDD42740] text-[#DDD427]",
      Completed: "bg-[#22C55E40] text-[#22C55E]",
      Cancelled: "bg-[#EF444440] text-[#EF4444]",
    };

    return (
      <span
        className={`flex items-center justify-center w-[100px] h-[28px] rounded text-[10px] font-medium ${
          urgencyColors[rowData.urgencyLevel] || "bg-gray-200 text-gray-800"
        }`}
      >
        {rowData.urgencyLevel}
      </span>
    );
  };

  const ActionTypeIcon = (rowData) => {
    const actionIcons = {
      Updated: "/icons/updatedIcon.png",
      Deleted: "/icons/deletedIcon.png",
      Moved: "/icons/movedIcon.png",
      Created: "/icons/createdIcon.png",
    };

    const actionType = rowData.actionType;

    return (
      <div className="flex items-center gap-2">
        <img
          src={actionIcons[actionType] || "/icons/alert.png"}
          alt={actionType}
          width={14}
          height={14}
          className="object-contain"
        />
        {actionType}
      </div>
    );
  };

  const actionTemplate = (rowData) => (
    <span className="bg-[#0088D1] dark:bg-[#01CEE9] text-white px-3 py-1 flex items-center justify-center w-[100px] h-[28px] rounded text-[11px] font-medium">
      {rowData.action}
    </span>
  );

  const columns = useMemo(() => {
    switch (activeTabKey) {
      case "stockOverview":
        return [
          { field: "productName", header: "Product Name" },
          { field: "sku", header: "SKU" },
          { field: "quantity", header: "Quantity" },
          { field: "lastUpdated", header: "Last Updated" },
          { field: "location", header: "Location" },
          { field: "status", header: "Status", body: statusTemplate },
        ];
      case "reorderSuggestion":
        return [
          { field: "productName", header: "Product Name" },
          { field: "sku", header: "SKU" },
          { field: "currentStock", header: "Current Stock" },
          { field: "reorderLevel", header: "Reorder Level" },
          { field: "leadTime", header: "Lead Time (Days)" },
          { field: "suggestedQuantity", header: "Suggested Quantity" },
          {
            field: "urgencyLevel",
            header: "Urgency Level",
            body: urgencyTemplate,
          },
          { field: "action", header: "Action", body: actionTemplate },
        ];
      case "stockTransfer":
        return [
          { field: "productName", header: "Product Name" },
          { field: "quantity", header: "Quantity" },
          { field: "transferId", header: "Transfer ID" },
          { field: "sourceWarehouse", header: "Source Warehouse" },
          { field: "destinationWarehouse", header: "Destination Warehouse" },
          { field: "requestDate", header: "Request Date" },
          {
            field: "urgencyLevel",
            header: "Urgency Level",
            body: urgencyTemplate,
          },
        ];
      case "auditLogs":
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

  // AI SUGGESTED TABLE
  const AIrowsPerPage = 6;
  const [AIcurrentPage, setAICurrentPage] = React.useState(1);

  const totalPages = Math.ceil(AISuggestedData.length / AIrowsPerPage);

  const indexOfLastRow = AIcurrentPage * AIrowsPerPage;
  const indexOfFirstRow = indexOfLastRow - AIrowsPerPage;
  const currentTableData = AISuggestedData.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  // Corrected page change handler:
  const onPageChangeHandler = (pageZeroBased) => {
    setAICurrentPage(pageZeroBased + 1);
  };

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

  // skeleton
  const AuditLogCardSkeleton = () => (
    <div className="grid grid-cols-3 gap-4 w-full items-center pt-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex flex-row col-span-3 lg:col-span-1 h-[135px] w-full lg:w-[355px] bg-white dark:bg-black rounded-xl p-6"
        >
          {/* Icon */}
          <Skeleton
            width="40px"
            height="40px"
            className="dark:bg-[#2C2C2CAA]"
            style={{ marginRight: "32px", borderRadius: "0.375rem" }}
          />
          {/* Text center */}
          <div className="flex flex-col justify-center gap-3 flex-1">
            <Skeleton
              width="120px"
              height="18px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="80px"
              height="40px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const InventoryTableSkeleton = () => (
    <div className="pt-2">
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
                className="flex border-b border-[#6E7A8626] dark:border-[#6E7A8626] text-[13px] dark:bg-black bg-white whitespace-nowrap"
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

  const StockOverviewCardSkeleton = () => (
    <div className="pt-4">
      <div className="flex flex-col w-full bg-white dark:bg-black rounded-xl p-4">
        {/* Header */}
        <div className="flex flex-row items-center justify-between">
          <Skeleton
            width="160px"
            height="28px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="101px"
            height="34px"
            className="dark:bg-[#2C2C2CAA]"
            style={{ borderRadius: "0.375rem" }}
          />
        </div>

        {/* Center */}
        <div className="flex flex-row items-center mt-8 mb-8 justify-center">
          <Skeleton
            width="240px"
            height="240px"
            className="dark:bg-[#2C2C2CAA]"
            style={{ borderRadius: "9999px" }}
          />
        </div>
      </div>
    </div>
  );

  const ReorderSuggestionCardSkeleton = () => (
    <div className="flex flex-col lg:flex-row w-full gap-4 mb-2 justify-center pt-4">
      {[0, 1].map((cardIdx) => (
        <div
          key={cardIdx}
          className={`flex flex-col ${
            cardIdx === 0 ? "w-full lg:w-[60%]" : "w-full lg:w-[40%]"
          } ${
            cardIdx === 0 ? "h-[400px]" : "h-[400px]"
          } bg-white dark:bg-black rounded-xl p-4`}
        >
          {/* Header */}
          <div className="flex flex-row items-center justify-between mb-4">
            <Skeleton
              width="180px"
              height="28px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width={cardIdx === 0 ? 101 : 165}
              height="34px"
              className="dark:bg-[#2C2C2CAA]"
              style={{ borderRadius: "0.375rem" }}
            />
          </div>

          {/* Center */}
          {cardIdx === 0 ? (
            <div className="flex flex-row gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-row gap-1 items-center justify-center"
                >
                  <Skeleton
                    width="15px"
                    height="15px"
                    className="dark:bg-[#2C2C2CAA]"
                    style={{ borderRadius: "50%" }}
                  />
                  <Skeleton
                    width="80px"
                    height="12px"
                    className="dark:bg-[#2C2C2CAA]"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col h-full pt-3">
              {/* Table header */}
              <div className="flex border-b border-[#6E7A8626] dark:border-[#6E7A8626] mb-2">
                {["Product Name", "Current Stock", "Suggested Quantity"].map(
                  (text, idx) => (
                    <Skeleton
                      key={idx}
                      width="33%"
                      height="24px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  )
                )}
              </div>
              {/* Table rows */}
              <div
                className="flex flex-col space-y-1 overflow-y-auto"
                style={{ maxHeight: "280px" }}
              >
                {[...Array(5)].map((_, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="flex border-b border-[#6E7A8626] dark:border-[#6E7A8626]"
                    style={{ gap: "8px" }}
                  >
                    {[...Array(3)].map((__, colIdx) => (
                      <Skeleton
                        key={colIdx}
                        width="33%"
                        height="20px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                    ))}
                  </div>
                ))}
              </div>
              {/* Paginator */}
              <div className="mt-2 flex justify-center">
                <Skeleton
                  width="200px"
                  height="32px"
                  className="dark:bg-[#2C2C2CAA]"
                  style={{ borderRadius: "0.375rem" }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="pt-4 space-y-4 relative">
        {/* Tabs */}
        <div className="flex gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              width="130px"
              height="28px"
              className="dark:bg-[#2C2C2CAA]"
              style={{
                borderBottom: i === activeIndex ? "2px solid #0088D1" : "none",
                marginBottom: "4px",
              }}
            />
          ))}
        </div>

        {activeIndex === 3 && <AuditLogCardSkeleton />}

        {/* table skeleton */}
        <InventoryTableSkeleton />

        {/* activeIndex 0 FlexibleCard */}
        {activeIndex === 0 && <StockOverviewCardSkeleton />}

        {/* activeIndex 1 FlexibleCards */}
        {activeIndex === 1 && <ReorderSuggestionCardSkeleton />}
      </div>
    );
  }

  // row wise component
  const AuditLogCard = () => (
    <div className="grid grid-cols-3 gap-4 w-full items-center pt-4">
      <FlexibleCard
        cardClass="flex flex-row col-span-3 lg:col-span-1 h-[135px] w-full lg:w-[355px] bg-white dark:bg-black rounded-xl p-6 hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
        headerClass=""
        centerClass=""
        footerClass=""
        header={
          <div className="flex justify-center items-center h-full mr-8">
            <img src="/icons/TotalActionIcon.png" alt="ActionIcon" />
          </div>
        }
        center={
          <div className="flex flex-col justify-center gap-2 h-full pt-2">
            <h1 className="text-[#6E7A86] dark:text-[#EEF8FDCC] text-[14px] text-left">
              Total Actions
            </h1>
            <h1 className="text-[40px] text-[#0B1B33] dark:text-[#EEF8FD] font-extrabold text-left">
              1,500
            </h1>
          </div>
        }
      />

      <FlexibleCard
        cardClass="flex flex-row col-span-3 lg:col-span-1 h-[135px] w-full lg:w-[355px] bg-white dark:bg-black rounded-xl p-6 hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
        headerClass=""
        centerClass=""
        footerClass=""
        header={
          <div className="flex justify-center items-center h-full mr-8">
            <img src="/icons/RescentChangesIcon.png" alt="Rescent changes" />
          </div>
        }
        center={
          <div className="flex flex-col justify-center gap-2 h-full pt-2">
            <h1 className="text-[#6E7A86] dark:text-[#EEF8FDCC] text-[14px] text-left">
              Recent Changes
            </h1>
            <h1 className="text-[40px] text-[#0B1B33] dark:text-[#EEF8FD] font-extrabold text-left">
              50
            </h1>
          </div>
        }
      />

      <FlexibleCard
        cardClass="flex flex-row col-span-3 lg:col-span-1 h-[135px] w-full lg:w-[355px] bg-white dark:bg-black rounded-xl p-6 hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
        headerClass=""
        centerClass=""
        footerClass=""
        header={
          <div className="flex justify-center items-center h-full mr-8">
            <img src="/icons/UserIcon.png" alt="User Icon" />
          </div>
        }
        center={
          <div className="flex flex-col justify-center gap-2 h-full pt-2">
            <h1 className="text-[#6E7A86] dark:text-[#EEF8FDCC] text-[14px] text-left">
              User Involved
            </h1>
            <h1 className="text-[40px] text-[#0B1B33] dark:text-[#EEF8FD] font-extrabold text-left">
              10
            </h1>
          </div>
        }
      />
    </div>
  );

  const InventoryTable = () => (
    <>
      <div className="flex gap-6 pt-4">
        {[
          "Stock Overview",
          "Reorder Suggestion",
          "Stock Transfer",
          "Audit Logs",
        ].map((label, i) => (
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
                ? "text-[#0088D1] dark:text-[#EEF8FD] border-b-2 border-[#0088D1] dark:border-[#01CEE9]"
                : "text-[#0B1B33] dark:text-[#B5DEF2] hover:text-[#0088D1] dark:hover:text-[#EEF8FD]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeIndex === 3 && <AuditLogCard />}

      <div className="pt-2">
        <div className="bg-white dark:bg-[#000000] rounded-lg p-4 h-auto">
          <div className="flex flex-col md:flex-row gap-2 items-center w-full">
            <div className="flex flex-col gap-1 w-full">
              <h2 className="text-[#333333] dark:text-[#EEF8FD] font-bold text-[16px] lg:text-[18px]">
                {tabTitles[activeIndex].heading}
              </h2>
              <p className="text-[12px] lg:text-[14px] text-[#666666] dark:text-[#EEF8FD]">
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
                        setTempFilters({ ...filters });
                        setTempDateRange([...dateRange]);
                      }
                      setFilterOpen((prev) => !prev); // toggle panel open/close
                    }}
                  />
                </div>
                {activeIndex === 2 ? (
                  <ActionButton
                    label="Transfer Request"
                    iconLight={
                      <Icon
                        icon="material-symbols:add-rounded"
                        width={18}
                        height={18}
                      />
                    }
                    iconDark={
                      <Icon
                        icon="material-symbols:add-rounded"
                        width={18}
                        height={18}
                      />
                    }
                    iconPos="left"
                    buttonClass="flex items-center justify-center gap-1 text-sm h-[40px] w-[180px] px-4 bg-[#0088D1] text-white dark:bg-[#01CEE9] dark:text-black border-none focus:outline-none focus:ring-0"
                    onClick={handleStockTransfer}
                  />
                ) : (
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
                )}

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
                            <h4 className="font-semibold text-[12px] text-[#0B1B33] dark:text-[#EEF8FD] mb-2 capitalize">
                              {field}
                            </h4>
                            {values.map((val) => (
                              <label
                                key={val}
                                className="flex items-center gap-2 mb-1 text-[12px] text-[#6E7A86CC] dark:text-[#EEF8FDCC] cursor-pointer select-none"
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    tempFilters[field]?.includes(val) || false
                                  }
                                  onChange={() => toggleTempValue(field, val)}
                                  className="hidden peer"
                                />
                                <span className="w-3.5 h-3.5 rounded border border-[#6E7A86CC] peer-checked:bg-[#0088D1] peer-checked:border-[#0088D1] relative flex items-center justify-center">
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
                        buttonClass="flex items-center justify-center gap-1 text-[10px] h-[35px] w-full px-4 bg-white text-[#0088D1] dark:bg-[#0D0D0D] dark:text-[#0088D1] border border-[#0088D1] focus:outline-none focus:ring-0"
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
                        buttonClass="flex items-center justify-center gap-1 text-[10px] w-full h-[35px] px-4 bg-[#0088D1] text-white dark:bg-[#01CEE9] dark:text-black border-none focus:outline-none focus:ring-0"
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
                className="p-datatable-sm w-full [&_.p-datatable-tbody>tr]:dark:!bg-black"
                rowClassName={() =>
                  "border-b border-[#6E7A8626] text-[13px] text-[#666666] dark:text-[#EEF8FD] dark:bg-black whitespace-nowrap"
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
                    style={{ width: `${100 / columns.length}%` }}
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
    </>
  );

  const StockOverviewCard = () => {
    // donut chart data
    const [selectedRange, setSelectedRange] = useState("This Year");

    // Example dataset based on dropdown
    const chartData = {
      "This Week": { available: 20, outOfStock: 5 },
      "This Month": { available: 50, outOfStock: 15 },
      "This Year": { available: 70, outOfStock: 30 },
    };
    return (
      <div className="pt-4">
        <FlexibleCard
          cardClass="flex flex-col w-full  bg-white dark:bg-black rounded-xl p-4 hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
          headerClass="flex flex-row items-center justify-between"
          centerClass="flex flex-row items-center mt-8 mb-8 justify-center"
          footerClass=""
          header={
            <>
              <div className="flex w-full items-center">
                <h1 className="text-[18px] font-bold text-[#0B1B33] dark:text-[#EAF6FC] ">
                  Product Inventory
                </h1>
              </div>
              <div className="flex gap-2">
                <DropdownButton
                  defaultOption="This Year"
                  options={["This Week", "This Month", "This Year"]}
                  buttonClassName="flex items-center rounded-lg justify-center gap-2 px-3 py-2 text-white dark:text-black font-bold text-[11px] h-[34px] w-[105px] bg-gradient-to-r from-[#0088D1] to-[#353689] border-none focus:outline-none focus:ring-0"
                  dropdownClassName="bg-white dark:bg-[#121212] h-[80px] w-[105px]"
                  optionClassName="dark:text-gray-300 dark:hover:bg-gray-800 text-[11px]"
                  onChange={(value) => setSelectedRange(value)}
                />
              </div>
            </>
          }
          center={
            <>
              <div className="w-full h-full flex justify-center items-center">
                <DonutChart
                  available={chartData[selectedRange].available}
                  outOfStock={chartData[selectedRange].outOfStock}
                />
              </div>
            </>
          }
        />
      </div>
    );
  };

  const ReorderSuggestionCard = () => {
    //reorder suggestion data
    const [selectedBarChartRange, setSelectedBarChartRange] =
      useState("This Year");

    // Different datasets based on dropdown
    const productUrgencyDataSets = {
      "This Week": [
        { product: "Furniture", urgency: 70 },
        { product: "Apparel", urgency: 45 },
        { product: "Appliance", urgency: 35 },
        { product: "Food", urgency: 70 },
        { product: "Health Care", urgency: 95 },
        { product: "Health Care", urgency: 10 },
        { product: "Furniture", urgency: 70 },
        { product: "Apparel", urgency: 65 },
      ],
      "This Month": [
        { product: "Furniture", urgency: 40 },
        { product: "Apparel", urgency: 35 },
        { product: "Appliance", urgency: 15 },
        { product: "Food", urgency: 70 },
        { product: "Health Care", urgency: 95 },
        { product: "Health Care", urgency: 40 },
        { product: "Furniture", urgency: 80 },
        { product: "Apparel", urgency: 55 },
      ],
      "This Year": [
        { product: "Furniture", urgency: 80 },
        { product: "Apparel", urgency: 55 },
        { product: "Appliance", urgency: 25 },
        { product: "Food", urgency: 90 },
        { product: "Health Care", urgency: 65 },
        { product: "Health Care", urgency: 20 },
        { product: "Furniture", urgency: 80 },
        { product: "Apparel", urgency: 55 },
      ],
    };
    return (
      <div className="flex flex-col lg:flex-row w-full gap-4 mb-2 justify-center pt-4">
        {/* Card 1 */}
        <FlexibleCard
          cardClass="flex flex-col w-full lg:w-[60%] h-[400px] bg-white dark:bg-black rounded-xl p-4 hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
          headerClass="flex flex-row items-center justify-between"
          centerClass="flex flex-row items-center pt-2"
          footerClass="flex items-end justify-center h-full"
          header={
            <>
              <div className="flex w-full items-center">
                <h1 className="text-[18px] font-bold text-[#0B1B33] dark:text-[#EAF6FC] ">
                  Reorder Suggestion
                </h1>
              </div>
              <div className="flex gap-2">
                <DropdownButton
                  defaultOption="This Year"
                  options={["This Week", "This Month", "This Year"]}
                  buttonClassName="flex items-center rounded-lg justify-center gap-2 px-3 py-2 text-white dark:text-black font-bold text-[11px] h-[34px] w-[105px] bg-gradient-to-r from-[#0088D1] to-[#353689] border-none focus:outline-none focus:ring-0"
                  dropdownClassName="bg-white dark:bg-[#121212] h-[80px] w-[105px]"
                  optionClassName="dark:text-gray-300 dark:hover:bg-gray-800 text-[11px]"
                  onChange={(value) => setSelectedBarChartRange(value)}
                />
              </div>
            </>
          }
          center={
            <div className="flex flex-row gap-2">
              <div className="flex flex-row gap-1 items-center justify-center">
                <Icon
                  icon="ic:baseline-circle"
                  width="15"
                  height="15"
                  className="text-[#FF695B]"
                />
                <h2 className="text-[8px] text-[#6E7A86] dark:text-[#6E7A86]">
                  Critical Urgency
                </h2>
              </div>

              <div className="flex flex-row gap-1 items-center justify-center">
                <Icon
                  icon="ic:baseline-circle"
                  width="15"
                  height="15"
                  className="text-[#DDD427]"
                />
                <h2 className="text-[8px] text-[#6E7A86] dark:text-[#6E7A86]">
                  Moderate Urgency
                </h2>
              </div>

              <div className="flex flex-row gap-1 items-center justify-center">
                <Icon
                  icon="ic:baseline-circle"
                  width="15"
                  height="15"
                  className="text-[#22C55E]"
                />
                <h2 className="text-[8px] text-[#6E7A86] dark:text-[#6E7A86]">
                  Low Urgency
                </h2>
              </div>
            </div>
          }
          footer={
            <>
              <BarChart
                dataPoints={productUrgencyDataSets[selectedBarChartRange]}
              />
            </>
          }
        />
        {/* Card 2*/}
        <FlexibleCard
          cardClass="flex flex-col w-full lg:w-[40%] h-[400px] bg-white dark:bg-black rounded-xl p-4 hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
          headerClass="flex justify-between"
          centerClass="flex flex-row gap-4"
          footerClass=""
          header={
            <>
              <div className="flex flex-row w-full justify-between items-center">
                <h1 className="font-extrabold text-[20px] text-[#0B1B33] dark:text-[#EAF6FC]">
                  AI Suggestion
                </h1>

                <ActionButton
                  label="Reorder Suggestion"
                  iconLight={
                    <Icon
                      icon="ep:arrow-down"
                      width="16"
                      height="16"
                      className="text-white"
                    />
                  }
                  iconDark={
                    <Icon
                      icon="ep:arrow-down"
                      width="16"
                      height="16"
                      className="text-black"
                    />
                  }
                  iconPos="right"
                  buttonClass="flex flex-row-reverse items-center justify-center gap-2 px-3 py-2 text-white dark:text-black font-extralight text-[11px] h-[34px] w-[165px] bg-gradient-to-r from-[#0088D1] to-[#353689] border-none focus:outline-none focus:ring-0"
                />
              </div>
            </>
          }
          center={
            <div className="flex flex-col h-full pt-3">
              <table
                className="w-full text-sm text-left text-[#33333380] dark:text-[#EEF8FD80]"
                style={{ tableLayout: "fixed" }}
              >
                <thead className="text-[10px] md:text-[12px] sticky top-0 w-full">
                  <tr>
                    <th className="px-3 py-2 w-1/3">Product Name</th>
                    <th className="px-3 py-2 w-1/3">Current Stock</th>
                    <th className="px-3 py-2 w-1/3 whitespace-nowrap">
                      Suggested Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentTableData.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-[#6E7A8626] dark:border-[#6E7A8626] dark:text-[#EEF8FD] text-[#666666]"
                    >
                      <td className="px-3 py-2 w-1/3">{item.productName}</td>
                      <td className="px-3 py-2 w-1/3">{item.currentStock}</td>
                      <td className="px-3 py-2 w-1/3">
                        {item.suggestedQuantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-2">
                <CustomPaginator
                  totalPages={totalPages}
                  currentPage={AIcurrentPage - 1} // zero-based current page
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
      <InventoryTable />

      {activeIndex === 0 && (
        <PinWrapper
          id="stock-overview-card"
          meta={{ component: StockOverviewCard }}
          skeleton={<StockOverviewCardSkeleton />}
        >
          <StockOverviewCard />
        </PinWrapper>
      )}

      {activeIndex === 1 && (
        <PinWrapper
          id="reorder-suggestion-card"
          meta={{ component: ReorderSuggestionCard }}
          skeleton={<ReorderSuggestionCardSkeleton />}
        >
          <ReorderSuggestionCard />
        </PinWrapper>
      )}
    </div>
  );
}
