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
  FilterCalendar,
  CustomPaginator,
  MenuActionButton,
  Skeleton,
} from "@/common/imports";

const tabTitles = [
  {
    heading: "Purchase History",
  },
  {
    heading: "Price Comparison",
  },
];

const dataSets = {
  purchaseHistory: [
    {
      date: "2025-2-24",
      product: "Milk 5 Chocolate 6x20",
      qty: 12,
      price: "$3,434",
      status: "Delivered",
      action: "View Details",
    },
    {
      date: "2025-2-24",
      product: "Milk 5 Chocolate 6x20",
      qty: 12,
      price: "$3,434",
      status: "Pending",
      action: "View Details",
    },
    {
      date: "2025-2-24",
      product: "Milk 5 Chocolate 6x20",
      qty: 12,
      price: "$3,434",
      status: "In Transit",
      action: "View Details",
    },
    {
      date: "2025-2-24",
      product: "Milk 5 Chocolate 6x20",
      qty: 12,
      price: "$3,434",
      status: "Cancelled",
      action: "View Details",
    },
    {
      date: "2025-2-24",
      product: "Milk 5 Chocolate 6x20",
      qty: 12,
      price: "$3,434",
      status: "Delivered",
      action: "View Details",
    },
    {
      date: "2025-2-24",
      product: "Milk 5 Chocolate 6x20",
      qty: 12,
      price: "$3,434",
      status: "Cancelled",
      action: "View Details",
    },
    {
      date: "2025-2-24",
      product: "Milk 5 Chocolate 6x20",
      qty: 12,
      price: "$3,434",
      status: "Delivered",
      action: "View Details",
    },
    {
      date: "2025-2-24",
      product: "Milk 5 Chocolate 6x20",
      qty: 12,
      price: "$3,434",
      status: "Delivered",
      action: "View Details",
    },
    {
      date: "2025-2-14",
      product: "Milk 5 Chocolate 6x20",
      qty: 12,
      price: "$3,434",
      status: "Delivered",
      action: "View Details",
    },
    {
      date: "2025-2-15",
      product: "Milk 5 Chocolate 6x20",
      qty: 12,
      price: "$3,434",
      status: "Delivered",
      action: "View Details",
    },
    {
      date: "2025-2-15",
      product: "Milk 5 Chocolate 6x20",
      qty: 12,
      price: "$3,434",
      status: "Delivered",
      action: "View Details",
    },
    {
      date: "2025-2-12",
      product: "Milk 5 Chocolate 6x20",
      qty: 12,
      price: "$3,434",
      status: "Delivered",
      action: "View Details",
    },
    {
      date: "2025-2-24",
      product: "Milk 5 Chocolate 6x20",
      qty: 12,
      price: "$3,434",
      status: "Delivered",
      action: "View Details",
    },
  ],
  priceHistory: [
    {
      product: "Milk 5 Chocolate 6x20",
      code: "SKU5453",
      weight: "5 * 6g",
      shelfLife: 12,
      oldPrice: "$3,434",
      newPrice: "$3,434",
      priceUpdated: "2025-2-14",
    },
    {
      product: "Milk 5 Chocolate 6x20",
      code: "SKU5453",
      weight: "5 * 6g",
      shelfLife: 12,
      oldPrice: "$3,434",
      newPrice: "$3,434",
      priceUpdated: "2025-2-14",
    },
    {
      product: "Milk 5 Chocolate 6x20",
      code: "SKU5453",
      weight: "5 * 6g",
      shelfLife: 12,
      oldPrice: "$3,434",
      newPrice: "$3,434",
      priceUpdated: "2025-2-12",
    },
    {
      product: "Milk 5 Chocolate 6x20",
      code: "SKU5453",
      weight: "5 * 6g",
      shelfLife: 12,
      oldPrice: "$3,434",
      newPrice: "$3,434",
      priceUpdated: "2025-2-15",
    },
    {
      product: "Milk 5 Chocolate 6x20",
      code: "SKU5453",
      weight: "5 * 6g",
      shelfLife: 12,
      oldPrice: "$3,434",
      newPrice: "$3,434",
      priceUpdated: "2025-2-24",
    },
    {
      product: "Milk 5 Chocolate 6x20",
      code: "SKU5453",
      weight: "5 * 6g",
      shelfLife: 12,
      oldPrice: "$3,434",
      newPrice: "$3,434",
      priceUpdated: "2025-2-24",
    },
    {
      product: "Milk 5 Chocolate 6x20",
      code: "SKU5453",
      weight: "5 * 6g",
      shelfLife: 12,
      oldPrice: "$3,434",
      newPrice: "$3,434",
      priceUpdated: "2025-2-24",
    },
    {
      product: "Milk 5 Chocolate 6x20",
      code: "SKU5453",
      weight: "5 * 6g",
      shelfLife: 12,
      oldPrice: "$3,434",
      newPrice: "$3,434",
      priceUpdated: "2025-2-24",
    },
    {
      product: "Milk 5 Chocolate 6x20",
      code: "SKU5453",
      weight: "5 * 6g",
      shelfLife: 12,
      oldPrice: "$3,434",
      newPrice: "$3,434",
      priceUpdated: "2025-2-24",
    },
    {
      product: "Milk 5 Chocolate 6x20",
      code: "SKU5453",
      weight: "5 * 6g",
      shelfLife: 12,
      oldPrice: "$3,434",
      newPrice: "$3,434",
      priceUpdated: "2025-2-24",
    },
    {
      product: "Milk 5 Chocolate 6x20",
      code: "SKU5453",
      weight: "5 * 6g",
      shelfLife: 12,
      oldPrice: "$3,434",
      newPrice: "$3,434",
      priceUpdated: "2025-2-24",
    },
  ],
};

const filterFields = {
  purchaseHistory: ["status", "dateRange"],
  priceHistory: ["dateRange"],
};

export default function CustomerDetailsData() {
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
  const rowsPerPage = 7;
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

  const tabKeys = ["purchaseHistory", "priceHistory"];
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
      purchaseHistory: "date",
      priceHistory: "priceUpdated",
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
      Delivered: "bg-[#22C55E26] text-[#22C55E]",
      Pending: "bg-[#DDD42726] text-[#DDD427]",
      "In Transit": "bg-[#2794DD26] text-[#2794DD]",
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

  const columns = useMemo(() => {
    switch (activeTabKey) {
      case "purchaseHistory":
        return [
          { field: "date", header: "Date" },
          { field: "product", header: "Product" },
          { field: "qty", header: "Qty(Carton)" },
          { field: "price", header: "Price" },
          { field: "status", header: "Status", body: statusTemplate },
          {
            field: "action",
            header: "Action",
            body: (rowData) => (
              <button
                className="w-[110px] h-[28px] flex items-center gap-1 px-3 py-1 bg-[#09BF64] hover:bg-[#4b4de0] text-white text-[12px] rounded dark:text-[#0D0D0D] dark:bg-[#81D959]"
                // onClick={() => navigate("/orderdetail")}
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
      case "priceHistory":
        return [
          { field: "product", header: "Product" },
          { field: "code", header: "Code" },
          { field: "weight", header: "Weight" },
          { field: "shelfLife", header: "Shelf Life(Months)" },
          { field: "oldPrice", header: "Old Price" },
          { field: "newPrice", header: "New Price" },
          { field: "priceUpdated", header: "Price Updated" },
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="p-4 space-y-4 relative bg-white dark:bg-[#000000] rounded-lg mt-8">
          {/* Tabs Skeleton */}
          <div className="inline-flex w-full md:w-auto bg-[#EFFBF3] dark:bg-[#141414] h-[48px] items-center rounded-full overflow-hidden whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
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
                <Skeleton
                  width={200}
                  height={18}
                  className="dark:bg-[#2C2C2CAA]"
                />
                <Skeleton
                  width={150}
                  height={14}
                  className="dark:bg-[#2C2C2CAA]"
                />
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
      </div>
    );
  }

  return (
    <div className="space-y-4 ">
      <div className="p-4 space-y-4 relative bg-white dark:bg-[#000000] rounded-lg mt-8">
        {/* Tabs */}
        <div className="inline-flex w-auto bg-[#EFFBF3] dark:bg-[#141414] h-[48px] items-center rounded-full overflow-hidden whitespace-nowrap">
          {["Purchase History", "Price History"].map((label, i) => (
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
          ))}
        </div>

        {/* Filter + Search + Export */}
        {/* <div className="bg-white dark:bg-[#000000] rounded-lg p-4 h-auto"> */}
        <div className="flex flex-col lg:flex-row gap-2 items-center w-full">
          <div className="flex flex-row gap-3 items-center w-full">
            <div className="flex flex-col gap-1 w-full">
              <h2 className="text-[#333333] dark:text-[#EFFBF3] font-bold text-[16px] lg:text-[18px]">
                {tabTitles[activeIndex].heading}
              </h2>
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
              <DataTable
                value={pagedRows}
                paginator={false}
                className="p-datatable-sm w-full my-delete-table"
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
                    style={{ width: `${100 / columns.length}%` }}
                  />
                ))}
              </DataTable>
            </>
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
