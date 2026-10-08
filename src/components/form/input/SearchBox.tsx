import React from "react";
import { twMerge } from "tailwind-merge";
import { FiSearch } from "react-icons/fi";

const SearchBox = ({
  className = "",
 placeholder,
  ...props
}) => {
  const baseStyles =
    "w-full pl-5 pr-4 rounded-lg border border-[#6E7A86]/25 bg-white py-3 text-[#483415] font-regular text-sm focus:border-[#EA7D00] focus:ring-[#EA7D00] dark:bg-[#0D0D0D] dark:text-[#A9BACB] dark:placeholder:text-[#A9BACB]";

  return (
    <div className="relative w-full">
      
      <input
        className={twMerge(baseStyles, className)}
        {...props}
        type="search"
        placeholder={placeholder}
      />
      <FiSearch
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E7A86] dark:text-[#A9BACB]"
        size={18}
      />
    </div>
  );
};

export default SearchBox;
