import React, { useState, useEffect, useRef } from "react";
import ActionButton from "@/components/ActionButton";
import { Icon } from "@iconify/react";

const widgetOptions = [
  "Target",
  "Top Performer",
  "Biggest Bottleneck",
  "Revenue KPI",
  "New Customers KPI",
  "Sales KPI",
  "Orders Overview KPI",
  "Quick Actions & Multichannel View",
  "AI Powered Suggestions",
  "Tasks",
  "Recent Activities",
  "System Health",
  "Sales Trends",
  "Calendar",
  "Activity Feed",
  "Daily Tasks",
];

export default function CustomizeDashboard({
  selectedWidgets,
  setSelectedWidgets,
}) {
  const [open, setOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState(selectedWidgets); // ✅ keep temporary changes
  const dropdownRef = useRef(null);

  // When dropdown opens, sync tempSelection with actual widgets
  useEffect(() => {
    if (open) {
      setTempSelection(selectedWidgets);
    }
  }, [open, selectedWidgets]);

  const toggleOption = (option) => {
    if (tempSelection.includes(option)) {
      setTempSelection(tempSelection.filter((o) => o !== option));
    } else {
      setTempSelection([...tempSelection, option]);
    }
  };

  const resetSelection = () => {
    setTempSelection([...widgetOptions]); // reset temporary selection
    setSelectedWidgets([...widgetOptions]); // update parent immediately
  };

  const saveSelection = () => {
    setSelectedWidgets(tempSelection); // ✅ update parent with saved changes
    setOpen(false);
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Customize Dashboard Button */}
      <ActionButton
        label="Customize Dashboard"
        iconLight={
          <Icon
            icon="basil:edit-outline"
            className="w-[12px] h-[12px] xs:w-[13px] xs:h-[13px] sm:w-[15px] sm:h-[15px] md:w-[18px] md:h-[18px]"
          />
        }
        iconDark={
          <Icon
            icon="basil:edit-outline"
            className="w-[12px] h-[12px] xs:w-[13px] xs:h-[13px] sm:w-[14px] sm:h-[14px] md:w-[16px] md:h-[16px]"
          />
        }
        iconPos="left"
        labelClass="font-normal md:font-bold"
        buttonClass="flex items-center justify-center gap-2 text-[7px] xs:text-[10px] sm:text-[12px] md:text-sm h-[24px] xs:h-[30px] sm:h-[32px] md:h-[45px] w-auto px-2 sm:px-3 md:px-4 bg-[#0088D1] text-white dark:bg-[#0088D1] dark:text-black border border-[#0088D1] focus:outline-none focus:ring-0"
        onClick={() => setOpen(!open)}
      />

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#121212] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-4">
          {/* Header with title + cross */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-[#0B1B33] dark:text-[#B5DEF2]">
              Remove/Add widgets
            </h3>
            <button onClick={() => setOpen(false)}>
              <Icon
                icon="mdi:close"
                className="w-4 h-4 text-gray-500 dark:text-gray-300"
              />
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EEF8FD] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
            {widgetOptions.map((option, idx) => {
              const checked = tempSelection.includes(option);
              return (
                <label
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer text-[12px] text-[#8E8E9C] dark:text-[#EEF8FD]"
                  onClick={() => toggleOption(option)}
                >
                  <span
                    className={`relative w-4 h-4 border border-gray-400 rounded-sm mr-2 flex items-center justify-center
                      ${
                        checked
                          ? "bg-[#0088D1] border-[#0088D1]"
                          : "dark:bg-black dark:border-[#A9BACB]"
                      }`}
                  >
                    {checked && (
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
                  {option}
                </label>
              );
            })}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between items-center gap-3 mt-4">
            <button
              onClick={resetSelection}
              className="w-1/2 py-2 rounded-lg border border-[#0088D1] text-[#0088D1] font-medium text-sm hover:bg-[#0088D1]/10"
            >
              Reset
            </button>
            <button
              onClick={saveSelection}
              className="w-1/2 py-2 rounded-lg bg-[#0088D1] text-white font-medium text-sm hover:bg-[#4b4cd1]"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
