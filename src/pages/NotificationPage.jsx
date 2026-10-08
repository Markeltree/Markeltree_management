import { useState, useMemo } from "react";
import { Icon, ActionButton, SearchBox } from "@/common/imports";

const dummyNotifications = [
  {
    id: 1,
    user: "Taha Asim",
    text: "New message from Taha Asim",
    time: "3w",
    type: "new",
    unread: true,
  },
  {
    id: 2,
    user: "Payment",
    text: "Invoice #98765 has been successfully paid.",
    time: "2w",
    type: "today",
    unread: true,
  },
  {
    id: 3,
    user: "Testing",
    text: "Invoice #98765 has been successfully paid.",
    time: "4w",
    type: "earlier",
    unread: false,
  },
  {
    id: 4,
    user: "Test",
    text: "Invoice #98765 has been successfully paid.",
    time: "4w",
    type: "earlier",
    unread: true,
  },
  {
    id: 5,
    user: "Invoice",
    text: "Invoice #98765 has been successfully paid.",
    time: "1m",
    type: "new",
    unread: false,
  },
];

const tabTitles = [
  {
    heading: "Notification",
    subheading: "Real-time data on notification provided by system.",
  },
];

export default function NotificationPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [globalFilter, setGlobalFilter] = useState("");

  const filteredNotifications = useMemo(() => {
    let list =
      activeTab === "all"
        ? dummyNotifications
        : dummyNotifications.filter((n) => n.unread);

    if (globalFilter) {
      list = list.filter(
        (n) =>
          n.user.toLowerCase().includes(globalFilter.toLowerCase()) ||
          n.text.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }
    return list;
  }, [activeTab, globalFilter]);

  const grouped = {
    new: filteredNotifications.filter((n) => n.type === "new"),
    today: filteredNotifications.filter((n) => n.type === "today"),
    earlier: filteredNotifications.filter((n) => n.type === "earlier"),
  };

  return (
    <div className="flex-1 pl-3 pr-3 pt-4 bg-gray-50 dark:bg-[#141414]">
      {/* --- Top Section --- */}
      <div className="flex lg:flex-row justify-between items-center mb-4 gap-2">
        <h1 className="hidden lg:block text-[14px] font-semibold text-[#09BF64] dark:text-[#09BF64]">
          Notification
        </h1>

        <div className="flex flex-wrap justify-between md:justify-end items-center gap-2 w-full">
          {/* Refresh */}
          <ActionButton
            label="Refresh"
            iconLight="./refreshIcon.png"
            iconDark="./refreshIcon.png"
            iconPos="left"
            labelClass="font-normal md:font-bold"
            buttonClass="flex items-center justify-center gap-2 text-[9px] md:text-[12px] h-[24px] md:h-[45px] w-auto px-1 md:px-4 bg-white text-[#09BF64] dark:bg-[#0D0D0D] dark:text-[#09BF64] border border-[#09BF64]"
          />

          {/* Mark all as read */}
          <ActionButton
            label="Mark all as read"
            iconLight={
              <Icon
                icon="charm:tick"
                className="text-white dark:text-black w-[12px] md:w-[15px] h-[12px] md:h-[15px]"
              />
            }
            labelClass="font-normal md:font-bold"
            buttonClass="flex items-center justify-center gap-2 text-[9px] md:text-[12px] h-[24px] md:h-[45px] w-auto px-1 md:px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-black border border-[#09BF64]"
          />

          {/* Clear all */}
          <ActionButton
            label="Clear all"
            iconLight={
              <Icon
                icon="radix-icons:cross-2"
                className="text-white dark:text-black w-[12px] md:w-[15px] h-[12px] md:h-[15px]"
              />
            }
            labelClass="font-normal md:font-bold"
            buttonClass="flex items-center justify-center gap-2 text-[9px] md:text-[12px] h-[24px] md:h-[45px] w-auto px-1 md:px-4 bg-[#09BF64] text-white dark:bg-[#81D959] dark:text-black border border-[#09BF64]"
          />
        </div>
      </div>

      {/* Subtitle + Search */}
      <div className="flex flex-col md:flex-row gap-2 items-center w-full bg-white dark:bg-black rounded-lg p-4">
        <div className="flex flex-col gap-1 w-full">
          <h2 className="text-[#333333] dark:text-[#EFFBF3] font-bold text-[16px] lg:text-[18px]">
            {tabTitles[0].heading}
          </h2>
          <p className="text-[12px] lg:text-[14px] text-[#666666] dark:text-[#EFFBF3]">
            {tabTitles[0].subheading}
          </p>
        </div>
        <div className="flex justify-end w-full">
          <SearchBox
            styling="w-[250px] h-9 pl-10 pr-4 rounded-2xl text-sm bg-[#F4F6F9] dark:bg-gray-800 text-black dark:text-white border-none focus:outline-none"
            placeholder="Search notifications..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs + Notifications in same container */}
      <div className="bg-white dark:bg-black rounded-lg mt-4">
        {/* Tabs */}
        <div className="flex gap-4 px-4 py-2 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-black z-10">
          {["all", "unread"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium ${
                activeTab === tab
                  ? "text-[#09BF64] border-b-2 border-[#09BF64]"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {tab === "all" ? "All" : "Unread"}
            </button>
          ))}
        </div>

        {/* Notifications (scrollable area) */}
        <div className="overflow-y-auto max-h-[500px]">
          {Object.entries(grouped).map(([section, items]) =>
            items.length > 0 ? (
              <div key={section}>
                <div className="flex justify-between items-center px-4 py-2">
                  <h3 className="text-xs font-semibold uppercase text-gray-500">
                    {section}
                  </h3>
                </div>
                <ul>
                  {items.map((n) => (
                    <li
                      key={n.id}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-[#09BF641A] dark:hover:bg-[#81D95940] transition"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                        {n.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          <span className="font-semibold">{n.user}</span>{" "}
                          {n.text}
                        </p>
                        <p className="text-xs text-gray-500">{n.time}</p>
                      </div>
                      {n.unread && (
                        <span className="w-2 h-2 bg-[#09BF64] rounded-full mt-2"></span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          )}
        </div>
      </div>

      <div className="pb-5"></div>
    </div>
  );
}
