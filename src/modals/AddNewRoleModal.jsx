import React, { useMemo, useState, useEffect } from "react";
import { Skeleton, ActionButton } from "@/common/imports";

const INDIGO = "#0088D1";

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

function CustomCheckbox({ checked, onChange }) {
  return (
    <span
      onClick={onChange}
      className={`relative w-4 h-4 border rounded-sm flex items-center justify-center cursor-pointer
        ${
          checked
            ? "bg-[#0088D1] border-[#0088D1]"
            : "border-gray-400 bg-white dark:bg-black dark:border-[#A9BACB]"
        }`}
    >
      {checked && (
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
  );
}

export default function RolesPermissionsModal({ closeModal, loading }) {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate 2s loading
    return () => clearTimeout(timer);
  }, []);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [expanded, setExpanded] = useState(() =>
    Object.fromEntries(groupsData.map((g) => [g.title, false]))
  );

  const allKeys = useMemo(
    () => groupsData.flatMap((g) => g.items.map((i) => `${g.title}::${i}`)),
    []
  );
  const [checked, setChecked] = useState(() => new Set());

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

  const toggleItem = (k) =>
    setChecked((prev) => {
      const n = new Set(prev);
      n.has(k) ? n.delete(k) : n.add(k);
      return n;
    });

  if (isLoading) {
    return (
      <>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Skeleton
              width="150px"
              height="20px"
              className="dark:bg-[#2C2C2CAA]"
            />
          </div>

          {/* Inputs */}
          <div className="space-y-3">
            <div>
              <Skeleton
                width="60px"
                height="14px"
                className="mb-1 dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
            </div>

            <div>
              <Skeleton
                width="80px"
                height="14px"
                className="mb-1 dark:bg-[#2C2C2CAA]"
              />
              <Skeleton
                width="100%"
                height="40px"
                className="rounded-lg dark:bg-[#2C2C2CAA]"
              />
            </div>
          </div>

          {/* Permissions Label */}
          <Skeleton
            width="100px"
            height="14px"
            className="dark:bg-[#2C2C2CAA]"
          />

          {/* All Permission Box */}
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

          {/* Groups + Items */}
          <div className="max-h-[35vh] overflow-y-auto space-y-2">
            {[1, 2, 3, 4].map((_, idx) => (
              <div key={idx}>
                {/* Group Header */}
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

          {/* Footer Buttons */}
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
        <h2 className="text-[18px] font-bold text-[#0B1B33] dark:text-white">
          Roles & Permissions
        </h2>
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        <div>
          <label className="block text-[12px] text-[#6B7280] dark:text-gray-400 mb-1">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="w-full h-10 rounded-lg border border-[#E7E7E9] dark:border-gray-600 bg-white dark:bg-gray-800 px-3 text-sm text-black dark:text-white outline-none focus:border-[#C8C8FF]"
          />
        </div>
        <div>
          <label className="block text-[12px] text-[#6B7280] dark:text-gray-400 mb-1">
            Role Name
          </label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Enter Role"
            className="w-full h-10 rounded-lg border border-[#E7E7E9] dark:border-gray-600 bg-white dark:bg-gray-800 px-3 text-sm text-black dark:text-white outline-none focus:border-[#C8C8FF]"
          />
        </div>
      </div>

      <p className="font-semibold text-[13px] text-[#2B2B2B] dark:text-gray-200">
        Permissions
      </p>

      <div className="flex items-center justify-between rounded-lg border border-[#ECECF1] dark:border-gray-700 bg-[#FBFBFE] dark:bg-gray-800 px-3 py-2">
        <label className="flex items-center gap-2 text-[13px] text-[#2B2B2B] dark:text-gray-200 cursor-pointer">
          <CustomCheckbox
            checked={allSelected}
            onChange={() => toggleAllPermissions(!allSelected)}
          />
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

      <div className="max-h-[35vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EEF8FD] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
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
                  <label className="flex items-center gap-3 cursor-pointer">
                    <CustomCheckbox
                      checked={groupAnyChecked}
                      onChange={(e) => {
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
                    />
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
                          <CustomCheckbox
                            checked={checked.has(key)}
                            onChange={() => toggleItem(key)}
                          />
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
            buttonClass="flex items-center justify-center gap-1 text-sm h-[50px] w-full px-4 bg-white text-[#0088D1] dark:bg-[#0D0D0D] dark:text-[#0088D1] border border-[#0088D1] focus:outline-none focus:ring-0"
            onClick={closeModal}
          />
        </div>
        <div className="w-full gap-1">
          <ActionButton
            label="Send Access"
            labelClass="font-normal text-[12px] md:text-[16px]"
            buttonClass="flex items-center justify-center gap-1 text-sm w-full h-[50px] px-4 bg-[#0088D1] text-white dark:bg-[#01CEE9] dark:text-black border-none focus:outline-none focus:ring-0"
            //   onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
}
