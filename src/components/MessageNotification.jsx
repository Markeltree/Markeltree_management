import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MessageNotification() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const addNotification = (notification) => {
    setNotifications((prev) => {
      const newList = [...prev, notification];
      // Keep only last 3
      if (newList.length > 3) newList.shift();
      return newList;
    });
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationNavigate = (username) => {
    if (!username) return;

    // Immediately update the URL (keeps Activity & Dashboard behaviour consistent)
    navigate(`/chat?user=${encodeURIComponent(username)}`, { replace: false });

    // ✅ Dispatch a custom event so ChatPanel can react and set activeUser instantly
    window.dispatchEvent(
      new CustomEvent("open-chat-from-notification", { detail: { username } })
    );
  };

  // Dummy notification trigger (replace this with your real trigger)
  useEffect(() => {
    const dummyNotifications = [
      {
        id: Date.now(),
        avatar: "/avatar1.png",
        username: "John Smith",
        message:
          "Hey! This is a dummy message to demonstrate the notification UI. If it's too long it will be truncated.",
      },
      {
        id: Date.now() + 1,
        avatar: "/avatar2.png",
        username: "Michael Brown",
        message: "Another message to show stacking notifications.",
      },
      {
        id: Date.now() + 2,
        avatar: "/avatar3.png",
        username: "Sophia Taylor",
        message: "Third notification example.",
      },
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < dummyNotifications.length) {
        addNotification(dummyNotifications[index]);
        index++;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-2">
      {notifications.map((notif) => (
        <NotificationItem
          key={notif.id}
          data={notif}
          onClose={() => removeNotification(notif.id)}
          onNavigate={() => handleNotificationNavigate(notif.username)}
        />
      ))}
    </div>
  );
}

// Individual Notification Component
function NotificationItem({ data, onClose, onNavigate }) {
  const hideTimer = useRef(null);

  useEffect(() => {
    // Auto-hide after 5s
    hideTimer.current = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(hideTimer.current);
  }, [onClose]);

  return (
    <div
      className="w-80 bg-white dark:bg-[#0B0B0B] rounded-lg shadow-lg p-3 flex gap-3 items-start animate-slide-up cursor-pointer"
      onClick={onNavigate}
    >
      {/* Avatar */}
      <img
        src={data.avatar}
        alt={`${data.username} avatar`}
        className="w-10 h-10 rounded-xl flex-shrink-0"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="font-medium text-sm text-gray-900 dark:text-white">
            {data.username}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering navigation
              onClose();
            }}
            aria-label="Close notification"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
          >
            ✕
          </button>
        </div>
        <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
          {data.message}
        </p>
      </div>
    </div>
  );
}
