export default function Loading({
  size = 50,
  height = "100%",
  fullscreen = false,
}) {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#0D0D0D]">
        <svg
          className="animate-spin"
          style={{ width: size, height: size, color: "#0088D1" }}
          viewBox="0 0 50 50"
        >
          <circle
            className="opacity-25"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            fill="currentColor"
            d="M25 5a20 20 0 0 1 20 20h-5a15 15 0 0 0-15-15V5z"
          />
        </svg>
      </div>
    );
  }

  // Regular inline mode (used for charts, cards, etc.)
  return (
    <div
      className="flex items-center justify-center bg-transparent dark:bg-[#0D0D0D]"
      style={{
        height,
        width: "100%",
      }}
    >
      <svg
        className="animate-spin"
        style={{ width: size, height: size, color: "#e5e7eb" }}
        viewBox="0 0 50 50"
      >
        <circle
          className="opacity-25"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          fill="currentColor"
          d="M25 5a20 20 0 0 1 20 20h-5a15 15 0 0 0-15-15V5z"
        />
      </svg>
    </div>
  );
}
