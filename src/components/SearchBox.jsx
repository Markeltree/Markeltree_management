import { Icon } from "@/common/imports";

export default function SearchBox({
  styling = "",
  placeholder = "Search...",
  onChange,
  containerClass = "",
}) {
  return (
    <div className={`relative ${containerClass}`}>
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-300">
        <Icon icon="mdi:magnify" className="text-xl text-[#5D5FEF]" />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className={styling}
      />
    </div>
  );
}
