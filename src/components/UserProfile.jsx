import { useState, useRef, useEffect } from "react";
import { Avatar } from "@/common/imports";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function UserProfile({ className = "", avatarSize = "medium" }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const { user, displayName, logout } = useAuth();

  const avatar = user?.employee?.avatarUrl || null;
  const initial = displayName?.charAt(0)?.toUpperCase() || "?";
  const subtitle = user?.employee?.designation || user?.role?.name || "";

  // Close dropdown panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={`relative ${className}`} ref={panelRef}>
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <Avatar image={avatar} label={!avatar ? initial : undefined} shape="circle" size={avatarSize} className="bg-[#09BF64] text-white" />
        <div className="hidden md:flex flex-col leading-tight text-left">
          <span className="text-sm font-semibold text-black dark:text-white whitespace-nowrap">{displayName}</span>
          <span className="text-xs text-gray-400 dark:text-gray-400 whitespace-nowrap">{user?.role?.name}</span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50">
          <div className="flex flex-col items-center gap-1 text-center">
            <Avatar image={avatar} label={!avatar ? initial : undefined} shape="circle" size="large" className="bg-[#09BF64] text-white" />
            <span className="font-semibold text-black dark:text-white">{displayName}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</span>
            <span className="text-xs text-gray-400 break-all">{user?.email}</span>
          </div>
          <div className="flex justify-between mt-3 text-[12px] gap-2">
            <button
              className="flex-1 px-3 py-1 bg-[#09BF64] text-white rounded"
              onClick={() => {
                setIsOpen(false);
                navigate("/profile");
              }}
            >
              My Profile
            </button>
            <button onClick={handleLogout} className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
