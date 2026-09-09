import { DateRange } from "react-date-range";
import {
  format,
  parse,
  isWithinInterval,
  startOfDay,
  endOfDay,
  isValid,
} from "date-fns";
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
  Skeleton,
  RangeCalendar,
  MenuActionButton,
} from "@/common/imports";

const tabTitles = [
  {
    heading: "Notification",
    subheading: "Real-time data on notification provide by system.",
  },
];

const dataSets = [
  {
    date: "12/01/2025",
    type: "Invoice Paid",
    message: "Invoice #98765 has been successfully paid.",
    action: "View Details",
  },
  {
    date: "12/01/2025",
    type: "Order Delayed",
    message: "Invoice #98765 has been successfully paid.",
    action: "View Details",
  },
  {
    date: "12/01/2025",
    type: "Warnings",
    message: "Invoice #98765 has been successfully paid.",
    action: "View Details",
  },
  {
    date: "12/01/2025",
    type: "Invoice Paid",
    message: "Invoice #98765 has been successfully paid.",
    action: "View Details",
  },
  {
    date: "12/01/2025",
    type: "Warnings",
    message: "Invoice #98765 has been successfully paid.",
    action: "View Details",
  },
  {
    date: "12/01/2025",
    type: "Order Delayed",
    message: "Invoice #98765 has been successfully paid.",
    action: "View Details",
  },
  {
    date: "12/01/2025",
    type: "Invoice Paid",
    message: "Invoice #98765 has been successfully paid.",
    action: "View Details",
  },
  {
    date: "12/01/2025",
    type: "Invoice Paid",
    message: "Invoice #98765 has been successfully paid.",
    action: "View Details",
  },
  {
    date: "12/01/2025",
    type: "Invoice Paid",
    message: "Invoice #98765 has been successfully paid.",
    action: "View Details",
  },
  {
    date: "12/01/2025",
    type: "Warnings",
    message: "Invoice #98765 has been successfully paid.",
    action: "View Details",
  },
  {
    date: "12/01/2025",
    type: "Invoice Paid",
    message: "Invoice #98765 has been successfully paid.",
    action: "View Details",
  },
  {
    date: "12/01/2025",
    type: "Invoice Paid",
    message: "Invoice #98765 has been successfully paid.",
    action: "View Details",
  },
  {
    date: "12/01/2025",
    type: "Invoice Paid",
    message: "Invoice #98765 has been successfully paid.",
    action: "View Details",
  },
  {
    date: "12/01/2025",
    type: "Invoice Paid",
    message: "Invoice #98765 has been successfully paid.",
    action: "View Details",
  },
  {
    date: "12/01/2025",
    type: "Invoice Paid",
    message: "Invoice #98765 has been successfully paid.",
    action: "View Details",
  },
];

const filterableColumns = ["type"];

export default function Notification() {
  const { openModal, closeModal } = useModal();
  const exportMenuOptions = menuOptions(["CSV", "Excel"]);
  const [key, setKey] = useState(0);

  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // --- local UI / filter state ---
  const [globalFilter, setGlobalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 9;

  // "applied" filters (what is currently active)
  const [filters, setFilters] = useState({}); // e.g. { status: ['Resolved'] }

  // filter panel open state & temporary values while panel is open
  const [filterOpen, setFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({}); // temporary holder for checkboxes

  // reset page when filters/search/date change
  useEffect(() => setCurrentPage(0), [filters, globalFilter]);

  const rawData = dataSets;

  // unique filter values (status) — computed from rawData
  const uniqueFilterValues = useMemo(
    () => ({
      type: [...new Set(rawData.map((r) => r.type).filter(Boolean))],
    }),
    [rawData]
  );

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

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

  // Define columns per tab
  const TypeIcon = (rowData) => {
    const typeIcons = {
      Warnings: "ion:warning",
      "Invoice Paid": "mingcute:checkbox-fill",
      "Order Delayed": "fluent:hexagon-16-filled",
    };

    const iconClasses = {
      Warnings: "text-yellow-500 w-5 h-5",
      "Invoice Paid": "text-green-500 w-5 h-5",
      "Order Delayed": "text-red-500 w-5 h-5",
    };

    const Type = rowData.type;

    return (
      <div className="flex items-center gap-2">
        <Icon
          icon={typeIcons[Type]}
          alt={Type}
          className={`object-contain ${iconClasses[Type] || ""}`}
        />
        <span>{Type}</span>
      </div>
    );
  };

  const actionTemplate = (rowData) => {
    return (
      <button
        type="button"
        className="flex items-center gap-2 bg-[#5D5FEF] dark:bg-[#7476F1]
                   text-white dark:text-black 
                   px-3 py-1 rounded text-[11px] font-medium h-[28px]"
      >
        <Icon
          icon="hugeicons:view"
          width={14}
          height={14}
          className="text-white dark:text-black"
        />
        View Details
      </button>
    );
  };

  const columns = useMemo(
    () => [
      { field: "date", header: "Date" },
      { field: "type", header: "Type", body: TypeIcon },
      { field: "message", header: "Message" },
      { field: "action", header: "Action", body: actionTemplate },
    ],
    []
  );

  // Filtering logic
  const filteredData = useMemo(() => {
    return rawData.filter((row) => {
      // column filters (checkboxes)
      const passesFilter = Object.entries(filters).every(([field, selected]) =>
        selected && selected.length ? selected.includes(row[field]) : true
      );

      // global search — searchable fields
      const passesSearch = globalFilter
        ? ["date", "type", "message"].some((k) =>
            row[k]
              ?.toString()
              .toLowerCase()
              .includes(globalFilter.toLowerCase())
          )
        : true;

      return passesFilter && passesSearch;
    });
  }, [rawData, filters, globalFilter]);

  // pagination
  const pagedRows = filteredData.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  // filter panel handlers
  const openFilterPanel = () => {
    setTempFilters(filters || {});

    setFilterOpen(true);
  };

  const applyTempFilters = () => {
    setFilters(tempFilters || {});

    setFilterOpen(false);
    setCurrentPage(0);
  };

  const resetAllFilters = () => {
    setTempFilters({});
    setFilters({});
    setFilterOpen(false);
    setCurrentPage(0);
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // show skeleton
    const timer = setTimeout(() => setIsLoading(false), 2000); // simulate loading
    return () => clearTimeout(timer);
  }, [key]);

  if (isLoading) {
    return (
      <div className="flex-1 pl-3 pr-3 pt-4 bg-gray-50 dark:bg-[#141414]">
        {/* Row 1: Main Dashboard Skeleton */}
        <div className="flex lg:flex-row justify-between items-center mb-4 gap-2">
          {/* Title (Hidden below lg) */}
          <Skeleton
            width="100px"
            height="20px"
            className="hidden lg:block dark:bg-[#2C2C2CAA]"
          />

          {/* Buttons Container */}
          <div className="flex flex-row justify-between md:justify-end items-center gap-2 w-full">
            {/* RangeCalendar */}
            <Skeleton
              width="140px"
              height="45px"
              className="dark:bg-[#2C2C2CAA] rounded-md"
            />

            {/* Refresh Button */}
            <Skeleton
              width="100px"
              height="45px"
              className="dark:bg-[#2C2C2CAA] rounded-md"
            />

            {/* Mark all as read Button */}
            <Skeleton
              width="130px"
              height="45px"
              className="dark:bg-[#2C2C2CAA] rounded-md"
            />

            {/* Clear all Button */}
            <Skeleton
              width="100px"
              height="45px"
              className="dark:bg-[#2C2C2CAA] rounded-md"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-[#000000] rounded-lg p-4 h-auto">
          {/* Header Row Skeleton */}
          <div className="flex flex-col md:flex-row gap-2 items-center w-full">
            <div className="flex flex-col gap-1 w-full">
              <Skeleton
                width="150px"
                height="20px"
                className="dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="200px"
                height="16px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
            <div className="flex flex-col md:flex-row justify-end items-start lg:items-end gap-4 w-full">
              {/* SearchBox */}
              <Skeleton
                width="250px"
                height="36px"
                className="dark:bg-[#2C2C2CAA] rounded-2xl"
              />
              {/* Buttons */}
              <Skeleton
                width="100px"
                height="40px"
                className="dark:bg-[#2C2C2CAA] rounded-md"
              />
              <Skeleton
                width="104px"
                height="40px"
                className="dark:bg-[#2C2C2CAA] rounded-md"
              />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="pt-6 overflow-x-auto w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <th key={idx} className="p-2">
                      <Skeleton
                        width="100px"
                        height="18px"
                        className="dark:bg-[#2C2C2CAA]"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 9 }).map((_, rowIdx) => (
                  <tr key={rowIdx}>
                    {Array.from({ length: 4 }).map((_, colIdx) => (
                      <td key={colIdx} className="p-2">
                        <Skeleton
                          width="100%"
                          height="18px"
                          className="dark:bg-[#2C2C2CAA]"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginator Skeleton */}
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton
                key={idx}
                width="32px"
                height="32px"
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
      {/* Main  Dashboard */}
      <div className="flex-1 pl-3 pr-3 pt-4 bg-gray-50 dark:bg-[#141414]">
        {/* Row 1: Main Dashboard */}
        <div className="flex lg:flex-row justify-between items-center mb-4 gap-2">
          {/* Title (Hidden below lg) */}
          <h1 className="hidden lg:block text-[14px] font-semibold text-[#5D5FEF] dark:text-[#5D5FEF]">
            Notification
          </h1>

          {/* Buttons Container */}
          <div className="flex flex-wrap justify-between md:justify-end items-center gap-2 w-full">
            {/* RangeCalendar */}
            <div className="w-auto h-[35px] md:h-[45px] flex items-center justify-center">
              <RangeCalendar
                icon="pi pi-calendar"
                placeholder="Select date range"
                labelClass="font-normal md:font-bold"
                gapClasses="gap-1 sm:gap-2"
                dropdownClass="
                      w-[340px] sm:w-[420px] text-[8px] sm:text-xs overflow-hidden
                      left-[unset] sm:left-0 translate-x-0
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
              buttonClass="flex items-center justify-center gap-2 text-[9px] md:text-[12px] h-[24px] md:h-[45px] w-auto px-1 md:px-4 bg-white text-[#5D5FEF] dark:bg-[#0D0D0D] dark:text-[#5D5FEF] border border-[#5D5FEF] focus:outline-none focus:ring-0"
              iconClass="w-[12px] md:w-[16px] h-[12px] md:h-[16px]"
              onClick={handleRefresh}
            />

            {/*Mark all as read Button */}
            <ActionButton
              label="Mark all as read"
              iconLight={
                <Icon
                  icon="charm:tick"
                  className="text-white dark:text-black w-[12px] md:w-[15px] h-[12px] md:h-[15px]"
                />
              }
              iconDark={
                <Icon
                  icon="charm:tick"
                  className="text-white dark:text-black w-[12px] md:w-[15px] h-[12px] md:h-[15px]"
                />
              }
              labelClass="font-normal md:font-bold"
              buttonClass="flex items-center justify-center gap-2 text-[9px] md:text-[12px] h-[24px] md:h-[45px] w-auto px-1 md:px-4 bg-[#5D5FEF] text-white dark:bg-[#7476F1] dark:text-black border border-[#5D5FEF] focus:outline-none focus:ring-0"
            />

            {/* Clear all Button */}
            <ActionButton
              label="Clear all"
              iconLight={
                <Icon
                  icon="radix-icons:cross-2"
                  className="text-white dark:text-black w-[12px] md:w-[15px] h-[12px] md:h-[15px]"
                />
              }
              iconDark={
                <Icon
                  icon="radix-icons:cross-2"
                  className="text-white dark:text-black w-[14px] md:w-[20px] h-[14px] md:h-[20px]"
                />
              }
              labelClass="font-normal md:font-bold"
              buttonClass="flex items-center justify-center gap-2 text-[9px] md:text-[12px] h-[24px] md:h-[45px] w-auto px-1 md:px-4 bg-[#5D5FEF] text-white dark:bg-[#7476F1] dark:text-black border border-[#5D5FEF] focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* table */}
        <div className="bg-white dark:bg-[#000000] rounded-lg p-4 h-auto">
          <div className="flex flex-col md:flex-row gap-2 items-center w-full">
            <div className="flex flex-col gap-1 w-full">
              <h2 className="text-[#333333] dark:text-[#F2F2FE] font-bold text-[16px] lg:text-[18px]">
                {tabTitles[0].heading}
              </h2>
              <p className="text-[12px] lg:text-[14px] text-[#666666] dark:text-[#F2F2FE]">
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
                      setTempFilters(filters || {});
                    }
                    setFilterOpen((v) => !v);
                  }}
                />

                <ActionButton
                  label="Export"
                  iconLight="./exportIconLight.png"
                  iconDark="./exportIconDark.png"
                  iconPos="left"
                  menuOptions={exportMenuOptions}
                  buttonClass="flex items-center justify-center gap-1 text-sm h-[40px] w-[104px] px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
                  menuClass="mt-2 w-[104px] p-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C]"
                  iconClass="w-[16px] h-[14px]"
                />

                {filterOpen && (
                  <div
                    className="absolute top-full mt-1 w-64 bg-white dark:bg-[#0D0D0D] shadow-lg rounded-lg  p-4 z-50 left-0 md:left-auto md:right-0"
                    style={{ minWidth: "16rem" }} // fixed width 16rem
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
                        return (
                          <div key={field} className="mb-3">
                            <h4 className="font-semibold text-[12px] text-[#151D48] dark:text-[#F2F2FE] mb-2 capitalize">
                              {field}
                            </h4>
                            {values.map((val) => (
                              <label
                                key={val}
                                className="flex items-center gap-2 mb-1 text-[12px] text-[#737791CC] dark:text-[#F2F2FECC] cursor-pointer select-none"
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    tempFilters[field]?.includes(val) || false
                                  }
                                  onChange={() => toggleTempValue(field, val)}
                                  className="hidden peer"
                                />
                                <span className="w-3.5 h-3.5 rounded border border-[#737791CC] peer-checked:bg-[#5D5FEF] peer-checked:border-[#5D5FEF] relative flex items-center justify-center">
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

                    {/* Buttons */}
                    <div className="flex flex-row justify-between mt-3 gap-2">
                      <ActionButton
                        label="Reset"
                        labelClass="font-normal"
                        buttonClass="flex items-center justify-center gap-1 text-[10px] h-[35px] w-full px-4 bg-white text-[#5D5FEF] dark:bg-[#0D0D0D] dark:text-[#5D5FEF] border border-[#5D5FEF] focus:outline-none focus:ring-0"
                        onClick={resetAllFilters}
                      />

                      <ActionButton
                        label="Apply Filter"
                        labelClass="font-normal"
                        buttonClass="flex items-center justify-center gap-1 text-[10px] w-full h-[35px] px-4 bg-[#5D5FEF] text-white dark:bg-[#7476F1] dark:text-black border-none focus:outline-none focus:ring-0"
                        onClick={applyTempFilters}
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
                  style={{ width: `${10 / columns.length}%` }}
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
