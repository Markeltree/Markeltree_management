import React from "react";
import DatePicker from "react-datepicker";
import { Icon } from "@iconify/react";
import "react-datepicker/dist/react-datepicker.css";

export default function DateField({
  label = "Select Date",
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  ContainerClassName = "",
}) {
  return (
    <div className={`flex flex-col w-full gap-1 ${ContainerClassName}`}>
      {/* Label */}
      <label className="text-[12px] text-[#6E7A86] dark:text-[#A9BACB]">
        {label}
      </label>

      {/* Date Picker */}
      <div className="relative w-full">
        <DatePicker
          selected={value}
          onChange={onChange}
          placeholderText={placeholder}
          className={`w-full text-[14px] pl-3 pr-3 border border-[#6E7A8640] 
                      dark:border-[#A9BACB] h-[40px] rounded-lg 
                      dark:text-[#A9BACB] bg-transparent 
                      focus:outline-none focus:ring-1 focus:ring-[#A6DDF3] 
                      hover:shadow-md transition-shadow duration-200 
                      dark:hover:[box-shadow:0_3px_10px_rgba(255,255,255,0.2)] ${className}`}
          calendarClassName="rounded-lg shadow-md"
        />

        {/* Calendar icon inside input */}
        <Icon
          icon="solar:calendar-linear"
          width="16"
          height="16"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0088D1]"
        />
      </div>

      {/* Force wrapper full width */}
      <style>
        {`
        .react-datepicker-wrapper {
          width: 100%;
        }
      `}
      </style>
    </div>
  );
}
