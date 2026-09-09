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
  DropdownButton,
  CustomPaginator,
  FlexibleCard,
  FilterCalendar,
  MenuActionButton,
  PaymentSummaryModal,
  Skeleton,
  PinWrapper,
  PreviewInvoiceModal,
  DualLineChart,
  StatusActionDropdown,
  UploadInvoiceModal,
} from "@/common/imports";

const tabTitles = [
  {
    heading: "Payment History",
    subheading: "Real-time data on profit and expense.",
  },
  {
    heading: "Invoices",
    subheading: "Real-time data on invoices.",
  },
  {
    heading: "Invoices",
    subheading: "Real-time data on invoices.",
  },
];

const AISuggestion = [
  {
    id: 1,
    title: "Unusual Spike in Expenses",
    msg: "300% higher than normal!",
  },
  {
    id: 2,
    title: "Unusual Spike in Expenses",
    msg: "300% higher than normal!",
  },
  {
    id: 3,
    title: "Invoice Payment Delay",
    msg: "From Vendor expected 5 days late.",
  },
  {
    id: 4,
    title: "Unusual Spike in Expenses",
    msg: "300% higher than normal!",
  },
];

const dataSets = {
  paymentHistory: [
    {
      date: "2025-2-08",
      paymentType: "Invoice Payment",
      category: "Sales",
      amount: "$3,434",
      statusAction: "Paid",
      status: "Paid",
      action: "View Details",
    },
    {
      date: "2025-2-08",
      paymentType: "Invoice Payment",
      category: "Sales",
      amount: "$3,434",
      statusAction: "Paid",
      status: "Pending",
      action: "View Details",
    },
    {
      date: "2025-2-08",
      paymentType: "Invoice Payment",
      category: "Sales",
      amount: "$3,434",
      statusAction: "Paid",
      status: "Paid",
      action: "View Details",
    },
    {
      date: "2025-2-08",
      paymentType: "Invoice Payment",
      category: "Sales",
      amount: "$3,434",
      statusAction: "Paid",
      status: "Paid",
      action: "View Details",
    },
    {
      date: "2025-2-08",
      paymentType: "Invoice Payment",
      category: "Sales",
      amount: "$3,434",
      statusAction: "Paid",
      status: "Pending",
      action: "View Details",
    },
    {
      date: "2025-2-08",
      paymentType: "Invoice Payment",
      category: "Expense",
      amount: "$3,434",
      statusAction: "Paid",
      status: "Paid",
      action: "View Details",
    },
    {
      date: "2025-2-08",
      paymentType: "Invoice Payment",
      category: "Sales",
      amount: "$3,434",
      statusAction: "Paid",
      status: "Paid",
      action: "View Details",
    },
    {
      date: "2025-2-13",
      paymentType: "Invoice Payment",
      category: "Sales",
      amount: "$3,434",
      statusAction: "Paid",
      status: "Paid",
      action: "View Details",
    },
    {
      date: "2025-2-14",
      paymentType: "Invoice Payment",
      category: "Expense",
      amount: "$3,434",
      statusAction: "Paid",
      status: "Paid",
      action: "View Details",
    },
    {
      date: "2025-2-15",
      paymentType: "Invoice Payment",
      category: "Sales",
      amount: "$3,434",
      statusAction: "Paid",
      status: "Paid",
      action: "View Details",
    },
  ],
  invoiceSent: [
    {
      invoice: "INV-001",
      clientName: "ABC Corp",
      amount: "$3,434",
      dueDate: "2025-2-08",
      autoBilling: "Off",
      statusAction: "Unpaid",
      status: "Pending",
      action: "View Details",
    },
    {
      invoice: "INV-001",
      clientName: "ABC Corp",
      amount: "$3,434",
      dueDate: "2025-2-08",
      autoBilling: "On",
      statusAction: "Paid",
      status: "Paid",
      action: "View Details",
    },
    {
      invoice: "INV-001",
      clientName: "ABC Corp",
      amount: "$3,434",
      dueDate: "2025-2-15",
      autoBilling: "On",
      statusAction: "Paid",
      status: "Paid",
      action: "View Details",
    },
    {
      invoice: "INV-001",
      clientName: "ABC Corp",
      amount: "$3,434",
      dueDate: "2025-2-14",
      autoBilling: "",
      statusAction: "Paid",
      status: "Pending",
      action: "View Details",
    },
    {
      invoice: "INV-001",
      clientName: "ABC Corp",
      amount: "$3,434",
      dueDate: "2025-2-12",
      autoBilling: "Off",
      statusAction: "Paid",
      status: "Pending",
      action: "View Details",
    },
    {
      invoice: "INV-001",
      clientName: "ABC Corp",
      amount: "$3,434",
      dueDate: "2025-2-08",
      autoBilling: "Off",
      statusAction: "Paid",
      status: "Pending",
      action: "View Details",
    },
  ],
  invoiceReceived: [
    {
      invoice: "INV-001",
      clientName: "ABC Corp",
      invoiceDate: "2025-2-08",
      dueDate: "2025-2-08",
      paymentTerm: "30 Days",
      paymentDue: "€43",
      VAT: "€43",
      invoiceTotal: "€43",
      notes: "02/01- Monthly retainer for licensing agent services",
      verification: "Not Verified",
      status: "Pending",
      action: "edit",
    },
    {
      invoice: "INV-001",
      clientName: "ABC Corp",
      invoiceDate: "2025-2-08",
      dueDate: "2025-2-08",
      paymentTerm: "30 Days",
      paymentDue: "€43",
      VAT: "€43",
      invoiceTotal: "€43",
      notes: "02/01- Monthly retainer for licensing agent services",
      verification: "Verified",
      status: "Paid",
      action: "edit",
    },
    {
      invoice: "INV-001",
      clientName: "ABC Corp",
      invoiceDate: "2025-2-08",
      dueDate: "2025-2-08",
      paymentTerm: "30 Days",
      paymentDue: "€43",
      VAT: "€43",
      invoiceTotal: "€43",
      notes: "02/01- Monthly retainer for licensing agent services",
      verification: "Not Verified",
      status: "Pending",
      action: "edit",
    },
    {
      invoice: "INV-001",
      clientName: "ABC Corp",
      invoiceDate: "2025-2-08",
      dueDate: "2025-2-15",
      paymentTerm: "30 Days",
      paymentDue: "€43",
      VAT: "€43",
      invoiceTotal: "€43",
      notes: "02/01- Monthly retainer for licensing agent services",
      verification: "Verified",
      status: "Paid",
      action: "edit",
    },
    {
      invoice: "INV-001",
      clientName: "ABC Corp",
      invoiceDate: "2025-2-14",
      dueDate: "2025-2-08",
      paymentTerm: "30 Days",
      paymentDue: "€43",
      VAT: "€43",
      invoiceTotal: "€43",
      notes: "02/01- Monthly retainer for licensing agent services",
      verification: "Not Verified",
      status: "Pending",
      action: "edit",
    },
    {
      invoice: "INV-001",
      clientName: "ABC Corp",
      invoiceDate: "2025-2-12",
      dueDate: "2025-2-08",
      paymentTerm: "30 Days",
      paymentDue: "€43",
      VAT: "€43",
      invoiceTotal: "€43",
      notes: "02/01- Monthly retainer for licensing agent services",
      verification: "Verified",
      status: "Paid",
      action: "edit",
    },
  ],
};

const filterFields = {
  paymentHistory: ["category", "status", "dateRange"],
  invoiceSent: ["statusAction", "status", "dateRange"],
  invoiceReceived: ["verification", "status", "dateRange"],
};

export default function AccountsData() {
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

  const tabKeys = ["paymentHistory", "invoiceSent", "invoiceReceived"];
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
      paymentHistory: "date",
      invoiceReceived: "invoiceDate",
      invoiceSent: "dueDate",
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
      Paid: "bg-[#27DDA326] text-[#27DDA3]",
      Pending: "bg-[#DDD42726] text-[#DDD427]",
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

  const verificationTemplate = (rowData) => {
    const verificationColors = {
      Verified: "bg-[#27DDA326] text-[#27DDA3]",
      "Not Verified": "bg-[#EF444426] text-[#EF4444]",
    };

    return (
      <span
        className={`flex items-center justify-center w-[100px] h-[28px] rounded text-[11px] font-medium ${
          verificationColors[rowData.verification] ||
          "bg-gray-200 text-gray-800"
        }`}
      >
        {rowData.verification}
      </span>
    );
  };

  const actionTemplate = (rowData) => {
    return (
      <button
        type="button"
        className="flex items-center gap-2 bg-[#5D5FEF] dark:bg-[#7476F1]
                 text-white dark:text-black 
                 px-3 py-1 rounded text-[11px] font-medium h-[28px]"
        onClick={handlePaymentSummary}
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

  const actionInvoiceSentTemplate = (rowData) => {
    return (
      <button
        type="button"
        className="flex items-center gap-2 bg-[#5D5FEF] dark:bg-[#7476F1]
                 text-white dark:text-black 
                 px-3 py-1 rounded text-[11px] font-medium h-[28px]"
        onClick={handlePreviewInvoice}
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

  const actionInvoiceReceivedTemplate = (rowData) => {
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
        View Invoice
      </button>
    );
  };

  const editTemplate = (rowData) => {
    return (
      <button
        type="button"
        className="flex items-center gap-2 bg-white dark:bg-black 
                   text-[#5D5FEF] dark:text-[#7476F1] 
                   border border-[#5D5FEF] dark:border-[#7476F1] 
                   px-3 py-1 rounded text-[11px] font-medium"
      >
        <Icon
          icon="tabler:edit"
          width={14}
          height={14}
          className="text-[#5D5FEF] dark:text-[#7476F1]"
        />
        Edit
      </button>
    );
  };

  const statusActionTemplate = (rowData) => {
    return (
      <StatusActionDropdown
        initialValue={rowData.statusAction || "Select"}
        options={["Paid", "Unpaid"]}
        onChange={(selected) => {
          rowData.statusAction = selected;
        }}
      />
    );
  };

  const toggleTemplate = (rowData) => {
    const [enabled, setEnabled] = React.useState(rowData.autoBilling === "On");

    const handleToggle = () => {
      const newValue = !enabled;
      setEnabled(newValue);
      rowData.autoBilling = newValue ? "On" : "Off"; // ✅ persist in row
    };

    return (
      <button
        onClick={handleToggle}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
          enabled
            ? "bg-[#5D5FEF] dark:bg-[#7476F1]"
            : "bg-gray-300 dark:bg-[#141414]"
        }`}
      >
        <div
          className={`bg-white dark:bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    );
  };

  const handlePaymentSummary = () => {
    openModal(PaymentSummaryModal, {
      sizeClass: "w-[85%] md:w-[50%]",
    });
  };

  const handleUploadInvoice = () => {
    openModal(UploadInvoiceModal, {
      sizeClass: "w-[85%] md:w-[50%]",
    });
  };

  const handlePreviewInvoice = () => {
    openModal(PreviewInvoiceModal, {
      sizeClass: "w-[85%] md:w-[50%]",
      secondButtonLabel: "Resend the Invoice",
      firstButtonLabel: "Cancel",
    });
  };

  const columns = useMemo(() => {
    switch (activeTabKey) {
      case "paymentHistory":
        return [
          { field: "date", header: "Date" },
          { field: "paymentType", header: "Payment Type" },
          { field: "category", header: "Category" },
          { field: "amount", header: "Amount" },
          {
            field: "statusAction",
            header: "Status Action",
            body: statusActionTemplate,
          },
          { field: "status", header: "Status", body: statusTemplate },
          {
            field: "action",
            header: "Action",
            body: actionTemplate,
          },
        ];
      case "invoiceSent":
        return [
          { field: "invoice", header: "Invoice" },
          { field: "clientName", header: "Client Name" },
          { field: "amount", header: "Amount" },
          { field: "dueDate", header: "Due Date" },
          {
            field: "autoBilling",
            header: "Auto Billing",
            body: toggleTemplate,
          },
          {
            field: "statusAction",
            header: "Status Action",
            body: statusActionTemplate,
          },
          { field: "status", header: "Status", body: statusTemplate },
          {
            field: "action",
            header: "Action",
            body: actionInvoiceSentTemplate,
          },
        ];
      case "invoiceReceived":
        return [
          { field: "invoice", header: "Invoice" },
          { field: "clientName", header: "Client Name" },
          { field: "invoiceDate", header: "Invoice Date" },
          { field: "dueDate", header: "Due Date" },
          { field: "paymentTerm", header: "Payment Term" },
          { field: "paymentDue", header: "Payment Due" },
          { field: "VAT", header: "VAT" },
          { field: "invoiceTotal", header: "Invoice Total" },
          { field: "notes", header: "Notes" },
          {
            field: "verification",
            header: "Verification",
            body: verificationTemplate,
          },
          { field: "status", header: "Status", body: statusTemplate },
          { field: "action", header: "Action", body: editTemplate },
          { header: "", body: actionInvoiceReceivedTemplate },
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

  const AccountBottomCardSkeleton = () => (
    <div className="flex flex-col lg:flex-row w-full gap-4 mb-2 justify-center pt-4">
      {/* Card 1: Sales Trends & Revenue */}
      <div className="flex flex-col w-full lg:w-[70%] h-[400px] bg-white dark:bg-[#2C2C2CAA] rounded-xl p-4 space-y-4">
        <Skeleton width="70%" height={24} className="dark:bg-[#2C2C2CAA]" />
        <div className="flex flex-col gap-2">
          <Skeleton
            width="60%"
            height={20}
            className="rounded dark:bg-[#2C2C2CAA]"
          />
          <Skeleton
            width="60%"
            height={20}
            className="rounded dark:bg-[#2C2C2CAA]"
          />
        </div>
        <Skeleton
          width="100%"
          height={200}
          className="rounded dark:bg-[#2C2C2CAA]"
        />
      </div>

      {/* Card 2: AI Suggestions */}
      <div className="flex flex-col w-full lg:w-[30%] bg-white dark:bg-[#2C2C2CAA] rounded-xl p-4 space-y-4">
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
              className="w-full h-auto bg-[#F2F2FE80] dark:bg-[#14141480] rounded-xl p-4 space-y-2"
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="p-4 space-y-4 relative bg-white dark:bg-[#000000] rounded-lg mt-8">
          {/* Tabs Skeleton */}
          <div className="inline-flex w-full md:w-auto bg-[#F2F2FE] dark:bg-[#141414] h-[48px] items-center rounded-full overflow-hidden whitespace-nowrap">
            {[...Array(3)].map((_, i) => (
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
                  className="flex flex-row justify-between border-b border-[#73779126] w-full gap-2"
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

        {/* Cards Skeleton Row */}
        <AccountBottomCardSkeleton />
      </div>
    );
  }

  const AccountBottomChart = () => {
    const weekData = [
      { date: "Mon", expected: 20, actual: 15 },
      { date: "Tue", expected: 25, actual: 18 },
      { date: "Wed", expected: 22, actual: 20 },
      { date: "Thu", expected: 28, actual: 24 },
      { date: "Fri", expected: 30, actual: 26 },
      { date: "Sat", expected: 35, actual: 28 },
      { date: "Sun", expected: 40, actual: 30 },
    ];

    const monthData = Array.from({ length: 30 }, (_, i) => ({
      date: `${i + 1}`,
      expected: Math.floor(Math.random() * 100),
      actual: Math.floor(Math.random() * 100),
    }));

    const yearData = [
      { date: "2024-01-05", expected: 100, actual: 30 },
      { date: "2024-01-12", expected: 90, actual: 29 },
      { date: "2024-01-20", expected: 85, actual: 29 },
      { date: "2024-01-28", expected: 94, actual: 24 },
      { date: "2024-02-05", expected: 92, actual: 26 },
      { date: "2024-02-12", expected: 95, actual: 31 },
      { date: "2024-02-20", expected: 88, actual: 30 },
      { date: "2024-02-28", expected: 87, actual: 25 },
      { date: "2024-03-05", expected: 79, actual: 19 },
      { date: "2024-03-12", expected: 84, actual: 27 },
      { date: "2024-03-20", expected: 89, actual: 29 },
      { date: "2024-03-28", expected: 90, actual: 22 },
      { date: "2024-04-05", expected: 88, actual: 28 },
      { date: "2024-04-12", expected: 83, actual: 19 },
      { date: "2024-04-20", expected: 92, actual: 27 },
      { date: "2024-04-28", expected: 88, actual: 25 },
      { date: "2024-05-05", expected: 76, actual: 30 },
      { date: "2024-05-12", expected: 71, actual: 35 },
      { date: "2024-05-20", expected: 79, actual: 40 },
      { date: "2024-05-28", expected: 86, actual: 49 },
      { date: "2024-06-05", expected: 89, actual: 56 },
      { date: "2024-06-12", expected: 95, actual: 67 },
      { date: "2024-06-20", expected: 92, actual: 77 },
      { date: "2024-06-28", expected: 83, actual: 79 },
      { date: "2024-07-05", expected: 78, actual: 80 },
      { date: "2024-07-12", expected: 73, actual: 67 },
      { date: "2024-07-20", expected: 70, actual: 73 },
      { date: "2024-07-28", expected: 67, actual: 75 },
      { date: "2024-08-05", expected: 64, actual: 71 },
      { date: "2024-08-12", expected: 61, actual: 78 },
      { date: "2024-08-20", expected: 59, actual: 67 },
      { date: "2024-08-28", expected: 51, actual: 56 },
      { date: "2024-09-05", expected: 49, actual: 53 },
      { date: "2024-09-12", expected: 43, actual: 50 },
      { date: "2024-09-20", expected: 39, actual: 44 },
      { date: "2024-09-28", expected: 32, actual: 38 },
      { date: "2024-10-05", expected: 30, actual: 37 },
      { date: "2024-10-12", expected: 28, actual: 35 },
      { date: "2024-10-20", expected: 23, actual: 27 },
      { date: "2024-10-28", expected: 35, actual: 40 },
      { date: "2024-11-05", expected: 39, actual: 45 },
      { date: "2024-11-12", expected: 42, actual: 50 },
      { date: "2024-11-20", expected: 45, actual: 50 },
      { date: "2024-11-28", expected: 50, actual: 53 },
      { date: "2024-12-05", expected: 52, actual: 57 },
      { date: "2024-12-12", expected: 52, actual: 60 },
      { date: "2024-12-20", expected: 55, actual: 63 },
      { date: "2024-12-28", expected: 56, actual: 64 },
    ];

    const [selectedRange, setSelectedRange] = useState("This Year");
    const [chartData, setChartData] = useState(yearData);

    const handleRangeChange = (option) => {
      setSelectedRange(option);

      if (option === "This Week") setChartData(weekData);
      else if (option === "This Month") setChartData(monthData);
      else setChartData(yearData);
    };
    return (
      <div className="flex flex-col lg:flex-row w-full gap-4 mb-2 justify-center pt-4">
        {/* Card 1 */}
        <FlexibleCard
          cardClass="flex flex-col w-full lg:w-[70%] h-[400px] bg-white dark:bg-black rounded-xl p-4 hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
          headerClass="flex flex-row items-center justify-between"
          centerClass="flex flex-row items-center pt-2"
          footerClass="flex items-end justify-center h-full"
          header={
            <>
              <div className="flex w-full items-center">
                <h1 className="text-[18px] font-bold text-[#151D48] dark:text-[#EEF1FF] ">
                  Projected Revenue vs. Expenses
                </h1>
              </div>
              <div className="flex gap-2">
                <DropdownButton
                  defaultOption={selectedRange}
                  options={["This Week", "This Month", "This Year"]}
                  buttonClassName="flex items-center rounded-lg justify-center gap-2 px-3 py-2 text-white dark:text-black font-bold text-[11px] h-[34px] w-[105px] bg-gradient-to-r from-[#5D5FEF] to-[#353689] border-none focus:outline-none focus:ring-0"
                  dropdownClassName="bg-white dark:bg-[#121212] h-[80px] w-[105px]"
                  optionClassName="dark:text-gray-300 dark:hover:bg-gray-800 text-[11px]"
                  onChange={(val) => {
                    console.log("Dropdown selected:", val);
                    handleRangeChange(val);
                  }}
                />
              </div>
            </>
          }
          center={
            <>
              <div className="flex flex-col gap-1">
                <h2 className="flex flex-row gap-1 text-[#2B2B2B] dark:text-[#1A9FFF] font-light text-[12px]">
                  <span>
                    <Icon
                      icon="material-symbols:rocket"
                      width="16"
                      height="18"
                      className="text-[#0096FF] dark:text-[#1A9FFF]"
                    />
                  </span>
                  Revenue will exceed expense in 2 months!
                </h2>
                <h2 className="flex flex-row gap-1 text-[#D23F0F] dark:text-[#EA4710] font-light text-[12px]">
                  <span>
                    <Icon
                      icon="heroicons-solid:exclamation"
                      width="16"
                      height="18"
                      className="text-[#D23F0F] dark:text-[#EA4710]"
                    />
                  </span>
                  Expenses will exceed revenue in 2 months!
                </h2>
              </div>
            </>
          }
          footer={
            <DualLineChart
              data={chartData}
              height={260}
              className="bg-white rounded-2xl"
              range={selectedRange}
            />
          }
        />
        {/* Card 2*/}
        <FlexibleCard
          cardClass="flex flex-col w-full lg:w-[30%] bg-white dark:bg-black rounded-xl hover:shadow-lg dark:hover:[box-shadow:2px_4px_12px_rgba(255,255,255,0.2)]"
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
                    className=" text-[#5D5FEF]"
                  />
                  <h1 className="text-[14px] text-[#737791] dark:text-[#EEF1FF] font-medium">
                    AI Powered Suggestions
                  </h1>
                </div>
              </div>
            </>
          }
          center={
            <>
              <div className="h-[310px] w-full overflow-y-auto overflow-x-hidden space-y-4 pr-2 mt-2 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#F2F2FE] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
                <div className="flex flex-col gap-4 w-full">
                  {AISuggestion.map((msg) => (
                    <FlexibleCard
                      key={msg.id}
                      cardClass="w-full h-auto bg-[#F2F2FE80] dark:bg-[#14141480] border-none rounded-xl p-4"
                      headerClass=""
                      centerClass=""
                      footerClass="flex flex-row items-center"
                      header={
                        <div className="relative flex w-full items-center">
                          <div className="flex flex-col gap-3 text-left">
                            <h3 className="text-[13px] text-[#737791] dark:text-[#A9A9CD]">
                              {msg.title}
                            </h3>
                            <h3 className="text-[15px] text-[#2B2B2B] dark:text-[#F2F2FE] font-medium">
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
        <div className="inline-flex  bg-[#F2F2FE] dark:bg-[#141414] h-[48px] items-center rounded-full overflow-hidden whitespace-nowrap">
          {["Payment History", "Invoice Sent", "Invoice Received"].map(
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
                className={`h-full text-[11px] md:text-[16px] font-medium transition-all rounded-full
        ${
          i === activeIndex
            ? "text-white dark:text-[#0D0D0D] bg-[#5D5FEF] dark:bg-[#7476F1] px-3 md:px-6"
            : "text-[#151D48] dark:text-[#D4D4D4] hover:text-[#5D5FEF] dark:hover:text-[#F2F2FE] px-3 md:px-6"
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
            <div className="flex flex-col gap-1 w-full">
              <h2 className="text-[#333333] dark:text-[#F2F2FE] font-bold text-[16px] lg:text-[18px]">
                {tabTitles[activeIndex].heading}
              </h2>
              <p className="text-[12px] lg:text-[14px] text-[#666666] dark:text-[#F2F2FE]">
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
              {activeIndex !== 2 && (
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

              {activeIndex === 2 && (
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
                      buttonClass="flex items-center justify-center gap-1 text-[10px] md:text-sm h-[40px] w-[80px] md:w-[100px] px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
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
                    buttonClass="flex items-center justify-center gap-1 text-[10px] md:text-sm h-[40px] w-[80px] md:w-[104px] px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
                    menuClass="mt-2 w-[104px] p-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C]"
                    iconClass="w-[16px] h-[14px]"
                  />
                  <ActionButton
                    label="Upload Invoice"
                    iconLight={
                      <Icon
                        icon="fluent:cloud-add-20-regular"
                        width={20}
                        height={20}
                      />
                    }
                    iconDark={
                      <Icon
                        icon="fluent:cloud-add-20-regular"
                        width={20}
                        height={20}
                      />
                    }
                    iconPos="left"
                    labelClass="font-normal"
                    buttonClass="flex items-center justify-center gap-1 text-[10px] md:text-sm h-[40px] w-[160px] px-4 bg-[#5D5FEF] text-white dark:bg-[#7476F1] dark:text-black border-none focus:outline-none focus:ring-0 whitespace-nowrap"
                    onClick={handleUploadInvoice}
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
                      buttonClass="flex items-center justify-center gap-1 text-[10px] h-[35px] w-full px-4 bg-white text-[#5D5FEF] dark:bg-[#0D0D0D] dark:text-[#5D5FEF] border border-[#5D5FEF] focus:outline-none focus:ring-0"
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
                      buttonClass="flex items-center justify-center gap-1 text-[10px] w-full h-[35px] px-4 bg-[#5D5FEF] text-white dark:bg-[#7476F1] dark:text-black border-none focus:outline-none focus:ring-0"
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
          maxButtons={5}
        />
      </div>

      <PinWrapper
        id="account-bottom-chart"
        meta={{ component: AccountBottomChart }}
        skeleton={<AccountBottomCardSkeleton />}
      >
        <AccountBottomChart />
      </PinWrapper>
    </div>
  );
}
