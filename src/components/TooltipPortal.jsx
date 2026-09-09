import { createPortal } from "react-dom";

export default function TooltipPortal({ visible, text, rect, offset = 10 }) {
  if (!visible || !rect) return null;

  const top = rect.top + rect.height / 2;
  const left = rect.right + offset;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top,
        left,
        transform: "translateY(-50%)",
        zIndex: 9999, // above everything
      }}
      className="px-3 py-1.5 rounded-md text-xs text-white dark:text-black bg-black dark:bg-white shadow-lg pointer-events-none whitespace-nowrap"
    >
      {text}
    </div>,
    document.body
  );
}
