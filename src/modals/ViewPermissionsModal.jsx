import React, { useState, useMemo, useEffect } from "react";
import { useModal } from "@/context/ModalContext";
import { Skeleton, ActionButton } from "@/common/imports";

const INDIGO = "#5D5FEF";

function Chevron({ open }) {
  return (
    <svg
      className={`h-5 w-5 transition-transform duration-200 ${
        open ? "rotate-180" : "rotate-0"
      }`}
      viewBox="0 0 24 24"
      fill="none"
      style={{ color: INDIGO }}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const CHECKBOX_BASE =
  "relative w-4 h-4 border rounded-sm mr-2 flex items-center justify-center cursor-pointer";
const CHECKED_CLS = "bg-[#5D5FEF] border-[#5D5FEF]";
const UNCHECKED_CLS = "border-gray-400 dark:bg-black dark:border-[#A9A9CD]";

const groupsData = [
  {
    title: "Dashboard",
    items: [
      "View",
      "Edit",
      "Export",
      "Customize Dashboard",
      "Quick Actions",
      "Tasks",
    ],
  },
  {
    title: "Inventory Management",
    items: ["View", "Edit", "Add Stock", "Transfer Request"],
  },
  {
    title: "Product Management",
    items: ["View", "Edit", "Delete", "Export", "Add Product"],
  },
  { title: "Logistic", items: ["View", "Export"] },
  {
    title: "Order Management",
    items: ["View", "Export", "Add New Order", "Generate Invoice"],
  },
  { title: "Reporting", items: ["View", "Export", "Generate Report"] },
  {
    title: "Accounts",
    items: ["View", "Export", "Generate Invoice", "Upload Invoice"],
  },
  {
    title: "Setting",
    items: [
      "View",
      "Edit",
      "System Configuration",
      "Role Management",
      "Workflow Configuration",
    ],
  },
  { title: "Feedback", items: ["View", "Export", "Share Feedback"] },
];

export default function ViewPermissionsModal({ closeModal }) {
  const [expanded, setExpanded] = useState(() =>
    Object.fromEntries(groupsData.map((g) => [g.title, false]))
  );

  const allKeys = useMemo(
    () => groupsData.flatMap((g) => g.items.map((i) => `${g.title}::${i}`)),
    []
  );

  const defaultChecked = [
    "Dashboard::View",
    "Dashboard::Quick Actions",
    "Inventory Management::Edit",
    "Product Management::Add Product",
    "Reporting::View",
    "Accounts::Generate Invoice",
    "Setting::Role Management",
  ];

  const [savedChecked, setSavedChecked] = useState(new Set(defaultChecked));
  const [checked, setChecked] = useState(new Set(defaultChecked));
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleGroup = (title) =>
    setExpanded((s) => ({ ...s, [title]: !s[title] }));

  const allExpanded = Object.values(expanded).every((v) => v === true);

  const toggleExpandAll = () => {
    const val = !allExpanded;
    setExpanded(Object.fromEntries(groupsData.map((g) => [g.title, val])));
  };

  const allSelected = checked.size === allKeys.length;

  const toggleAllPermissions = (on) => {
    setChecked(on ? new Set(allKeys) : new Set());
  };

  const toggleItem = (key) => {
    setChecked((prev) => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  };

  const handleCancel = () => {
    setChecked(new Set(savedChecked));
    closeModal();
  };

  if (isLoading) {
    return (
      <>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton
              width="150px"
              height="20px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
          <Skeleton
            width="100px"
            height="14px"
            className="dark:bg-[#2C2C2CAA]"
          />
          <div className="flex items-center justify-between rounded-lg border px-3 py-2">
            <div className="flex items-center gap-2">
              <Skeleton
                width="16px"
                height="20px"
                className="dark:bg-[#2C2C2CAA] rounded"
              />
              <Skeleton
                width="180px"
                height="14px"
                className="dark:bg-[#2C2C2CAA]"
              />
            </div>
            <Skeleton
              width="70px"
              height="14px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>
          <div className="max-h-[35vh] overflow-y-auto space-y-2">
            {[1, 2, 3, 4].map((_, idx) => (
              <div key={idx}>
                <div className="flex w-full items-center justify-between rounded-lg border px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Skeleton
                      width="16px"
                      height="20px"
                      className="dark:bg-[#2C2C2CAA] rounded"
                    />
                    <Skeleton
                      width="100px"
                      height="14px"
                      className="dark:bg-[#2C2C2CAA]"
                    />
                  </div>
                  <Skeleton
                    width="12px"
                    height="12px"
                    className="dark:bg-[#2C2C2CAA] rounded"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row gap-4 mb-2 pl-1">
            <Skeleton
              width="100%"
              height="50px"
              className="dark:bg-[#2C2C2CAA] rounded-lg"
            />
            <Skeleton
              width="100%"
              height="50px"
              className="dark:bg-[#2C2C2CAA] rounded-lg"
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[#151D48] dark:text-white">
          Permissions
        </h2>
      </div>

      <p className="font-semibold text-[13px] text-[#2B2B2B] dark:text-gray-200">
        Permissions
      </p>

      <div className="flex items-center justify-between rounded-lg border border-[#ECECF1] dark:border-gray-700 bg-[#FBFBFE] dark:bg-gray-800 px-3 py-2">
        <label className="flex items-center gap-2 text-[13px] text-[#2B2B2B] dark:text-gray-200 cursor-pointer">
          <span
            className={`${CHECKBOX_BASE} ${
              allSelected ? CHECKED_CLS : UNCHECKED_CLS
            }`}
            onClick={() => toggleAllPermissions(!allSelected)}
          >
            {allSelected && (
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
          <span>All Permission (Admin Access)</span>
        </label>

        <button
          type="button"
          onClick={toggleExpandAll}
          className="text-[12px] font-medium"
          style={{ color: INDIGO }}
        >
          {allExpanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="max-h-[35vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#F2F2FE] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
        <div className="space-y-2">
          {groupsData.map((group) => {
            const isOpen = expanded[group.title];
            const groupAnyChecked = group.items.some((i) =>
              checked.has(`${group.title}::${i}`)
            );
            return (
              <div key={group.title}>
                <button
                  type="button"
                  onClick={() => toggleGroup(group.title)}
                  className="flex w-full items-center justify-between rounded-lg border border-[#ECECF1] dark:border-gray-700 bg-[#FBFBFE] dark:bg-gray-800 px-3 py-2"
                >
                  <label
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      className={`${CHECKBOX_BASE} ${
                        groupAnyChecked ? CHECKED_CLS : UNCHECKED_CLS
                      }`}
                      onClick={() => {
                        const on = !groupAnyChecked;
                        setChecked((prev) => {
                          const n = new Set(prev);
                          group.items.forEach((i) => {
                            const k = `${group.title}::${i}`;
                            on ? n.add(k) : n.delete(k);
                          });
                          return n;
                        });
                      }}
                    >
                      {groupAnyChecked && (
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
                    <span className="text-[13px] text-[#2B2B2B] dark:text-gray-200">
                      {group.title}
                    </span>
                  </label>
                  <Chevron open={isOpen} />
                </button>

                {isOpen && (
                  <div className="pl-6 pt-3 pb-2 space-y-3">
                    {group.items.map((item) => {
                      const key = `${group.title}::${item}`;
                      return (
                        <label
                          key={key}
                          className="flex items-center gap-3 text-[13px] text-[#2B2B2B] dark:text-gray-200 cursor-pointer"
                        >
                          <span
                            className={`${CHECKBOX_BASE} ${
                              checked.has(key) ? CHECKED_CLS : UNCHECKED_CLS
                            }`}
                            onClick={() => toggleItem(key)}
                          >
                            {checked.has(key) && (
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
                          <span>{item}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-row gap-4 mb-2 pl-1">
        <div className="w-full gap-1">
          <ActionButton
            label="Cancel"
            labelClass="font-normal text-[12px] md:text-[16px]"
            buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#5D5FEF] dark:bg-[#0D0D0D] dark:text-[#5D5FEF] border border-[#5D5FEF] focus:outline-none focus:ring-0"
            onClick={handleCancel}
          />
        </div>
        <div className="w-full gap-1">
          <ActionButton
            label="Save"
            labelClass="font-normal text-[12px] md:text-[16px]"
            buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#5D5FEF] text-white dark:bg-[#7476F1] dark:text-black border-none focus:outline-none focus:ring-0"
          />
        </div>
      </div>
    </div>
  );
}
