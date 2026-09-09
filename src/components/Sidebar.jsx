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

export default function Sidebar() {
  const menuRef = useRef(null);
  const [selected, setSelected] = useState("dashboard");
  const [unreadCount, setUnreadCount] = useState(0);

  const { collapsed, enableTransition } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSelected(getActiveKey(location.pathname));
  }, [location.pathname]);

  // Initialize unread count from localStorage on mount
  useEffect(() => {
    const storedCount = localStorage.getItem("unreadNotificationCount");
    if (storedCount) {
      setUnreadCount(parseInt(storedCount, 10));
    }
  }, []);

  // Listen for unread count updates
  useEffect(() => {
    const handleUnreadCountUpdate = (e) => {
      const count = e.detail.count;
      setUnreadCount(count);
      // Store in localStorage so it persists across page navigations
      localStorage.setItem("unreadNotificationCount", count.toString());
    };

    window.addEventListener("updateUnreadCount", handleUnreadCountUpdate);

    return () => {
      window.removeEventListener("updateUnreadCount", handleUnreadCountUpdate);
    };
  }, []);

  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <i className="pi pi-home text-xl" />,
      path: "/dashboard",
    },
    {
      key: "chat",
      label: "Chat",
      icon: <i className="pi pi-comments text-xl" />,
      path: "/chat",
    },
    {
      key: "inventoryManagement",
      label: "Inventory Management",
      icon: <i className="pi pi-box text-xl" />,
      path: "/inventory",
    },
    {
      key: "productManagement",
      label: "Product Management",
      icon: <i className="pi pi-tags text-xl" />,
      path: "/product",
    },
    {
      key: "logistics",
      label: "Logistics",
      icon: <i className="pi pi-truck text-xl" />,
      path: "/logistics",
    },
    {
      key: "orderManagement",
      label: "Order Management",
      icon: <i className="pi pi-shopping-cart text-xl" />,
      path: "/order",
    },
    {
      key: "customer",
      label: "Customer",
      icon: <i className="pi pi-users text-xl" />,
      path: "/customer",
    },
    {
      key: "manufacturer",
      label: "Manufacturer",
      icon: <i className="pi pi-building text-xl" />,
      path: "/manufacturer",
    },
    { separator: true },
    {
      key: "reporting",
      label: "Reporting",
      icon: <i className="pi pi-chart-line text-xl" />,
      path: "/report",
    },
    {
      key: "accounts",
      label: "Accounts",
      icon: <i className="pi pi-credit-card text-xl" />,
      path: "/accounts",
    },
    {
      key: "task",
      label: "Task",
      icon: <i className="pi pi-credit-card text-xl" />,
      path: "/task",
    },
    { separator: true },
    {
      key: "settings",
      label: "Settings",
      icon: <i className="pi pi-cog text-xl" />,
      path: "/settings",
    },
    {
      key: "feedback",
      label: "Feedback",
      icon: <i className="pi pi-comment text-xl" />,
      path: "/feedback",
    },
    {
      key: "help",
      label: "Help",
      icon: <i className="pi pi-question-circle text-xl" />,
      path: "/help",
    },
    {
      key: "signout",
      label: "Sign Out",
      icon: <i className="pi pi-sign-out text-xl" />,
      path: "/login",
    },
  ];

  const getActiveKey = (pathname) => {
    if (pathname.startsWith("/logistic")) {
      return "logistics";
    }
    if (pathname.startsWith("/notes")) {
      return "task";
    }
    if (pathname.startsWith("/manufacturer")) {
      return "manufacturer";
    }

    if (pathname.startsWith("/viewreport")) {
      return "reporting";
    }
    if (
      pathname.startsWith("/lowstock") ||
      pathname.startsWith("/outofstock") ||
      pathname.startsWith("/nearexpiry")
    ) {
      return "productManagement";
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
          ? "bg-[#5D5FEF] text-white dark:bg-[#7476F1]"
          : "hover:bg-[#5D5FEF1A] dark:hover:bg-[#7476F140] text-[#737791] dark:text-[#8E8E9C]"
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
                    ? "bg-white text-[#5D5FEF]"
                    : "bg-[#5D5FEF] text-white"
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
                      ? "bg-white text-[#5D5FEF]"
                      : "bg-[#5D5FEF] text-white"
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
    bg-white dark:bg-[#000000] text-[#737791] dark:text-white
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
