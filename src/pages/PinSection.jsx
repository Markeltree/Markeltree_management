import { useEffect, useRef, useState } from "react";
import { usePins } from "../context/PinContext";
import { Icon } from "@iconify/react";
import ActionButton from "../components/ActionButton";
import { useNavigate } from "react-router-dom";

export default function PinSection() {
  const { pins, removePin, clearPins } = usePins();
  const navigate = useNavigate();

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [activePinId, setActivePinId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const onGlobalClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuVisible(false);
        setActivePinId(null);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuVisible(false);
        setActivePinId(null);
      }
    };
    window.addEventListener("click", onGlobalClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onGlobalClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const showUnpinMenu = (e, id) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setActivePinId(id);
    setMenuVisible(true);
  };

  return (
    <div className="flex-1 pl-3 pr-3 pt-4 bg-gray-50 dark:bg-[#141414]">
      <div className="flex flex-row gap-4 justify-between items-center">
        <h1
          className="text-[#09BF64] text-[14px] flex flex-row items-center gap-1 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <Icon icon="ion:arrow-back-outline" />
          Back
        </h1>

        <ActionButton
          label="Unpin all"
          iconLight={<Icon icon="fluent-mdl2:unpin" className="w-4 h-4" />}
          iconDark={<Icon icon="fluent-mdl2:unpin" className="w-4 h-4" />}
          iconPos="left"
          buttonClass="flex items-center justify-center gap-2 text-[14px] h-[45px] w-auto bg-[#09BF64] px-3 text-white dark:text-black border-none focus:outline-none focus:ring-0"
          iconClass="text-white dark:text-black w-5 h-5"
          onClick={() => {
            clearPins();
            setMenuVisible(false);
            setActivePinId(null);
          }}
        />
      </div>

      <div>
        {pins.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No sections pinned yet. Right-click any section to pin it.
          </p>
        ) : (
          <div className="flex flex-col">
            {pins.map((pin) => (
              <div
                key={pin.id}
                onContextMenu={(e) => showUnpinMenu(e, pin.id)}
                className="w-full relative"
              >
                {/* ✅ FIX: use pin.component (lowercase c) */}
                <PinWithSkeleton
                  skeleton={pin.skeleton}
                  Component={pin.component}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {menuVisible && activePinId && (
        <div
          ref={menuRef}
          className="fixed z-[9999] w-[200px] rounded-xl shadow-lg border bg-white text-black dark:bg-black dark:text-white border-gray-200 dark:border-gray-700"
          style={{
            top: Math.min(menuPos.y, window.innerHeight - 120),
            left: Math.min(menuPos.x, window.innerWidth - 220),
          }}
        >
          <button
            onClick={() => {
              removePin(activePinId);
              setMenuVisible(false);
              setActivePinId(null);
            }}
            className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
          >
            <Icon icon="fluent-mdl2:unpin" className="text-lg" />
            Unpin this section
          </button>
        </div>
      )}

      <div className="pt-4"></div>
    </div>
  );
}

// 🔹 Skeleton → then actual Component
function PinWithSkeleton({ skeleton, Component }) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return showSkeleton ? skeleton : Component ? <Component /> : null;
}
