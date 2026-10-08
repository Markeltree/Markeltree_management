import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/common/imports";
import { AnimatePresence, motion } from "framer-motion";
import { useSidebar } from "@/context/SidebarContext";
import { useEffect } from "react";

export default function ChatLayout() {
  const location = useLocation();
  const { setCollapsed, setEnableTransition } = useSidebar();

  // Force sidebar to be collapsed for chat layout
  useEffect(() => {
    setEnableTransition(true);
    setCollapsed(true);

    // Cleanup: restore normal sidebar behavior when leaving chat
    return () => {
      // Reset to default behavior (collapsed on mobile, expanded on desktop)
      if (window.innerWidth >= 1280) {
        setCollapsed(false);
      } else {
        setCollapsed(true);
      }
    };
  }, [setCollapsed, setEnableTransition]);

  return (
    <>
      <style>{`
        .chat-layout-container .sidebar-wrapper > div {
          width: 70px !important;
          min-width: 70px !important;
        }
      `}</style>
      <div className="h-screen flex chat-layout-container">
        {/* Collapsed Sidebar (70px width - same as other pages) */}
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>

        {/* Chat Content - Full height without topbar/footer */}
        <div className="flex-1 bg-gray-50 dark:bg-[#141414] overflow-auto scrollbar-thin scrollbar-thumb-[#8E8E9C2E] scrollbar-track-[#EFFBF3] dark:scrollbar-thumb-[#8E8E9C2E] dark:scrollbar-track-[#141414]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
