import React from "react";

const defaultTabs = [
  { id: "Board", label: "Board" },
  { id: "Training", label: "Training" },
  { id: "Necessary Information", label: "Necessary Information" },
];

interface TabButtonsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs?: { id: string; label: string }[];
}

const TabButtons: React.FC<TabButtonsProps> = ({
  activeTab,
  onTabChange,
  tabs = defaultTabs,
}) => {
  return (
    <>
    <div className="inline-flex items-center gap-1 sm:gap-2 bg-[#EEF8FD] dark:bg-[#1a1a1a] rounded-full p-1 overflow-x-auto">
      {tabs.map((tab) => {
        // Use strict equality to ensure exact match
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onTabChange(tab.id);
            }}
            type="button"
            className={`px-4 sm:px-10 py-1 sm:py-2 max-sm:px-5 font-medium max-sm:text-[10px] text-[12px] sm:text-[15px] whitespace-nowrap transition-all duration-300 rounded-full ${
              isActive
                ? "!bg-[#0088D1] !text-white shadow-md"
                : "!bg-transparent text-[#2B2B2B] dark:text-white hover:text-[#0088D1]"
            }`}
            style={{
              backgroundColor: isActive ? '#0088D1' : 'transparent',
              color: isActive ? '#ffffff' : undefined,
            }}
            aria-pressed={isActive}
            data-active={isActive}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
    </>
  );
};

export default TabButtons;
