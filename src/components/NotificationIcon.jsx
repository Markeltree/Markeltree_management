import { useState } from "react";
import { Icon } from "@/common/imports";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { timeAgo, useQuery } from "@/components/hr/utils";
import { useToast } from "@/context/ToastContext";
import { useRealtimeContext } from "@/context/RealtimeContext";
import { usePolling, useRealtime } from "@/hooks/useRealtime";

const TYPE_ICON = {
  TASK_ASSIGNED: "mdi:clipboard-check-outline",
  TASK_UPDATED: "mdi:clipboard-arrow-right-outline",
  TASK_COMMENT: "mdi:comment-text-outline",
  MENTION: "mdi:at",
  LEAVE_SUBMITTED: "mdi:calendar-clock",
  LEAVE_DECIDED: "mdi:calendar-check",
  ATTENDANCE_EXCEPTION: "mdi:clock-alert-outline",
  ANNOUNCEMENT: "mdi:bullhorn-outline",
  ONBOARDING: "mdi:account-plus-outline",
  PROJECT_ADDED: "mdi:folder-account-outline",
  CHAT_MESSAGE: "mdi:message-outline",
  PAYSLIP: "mdi:cash-check",
};

const isToday = (d) => new Date(d).toDateString() === new Date().toDateString();

export default function NotificationIcon({ icon = "carbon:notification", iconStyle = "", showDot = true, dotStyling = "", className = "" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const isActive = location.pathname === "/notifications";
  const toast = useToast();
  const { connected } = useRealtimeContext();
  const count = useQuery("/notifications/unread-count");
  const list = useQuery(open ? `/notifications?pageSize=20${activeTab === "unread" ? "&unread=true" : ""}` : null);
  const unread = count.data?.unread ?? 0;
  const items = list.data?.items ?? [];

  // Realtime keeps the count fresh (the provider invalidates /notifications); poll only as a fallback.
  usePolling(count.reload, 60_000, !connected);
  useRealtime(async (event) => {
    if (event !== "notification") return;
    try {
      const latest = await api.get("/notifications?pageSize=1", { cache: false });
      const n = latest.items[0];
      if (n && !n.readAt) toast.info(n.body ?? "", n.title);
    } catch {
      /* the badge still updates */
    }
  });

  const openItem = async (n) => {
    if (!n.readAt) await api.post("/notifications/read", { ids: [n.id] }).catch(() => {});
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const markAllRead = () => api.post("/notifications/read", {}).catch(() => {});

  const grouped = {
    new: items.filter((n) => !n.readAt && isToday(n.createdAt)),
    today: items.filter((n) => n.readAt && isToday(n.createdAt)),
    earlier: items.filter((n) => !isToday(n.createdAt)),
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition
          ${isActive ? "bg-[#09BF64] text-white" : "bg-[#F4F6F9] dark:bg-gray-800 text-[#09BF64] dark:text-[#09BF64]"}
          ${className}
        `}
      >
        <Icon icon={icon} className={`text-xl ${isActive ? "text-white" : ""} ${iconStyle}`} />
        {showDot && unread > 0 && (
          <span
            className={`absolute top-1 left-[26px] block h-1.5 w-1.5 rounded-full
              ${isActive ? "bg-white" : "bg-red-500"}
              ${dotStyling}
            `}
          ></span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] flex justify-end" onClick={() => setOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-black transition-all
               w-96 max-w-[calc(100vw-2rem)] mt-14 mr-4 rounded-xl flex flex-col max-h-[420px]
               border border-gray-200 dark:border-gray-700
               shadow-[0_10px_25px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center justify-between pl-4 pr-4 pt-4 pb-3">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Notifications</h2>
              <div className="flex items-center gap-3">
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-xs text-[#09BF64] hover:underline">
                    Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  ✕
                </button>
              </div>
            </div>

            <div className="flex gap-4 px-4">
              {["all", "unread"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === tab ? "text-[#09BF64] border-b-2 border-[#09BF64]" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {tab === "all" ? "All" : `Unread${unread ? ` (${unread})` : ""}`}
                </button>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/notifications");
                }}
                className="ml-auto pb-2 text-xs text-[#09BF64] hover:underline"
              >
                See all
              </button>
            </div>

            <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-transparent pb-2">
              {items.length === 0 && <p className="text-center text-sm text-gray-500 py-6">You're all caught up.</p>}
              {Object.entries(grouped).map(([section, list]) =>
                list.length > 0 ? (
                  <div key={section}>
                    <h3 className="text-xs font-semibold uppercase text-gray-500 px-4 py-2">{section}</h3>
                    <ul>
                      {list.map((n) => (
                        <li
                          key={n.id}
                          onClick={() => openItem(n)}
                          className="flex items-start gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-full bg-[#09BF641A] text-[#09BF64] flex items-center justify-center shrink-0">
                            <Icon icon={TYPE_ICON[n.type] ?? "carbon:notification"} width={18} height={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">{n.title}</p>
                            {n.body && <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{n.body}</p>}
                            <p className="text-xs text-gray-500">{timeAgo(n.createdAt)}</p>
                          </div>
                          {!n.readAt && <span className="w-2 h-2 bg-[#09BF64] rounded-full mt-2 shrink-0"></span>}
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
