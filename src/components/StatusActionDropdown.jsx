import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import MenuActionButton from "./MenuActionButton";

export default function StatusActionDropdown({
  initialValue = "Select",
  options = ["Paid", "Unpaid"],
  onChange,
}) {
  const [selected, setSelected] = useState(initialValue);

  // ✅ Sync local state with prop changes
  useEffect(() => {
    setSelected(initialValue);
  }, [initialValue]);

  // Format options for MenuActionButton
  const formattedOptions = options.map((opt) => ({
    template: () => (
      <div
        className="px-3 py-2 cursor-pointer hover:bg-[#0088D11A] dark:hover:bg-[#01CEE940] rounded-lg"
        onClick={() => {
          setSelected(opt);
          if (onChange) onChange(opt);
        }}
      >
        {opt}
      </div>
    ),
  }));

  return (
    <MenuActionButton
      label={selected}
      iconLight={
        <Icon
          icon="iconamoon:arrow-down-2-duotone"
          className="w-[15px] h-[15px]"
        />
      }
      iconDark={<Icon icon="iconamoon:arrow-down-2-duotone" />}
      menuOptions={formattedOptions}
      labelClass="font-normal"
      buttonClass="flex flex-row-reverse items-center justify-center gap-2 text-[11px] h-[28px] w-[90px] px-3 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] border border-[#A9A9A9] dark:border-[#8E8E9C] focus:outline-none focus:ring-0 rounded"
      menuClass="mt-2 w-[90px] p-2 bg-white text-black dark:bg-[#0D0D0D] dark:text-[#8E8E9C] rounded-md"
    />
  );
}
