import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";

export default function DropdownButton({
  defaultOption = "This Week",
  options = ["This Week", "This Month", "This Year"],
  onChange,
  className = "",
  buttonClassName = "",
  dropdownClassName = "",
  optionClassName = "",
}) {
  const [selected, setSelected] = useState(defaultOption);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    if (onChange) onChange(option);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-[10px] ${buttonClassName}`}
      >
        {selected}
        <Icon
          icon={open ? "fe:arrow-up" : "fe:arrow-down"}
          width="12"
          height="12"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute right-0 mt-1 bg-white dark:bg-black border rounded-md shadow-md z-50 ${dropdownClassName}`}
        >
          {options.map((option, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(option)}
              className={`px-3 py-1 text-[10px] cursor-pointer hover:bg-gray-100 ${
                option === selected ? "text-[#09BF64]" : "text-gray-700"
              } ${optionClassName}`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
