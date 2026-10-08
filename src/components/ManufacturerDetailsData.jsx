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
  Skeleton,
  MenuActionButton,
} from "@/common/imports";

const tabTitles = [
  {
    heading: "Orders",
    subheading: "Real-time data on customers and manage customers.",
  },
];

const dataSets = [
  {
    po: "#2464345",
    noOfProducts: 3,
    qty: 22,
    price: "€43",
    createdBy: "Abhiraj Singh",
    approvedBy: "Not Approved",
    status: "Delivered",
    actions: "View Details",
  },
  {
    po: "#2464345",
    noOfProducts: 3,
    qty: 22,
    price: "€43",
    createdBy: "Abhiraj Singh",
    approvedBy: "Kapil Dev",
    status: "Pending",
    actions: "View Details",
  },
  {
    po: "#2464345",
    noOfProducts: 3,
    qty: 22,
    price: "€43",
    createdBy: "Abhiraj Singh",
    approvedBy: "Not Approved",
    status: "Cancelled",
    actions: "View Details",
  },
  {
    po: "#2464345",
    noOfProducts: 3,
    qty: 22,
    price: "€43",
    createdBy: "Abhiraj Singh",
    approvedBy: "Kapil Dev",
    status: "In Transit",
    actions: "View Details",
  },
  {
    po: "#2464345",
    noOfProducts: 3,
    qty: 22,
    price: "€43",
    createdBy: "Abhiraj Singh",
    approvedBy: "Not Approved",
    status: "Delivered",
    actions: "View Details",
  },
  {
    po: "#2464345",
    noOfProducts: 3,
    qty: 22,
    price: "€43",
    createdBy: "Abhiraj Singh",
    approvedBy: "Kapil Dev",
    status: "In Transit",
    actions: "View Details",
  },
  {
    po: "#2464345",
    noOfProducts: 3,
    qty: 22,
    price: "€43",
    createdBy: "Abhiraj Singh",
    approvedBy: "Not Approved",
    status: "Cancelled",
    actions: "View Details",
  },
  {
    po: "#2464345",
    noOfProducts: 3,
    qty: 22,
    price: "€43",
    createdBy: "Abhiraj Singh",
    approvedBy: "Not Approved",
    status: "Pending",
    actions: "View Details",
  },
  {
    po: "#2464345",
    noOfProducts: 3,
    qty: 22,
    price: "€43",
    createdBy: "Abhiraj Singh",
    approvedBy: "Not Approved",
    status: "Delivered",
    actions: "View Details",
  },
  {
    po: "#2464345",
    noOfProducts: 3,
    qty: 22,
    price: "€43",
    createdBy: "Abhiraj Singh",
    approvedBy: "Not Approved",
    status: "Delivered",
    actions: "View Details",
  },
  {
    po: "#2464345",
    noOfProducts: 3,
    qty: 22,
    price: "€43",
    createdBy: "Abhiraj Singh",
    approvedBy: "Not Approved",
    status: "Delivered",
    actions: "View Details",
  },
];

const filterableColumns = ["approvedBy", "status"]; // you requested this

export default function ManufacturerDetailsData() {
  const { openModal, closeModal } = useModal();
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
  const rowsPerPage = 5;

  // "applied" filters (what is currently active)
  const [filters, setFilters] = useState({}); // e.g. { status: ['Resolved'] }

  // filter panel open state & temporary values while panel is open
  const [tempFilters, setTempFilters] = useState({}); // temporary holder for checkboxes

  useEffect(() => setCurrentPage(0), [filters, globalFilter]);

  const rawData = dataSets;

  const uniqueFilterValues = useMemo(
    () => ({
      status: [...new Set(rawData.map((r) => r.status).filter(Boolean))],
      approvedBy: [
        ...new Set(rawData.map((r) => r.approvedBy).filter(Boolean)),
      ],
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

  const columns = useMemo(
    () => [
      { field: "po", header: "PO" },
      { field: "noOfProducts", header: "No. of Productss" },
      { field: "qty", header: "Qty(Cartons)" },
      { field: "price", header: "Price" },
      { field: "createdBy", header: "Created By" },
      { field: "approvedBy", header: "Approved By" },
      { field: "status", header: "Status", body: statusTemplate },
      {
        field: "actions",
        header: "Actions",
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

  const filteredData = useMemo(() => {
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

      return passesCheckboxFilter && passesSearch;
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

  if (isLoading) {
    return (
      <div className="pt-4 space-y-4 relative">
        {/* Skeleton for Filter + Search + Export section */}
        <div className="bg-white dark:bg-[#000000] rounded-lg p-4 h-auto">
          {/* Header Titles */}
          <div className="flex flex-col md:flex-row gap-2 items-center w-full">
            <div className="flex flex-col gap-1 w-full">
              <Skeleton
                className="dark:bg-[#2C2C2CAA]"
                width="150px"
                height="30px"
              />
              <Skeleton
                className="dark:bg-[#2C2C2CAA]"
                width="200px"
                height="15px"
              />
            </div>

            {/* Search + Buttons */}
            <div className="flex flex-col md:flex-row justify-end items-start lg:items-end gap-4 w-full">
              {/* Search */}
              <Skeleton
                className="dark:bg-[#2C2C2CAA]"
                width="250px"
                height="45px"
                borderRadius="9999px"
              />
              {/* Filter Button */}
              <Skeleton
                className="dark:bg-[#2C2C2CAA]"
                width="100px"
                height="45px"
                borderRadius="8px"
              />
              {/* Export Button */}
              <Skeleton
                className="dark:bg-[#2C2C2CAA]"
                width="104px"
                height="45px"
                borderRadius="8px"
              />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="pt-6 overflow-x-auto w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {Array.from({ length: columns.length }).map((_, idx) => (
                    <th key={idx} className="px-2 py-2">
                      <Skeleton
                        className="dark:bg-[#2C2C2CAA]"
                        width="80%"
                        height="20px"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 9 }).map((_, rowIdx) => (
                  <tr key={rowIdx}>
                    {Array.from({ length: columns.length }).map((_, colIdx) => (
                      <td key={colIdx} className="px-2 py-2">
                        <Skeleton
                          className="dark:bg-[#2C2C2CAA]"
                          width="90%"
                          height="20px"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="dark:bg-[#2C2C2CAA]"
                width="30px"
                height="30px"
                borderRadius="50%"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="pt-4 space-y-4 relative">
      {/* Filter + Search + Export */}
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

                  {/* Buttons */}
                  <div className="flex flex-row justify-between mt-3 gap-2">
                    <ActionButton
                      label="Reset"
                      labelClass="font-normal"
                      buttonClass="flex items-center justify-center gap-1 text-[10px] h-[35px] w-full px-4 bg-white text-[#09BF64] dark:bg-[#0D0D0D] dark:text-[#09BF64] border border-[#09BF64] focus:outline-none focus:ring-0"
                      onClick={() => {
                        setTempFilters({});
                        setFilters({});
                      }}
                    />

                    <ActionButton
                      label="Apply Filter"
                      labelClass="font-normal"
                      buttonClass="flex items-center justify-center gap-1 text-[10px] w-full h-[35px] px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-black border-none focus:outline-none focus:ring-0"
                      onClick={() => {
                        setFilters(tempFilters);
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
                    ? { width: "20%" }
                    : { width: `${80 / (columns.length - 1)}%` }
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
  );
}
