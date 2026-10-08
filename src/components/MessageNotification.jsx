import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRealtime } from "@/hooks/useRealtime";
import { Avatar } from "@/components/hr/ui";
import { fullName } from "@/components/hr/utils";

/** Pop-ups for incoming chat messages (NOT-04), unless that conversation is already open. */
export default function MessageNotification() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const viewing = location.pathname === "/chat" ? params.get("c") : null;

  const remove = useCallback((id) => setItems((list) => list.filter((n) => n.id !== id)), []);

  useRealtime(async (event, p) => {
    if (event !== "chat" || p?.kind !== "message" || !p.messageId || p.conversationId === viewing) return;
    try {
      const m = await api.get(`/chat/messages/${p.messageId}`, { cache: false });
      if (m.senderId === user?.id || m.deletedAt) return;
      setItems((list) => [...list.slice(-2), { id: m.id, conversationId: m.conversationId, person: m.sender?.employee, body: m.body }]);
    } catch {
      /* ignore — the unread badge still updates */
    }
  });

  return (
    <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-2">
      {items.map((n) => (
        <NotificationItem
          key={n.id}
          data={n}
          onClose={() => remove(n.id)}
          onNavigate={() => {
            remove(n.id);
            navigate(`/chat?c=${n.conversationId}`);
          }}
        />
      ))}
    </div>
  );
}

function NotificationItem({ data, onClose, onNavigate }) {
  const hideTimer = useRef(null);

  useEffect(() => {
    hideTimer.current = setTimeout(() => onClose(), 6000);
    return () => clearTimeout(hideTimer.current);
  }, [onClose]);

  return (
    <div className="w-80 bg-white dark:bg-[#0B0B0B] rounded-lg shadow-lg p-3 flex gap-3 items-start animate-slide-up cursor-pointer border border-[#6F7C7426]" onClick={onNavigate}>
      <Avatar person={data.person} size={40} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="font-medium text-sm text-gray-900 dark:text-white">{data.person ? fullName(data.person) : "New message"}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close notification"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
          >
            ✕
          </button>
        </div>
        <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">{data.body}</p>
      </div>
    </div>
  );
}
