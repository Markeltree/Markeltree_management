import { useEffect, useRef, useState } from "react";
import { usePins } from "../context/PinContext";
import { Icon } from "@iconify/react";

export default function PinWrapper({
  id,
  meta,
  skeleton,
  children,
  className = "",
}) {
  const { addPin, pins } = usePins();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  const alreadyPinned = pins.some((p) => p.id === id);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuVisible(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setMenuVisible(true);
  };

  return (
    <div
      className={className}
      onContextMenu={handleContextMenu}
      style={{ position: "relative" }}
    >
      {children}

      {menuVisible && (
        <div
          ref={menuRef}
          className="absolute z-[9999] w-[200px] rounded-xl shadow-lg border
                     bg-white text-black dark:bg-black dark:text-white 
                     border-gray-200 dark:border-gray-700"
          style={{ top: menuPos.y, left: menuPos.x }}
        >
          <button
            disabled={alreadyPinned}
            onClick={() => {
              if (!alreadyPinned) {
                // 🔑 FIX: save only component reference + skeleton
                addPin(id, { ...meta, skeleton });
              }
              setMenuVisible(false);
            }}
            className={`flex items-center gap-2 w-full px-4 py-3 text-sm rounded-xl
              ${
                alreadyPinned
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            <Icon icon="solar:pin-linear" className="text-lg" />
            {alreadyPinned ? "Already pinned" : "Pin this section"}
          </button>
        </div>
      )}
    </div>
  );
}
