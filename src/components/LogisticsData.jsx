import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useNavigate } from "react-router-dom";
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
  Skeleton,
  FeedbackDetailModal,
  MenuActionButton,
} from "@/common/imports";

const tabTitles = [
  {
    heading: "Delivery Details",
    subheading: "Real-time data on delivery and manage logistics.",
  },
];

const dataSets = [
  {
    orderId: "UA7345",
    destination: "Noida, India",
    routeName: "Route 21 - South Zone",
    carrier: "FedEx",
    deliverySchedule: "12/01/2025, 11pm",
    Status: "Delivered",
    location: "View Details",
  },
  {
    orderId: "UA7345",
    destination: "Noida, India",
    routeName: "Route 21 - South Zone",
    carrier: "FedEx",
    deliverySchedule: "12/01/2025, 11pm",
    Status: "Pending",
    location: "View Details",
  },
  {
    orderId: "UA7345",
    destination: "Noida, India",
    routeName: "Route 21 - South Zone",
    carrier: "FedEx",
    deliverySchedule: "12/01/2025, 11pm",
    Status: "In Transit",
    location: "View Details",
  },
  {
    orderId: "UA7345",
    destination: "Noida, India",
    routeName: "Route 21 - South Zone",
    carrier: "FedEx",
    deliverySchedule: "12/01/2025, 11pm",
    Status: "Delivered",
    location: "View Details",
  },
  {
    orderId: "UA7345",
    destination: "Noida, India",
    routeName: "Route 21 - South Zone",
    carrier: "FedEx",
    deliverySchedule: "12/01/2025, 11pm",
    Status: "Delivered",
    location: "View Details",
  },
  {
    orderId: "S4374785",
    destination: "Noida, India",
    routeName: "Route 21 - South Zone",
    carrier: "FedEx",
    deliverySchedule: "12/01/2025, 11pm",
    Status: "Delayed",
    location: "View Details",
  },
  {
    orderId: "S4374785",
    destination: "Noida, India",
    routeName: "Route 21 - South Zone",
    carrier: "FedEx",
    deliverySchedule: "12/01/2025, 11pm",
    Status: "Delivered",
    location: "View Details",
  },
  {
    orderId: "UA7345",
    destination: "Noida, India",
    routeName: "Route 21 - South Zone",
    carrier: "FedEx",
    deliverySchedule: "12/01/2025, 11pm",
    Status: "In Transit",
    location: "View Details",
  },
  {
    orderId: "UA7345",
    destination: "Noida, India",
    routeName: "Route 21 - South Zone",
    carrier: "FedEx",
    deliverySchedule: "12/01/2025, 11pm",
    Status: "Delivered",
    location: "View Details",
  },
  {
    orderId: "UA7345",
    destination: "Noida, India",
    routeName: "Route 21 - South Zone",
    carrier: "FedEx",
    deliverySchedule: "12/01/2025, 11pm",
    Status: "Pending",
    location: "View Details",
  },
  {
    orderId: "UA7345",
    destination: "Noida, India",
    routeName: "Route 21 - South Zone",
    carrier: "FedEx",
    deliverySchedule: "12/01/2025, 11pm",
    Status: "Delayed",
    location: "View Details",
  },
];

export default function LogisticsData() {
  const { openModal, closeModal } = useModal();
  const navigate = useNavigate();

  const exportMenuOptions = menuOptions(["CSV", "Excel"]);

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
  const [filters, setFilters] = useState({});

  // filter panel open state & temporary values while panel is open
  const [tempFilters, setTempFilters] = useState({});

  // reset page when filters/search/date change
  useEffect(() => setCurrentPage(0), [filters, globalFilter]);

  const rawData = dataSets;

  // unique filter values (status) — computed from rawData
  const uniqueFilterValues = useMemo(
    () => ({
      Status: [...new Set(rawData.map((r) => r.Status).filter(Boolean))],
      carrier: [...new Set(rawData.map((r) => r.carrier).filter(Boolean))],
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

  const StatusBadge = (rowData) => {
    const statusColors = {
      Delivered: "bg-[#22C55E26] text-[#22C55E]",
      "In Transit": "bg-[#2794DD26] text-[#2794DD]",
      Pending: "bg-[#DDD42726] text-[#DDD427]",
      Delayed: "bg-[#FF695B26] text-[#FF695B]",
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

  const columns = useMemo(
    () => [
      { field: "orderId", header: "Order ID" },
      { field: "destination", header: "Destination" },
      { field: "routeName", header: "Route Name" },
      { field: "carrier", header: "Carrier" },
      { field: "deliverySchedule", header: "Delivery Schedule" },
      {
        field: "Status",
        header: "Status",
        body: (r) => <StatusBadge Status={r.Status} />,
      },
      {
        field: "location",
        header: "Location",
        body: (rowData) => (
          <button
            className="w-[110px] h-[28px] flex items-center gap-1 px-3 py-1 bg-[#5D5FEF] hover:bg-[#4b4de0] text-white text-[12px] rounded dark:text-[#0D0D0D] dark:bg-[#7476F1]"
            onClick={() => navigate("/logisticdetails")}
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

  // Filtering logic
  const filteredData = useMemo(() => {
    return rawData.filter((row) => {
      // column filters (checkboxes)
      const passesFilter = Object.entries(filters).every(([field, selected]) =>
        selected && selected.length ? selected.includes(row[field]) : true
      );

      // global search — searchable fields
      const passesSearch = globalFilter
        ? [
            "orderId",
            "destination",
            "carrier",
            "Status",
            "routeName",
            "deliverySchedule",
          ].some((k) =>
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
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const TableSkeleton = () => (
    <div className="bg-white dark:bg-[#000000] rounded-lg p-4 h-auto">
      <div className="flex flex-col md:flex-row gap-2 items-center w-full">
        {/* Left Title Block */}
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

        {/* Right Controls */}
        <div className="flex flex-col md:flex-row justify-end items-start lg:items-end gap-4 w-full">
          {/* Search Box */}
          <Skeleton
            width="250px"
            height="36px"
            className="rounded-2xl dark:bg-[#2C2C2CAA]"
          />

          {/* Buttons */}
          <div className="flex flex-row gap-4 relative">
            <Skeleton
              width="100px"
              height="40px"
              className="rounded-lg dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="104px"
              height="40px"
              className="rounded-lg dark:bg-[#2C2C2CAA]"
            />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="pt-6 overflow-x-auto w-full">
        {/* Table Header */}
        <div className="flex gap-4 mb-2">
          {[...Array(columns.length)].map((_, i) => (
            <Skeleton
              key={i}
              width={`${100 / columns.length - 2}%`}
              height="20px"
              className="dark:bg-[#2C2C2CAA]"
            />
          ))}
        </div>

        {/* Table Rows */}
        <div className="flex flex-col gap-4">
          {[...Array(9)].map((_, rowIdx) => (
            <div key={rowIdx} className="flex gap-4">
              {[...Array(columns.length)].map((_, colIdx) => (
                <Skeleton
                  key={colIdx}
                  width={`${100 / columns.length - 2}%`}
                  height="16px"
                  className="dark:bg-[#2C2C2CAA]"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Paginator Skeleton */}
      <div className="flex justify-center mt-4 gap-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton
            key={i}
            width="30px"
            height="30px"
            className="rounded-md dark:bg-[#2C2C2CAA]"
          />
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="pt-4 space-y-4 relative">
        {/* Table skeleton */}
        <TableSkeleton />
      </div>
    );
  }
  return (
    <div className="pt-4 space-y-4 relative">
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
                  {Object.entries(uniqueFilterValues).map(([field, values]) => {
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
                  })}

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
            className="p-datatable-sm w-full [&_.p-datatable-tbody>tr]:dark:!bg-black"
            rowClassName={() =>
              "border-b border-[#73779126] text-[13px] text-[#666666] dark:text-[#F2F2FE] dark:bg-black whitespace-nowrap"
            }
            emptyMessage={
              <div className="py-6 text-[15px] bg-white dark:bg-black text-black dark:text-white">
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
  );
}
