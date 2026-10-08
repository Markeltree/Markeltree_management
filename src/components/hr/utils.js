// Non-component helpers for the HR modules (kept separate from ui.jsx for React Fast Refresh).
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchQuery, onInvalidate, peekQuery } from "@/lib/api";
import { confirmDialog } from "primereact/confirmdialog";

// ── Data fetching ────────────────────────────────────────────────

/** Runs an async loader and tracks loading/error; re-runs when deps change. */
export function useApi(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const seq = useRef(0);
  const run = useCallback(() => {
    const id = ++seq.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    return loader()
      .then((data) => id === seq.current && setState({ data, loading: false, error: null }))
      .catch((error) => id === seq.current && setState((s) => ({ ...s, loading: false, error })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => {
    run();
  }, [run]);
  return { ...state, reload: run };
}

/** Freshness window for rarely-changing lookup lists (writes still invalidate immediately). */
export const LOOKUP_TTL = 5 * 60_000;

/**
 * Cached GET with stale-while-revalidate: renders cached data instantly, refetches in the
 * background when older than `ttl` ms, and refetches automatically after related writes.
 * Pass a falsy `path` to skip.
 */
export function useQuery(path, { ttl = 0 } = {}) {
  const initial = path ? peekQuery(path) : null;
  const [state, setState] = useState({ data: initial?.data ?? null, loading: !!path && !initial, error: null });
  const current = useRef(path);
  current.current = path;

  const load = useCallback(
    (force) => {
      if (!path) return Promise.resolve();
      const cachedEntry = peekQuery(path);
      if (cachedEntry) setState({ data: cachedEntry.data, loading: false, error: null });
      if (!force && cachedEntry && Date.now() - cachedEntry.at < ttl) return Promise.resolve(cachedEntry.data);
      if (!cachedEntry) setState((s) => ({ ...s, loading: true, error: null }));
      return fetchQuery(path, { force })
        .then((data) => current.current === path && setState({ data, loading: false, error: null }))
        .catch((error) => current.current === path && setState((s) => ({ ...s, loading: false, error })));
    },
    [path, ttl]
  );

  useEffect(() => {
    if (!path) return setState({ data: null, loading: false, error: null });
    load(false);
    return onInvalidate((prefix) => path.startsWith(prefix) && load(true));
  }, [path, load]);

  return { ...state, reload: () => load(true) };
}

/** Value that only updates after `ms` without changes — for search boxes and filters. */
export function useDebounce(value, ms = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

// ── Formatting ───────────────────────────────────────────────────

export const fullName = (e) => (e ? `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim() : "—");
// Calendar dates (DATE columns) arrive as "YYYY-MM-DD" or midnight UTC and must render in UTC to avoid shifting a day.
const isCalendarDate = (v) => typeof v === "string" && (v.length === 10 || /T00:00:00(\.000)?Z$/.test(v));
export const fmtDate = (v) => {
  if (!v) return "—";
  const d = new Date(typeof v === "string" && v.length === 10 ? `${v}T00:00:00Z` : v);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric", ...(isCalendarDate(v) && { timeZone: "UTC" }) });
};
export const fmtTime = (v) => (v ? new Date(v).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "—");
export const fmtDateTime = (v) => (v ? `${fmtDate(v)} ${fmtTime(v)}` : "—");
export const fmtMinutes = (m) => (m == null ? "—" : `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`);
export const fmtMoney = (v, currency = "PKR") => {
  const n = Number(v ?? 0);
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
};
export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const humanize = (s) => (s ? String(s).replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) : "—");
export const timeAgo = (v) => {
  const s = Math.round((Date.now() - new Date(v).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return fmtDate(v);
};
export const toInputDate = (d = new Date()) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};

/** Promise-based confirmation using PrimeReact's ConfirmDialog (mounted in ToastProvider). */
export const confirmAction = ({ message, header = "Please confirm", acceptLabel = "Confirm", danger = false }) =>
  new Promise((resolve) =>
    confirmDialog({
      message,
      header,
      icon: danger ? "pi pi-exclamation-triangle" : "pi pi-question-circle",
      acceptLabel,
      rejectLabel: "Cancel",
      acceptClassName: danger ? "p-button-danger" : undefined,
      accept: () => resolve(true),
      reject: () => resolve(false),
      onHide: () => resolve(false),
    })
  );
