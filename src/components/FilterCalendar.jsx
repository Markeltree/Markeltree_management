import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

export default function FilterCalendar({ value = [], onChange }) {
  const [dateRange, setDateRange] = useState([
    value?.[0]?.startDate || null,
    value?.[0]?.endDate || null,
  ]);

  const [startDate, endDate] = dateRange;
  const [open, setOpen] = useState(false);

  const handleChange = (update) => {
    setDateRange(update);
    const [start, end] = update;

    if (onChange) {
      onChange(start && end ? [{ startDate: start, endDate: end }] : []);
    }

    // close automatically after selecting both
    if (start && end) {
      setOpen(false);
    }
  };

  return (
    <div className="mb-3 relative w-full">
      {/* Label */}
      <h4 className="font-semibold text-[12px] text-[#0F2418] dark:text-[#EFFBF3] mb-2">
        Date Range
      </h4>

      {/* Button trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded text-[#09BF64] bg-[#09BF641A] text-[13px] font-medium hover:bg-[#09BF6433] transition"
      >
        <Icon icon="mdi:calendar" width={18} height={18} />
        <span>
          {value?.[0]?.startDate && value?.[0]?.endDate
            ? `${format(value[0].startDate, "d-MMM-yyyy")} to ${format(
                value[0].endDate,
                "d-MMM-yyyy"
              )}`
            : "Select date range"}
        </span>
      </button>

      {/* Calendar */}
      {open && (
        <div
          className="mt-2 shadow-lg rounded border border-gray-300 bg-white dark:bg-[#0D0D0D]"
          style={{
            position: "absolute",
            zIndex: 9999,
            width: 280,
            right: 0,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={handleChange}
            dateFormat="dd MMM yyyy"
            open
            inline
            shouldCloseOnSelect={false}
            calendarClassName="!p-4 !rounded-lg !border !border-[#E5E7EB] dark:!border-[#333] dark:!bg-[#0D0D0D]"
            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
              <div className="flex justify-between items-center mb-2">
                <span className="text-[14px] font-semibold">
                  {date.toLocaleString("default", { month: "long" })}{" "}
                  {date.getFullYear()}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={decreaseMonth}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <Icon
                      icon="solar:alt-arrow-left-outline"
                      className="w-4 h-4"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={increaseMonth}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <Icon
                      icon="solar:alt-arrow-right-outline"
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              </div>
            )}
          />
        </div>
      )}

      {/* Styling for calendar days */}
      <style>
        {`
    .react-datepicker__day-name {
      width: 2rem;
      font-weight: 600;
      font-size: 0.75rem;
      color: #6b7280;
    }
    .react-datepicker__day {
      width: 2rem;
      line-height: 2rem;
      margin: 0.2rem;
      border-radius: 9999px;
    }
    .react-datepicker__day--selected,
    .react-datepicker__day--in-range,
    .react-datepicker__day--keyboard-selected {
      background-color: #09BF64 !important;
      color: white !important;
    }
    .react-datepicker__day:hover {
      background-color: #e0e7ff !important;
    }
  `}
      </style>
    </div>
  );
}
