import { useEffect, useRef } from "react";
import { useRealtimeContext } from "@/context/RealtimeContext";

/** Calls `handler(event, payload)` for every realtime signal while mounted. */
export function useRealtime(handler) {
  const { subscribe } = useRealtimeContext();
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => subscribe((event, payload) => ref.current(event, payload)), [subscribe]);
}

/** Runs `fn` every `ms` while `enabled` and the tab is visible — the fallback when realtime is down. */
export function usePolling(fn, ms, enabled = true) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    if (!enabled) return;
    const t = setInterval(() => document.visibilityState === "visible" && ref.current(), ms);
    return () => clearInterval(t);
  }, [ms, enabled]);
}
