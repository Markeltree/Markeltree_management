import { useRef, useLayoutEffect } from "@/common/imports";
import { useState, useContext, createContext } from "react";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [enableTransition, setEnableTransition] = useState(true);
  const firstRender = useRef(true);

  useLayoutEffect(() => {
    const handleResize = () => {
      // Disable transition for first auto collapse
      if (firstRender.current) {
        setEnableTransition(false);
      }

      if (window.innerWidth < 1280) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }

      if (firstRender.current) {
        firstRender.current = false;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    const handleCollapseEvent = () => {
      setEnableTransition(true);
      setCollapsed(true);
    };

    window.addEventListener("collapseSidebar", handleCollapseEvent);
    return () =>
      window.removeEventListener("collapseSidebar", handleCollapseEvent);
  }, []);

  const manualToggleSidebar = () => {
    setEnableTransition(true);
    setCollapsed((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        enableTransition,
        manualToggleSidebar,
        setCollapsed,
        setEnableTransition,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
