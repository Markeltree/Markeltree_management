import { Icon } from "@/common/imports";

const allExportMenuOptions = [
  {
    key: "Excel",
    label: "Excel",
    icon: (
      <Icon
        icon="material-symbols-light:download-rounded"
        width="24"
        height="24"
      />
    ),
    command: () => console.log("Excel"),
  },
  {
    key: "CSV",
    label: "CSV",
    icon: (
      <Icon
        icon="material-symbols-light:download-rounded"
        width="24"
        height="24"
      />
    ),
    command: () => console.log("CSV"),
  },
  {
    key: "PDF",
    label: "PDF",
    icon: (
      <Icon
        icon="material-symbols-light:download-rounded"
        width="24"
        height="24"
      />
    ),
    command: () => console.log("PDF"),
  },
];

// Function to filter menu options
export const menuOptions = (allowedKeys = []) => {
  const filtered =
    allowedKeys.length > 0
      ? allExportMenuOptions.filter((opt) => allowedKeys.includes(opt.key))
      : allExportMenuOptions;

  return filtered.map((item) => ({
    ...item,
    template: (opt) => (
      <div
        className="flex items-center justify-around py-2 cursor-pointer hover:bg-[#09BF641A] dark:hover:bg-[#81D95940]"
        onClick={item.command}
      >
        <span className="text-sm text-left">{item.label}</span>
        {item.icon}
      </div>
    ),
  }));
};
