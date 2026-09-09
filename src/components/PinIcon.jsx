import { Icon } from "@iconify/react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PinIcon({
  icon = "solar:pin-linear",
  iconStyle = "",
  showDot = true,
  dotStyling = "bg-red-500",
  className = "",
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = location.pathname === "/pinsection";

  return (
    <button
      onClick={() => navigate("/pinsection")}
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition
        ${
          isActive
            ? "bg-[#5D5FEF] text-white"
            : "bg-[#F4F6F9] dark:bg-gray-800 text-[#5D5FEF] dark:text-white"
        }
        ${className}`}
    >
      <Icon
        icon={icon}
        className={`text-xl ${isActive ? "text-white" : ""} ${iconStyle}`}
      />
      {showDot && (
        <span
          className={`absolute top-1 left-[26px] block h-1.5 w-1.5 rounded-full 
            ${isActive ? "bg-white" : dotStyling}`}
        ></span>
      )}
    </button>
  );
}
