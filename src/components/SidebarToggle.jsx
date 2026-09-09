import { useSidebar, Icon } from "@/common/imports";

export default function SidebarToggle({ styling = "" }) {
  const { collapsed, manualToggleSidebar } = useSidebar();

  return (
    <button onClick={manualToggleSidebar} className={styling}>
      <Icon
        icon={collapsed ? "line-md:menu-unfold-right" : "ri:menu-fold-3-line"}
        width="22"
        height="22"
      />
    </button>
  );
}
