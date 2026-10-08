import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useModal } from "@/context/ModalContext";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataTable,
  useMemo,
  Column,
  ActionButton,
  menuOptions,
  SearchBox,
  Icon,
  CustomPaginator,
  useRef,
  FilterCalendar,
  Skeleton,
  RangeCalendar,
  MenuActionButton,
} from "@/common/imports";

const tabTitles = [
  {
    heading: "Near Expiry Stock Details",
    subheading: "Real-time data on product and manage products.",
  },
];

const dataSets = [
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 100,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 10,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 200,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 20,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 100,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 100,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 0,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 20,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 10,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 100,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 100,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 20,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 100,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-12",
    stock: 100,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-12",
    stock: 20,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-14",
    stock: 100,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-15",
    stock: 100,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-13",
    stock: 100,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 20,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 100,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 100,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 200,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 100,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 30,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 100,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 0,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 100,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 10,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 100,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 10,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 0,
    status: "In 2 days",
    location: "Edit",
  },
  {
    productName: "Product A",
    sku: "SKU123",
    category: "Electronics",
    expiryDate: "2025-2-08",
    stock: 200,
    status: "In 2 days",
    location: "Edit",
  },
];

const filterableColumns = ["category", "dateRange"];

export default function NearExpiryStockSKU() {
  const { openModal, closeModal } = useModal();
  const exportMenuOptions = menuOptions(["CSV", "Excel"]);
  const navigate = useNavigate();
  const filterButtonRef = useRef(null);
  const filterPanelRef = useRef(null);

  // --- local UI / filter state ---
  const [globalFilter, setGlobalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 9;

  // "applied" filters (what is currently active)
  const [filters, setFilters] = useState({}); // e.g. { status: ['Resolved'] }

  // filter panel open state & temporary values while panel is open
  const [filterOpen, setFilterOpen] = useState(false);
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
      category: [...new Set(rawData.map((r) => r.category).filter(Boolean))],
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

  // Define columns per tab
  const locationTemplate = (rowData) => {
    return (
      <button
        type="button"
        className="flex items-center gap-2 bg-white dark:bg-black 
                 text-[#0088D1] dark:text-[#01CEE9] 
                 border border-[#0088D1] dark:border-[#01CEE9] 
                 px-3 py-1 rounded text-[11px] font-medium"
      >
        <Icon
          icon="tabler:edit"
          width={14}
          height={14}
          className="text-[#0088D1] dark:text-[#01CEE9]"
        />
        Edit
      </button>
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

  const columns = useMemo(
    () => [
      { field: "productName", header: "Product Name" },
      { field: "sku", header: "SKUs" },
      { field: "category", header: "Category" },
      {
        field: "expiryDate",
        header: "Expiry Date",
        body: (rowData) => (
          <span className="text-[#EF4444]">{rowData.expiryDate}</span>
        ),
      },
      { field: "stock", header: "Stock(carton)" },
      { field: "status", header: "Status" },
      { field: "location", header: "Location", body: locationTemplate },
      { header: "", body: deleteButtonTemplate },
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
      if (startDate && endDate && row.expiryDate) {
        const rowDate = parseRowDate(row.expiryDate);
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
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setIsLoading(true); // show skeleton
    setKey((prev) => prev + 1);

    // simulate refetch delay
    setTimeout(() => {
      setIsLoading(false); // hide skeleton after data "loads"
    }, 1000);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 pl-3 pr-3 pt-4 bg-gray-50 dark:bg-[#141414]">
        {/* Row 1: Main Dashboard Skeleton */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-2">
          {/* Title Skeleton */}
          <div className="flex w-full justify-start items-center">
            <Skeleton
              width="180px"
              height="20px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Buttons Container Skeleton */}
          <div className="flex flex-row justify-between md:!justify-end items-center gap-2 md:gap-4 w-full">
            {/* Export Button Skeleton */}
            <Skeleton
              height="35px"
              className="dark:bg-[#2C2C2CAA] w-1/3 md:w-[100px] lg:w-[110px]"
              style={{ borderRadius: "0.375rem" }}
            />

            {/* RangeCalendar Skeleton */}
            <Skeleton
              height="35px"
              className="dark:bg-[#2C2C2CAA] w-1/3 md:w-[180px] lg:w-[200px]"
              style={{ borderRadius: "0.375rem" }}
            />

            {/* Refresh Button Skeleton */}
            <Skeleton
              height="35px"
              className="dark:bg-[#2C2C2CAA] w-1/3 md:w-[100px] lg:w-[110px]"
              style={{ borderRadius: "0.375rem" }}
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-[#000000] rounded-lg p-4 h-auto">
          <div className="flex flex-col md:flex-row gap-2 items-center w-full">
            {/* Heading and subheading */}
            <div className="flex flex-col gap-1 w-full">
              <Skeleton
                width="200px"
                height="18px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="150px"
                height="14px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>

            {/* Search and filter */}
            <div className="flex flex-col md:flex-row justify-end items-start lg:items-end gap-4 w-full">
              <Skeleton
                width="250px"
                height="36px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <div className="flex flex-row gap-4 relative">
                <Skeleton
                  width="100px"
                  height="40px"
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width="104px"
                  height="40px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              </div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="pt-6 overflow-x-auto w-full">
            {[...Array(9)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="flex border-b border-[#6E7A8626] text-[13px] whitespace-nowrap py-2 w-full"
              >
                {[...Array(columns.length)].map((_, colIndex) => (
                  <Skeleton
                    key={colIndex}
                    width="100px"
                    height="20px"
                    className="dark:bg-[#2C2C2CAA] mr-4 flex-1"
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Paginator Skeleton */}
          <div className="flex justify-center mt-4 gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                width="30px"
                height="30px"
                className="dark:bg-[#2C2C2CAA] rounded-full"
              />
            ))}
          </div>
        </div>

        <div className="pb-5"></div>
      </div>
    );
  }
  return (
    <>
      {/* Main Inventory Dashboard */}
      <div
        key={key}
        className="flex-1 pl-3 pr-3 pt-4 bg-gray-50 dark:bg-[#141414]"
      >
        {/* Row 1: Main Dashboard */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-2">
          {/* Title (Hidden below lg) */}
          <h1 className="flex w-full  justify-start items-center text-[14px] font-semibold text-[#0088D1] dark:text-[#0088D1] whitespace-nowrap">
            <button
              onClick={() => navigate("/product")}
              className="flex items-center text-[#0088D1] dark:text-[#0088D1] hover:underline"
            >
              Product Management
            </button>
            <Icon
              icon="mdi:chevron-right"
              className="mx-1 text-[#0088D1] dark:text-[#0088D1]"
              width="16"
              height="16"
            />
            Out of Stock Products
          </h1>

          {/* Buttons Container */}
          <div className="flex flex-wrap justify-between md:justify-end items-center gap-2 md:gap-4 w-full">
            {/* Export Button */}
            <MenuActionButton
              label="Export"
              iconLight="./exportIconLight.png"
              iconDark="./exportIconDark.png"
              iconPos="left"
              menuOptions={exportMenuOptions}
              labelClass="font-normal md:font-bold"
              buttonClass="flex items-center justify-center gap-2 text-[10px] md:text-[12px] h-[35px] md:h-[45px] w-auto px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
              menuClass="mt-2 w-[104px] p-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C]"
              iconClass="w-[14px] md:w-[16px] h-[14px] md:h-[16px]"
            />
            {/* RangeCalendar */}
            <div className="w-auto h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] flex items-center justify-center">
              <RangeCalendar
                icon="pi pi-calendar"
                placeholder="Select date range"
                labelClass="font-normal md:font-bold"
                buttonStyling="h-[35px] md:h-[45px] w-auto text-[10px] md:text-[12px] px-4 rounded-md"
                gapClasses="gap-1 sm:gap-2"
                dropdownClass="
                                  w-[340px] sm:w-[420px] text-[8px] sm:text-xs overflow-hidden
                                  left-[unset] sm:left-0 -translate-x-24
                                  md:left-auto md:right-0 md:translate-x-0
                                "
              />
            </div>

            {/* Refresh Button */}
            <ActionButton
              label="Refresh"
              iconLight="./refreshIcon.png"
              iconDark="./refreshIcon.png"
              iconPos="left"
              labelClass="font-normal md:font-bold"
              buttonClass="flex items-center justify-center gap-2 text-[10px] md:text-[12px] h-[35px] md:h-[45px] w-auto px-4 bg-white text-[#0088D1] dark:bg-[#0D0D0D] dark:text-[#0088D1] border border-[#0088D1] focus:outline-none focus:ring-0"
              iconClass="w-[14px] md:w-[16px] h-[14px] md:h-[16px]"
              onClick={handleRefresh}
            />
          </div>
        </div>

        {/* table */}
        <div className="bg-white dark:bg-[#000000] rounded-lg p-4 h-auto">
          <div className="flex flex-col md:flex-row gap-2 items-center w-full">
            <div className="flex flex-col gap-1 w-full">
              <h2 className="text-[#333333] dark:text-[#EEF8FD] font-bold text-[16px] lg:text-[18px]">
                {tabTitles[0].heading}
              </h2>
              <p className="text-[12px] lg:text-[14px] text-[#666666] dark:text-[#EEF8FD]">
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
            <DataTable
              value={pagedRows}
              paginator={false}
              className="p-datatable-sm w-full my-delete-table"
              rowClassName={() =>
                "border-b border-[#6E7A8626] text-[13px] text-[#666666] dark:text-[#EEF8FD] dark:bg-black whitespace-nowrap"
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

        <div className="pb-5"></div>
      </div>
    </>
  );
}
