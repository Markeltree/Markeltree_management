import {
  subDays,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  isSameMonth,
  format,
} from "date-fns";
import { useState, useEffect, useRef } from "react";
import { Icon } from "@/common/imports";

const quickRanges = [
  { label: "Today", range: [new Date(), new Date()] },
  {
    label: "Yesterday",
    range: [subDays(new Date(), 1), subDays(new Date(), 1)],
  },
  { label: "Last Week", range: [subDays(new Date(), 7), new Date()] },
  { label: "Last Month", range: [subDays(new Date(), 30), new Date()] },
];

export default function RangeCalendar({
  icon = "pi pi-calendar",
  placeholder = "Select date range",
  className = "",
  labelClass = "",
  buttonStyling = "h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] w-[98px] xs:w-[120px] sm:w-[172px] md:w-[195px] text-[7px] xs:text-[10px] sm:text-[12px] md:text-sm px-2 sm:px-3 md:px-4 rounded-md",
  dropdownClass = "w-[340px] sm:w-[420px] text-[8px] sm:text-xs h-auto overflow-hidden left-[unset] sm:left-0 sm:right-0 sm:mx-auto -translate-x-12 sm:translate-x-0",
  gapClasses = "gap-1 sm:gap-2",
}) {
  const [range, setRange] = useState([new Date(), new Date()]);
  const [selectedOption, setSelectedOption] = useState("Today");
  const [custom, setCustom] = useState(false);
  const [show, setShow] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleQuickSelect = (label, dates) => {
    setRange(dates);
    setSelectedOption(label);
    setCustom(false);
    setShow(false);
  };

  const resetSelection = () => {
    handleQuickSelect("Today", [new Date(), new Date()]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dateObj = day;
        const isSelectedStart = range[0] && isSameDay(dateObj, range[0]);
        const isSelectedEnd = range[1] && isSameDay(dateObj, range[1]);
        const isInRange =
          range[0] && range[1] && dateObj > range[0] && dateObj < range[1];

        const base =
          "w-[30px] h-[30px] flex items-center justify-center rounded-full text-[12px] leading-none cursor-pointer font-semibold";
        const selected =
          isSelectedStart || isSelectedEnd
            ? "bg-[#5D5FEF] text-white"
            : isInRange
            ? "bg-[#5D5FEF]/70 text-white"
            : isSameMonth(day, monthStart)
            ? "text-[#293050CC] dark:text-[#F2F2FE]"
            : "text-gray-400";

        days.push(
          <div
            key={day}
            className={`${base} ${selected}`}
            onClick={() => {
              if (!range[0] || (range[0] && range[1])) {
                setRange([dateObj, null]);
              } else {
                if (dateObj < range[0]) {
                  setRange([dateObj, range[0]]);
                } else {
                  setRange([range[0], dateObj]);
                }
                setSelectedOption("Custom Range");
              }
            }}
          >
            {format(day, "d")}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="flex justify-between">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-[2px]">{rows}</div>;
  };

  return (
    <div
      className={`relative transition-all hover:shadow-lg dark:hover:[box-shadow:0_4px_12px_rgba(255,255,255,0.2)] ${className}`}
    >
      {/* Trigger Button */}
      <button
        onClick={() => setShow((prev) => !prev)}
        ref={buttonRef}
        className={`bg-[#5D5FEF]/10 text-[#5D5FEF] border-none overflow-hidden focus:outline-none focus:ring-0 ${buttonStyling}`}
      >
        <div
          className={`flex items-center justify-center w-full h-full ${gapClasses}`}
        >
          <i
            className={`${icon} text-[#5D5FEF] text-[9px] xs:text-[10px] sm:text-[11px] md:text-[14px]`}
          />
          <span className={`text-[#5D5FEF] truncate ${labelClass}`}>
            {placeholder}
          </span>
        </div>
      </button>

      {/* Dropdown Panel */}
      {show && (
        <div
          ref={dropdownRef}
          className={`absolute z-50 mt-2 bg-white dark:bg-black border-none rounded-lg shadow-lg flex flex-row pb-2 ${dropdownClass}`}
        >
          {/* Left Panel - Quick Select */}
          <div className="w-full sm:w-[30%] flex flex-col justify-between py-1 px-2 mt-1 sm:mt-3 ">
            <div className="flex flex-col gap-[4px] ">
              {quickRanges.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleQuickSelect(item.label, item.range)}
                  className={`text-left px-2 py-[2px] rounded hover:bg-blue-50 dark:hover:bg-blue-900 ${
                    selectedOption === item.label
                      ? "bg-blue-100 dark:bg-[#5D5FEF] dark:text-[#F2F2FE] text-[#293050CC]"
                      : "dark:text-[#F2F2FE] text-[#293050CC]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setCustom(true);
                  setSelectedOption("Custom Range");
                }}
                className={`text-left px-2 py-[2px] rounded hover:bg-blue-50 dark:hover:bg-blue-900 ${
                  selectedOption === "Custom Range"
                    ? "bg-blue-100 dark:bg-[#5D5FEF] dark:text-[#F2F2FE] text-[#293050CC]"
                    : "dark:text-[#F2F2FE] text-[#293050CC]"
                }`}
              >
                Custom Range
              </button>
            </div>

            <button
              onClick={resetSelection}
              className="text-left text-[#5D5FEF] hover:text-[#3D3DEF] font-semibold text-[12px] sm:text-[14px] mt-1 px-2 py-2"
            >
              Reset
            </button>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px bg-gray-200 dark:bg-gray-700" />

          {/* Right Panel - Custom Calendar */}
          <div className="w-full sm:w-[70%] p-2 min-w-[250px] sm:min-w-[280px]">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-2 text-[12px] text-[#293050CC] dark:text-[#F2F2FE] font-semibold">
              <span>{format(currentMonth, "MMMM yyyy")}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                  className="w-[30px] h-[30px] flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Icon icon="mdi:chevron-left" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="w-[30px] h-[30px] flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Icon icon="mdi:chevron-right" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Week Days */}
            <div className="flex justify-between text-[11px] mb-1 text-gray-500 font-semibold">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="w-[30px] h-[20px] flex items-center justify-center"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Dates */}
            {renderCells()}
          </div>
        </div>
      )}
    </div>
  );
}
