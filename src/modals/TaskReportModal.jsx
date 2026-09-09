import {
  useState,
  useEffect,
  DataTable,
  Column,
  menuOptions,
  CustomPaginator,
  Icon,
  ActionButton,
  Skeleton,
  MenuActionButton,
  useRef,
  useMemo,
} from "@/common/imports";

const tableData = [
  {
    id: 1,
    TaskName: "$1200",
    "Target Created": "2025-07-01",
    deadline: "2025-07-31",
    Status: "Completed",
    "Assign To": ["Ajay", "Ajay"],
  },
  {
    id: 2,
    TaskName: "$800",
    "Target Created": "2025-07-05",
    deadline: "2025-08-01",
    Status: "Failed",
    "Assign To": ["Ajay", "Ajay", "Ajay"],
  },
  {
    id: 3,
    TaskName: "$950",
    "Target Created": "2025-07-10",
    deadline: "2025-08-05",
    Status: "In Progress",
    "Assign To": ["Ajay", "Ajay", "Ajay", "Ajay"],
  },
  {
    id: 4,
    TaskName: "$1500",
    "Target Created": "2025-07-12",
    deadline: "2025-08-15",
    Status: "Failed",
    "Assign To": ["Ajay", "Ajay", "Ajay", "Ajay"],
  },
  {
    id: 5,
    TaskName: "$300",
    "Target Created": "2025-07-15",
    deadline: "2025-08-20",
    Status: "Completed",
    "Assign To": ["Ajay"],
  },
  {
    id: 6,
    TaskName: "$1110",
    "Target Created": "2025-07-17",
    deadline: "2025-08-22",
    Status: "In Progress",
    "Assign To": ["Ajay", "Ajay", "Ajay", "Ajay"],
  },
  {
    id: 7,
    TaskName: "$999",
    "Target Created": "2025-07-20",
    deadline: "2025-08-25",
    Status: "Failed",
    "Assign To": ["Ajay", "Ajay", "Ajay"],
  },
];

export default function TargetReportModal({ closeModal }) {
  const exportMenuOptions = menuOptions();

  const filterButtonRef = useRef(null);
  const filterPanelRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const [globalFilter, setGlobalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 6;

  const [filters, setFilters] = useState({});
  const [tempFilters, setTempFilters] = useState({});
  const [first, setFirst] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const rawData = tableData;

  // --- Unique filter values ---
  const uniqueFilterValues = useMemo(
    () => ({
      Status: [...new Set(rawData.map((r) => r.Status).filter(Boolean))],
    }),
    [rawData]
  );

  // --- Filter toggle ---
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

  // --- Filtered data ---
  const filteredData = useMemo(() => {
    return rawData.filter((row) => {
      return Object.entries(filters).every(([field, selected]) =>
        selected && selected.length ? selected.includes(row[field]) : true
      );
    });
  }, [rawData, filters]);

  const paginatedData = filteredData.slice(first, first + rowsPerPage);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const taskNameColumn = (rowData) => (
    <div className="flex items-center gap-2">
      <label class="relative flex items-center cursor-pointer w-4 h-4">
        <input
          type="checkbox"
          class="peer appearance-none w-4 h-4 rounded border border-[#73779140] bg-white 
           checked:bg-[#5D5FEF] checked:border-[#5D5FEF] 
           dark:bg-[#0D0D0D] dark:border-[#A9A9CD] dark:checked:bg-[#5D5FEF] dark:checked:border-[#5D5FEF]
           focus:outline-none"
        />

        <svg
          class="absolute left-0 top-0 w-4 h-4 text-white scale-0 peer-checked:scale-100 transition-transform"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </label>
      <span className="text-[#666666] ml-2 text-[12px]">
        {rowData.TaskName}
      </span>
    </div>
  );

  const statusColumn = (rowData) => {
    const statusColorMap = {
      Completed:
        "text-[#22C55E] dark:text-[#27DA68] bg-[#22C55E26] dark:bg-[#27DA6826]",
      Failed:
        "text-[#FF695B] dark:text-[#FF8075] bg-[#FF695B26] dark:bg-[#FF807526]",
      "In Progress":
        "text-[#DDD427] dark:text-[#E0D83D] bg-[#DDD42726] dark:bg-[#E0D83D26]",
    };

    const label = rowData.Status;

    return (
      <div
        className={`text-[12px] rounded-md px-2 py-[2px] h-[29px] w-[92px] flex items-center justify-center ${
          statusColorMap[label] || ""
        }`}
      >
        {label}
      </div>
    );
  };

  const assignToColumn = (rowData) => {
    const assignees = rowData["Assign To"];

    if (!Array.isArray(assignees)) return null;

    return (
      <div className="flex flex-row gap-2">
        {assignees.map((name, index) => (
          <div
            key={index}
            className="bg-[#F6F6FF] text-[#5D5FEF] dark:bg-[#1A1A40] dark:text-[#7B7DF8] text-[12px] px-3 py-1 rounded-md flex items-center gap-1"
          >
            {name}
            <span className="cursor-pointer">×</span>
          </div>
        ))}
      </div>
    );
  };

  const headerClass =
    "bg-[#FFFFFF] dark:bg-[#0D0D0D] text-[12px] text-[#33333380] dark:text-[#8E8E9C] font-normal";

  // --- Filter panel handlers ---
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

  // --- Click outside for filter panel ---
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  return (
    <div className="flex flex-col gap-2 text-black dark:text-white w-full">
      {/* Row 1: Header */}
      {isLoading ? (
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col gap-6 w-full">
            <Skeleton
              width="160px"
              height="1.5rem"
              borderRadius="6px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="220px"
              height="1rem"
              borderRadius="6px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
          <div className="flex flex-row items-center justify-start gap-2 mt-2">
            <Skeleton
              width="100px"
              height="36px"
              borderRadius="8px"
              className="dark:bg-[#2C2C2CAA]"
            />
            <Skeleton
              width="100px"
              height="36px"
              borderRadius="8px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col items-start gap-2">
            <h2 className="text-[18px] text-[#333333] dark:text-[#F2F2FE] font-bold">
              Task Report
            </h2>
            <p className="text-[12px] text-[#666666] dark:text-[#F2F2FE]">
              Showing tasks for This Month
            </p>
          </div>

          <div className="flex flex-row items-center justify-start gap-2 mt-2">
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
                buttonClass="flex items-center justify-center gap-1 text-sm h-[36px] w-[100px] px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] focus:outline-none focus:ring-0"
                menuClass="mt-2 w-[104px] p-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C]"
                iconClass="w-[16px] h-[14px]"
                onClick={openFilterPanel}
              />
            </div>
            <MenuActionButton
              label="Export"
              iconLight="./exportIconLight.png"
              iconDark="./exportIconDark.png"
              iconPos="left"
              menuOptions={exportMenuOptions}
              buttonClass="flex items-center justify-center gap-1 text-sm h-[36px] w-[100px] px-4 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0"
              menuClass="mt-2 w-[104px] p-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C]"
              iconClass="w-[16px] h-[14px]"
            />
            {filterOpen && filterButtonRef.current && (
              <div
                ref={filterPanelRef}
                className="absolute bg-white dark:bg-[#0D0D0D] shadow-lg rounded-lg p-4 z-50"
                style={{
                  top: filterButtonRef.current.offsetHeight + 40, // vertical offset below button
                  left:
                    window.innerWidth >= 768
                      ? filterButtonRef.current.offsetLeft - 155 // large screens
                      : filterButtonRef.current.offsetLeft, // small screens: align left
                  minWidth: "16rem",
                }}
              >
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
                            checked={tempFilters[field]?.includes(val) || false}
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
      )}

      {/* Row 2: Table */}
      <div className="w-full overflow-x-auto">
        {isLoading ? (
          <div className="space-y-2 gap-4">
            {[...Array(rowsPerPage)].map((_, i) => (
              <div
                key={i}
                className="flex gap-4 w-full p-2 border-b border-[#E0E0E0] dark:border-[#2C2C2E]"
              >
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="w-full">
                    <Skeleton
                      height="20px"
                      className="rounded-md bg-[#F0F0F0] dark:bg-[#2C2C2E] w-full"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <>
            <DataTable
              value={paginatedData}
              dataKey="id"
              className="p-datatable-sm"
              rowClassName={() =>
                "border-b border-[#E0E0E0] dark:border-[#2C2C2E]"
              }
            >
              <Column
                field="Task Name"
                header="Task Name"
                body={taskNameColumn}
                headerClassName={headerClass}
                bodyClassName="dark:bg-[#0D0D0D] whitespace-nowrap"
              />
              <Column
                field="Target Created"
                header="Target Created"
                headerClassName={headerClass}
                bodyClassName="text-[#666666] ml-2 text-[12px] dark:bg-[#0D0D0D] whitespace-nowrap"
              />
              <Column
                field="deadline"
                header="Deadline"
                headerClassName={headerClass}
                bodyClassName="text-[#666666] ml-2 text-[12px] dark:bg-[#0D0D0D] whitespace-nowrap"
              />
              <Column
                field="status"
                header="Status"
                body={statusColumn}
                headerClassName={headerClass}
                bodyClassName="dark:bg-[#0D0D0D] whitespace-nowrap"
              />
              <Column
                field="Assign To"
                header="Assign To"
                body={assignToColumn}
                headerClassName={headerClass}
                bodyClassName="text-[#666666] ml-2 text-[12px] dark:bg-[#0D0D0D] whitespace-nowrap"
              />
            </DataTable>
            <CustomPaginator
              totalPages={Math.ceil(filteredData.length / rowsPerPage)}
              currentPage={Math.floor(first / rowsPerPage)}
              onPageChange={(page) => setFirst(page * rowsPerPage)}
              maxButtons={5}
              className="mt-4"
            />
          </>
        )}
      </div>
    </div>
  );
}
