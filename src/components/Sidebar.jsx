import {
  useEffect,
  useState,
  useRef,
  TieredMenu,
  useSidebar,
} from "@/common/imports";
import "../index.css";
import { useNavigate, useLocation } from "react-router-dom";
import TooltipPortal from "@/components/TooltipPortal";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeContext } from "@/context/RealtimeContext";
import { useQuery } from "@/components/hr/utils";
import { usePolling } from "@/hooks/useRealtime";

export default function Sidebar() {
  const menuRef = useRef(null);
  const [selected, setSelected] = useState("dashboard");
  const { collapsed, enableTransition } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSelected(getActiveKey(location.pathname));
  }, [location.pathname]);

  // Real unread chat count; realtime invalidates it, polling is only the fallback.
  const { connected } = useRealtimeContext();
  const chatUnread = useQuery("/chat/unread");
  const unreadCount = chatUnread.data?.total ?? 0;
  usePolling(chatUnread.reload, 30_000, !connected);

  const { can, logout } = useAuth();

  // HR platform modules (FRD §9). `perms` hides entries the user can't use — the API still enforces access.
  const allMenuItems = [
    { key: "dashboard", label: "Dashboard", icon: <i className="pi pi-home text-xl" />, path: "/dashboard" },
    { key: "chat", label: "Chat", icon: <i className="pi pi-comments text-xl" />, path: "/chat" },
    { key: "employees", label: "Employees", icon: <i className="pi pi-users text-xl" />, path: "/employees" },
    { key: "attendance", label: "Attendance", icon: <i className="pi pi-clock text-xl" />, path: "/attendance" },
    { key: "leave", label: "Leave", icon: <i className="pi pi-calendar-minus text-xl" />, path: "/leave" },
    { key: "task", label: "Tasks", icon: <i className="pi pi-check-square text-xl" />, path: "/task" },
    { key: "announcements", label: "Announcements", icon: <i className="pi pi-megaphone text-xl" />, path: "/announcements" },
    { separator: true },
    {
      key: "reports",
      label: "Reports",
      icon: <i className="pi pi-chart-line text-xl" />,
      path: "/reports",
      perms: ["reports.view_all", "reports.view_team", "attendance.view_team", "attendance.view_all", "leave.view_all"],
    },
    {
      key: "payroll",
      label: "Payroll",
      icon: <i className="pi pi-wallet text-xl" />,
      path: "/payroll",
      perms: ["payroll.manage", "payroll.approve"],
    },
    {
      key: "admin",
      label: "Administration",
      icon: <i className="pi pi-shield text-xl" />,
      path: "/admin",
      perms: ["admin.users", "admin.roles", "admin.settings", "admin.audit", "org.manage", "leave.manage_policy", "holidays.manage"],
    },
    { separator: true },
    { key: "profile", label: "My Profile", icon: <i className="pi pi-user text-xl" />, path: "/profile" },
    { key: "help", label: "Help", icon: <i className="pi pi-question-circle text-xl" />, path: "/help" },
    {
      key: "signout",
      label: "Sign Out",
      icon: <i className="pi pi-sign-out text-xl" />,
      onClick: async () => {
        await logout();
        navigate("/login", { replace: true });
      },
    },
  ];
  const menuItems = allMenuItems.filter((m) => !m.perms || can(...m.perms));

  const getActiveKey = (pathname) => {
    if (pathname.startsWith("/notes")) {
      return "task";
    }

    const candidates = menuItems
      .filter((m) => m.path)
      .filter(
        (m) =>
          pathname === m.path ||
          pathname.startsWith(m.path + "/") ||
          pathname.startsWith(m.path)
      )
      .sort((a, b) => b.path.length - a.path.length);

    return candidates.length ? candidates[0].key : "dashboard";
  };

  const [tip, setTip] = useState({ visible: false, text: "", rect: null });

  const showTip = (e, label) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTip({ visible: true, text: label, rect });
  };
  const hideTip = () => setTip({ visible: false, text: "", rect: null });

  const itemsWithTemplate = menuItems.map((item, index) => {
    if (item.separator) {
      return {
        template: () => (
          <hr
            key={`separator-${index}`}
            className={`border-t border-gray-300 dark:border-gray-600 my-2 w-full items-center justify-center ${
              collapsed ? "pl-12 w-[1%] items-center justify-center" : "mx-2"
            }`}
          />
        ),
      };
    }

    return {
      ...item,
      template: () => (
        <div
          onClick={() => {
            if (item.onClick) return item.onClick();
            setSelected(item.key);
            if (item.path) navigate(item.path);
            if (window.innerWidth < 1280) {
              const event = new Event("collapseSidebar");
              window.dispatchEvent(event);
            }
          }}
          onMouseEnter={(e) => collapsed && showTip(e, item.label)}
          onMouseLeave={hideTip}
          className={`relative group flex items-center mb-2
      ${collapsed ? "p-3 rounded-xl w-11" : "p-3 rounded-lg hover:rounded-xl"}
      cursor-pointer focus:outline-none focus:ring-0
      ${
        selected === item.key
          ? "bg-[#0088D1] text-white dark:bg-[#01CEE9]"
          : "hover:bg-[#0088D11A] dark:hover:bg-[#01CEE940] text-[#6E7A86] dark:text-[#8E8E9C]"
      }
    `}
        >
          <div
            className={`${
              collapsed ? "" : "mr-2"
            } flex items-center justify-center relative`}
          >
            {item.icon}
            {/* Badge on top of icon when collapsed */}
            {collapsed && item.key === "chat" && unreadCount > 0 && (
              <span
                className={`absolute -top-2 -right-3 ${
                  selected === item.key
                    ? "bg-white text-[#0088D1]"
                    : "bg-[#0088D1] text-white"
                } text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center`}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>

          {!collapsed && (
            <span className="text-[12px] font-medium whitespace-nowrap flex items-center gap-3">
              {item.label}
              {item.key === "chat" && unreadCount > 0 && (
                <span
                  className={`${
                    selected === item.key
                      ? "bg-white text-[#0088D1]"
                      : "bg-[#0088D1] text-white"
                  } text-[10px] font-bold px-1.5 py-0.5 rounded-full`}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </span>
          )}
        </div>
      ),
    };
  });

  return (
    <>
      <div
        className={`
    ${
      collapsed
        ? "w-0 hidden lg:!block lg:!w-[70px] lg:!relative"
        : "w-[232px] lg:top-[115px] xl:top-0"
    }
    ${enableTransition ? "transition-all duration-300 ease-in-out" : ""}
    bg-white dark:bg-[#000000] text-[#6E7A86] dark:text-white
    overflow-y-auto ${
      collapsed ? "overflow-hidden" : "overflow-x-hidden"
    } scrollbar-hide
    h-[calc(100vh-55px)]
    top-[55px] z-40
    fixed xl:relative lg:top-0 lg:left-0 
  `}
      >
        <TieredMenu
          ref={menuRef}
          model={itemsWithTemplate}
          popup={false}
          className={`border-none shadow-none bg-transparent ${
            collapsed ? "ml-4 mr-0" : "ml-4 mr-4"
          } lg:mb-20 xl:mb-4`}
        />
      </div>

      <TooltipPortal
        visible={tip.visible && collapsed}
        text={tip.text}
        rect={tip.rect}
      />
    </>
  );
}
