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
  DropdownButton,
  Icon,
  FilterCalendar,
  CustomPaginator,
  PinWrapper,
  FlexibleCard,
  MenuActionButton,
  ResponsiveTrendChart,
  Skeleton,
  AddProductModal,
} from "@/common/imports";

const tabTitles = [
  {
    heading: "Stock Management",
    subheading: "Real-time data on product and manage products.",
  },
  {
    heading: "FIFO",
    subheading: "Stock Allocation History",
  },
  {
    heading: "Escrow Management",
    subheading: "Escrow Stock Movement Table ",
  },
  {
    heading: "Batch-Level Tracking & Reporting",
    subheading: " Batch History Table",
  },
];

const AISuggestion = [
  {
    id: 1,
    title: "Process New Orders",
    msg: "Orders are piling up; complete processing today to maintain efficiency.",
  },
  {
    id: 2,
    title: "Process New Orders",
    msg: "Orders are piling up; complete processing today to maintain efficiency.",
  },
  {
    id: 3,
    title: "Process New Orders",
    msg: "Orders are piling up; complete processing today to maintain efficiency.",
  },
  {
    id: 4,
    title: "Process New Orders",
    msg: "Orders are piling up; complete processing today to maintain efficiency.",
  },
];

const dataSets = {
  stockManagement: [
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 100,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 10,
      status: "Out of Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 200,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 20,
      status: "Low Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 100,
      status: "Out of Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 100,
      status: "Low Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 0,
      status: "Out of Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 20,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 10,
      status: "Low Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 100,
      status: "Low Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 100,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 20,
      status: "Out of Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 100,
      status: "Low Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 100,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 20,
      status: "Out of Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 100,
      status: "Low Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 100,
      status: "Out of Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 100,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 20,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 100,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 100,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 200,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-18",
      stock: 100,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-16",
      stock: 30,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-25",
      stock: 100,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-21",
      stock: 0,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 100,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 10,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 100,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 10,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 0,
      status: "In Stock",
      location: "Edit",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 200,
      status: "In Stock",
      location: "Edit",
    },
  ],
  fifo: [
    {
      productName: "Product X",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-10",
      stock: 200,
      allocatedStock: 100,
      batch: "BATCH001",
    },
    {
      productName: "Product X",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-02",
      stock: 100,
      allocatedStock: 100,
      batch: "BATCH001",
    },
    {
      productName: "Product X",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-12",
      stock: 20,
      allocatedStock: 20,
      batch: "BATCH001",
    },
    {
      productName: "Product X",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-09",
      stock: 20,
      allocatedStock: 20,
      batch: "BATCH001",
    },
    {
      productName: "Product X",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 0,
      allocatedStock: 0,
      batch: "BATCH001",
    },
    {
      productName: "Product X",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 200,
      allocatedStock: 100,
      batch: "BATCH001",
    },
    {
      productName: "Product X",
      sku: "SKU123",
      category: "Electronics",
      expiryDate: "2025-2-24",
      stock: 200,
      allocatedStock: 100,
      batch: "BATCH001",
    },
  ],
  escrow: [
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      allocatedStock: 100,
      batch: "BATCH001",
      escrow: 100,
      action: "Delivered",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      allocatedStock: 100,
      batch: "BATCH001",
      escrow: 20,
      action: "Delivered",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      allocatedStock: 20,
      batch: "BATCH001",
      escrow: 20,
      action: "Delivered",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      allocatedStock: 100,
      batch: "BATCH001",
      escrow: 20,
      action: "Mark as Delivered",
    },
    {
      productName: "Product A",
      sku: "SKU123",
      category: "Electronics",
      allocatedStock: 100,
      batch: "BATCH001",
      escrow: 15,
      action: "Mark as Delivered",
    },
  ],
  batchTracking: [
    {
      batchNo: "BATCH001",
      product: "Product A",
      sku: "SKU123",
      total: 100,
      allocatedStock: 100,
      remaining: 100,
      expiryDate: "12/02/2025",
      escrow: 100,
    },
    {
      batchNo: "BATCH001",
      product: "Product A",
      sku: "SKU123",
      total: 100,
      allocatedStock: 100,
      remaining: 100,
      expiryDate: "12/02/2025",
      escrow: 100,
    },
    {
      batchNo: "BATCH001",
      product: "Product A",
      sku: "SKU123",
      total: 100,
      allocatedStock: 20,
      remaining: 20,
      expiryDate: "12/02/2025",
      escrow: 20,
    },
    {
      batchNo: "BATCH001",
      product: "Product A",
      sku: "SKU123",
      total: 100,
      allocatedStock: 0,
      remaining: 0,
      expiryDate: "12/02/2025",
      escrow: 0,
    },
  ],
};

const filterFields = {
  stockManagement: ["category", "status", "dateRange"],
  fifo: ["category", "dateRange"],
  escrow: ["category", "action"],
  batchTracking: ["sku", "dateRange"],
};

export default function ProductManagementData() {
  const { openModal, closeModal } = useModal();
  const [toggleOn, setToggleOn] = useState(false);

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

  const handleAddProduct = () => {
    openModal(AddProductModal, {
      sizeClass: "w-[85%] md:w-[50%]",
    });
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

  const tabKeys = ["stockManagement", "fifo", "escrow", "batchTracking"];
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

  // Filter data by active filters and global search
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
      stockManagement: "expiryDate",
      fifo: "expiryDate",
      batchTracking: "expiryDate",
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

  const locationTemplate = (rowData) => {
    return (
      <button
        type="button"
        className="flex items-center gap-2 bg-white dark:bg-black 
                 text-[#09BF64] dark:text-[#81D959] 
                 border border-[#09BF64] dark:border-[#81D959] 
                 px-3 py-1 rounded text-[11px] font-medium"
      >
        <Icon
          icon="tabler:edit"
          width={14}
          height={14}
          className="text-[#09BF64] dark:text-[#81D959]"
        />
        Edit
      </button>
    );
  };

  const actionTemplate = (rowData) => {
    const actionColors = {
      Delivered: "bg-[#22C55E26] text-[#22C55E]",
      "Mark as Delivered":
        "bg-white dark:bg-black text-[#0CB91D] border border-[#0CB91D]",
    };

    return (
      <span
        className={`flex items-center justify-center w-[100px] h-[28px] rounded text-[11px] font-medium ${
          actionColors[rowData.action] || "bg-gray-200 text-gray-800"
        }`}
      >
        {rowData.action}
      </span>
    );
  };

  const deleteButtonTemplate = (rowData) => {
    return (
      <button
        type="button"
        className="flex items-center gap-1 px-2 py-1 rounded-md w-[78px] h-[28px]
                 bg-[#EF4444] dark:bg-[#F15B5B] hover:bg-red-900 text-white dark:text-black text-[11px] font-medium"
        onClick={() => handleDeleteRow(rowData)}
      >
        <Icon
          icon="mdi:delete-outline"
          width={16}
          height={16}
          className="text-white dark:text-black"
        />
        Delete
      </button>
    );
  };

  const columns = useMemo(() => {
    switch (activeTabKey) {
      case "stockManagement":
        return [
          { field: "productName", header: "Product Name" },
          { field: "sku", header: "SKUs" },
          { field: "category", header: "Category" },
          { field: "expiryDate", header: "Expiry Date" },
          { field: "stock", header: "Stock(carton)" },
          { field: "status", header: "Status", body: statusTemplate },
          { field: "location", header: "Location", body: locationTemplate },
          { header: "", body: deleteButtonTemplate },
        ];
      case "fifo":
        return [
          { field: "productName", header: "Product Name" },
          { field: "sku", header: "SKU" },
          { field: "category", header: "Category" },
          { field: "expiryDate", header: "Expiry Date" },
          { field: "stock", header: "Stock(carton)" },
          { field: "allocatedStock", header: "Allocated Stock" },
          { field: "batch", header: "Batch" },
        ];
      case "escrow":
        return [
          { field: "productName", header: "Product Name" },
          { field: "sku", header: "SKU" },
          { field: "category", header: "Category" },
          { field: "allocatedStock", header: "Allocated Stock" },
          { field: "batch", header: "Batch" },
          { field: "escrow", header: "Escrow" },
          { field: "action", header: "Action", body: actionTemplate },
        ];
      case "batchTracking":
        return [
          { field: "batchNo", header: "Batch No." },
          { field: "product", header: "Product" },
          { field: "sku", header: "SKU" },
          { field: "total", header: "Total" },
          { field: "allocatedStock", header: "Allocated Stock" },
          { field: "remaining", header: "Remaining" },
          { field: "expiryDate", header: "Expiry Date" },
          { field: "escrow", header: "Escrow" },
        ];
      default:
        return [];
    }
  }, [activeTabKey]);

  // Toggle filter checkbox value
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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const resetFilters = () => setFilters({});

  const hasDateRangeFilter = filterFields[activeTabKey]?.includes("dateRange");

  const BottomCardSkeleton = () => (
    <div className="flex flex-col lg:flex-row w-full gap-4 mb-2 justify-center pt-4">
      {/* Card 1: Sales Trends & Revenue */}
      <div className="flex flex-col w-full lg:w-[60%] h-[400px] bg-white dark:bg-[#2C2C2CAA] rounded-xl p-4 space-y-4">
        <Skeleton width="70%" height={24} className="dark:bg-[#2C2C2CAA]" />
        <div className="flex flex-row gap-2">
          <Skeleton
            width={112}
            height={34}
            className="rounded dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width={101}
            height={34}
            className="rounded dark:bg-[#2C2C2CAA]"
          />
        </div>
        <div className="flex flex-row gap-4 mt-4">
          <div className="flex flex-col gap-2 w-full">
            <Skeleton width={80} height={8} className="dark:bg-[#2C2C2CAA]" />
            <Skeleton width={100} height={28} className="dark:bg-[#2C2C2CAA]" />
            <Skeleton width={120} height={16} className="dark:bg-[#2C2C2CAA]" />
          </div>
          <div className="w-[2px] bg-[#E3E4E9]" />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton width={80} height={8} className="dark:bg-[#2C2C2CAA]" />
            <Skeleton width={100} height={28} className="dark:bg-[#2C2C2CAA]" />
            <Skeleton width={120} height={16} className="dark:bg-[#2C2C2CAA]" />
          </div>
        </div>
        <Skeleton
          width="100%"
          height={150}
          className="rounded dark:bg-[#2C2C2CAA]"
        />
      </div>

      {/* Card 2: AI Suggestions */}
      <div className="flex flex-col w-full lg:w-[40%] bg-white dark:bg-[#2C2C2CAA] rounded-xl p-4 space-y-4">
        <div className="flex flex-row justify-between items-center">
          <Skeleton width={120} height={20} className="dark:bg-[#2C2C2CAA]" />
          <Skeleton
            width={60}
            height={24}
            className="rounded dark:bg-[#2C2C2CAA]"
          />
        </div>
        <div className="h-[310px] w-full overflow-y-auto overflow-x-hidden space-y-4 pr-2 mt-2">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="w-full h-auto bg-[#EFFBF380] dark:bg-[#14141480] rounded-xl p-4 space-y-2"
            >
              <Skeleton
                width="60%"
                height={14}
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height={16}
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <div className="p-4 space-y-4 relative bg-white dark:bg-[#000000] rounded-lg mt-8">
      {/* Tabs Skeleton */}
      <div className="inline-flex w-full md:w-auto bg-[#EFFBF3] dark:bg-[#141414] h-[48px] items-center rounded-full overflow-hidden whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <Skeleton
            key={i}
            width={150}
            height={40}
            className="mx-1 rounded-full dark:bg-[#2C2C2CAA]"
          />
        ))}
      </div>

      {/* Filter + Search + Export Skeleton */}
      <div className="flex flex-col lg:flex-row gap-2 items-center w-full">
        <div className="flex flex-row gap-3 items-center w-full">
          {/* Title + Subheading */}
          <div className="flex flex-col gap-1 w-full">
            <Skeleton width={200} height={18} className="dark:bg-[#2C2C2CAA]" />
            <Skeleton width={150} height={14} className="dark:bg-[#2C2C2CAA]" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-end items-start lg:items-end gap-4 w-full lg:w-auto">
          <Skeleton
            width={250}
            height={36}
            className="rounded-2xl dark:bg-[#2C2C2CAA]"
          />
          <div className="flex flex-row gap-4 relative w-full">
            <Skeleton
              width={100}
              height={40}
              className="rounded dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width={104}
              height={40}
              className="rounded dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width={148}
              height={40}
              className="rounded dark:bg-[#2C2C2CAA]"
            />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="pt-6 overflow-x-auto w-full gap-2">
        <div className="space-y-2 ">
          {[...Array(7)].map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex flex-row justify-between border-b border-[#6F7C7426] w-full gap-2"
            >
              {[...Array(7)].map((_, colIdx) => (
                <Skeleton
                  key={colIdx}
                  width="16%"
                  height={20}
                  className="rounded dark:bg-[#2C2C2CAA] gap-2"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Paginator Skeleton */}
      <div className="flex justify-center mt-4">
        {[...Array(5)].map((_, idx) => (
          <Skeleton
            key={idx}
            width={30}
            height={30}
            className="mx-1 rounded-full dark:bg-[#2C2C2CAA]"
          />
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* table */}
        <TableSkeleton />
        {/* Cards Skeleton Row */}
        <BottomCardSkeleton />
      </div>
    );
  }

  const ProductBottomChart = () => {
    //graph data
    const [selectedCategory, setSelectedCategory] = useState("Electronics");
    const [selectedRange, setSelectedRange] = useState("This Year");

    const salesData = {
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
          revenue: "$120,000",
          revenueChange: "6% more than last year",
          cartons: "300 Cartons",
          pallet: "(10 Pallets)",
          cartonsChange: "6% more than last year",
        },
        "This Month": {
          revenue: "$25,000",
          revenueChange: "4% more than last month",
          cartons: "70 Cartons",
          pallet: "(2 Pallets)",
          cartonsChange: "4% more than last month",
        },
        "This Week": {
          revenue: "$6,500",
          revenueChange: "7% more than last week",
          cartons: "20 Cartons",
          pallet: "(1 Pallet)",
          cartonsChange: "7% more than last week",
        },
      },

      Food: {
        "This Year": {
          revenue: "$95,000",
          revenueChange: "3% more than last year",
          cartons: "220 Cartons",
          pallet: "(8 Pallets)",
          cartonsChange: "3% more than last year",
        },
        "This Month": {
          revenue: "$20,000",
          revenueChange: "5% more than last month",
          cartons: "60 Cartons",
          pallet: "(2 Pallets)",
          cartonsChange: "5% more than last month",
        },
        "This Week": {
          revenue: "$5,200",
          revenueChange: "6% more than last week",
          cartons: "15 Cartons",
          pallet: "(1 Pallet)",
          cartonsChange: "6% more than last week",
        },
      },

      Furniture: {
        "This Year": {
          revenue: "$80,000",
          revenueChange: "10% more than last year",
          cartons: "180 Cartons",
          pallet: "(6 Pallets)",
          cartonsChange: "10% more than last year",
        },
        "This Month": {
          revenue: "$18,500",
          revenueChange: "8% more than last month",
          cartons: "50 Cartons",
          pallet: "(2 Pallets)",
          cartonsChange: "8% more than last month",
        },
        "This Week": {
          revenue: "$4,800",
          revenueChange: "5% more than last week",
          cartons: "12 Cartons",
          pallet: "(1 Pallet)",
          cartonsChange: "5% more than last week",
        },
      },
    };

    const currentData = summaryData[selectedCategory][selectedRange];
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
                <h1 className="text-[18px] font-bold text-[#0F2418] dark:text-[#EBF9F0] ">
                  Sales Trends & Revenue
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
              <div>
                <h2 className="text-[8px] text-[#8E8E9C] dark:text-[#8E8E9C]">
                  Revenue
                </h2>
                <h1 className="text-[#0CB91D] dark:text-[#0DD121] font-extrabold text-[24px] md:text-[28px]">
                  {currentData.revenue}
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
                  {currentData.revenueChange}
                </h2>
              </div>
              <div className="mx-4 h-[68px] w-[2px] bg-[#E3E4E9]" />
              <div>
                <h2 className="text-[8px] text-[#8E8E9C] dark:text-[#8E8E9C]">
                  Carton Sold
                </h2>
                <h1 className="text-[#0096FF] dark:text-[#0096FF] font-extrabold text-[24px] md:text-[28px]">
                  {currentData.cartons}{" "}
                  <span className="text-[10px] text-[#8E8E9C] dark:text-[#8E8E9C] font-normal">
                    {currentData.pallet}
                  </span>
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
                  {currentData.cartonsChange}
                </h2>
              </div>
            </>
          }
          footer={
            <ResponsiveTrendChart
              data={salesData[selectedCategory][selectedRange]}
            />
          }
        />
        {/* Card 2*/}
        <FlexibleCard
          cardClass="flex flex-col w-full lg:w-[40%] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
          headerClass=" pb-2"
          centerClass="px-4 flex flex-col items-center w-full"
          footerClass=""
          header={
            <>
              <div className="flex flex-row p-4 justify-between">
                <div className="flex flex-row justify-start items-center gap-4">
                  <Icon
                    icon="mingcute:ai-line"
                    width="20"
                    height="20"
                    className=" text-[#09BF64]"
                  />
                  <h1 className="text-[14px] text-[#6F7C74] dark:text-[#EBF9F0] font-medium">
                    AI Powered Suggestions
                  </h1>
                </div>
                <div className="">
                  <ActionButton
                    label="View All"
                    buttonClass="flex text-[12px] h-[24px] font-normal text-[#09BF64] dark:text-[#81D959] border-none focus:outline-none focus:ring-0 !shadow-none hover:underline"
                  />
                </div>
              </div>
            </>
          }
          center={
            <>
              <div className="h-[310px] w-full overflow-y-auto overflow-x-hidden space-y-4 pr-2 mt-2 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EFFBF3] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
                <div className="flex flex-col gap-4 w-full">
                  {AISuggestion.map((msg) => (
                    <FlexibleCard
                      key={msg.id}
                      cardClass="w-full h-auto bg-[#EFFBF380] dark:bg-[#14141480] border-none rounded-xl p-4"
                      headerClass=""
                      centerClass=""
                      footerClass="flex flex-row items-center"
                      header={
                        <div className="relative flex w-full items-center">
                          <div className="flex flex-col gap-3 text-left">
                            <h3 className="text-[13px] text-[#6F7C74] dark:text-[#A9C2B3]">
                              {msg.title}
                            </h3>
                            <h3 className="text-[15px] text-[#2B2B2B] dark:text-[#EFFBF3] font-medium">
                              {msg.msg}
                            </h3>
                          </div>
                        </div>
                      }
                    />
                  ))}
                </div>
              </div>
            </>
          }
        />
      </div>
    );
  };

  return (
    <div className="space-y-4 ">
      <div className="p-4 space-y-4 relative bg-white dark:bg-[#000000] rounded-lg mt-8">
        {/* Tabs */}
        <div className="inline-flex w-full md:w-auto bg-[#EFFBF3] dark:bg-[#141414] h-[48px] items-center rounded-full overflow-hidden whitespace-nowrap">
          {["Stock Management", "FIFO", "Escrow", "Batch Tracking"].map(
            (label, i) => (
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
                className={`h-full text-[12px] md:text-[16px] font-medium transition-all rounded-full
        ${
          i === activeIndex
            ? "text-white dark:text-[#0D0D0D] bg-[#09BF64] dark:bg-[#81D959] px-3 md:px-6"
            : "text-[#0F2418] dark:text-[#D4D4D4] hover:text-[#09BF64] dark:hover:text-[#EFFBF3] px-3 md:px-6"
        }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        {/* Filter + Search + Export */}
        <div className="flex flex-col lg:flex-row gap-2 items-center w-full">
          <div className="flex flex-row gap-3 items-center w-full">
            {activeIndex === 1 && (
              <div
                onClick={() => setToggleOn((prev) => !prev)}
                className={`w-[70px] h-[36px] flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300
        ${
          toggleOn
            ? "bg-[#09BF64] dark:bg-[#81D959]"
            : "bg-gray-300 dark:bg-[#141414]"
        }`}
                style={{ minWidth: "70px" }}
              >
                <div
                  className={`bg-white dark:bg-black w-[28px] h-[28px] rounded-full shadow-md transform transition-transform duration-300
          ${toggleOn ? "translate-x-[32px]" : "translate-x-0"}`}
                />
              </div>
            )}
            <div className="flex flex-col gap-1 w-full">
              <h2 className="text-[#333333] dark:text-[#EFFBF3] font-bold text-[16px] lg:text-[18px]">
                {tabTitles[activeIndex].heading}
              </h2>
              <p className="text-[12px] lg:text-[14px] text-[#666666] dark:text-[#EFFBF3]">
                {tabTitles[activeIndex].subheading}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-end items-start lg:items-end gap-4 w-full lg:w-auto">
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
            <div className="flex flex-row gap-4 relative w-full">
              {activeIndex !== 0 && (
                <>
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
                          setTempFilters(filters); // panel open hone par existing filters temp me copy karo
                          setTempDateRange(dateRange); // same for date range
                        }
                        setFilterOpen(!filterOpen); // toggle panel open/close
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
                </>
              )}

              {activeIndex === 0 && (
                <>
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
                      buttonClass="flex items-center justify-center gap-1 text-[10px] md:text-sm h-[40px] w-[100px] px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
                      onClick={() => {
                        if (!filterOpen) {
                          setTempFilters(filters); // panel open hone par existing filters temp me copy karo
                          setTempDateRange(dateRange); // same for date range
                        }
                        setFilterOpen(!filterOpen); // toggle panel open/close
                      }}
                    />
                  </div>
                  <MenuActionButton
                    label="Export"
                    iconLight="./exportIconLight.png"
                    iconDark="./exportIconDark.png"
                    iconPos="left"
                    menuOptions={exportMenuOptions}
                    buttonClass="flex items-center justify-center gap-1 text-[10px] md:text-sm h-[40px] w-[104px] px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
                    menuClass="mt-2 w-[104px] p-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C]"
                    iconClass="w-[16px] h-[14px]"
                  />
                  <ActionButton
                    label="Add Product"
                    iconLight={
                      <Icon icon="formkit:add" width={18} height={18} />
                    }
                    iconDark={
                      <Icon icon="formkit:add" width={18} height={18} />
                    }
                    iconPos="left"
                    labelClass="font-normal"
                    buttonClass="flex items-center justify-center gap-1 text-[10px] md:text-sm h-[40px] w-[148px] px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-black border-none focus:outline-none focus:ring-0"
                    onClick={handleAddProduct}
                  />
                </>
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
        <div className="pt-6 overflow-x-auto w-full ">
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
            <>
              {activeIndex === 0 && (
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
              )}
              {activeIndex !== 0 && (
                <DataTable
                  value={pagedRows}
                  paginator={false}
                  className="p-datatable-sm w-full [&_.p-datatable-tbody>tr]:dark:!bg-black"
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
                      style={{ width: `${100 / columns.length}%` }}
                    />
                  ))}
                </DataTable>
              )}
            </>
          )}
        </div>

        {/* Your existing CustomPaginator */}
        <CustomPaginator
          totalPages={Math.ceil(filteredData.length / rowsPerPage)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          maxButtons={5}
        />
      </div>

      <PinWrapper
        id="inventory-bottom-card"
        meta={{ component: ProductBottomChart }}
        skeleton={<BottomCardSkeleton />}
      >
        <ProductBottomChart />
      </PinWrapper>
    </div>
  );
}
