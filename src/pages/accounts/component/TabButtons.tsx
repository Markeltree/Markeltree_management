import React from "react";

const tabs = [
  { id: "Payment-History", label: "Payment History" },
  { id: "Invoice-Sent", label: "Invoice Sent" },
  { id: "Invoice-Received", label: "Invoice Received" },
];

const TabButtons = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex flex-row">
      {tabs.map((tab) => (
        <div className="bg-[#EEF8FD]">
          <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-15 py-2 font-medium  transition-colors rounded-[20px] text-[16px] ${
            activeTab === tab.id
              ? "bg-[#0088D1] rounded-[20px] border-b-2 border-blue-600 text-white"
              : "bg-[#EEF8FD] rounded-[20px] text-[#2B2B2B] hover:text-blue-600"
          }`}
        >
          {tab.label}
        </button>
        </div>
      ))}
    </div>
  );
};

export default TabButtons;
