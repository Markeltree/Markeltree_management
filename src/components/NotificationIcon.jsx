import { useState } from "react";
import { Icon } from "@/common/imports";
import { useLocation, useNavigate } from "react-router-dom";

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

export default function NotificationIcon({
  icon = "carbon:notification",
  iconStyle = "",
  showDot = true,
  dotStyling = "",
  className = "",
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const isActive = location.pathname === "/notifications";

  const filteredNotifications =
    activeTab === "all"
      ? dummyNotifications
      : dummyNotifications.filter((n) => n.unread);

  const grouped = {
    new: filteredNotifications.filter((n) => n.type === "new"),
    today: filteredNotifications.filter((n) => n.type === "today"),
    earlier: filteredNotifications.filter((n) => n.type === "earlier"),
  };

  return (
    <div className="relative">
      {/* Notification Icon Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition
          ${
            isActive
              ? "bg-[#5D5FEF] text-white"
              : "bg-[#F4F6F9] dark:bg-gray-800 text-[#5D5FEF] dark:text-[#5D5FEF]"
          }
          ${className}
        `}
      >
        <Icon
          icon={icon}
          className={`text-xl ${isActive ? "text-white" : ""} ${iconStyle}`}
        />
        {showDot && (
          <span
            className={`absolute top-1 left-[26px] block h-1.5 w-1.5 rounded-full 
              ${isActive ? "bg-white" : "bg-red-500"} 
              ${dotStyling}
            `}
          ></span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex justify-end"
          onClick={() => setOpen(false)}
        >
          {/* Prevent click on panel from closing */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-black transition-all
               w-96 mt-14 mr-4 rounded-xl flex flex-col max-h-[320px]
               border border-gray-200 dark:border-gray-700
               shadow-[0_10px_25px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.4)]"
          >
            {/* Arrow Tip - positioned exactly below notification icon */}
            <div
              className="absolute -top-2 right-[133px] w-0 h-0 
               border-l-8 border-r-8 border-b-8 border-transparent 
               border-b-white dark:border-b-black
               "
            ></div>
            {/* Arrow Tip Border */}
            <div
              className="absolute -top-[9px] right-[133px] w-0 h-0 
               border-l-8 border-r-8 border-b-8 border-transparent 
               border-b-gray-200 dark:border-b-gray-700"
            ></div>

            {/* Header */}
            <div className="flex items-center justify-between pl-4 pr-4 pt-4 pb-3">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                Notifications
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 px-4">
              {["all", "unread"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === tab
                      ? "text-[#5D5FEF] border-b-2 border-[#5D5FEF]"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {tab === "all" ? "All" : "Unread"}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-transparent">
              {Object.entries(grouped).map(([section, items]) =>
                items.length > 0 ? (
                  <div key={section}>
                    <div className="flex justify-between items-center px-4 py-2">
                      <h3 className="text-xs font-semibold uppercase text-gray-500">
                        {section}
                      </h3>
                      {section === "new" && (
                        <button
                          onClick={() => {
                            setOpen(false);
                            navigate("/notifications");
                          }}
                          className="text-xs text-[#5D5FEF] hover:underline"
                        >
                          See all
                        </button>
                      )}
                    </div>
                    <ul>
                      {items.map((n) => (
                        <li
                          key={n.id}
                          className="flex items-start gap-3 px-4 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
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
                            <span className="w-2 h-2 bg-[#5D5FEF] rounded-full mt-2"></span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
