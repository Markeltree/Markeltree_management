import React from "react";
import { twMerge } from "tailwind-merge";

const Dropdown = ({
  className = "",
  options = [],
  ...props
}) => {
  const baseStyles =
    "w-full rounded-lg border border-[#6F7C74]/25 bg-white px-4 py-2.5 text-[#6F7C74] font-regular text-sm focus:border-[#EA7D00] focus:ring-[#EA7D00] dark:bg-[#0D0D0D] dark:text-[#A9C2B3] dark:placeholder:text-[#A9C2B3] dark:border-[#6F7C74]/75";

  return (
    <select className={twMerge(baseStyles, className)} {...props}>
      <option value="" disabled selected hidden>
        Select
      </option>
      {options.map(({ value, label }, idx) => (
        <option key={idx} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
