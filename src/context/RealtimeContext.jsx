import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { api, invalidateQueries } from "@/lib/api";
import { useAuth } from "./AuthContext";

/**
 * Supabase Realtime connection for the signed-in user.
 *
 * The server hands out a private per-user topic and broadcasts *signals* only
 * (e.g. "new message in conversation X"); screens then refetch through the
 * authenticated API. When realtime isn't configured or the socket drops,
 * `connected` is false and screens fall back to polling.
 */
const RealtimeContext = createContext({ connected: false, subscribe: () => () => {} });
export const useRealtimeContext = () => useContext(RealtimeContext);

export function RealtimeProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [connected, setConnected] = useState(false);
  const listeners = useRef(new Set());

  useEffect(() => {
    if (!userId) return;
    let client;
    let channel;
    let cancelled = false;

    (async () => {
      try {
        const cfg = await api.get("/realtime/config", { cache: false });
        if (!cfg.enabled || cancelled) return;
        const { createClient } = await import("@supabase/supabase-js");
        if (cancelled) return;
        client = createClient(cfg.url, cfg.anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
        channel = client
          .channel(cfg.topic)
          .on("broadcast", { event: "*" }, ({ event, payload }) => {
            // Keep cached reads fresh, then let screens react (e.g. append a chat message).
            if (event === "notification") invalidateQueries("/notifications");
            if (event === "chat" && payload?.kind !== "typing") {
              invalidateQueries("/chat/unread");
              invalidateQueries("/chat/conversations");
            }
            listeners.current.forEach((fn) => fn(event, payload));
          })
          .subscribe((status) => setConnected(status === "SUBSCRIBED"));
      } catch (e) {
        console.warn("Realtime unavailable, falling back to polling:", e.message);
      }
    })();

    return () => {
      cancelled = true;
      setConnected(false);
      if (client && channel) client.removeChannel(channel);
    };
  }, [userId]);

  const subscribe = useCallback((fn) => {
    listeners.current.add(fn);
    return () => listeners.current.delete(fn);
  }, []);
  const value = useMemo(() => ({ connected, subscribe }), [connected, subscribe]);
  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}
