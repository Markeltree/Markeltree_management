// HTTP client for the Markeltree HR API.
// Access token lives in memory only; the refresh token is an httpOnly cookie
// scoped to /api/auth, so a 401 triggers one silent refresh and a retry.

const BASE = import.meta.env.VITE_API_URL || "/api";

let accessToken = null;
let refreshPromise = null;
let onSessionExpired = () => {};

export const setAccessToken = (token) => {
  accessToken = token;
};
export const setSessionExpiredHandler = (fn) => {
  onSessionExpired = fn;
};

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function rawRequest(method, path, body, { headers, signal } = {}) {
  const res = await fetch(BASE + path, {
    method,
    credentials: "include",
    signal,
    headers: {
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return res;
}

/** Refreshes the session once, even if many requests fail at the same time. */
export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = rawRequest("POST", "/auth/refresh")
      .then(async (res) => {
        if (!res.ok) throw new ApiError(res.status, "Session expired");
        const data = await res.json();
        setAccessToken(data.accessToken);
        return data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function parseError(res) {
  let message = `Request failed (${res.status})`;
  let details;
  try {
    const data = await res.json();
    message = data?.error?.message || message;
    details = data?.error?.details;
  } catch {
    /* non-JSON error body */
  }
  if (details?.length) {
    message = `${message}: ${details.map((d) => d.message).join("; ")}`;
  }
  return new ApiError(res.status, message, details);
}

export async function request(method, path, body, opts = {}) {
  let res = await rawRequest(method, path, body, opts);
  const isSessionEndpoint = ["/auth/login", "/auth/refresh", "/auth/logout"].some((p) => path.startsWith(p));
  if (res.status === 401 && !isSessionEndpoint) {
    try {
      await refreshSession();
      res = await rawRequest(method, path, body, opts);
    } catch {
      setAccessToken(null);
      onSessionExpired();
      throw new ApiError(401, "Your session has expired. Please sign in again.");
    }
  }
  if (!res.ok) throw await parseError(res);
  if (opts.raw) return res;
  const type = res.headers.get("content-type") || "";
  return type.includes("application/json") ? res.json() : res.text();
}

// ── Query cache ──────────────────────────────────────────────────
// GET responses are cached by path and concurrent identical GETs share one request.
// Successful writes invalidate cached reads so screens revalidate (see useQuery).

const queryCache = new Map(); // path -> { data, at }
const inflightGets = new Map(); // path -> Promise
const invalidationListeners = new Set();

export const peekQuery = (path) => queryCache.get(path);

export function fetchQuery(path, { force = false } = {}) {
  if (!force && inflightGets.has(path)) return inflightGets.get(path);
  const p = request("GET", path)
    .then((data) => {
      if (inflightGets.get(path) === p) queryCache.set(path, { data, at: Date.now() });
      return data;
    })
    .finally(() => {
      if (inflightGets.get(path) === p) inflightGets.delete(path);
    });
  inflightGets.set(path, p);
  return p;
}

/** Drops cached reads matching `prefix` (all when omitted) and tells mounted queries to refetch. */
export function invalidateQueries(prefix = "") {
  for (const key of queryCache.keys()) if (key.startsWith(prefix)) queryCache.delete(key);
  for (const key of inflightGets.keys()) if (key.startsWith(prefix)) inflightGets.delete(key);
  invalidationListeners.forEach((fn) => fn(prefix));
}

export function onInvalidate(fn) {
  invalidationListeners.add(fn);
  return () => invalidationListeners.delete(fn);
}

// High-frequency writes that only affect their own area (chat, notification read state).
const SCOPED_WRITES = ["/chat", "/notifications"];

async function write(method, path, body, opts) {
  const result = await request(method, path, body, opts);
  if (opts?.invalidate !== false) {
    const scope = SCOPED_WRITES.find((p) => path.startsWith(p));
    invalidateQueries(scope ?? "");
  }
  return result;
}

export const clearQueryCache = () => {
  queryCache.clear();
  inflightGets.clear();
};

export const api = {
  get: (path, opts) => (opts ? request("GET", path, undefined, opts) : fetchQuery(path)),
  post: (path, body, opts) => write("POST", path, body ?? {}, opts),
  put: (path, body, opts) => write("PUT", path, body ?? {}, opts),
  patch: (path, body, opts) => write("PATCH", path, body ?? {}, opts),
  delete: (path, opts) => write("DELETE", path, undefined, opts),
};

/** Builds a query string, skipping empty values. */
export function qs(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.set(k, v);
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** Downloads a server-generated file (e.g. CSV export) with auth. */
export async function download(path, filename) {
  const res = await request("GET", path, undefined, { raw: true });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
