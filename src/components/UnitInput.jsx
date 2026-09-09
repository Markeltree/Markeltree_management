import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const ChevronDownIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const UnitInput = ({ label, unit, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(unit);
  const inputRef = useRef();
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4, // small gap
        right: window.innerWidth - rect.right, // align to right edge
      });
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col w-full gap-1" ref={inputRef}>
      {label && (
        <label className="text-[#737791] dark:text-[#A9A9CD] text-[12px]">
          {label}
        </label>
      )}

      <div
        className="flex items-center h-[40px] border border-[#73779140] dark:border-[#A9A9CD] rounded-lg px-2 py-1 text-[14px] dark:bg-[#0D0D0D] hover:shadow-md transition-shadow duration-200 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="number"
          placeholder=""
          className="flex-1 dark:text-[#A9A9CD] pl-1 outline-none bg-transparent placeholder:dark:text-[#A9A9CD] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <div className="flex items-center gap-1 text-[#5D5FEF] dark:text-[#7476F1]">
          <span>{selectedUnit}</span>
          <ChevronDownIcon className="w-4 h-4" />
        </div>
      </div>

      {isOpen &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: dropdownPosition.top,
              right: dropdownPosition.right,
              width: "96px", // small fixed width
              zIndex: 9999,
            }}
            className="bg-white dark:bg-[#0D0D0D] border border-[#73779140] dark:border-[#A9A9CD40] rounded-lg shadow-lg"
          >
            {options.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedUnit(opt);
                  setIsOpen(false);
                }}
                className="px-3 py-2 hover:bg-[#5D5FEF1A] dark:hover:bg-[#7476F140] cursor-pointer rounded"
              >
                {opt}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

export default UnitInput;
