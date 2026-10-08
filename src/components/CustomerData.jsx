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
  EditCustomerModal,
  PreviewCustomerModal,
  MenuActionButton,
} from "@/common/imports";

const tabTitles = [
  {
    heading: "Customer Management",
    subheading: "Real-time data on customers and manage customers.",
  },
];

const dataSets = [
  {
    customer: "Shraiy Gupta",
    postCode: "L24/MK42",
    product: "Milk 5 Chocolate  6x20",
    category: "Straws",
    SKU: "QM050108",
    weight: "5 * 6g",
    approvePrice: "£0.43",
    paymentTerm: "7 Days",
    shelfLife: 25,
  },
  {
    customer: "Shraiy Gupta",
    postCode: "L24/MK42",
    product: "Milk 5 Chocolate  6x20",
    category: "Straws",
    SKU: "QM050108",
    weight: "5 * 6g",
    approvePrice: "£0.43",
    paymentTerm: "7 Days",
    shelfLife: 25,
  },
  {
    customer: "Shraiy Gupta",
    postCode: "L24/MK42",
    product: "Milk 5 Chocolate  6x20",
    category: "Straws",
    SKU: "QM050108",
    weight: "5 * 6g",
    approvePrice: "£0.43",
    paymentTerm: "7 Days",
    shelfLife: 25,
  },
  {
    customer: "Shraiy Gupta",
    postCode: "L24/MK42",
    product: "Milk 5 Chocolate  6x20",
    category: "Straws",
    SKU: "QM050108",
    weight: "5 * 6g",
    approvePrice: "£0.43",
    paymentTerm: "7 Days",
    shelfLife: 25,
  },
  {
    customer: "Shraiy Gupta",
    postCode: "L24/MK42",
    product: "Milk 5 Chocolate  6x20",
    category: "Straws",
    SKU: "QM050108",
    weight: "5 * 6g",
    approvePrice: "£0.43",
    paymentTerm: "7 Days",
    shelfLife: 25,
  },
  {
    customer: "Shraiy Gupta",
    postCode: "L24/MK42",
    product: "Milk 5 Chocolate  6x20",
    category: "Straws",
    SKU: "QM050108",
    weight: "5 * 6g",
    approvePrice: "£0.43",
    paymentTerm: "7 Days",
    shelfLife: 25,
  },
  {
    customer: "Shraiy Gupta",
    postCode: "L24/MK42",
    product: "Milk 5 Chocolate  6x20",
    category: "Straws",
    SKU: "QM050108",
    weight: "5 * 6g",
    approvePrice: "£0.43",
    paymentTerm: "7 Days",
    shelfLife: 25,
  },
  {
    customer: "Shraiy Gupta",
    postCode: "L24/MK42",
    product: "Milk 5 Chocolate  6x20",
    category: "Straws",
    SKU: "QM050108",
    weight: "5 * 6g",
    approvePrice: "£0.43",
    paymentTerm: "7 Days",
    shelfLife: 25,
  },
  {
    customer: "Shraiy Gupta",
    postCode: "L24/MK42",
    product: "Milk 5 Chocolate  6x20",
    category: "Straws",
    SKU: "QM050108",
    weight: "5 * 6g",
    approvePrice: "£0.43",
    paymentTerm: "7 Days",
    shelfLife: 25,
  },
  {
    customer: "Shraiy Gupta",
    postCode: "L24/MK42",
    product: "Milk 5 Chocolate  6x20",
    category: "Chocolate",
    SKU: "QM050108",
    weight: "5 * 6g",
    approvePrice: "£0.43",
    paymentTerm: "7 Days",
    shelfLife: 25,
  },
  {
    customer: "Shraiy Gupta",
    postCode: "L24/MK42",
    product: "Milk 5 Chocolate  6x20",
    category: "Straws",
    SKU: "QM050108",
    weight: "5 * 6g",
    approvePrice: "£0.43",
    paymentTerm: "7 Days",
    shelfLife: 25,
  },
  {
    customer: "Shraiy Gupta",
    postCode: "L24/MK42",
    product: "Milk 5 Chocolate  6x20",
    category: "Milk",
    SKU: "QM050108",
    weight: "5 * 6g",
    approvePrice: "£0.43",
    paymentTerm: "7 Days",
    shelfLife: 25,
  },
];

export default function CustomerData() {
  const { openModal, closeModal } = useModal();
  const navigate = useNavigate();

  const exportMenuOptions = menuOptions(["CSV", "Excel"]);

  const filterButtonRef = useRef(null);
  const filterPanelRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const editCustomer = () => {
    openModal(EditCustomerModal, {
      sizeClass: "w-[85%] md:w-[50%]",
    });
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

  const actionTemplate = () => (
    <div className="flex items-center gap-3">
      <div
        className="flex border border-[#09BF64] p-1 w-7 h-6 rounded items-center justify-center"
        onClick={editCustomer}
      >
        <Icon
          icon="tabler:edit"
          style={{ color: "#09BF64" }}
          className="cursor-pointer items-center justify-center"
          width={15}
          height={15}
        />
      </div>
      <div
        className="flex bg-[#09BF64] p-1 w-7 h-6 rounded items-center justify-center"
        onClick={() => {
          navigate("/customerdetail");
        }}
      >
        <Icon
          icon="lsicon:view-outline"
          style={{ color: "white" }}
          className="cursor-pointer"
          width={15}
          height={15}
        />
      </div>
    </div>
  );

  const columns = useMemo(
    () => [
      { field: "customer", header: "Customer" },
      { field: "postCode", header: "Post Code" },
      { field: "product", header: "Product" },
      { field: "category", header: "Category" },
      { field: "SKU", header: "SKU" },
      { field: "weight", header: "Weight" },
      { field: "approvePrice", header: "Approved Price" },
      { field: "paymentTerm", header: "Payment Term" },
      { field: "shelfLife", header: "Shelf Life (Months)" },
      { field: "action", header: "Action", body: actionTemplate },
    ],
    []
  );

  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(false);

  // ✅ By default select all columns
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((c) => c.field)
  );

  const [tempVisibleColumns, setTempVisibleColumns] = useState(
    columns.map((c) => c.field)
  );

  // 3. Open popup handler
  const openCustomize = () => {
    setTempVisibleColumns([...visibleColumns]);
    setCustomizeOpen(true);
    setLoadingSkeleton(true);
    setTimeout(() => {
      setLoadingSkeleton(false);
    }, 2000); // show skeleton for 2 sec
  };

  // 4. Toggle checkbox inside popup
  const toggleTempColumn = (field) => {
    setTempVisibleColumns((prev) =>
      prev.includes(field) ? prev.filter((c) => c !== field) : [...prev, field]
    );
  };

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

  const CustomerTableSkeleton = () => (
    <div className="pt-4 space-y-4 relative">
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
            <div>
              <Skeleton
                width="104px"
                height="40px"
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="pt-6 overflow-x-auto w-full ">
          {/* Table Header */}
          <div className="flex gap-4 mb-2 justify-between">
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
              <div key={rowIdx} className="flex gap-4 justify-between">
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
    </div>
  );

  if (isLoading) {
    return <CustomerTableSkeleton />;
  }

  return (
    <div className="pt-4 space-y-4 relative">
      {/* Table */}
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
                      onClick={resetAllFilters}
                    />

                    <ActionButton
                      label="Apply Filter"
                      labelClass="font-normal"
                      buttonClass="flex items-center justify-center gap-1 text-[10px] w-full h-[35px] px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-black border-none focus:outline-none focus:ring-0"
                      onClick={applyTempFilters}
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              <ActionButton
                label="Customize Columns"
                buttonClass="flex items-center justify-center gap-1 text-sm h-[40px] w-[175px] px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0 whitespace-nowrap"
                onClick={openCustomize}
              />

              {customizeOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[999] bg-black bg-opacity-70">
                  <div className="bg-white dark:bg-[#0D0D0D] rounded-lg shadow-lg p-6 w-[600px] relative">
                    {loadingSkeleton ? (
                      // 🔹 Skeleton Layout
                      <div>
                        {/* Header skeleton */}
                        <div className="mb-4">
                          <Skeleton
                            width="150px"
                            height="20px"
                            className="dark:bg-[#2C2C2CAA]"
                          />
                        </div>

                        {/* Checkbox grid skeleton (3 per row) */}
                        <div className="grid grid-cols-3 gap-x-8 gap-y-6 mb-6">
                          {columns.map((_, idx) => (
                            <div key={idx} className="flex items-center">
                              <Skeleton
                                shape="square"
                                width="16px"
                                height="16px"
                                className="mr-2 dark:bg-[#2C2C2CAA]"
                              />
                              <Skeleton
                                width="80px"
                                height="14px"
                                className="dark:bg-[#2C2C2CAA]"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Footer buttons skeleton */}
                        <div className="flex justify-between w-full mt-4 gap-3">
                          <Skeleton
                            width="100%"
                            height="40px"
                            className="dark:bg-[#2C2C2CAA]"
                          />
                          <Skeleton
                            width="100%"
                            height="40px"
                            className="dark:bg-[#2C2C2CAA]"
                          />
                        </div>
                      </div>
                    ) : (
                      // 🔹 Actual popup content
                      <>
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-[16px] font-semibold text-[#0F2418] dark:text-[#EFFBF3]">
                            Remove / Add Columns
                          </h3>
                        </div>

                        {/* Checkbox Grid */}
                        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                          {columns.map((col) => {
                            const isChecked = tempVisibleColumns.includes(
                              col.field
                            );
                            return (
                              <label
                                key={col.field}
                                className="flex items-center text-sm text-[#6F7C74] dark:text-[#EFFBF3] cursor-pointer whitespace-nowrap"
                                onClick={() => toggleTempColumn(col.field)}
                              >
                                <span
                                  className={`relative w-4 h-4 border rounded-sm mr-2 flex items-center justify-center
                      ${
                        isChecked
                          ? "bg-[#09BF64] border-[#09BF64]"
                          : "bg-white border-gray-400 dark:bg-black dark:border-[#A9C2B3]"
                      }`}
                                >
                                  {isChecked && (
                                    <svg
                                      className="w-3 h-3 text-white pointer-events-none"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </span>
                                {col.header}
                              </label>
                            );
                          })}
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-between w-full mt-4 gap-3">
                          <ActionButton
                            label="Cancel"
                            buttonClass="flex items-center justify-center gap-1 text-sm h-[40px] w-full px-4 
                bg-white text-[#09BF64] dark:bg-[#0D0D0D] 
                border border-[#09BF64] focus:outline-none focus:ring-0 whitespace-nowrap"
                            onClick={() => setCustomizeOpen(false)}
                          />
                          <ActionButton
                            label="Save"
                            buttonClass="flex items-center justify-center gap-1 text-sm h-[40px] w-full px-4 
                bg-[#09BF64] text-white dark:text-black 
                focus:outline-none focus:ring-0 whitespace-nowrap"
                            onClick={() => {
                              setVisibleColumns(tempVisibleColumns);
                              setCustomizeOpen(false);
                            }}
                          />
                        </div>
                      </>
                    )}
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
              "border-b border-[#6F7C7426] text-[13px] text-[#666666] dark:text-[#EFFBF3] dark:bg-black whitespace-nowrap"
            }
            emptyMessage={
              <div className="py-4 bg-white text-black dark:bg-black dark:text-white">
                No Data.
              </div>
            }
          >
            {columns
              .filter((col) => visibleColumns.includes(col.field))
              .map((col, idx) => (
                <Column
                  key={idx}
                  field={col.field}
                  header={col.header}
                  body={(rowData) =>
                    col.body ? col.body(rowData) : rowData[col.field]
                  }
                  headerClassName="text-[12px] text-[#33333380] dark:text-[#8E8E9C] dark:bg-black font-semibold bg-white whitespace-nowrap"
                  style={{ width: `${100 / visibleColumns.length}%` }}
                />
              ))}
          </DataTable>
        </div>

        {/* Your existing CustomPaginator */}
        <CustomPaginator
          totalPages={Math.ceil(filteredData.length / rowsPerPage)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          maxButtons={5}
        />
      </div>
    </div>
  );
}
