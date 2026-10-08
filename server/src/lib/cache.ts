/**
 * In-process TTL cache with tag-based invalidation.
 *
 * Every write path that changes cached data must call `invalidate(tag)`. This is a
 * single-instance cache: if the API is ever scaled to several instances, swap this
 * module for Redis (same interface) so invalidations reach every instance.
 */

interface Entry {
  value: unknown;
  expiresAt: number;
  tags: string[];
}

const store = new Map<string, Entry>();
const inflight = new Map<string, { promise: Promise<unknown>; tags: string[] }>();
const MAX_ENTRIES = 5000;

export const TAGS = {
  auth: "auth", // every cached auth context (role/permission changes)
  user: (userId: string) => `user:${userId}`, // one user's sessions
  settings: "settings",
  org: "org", // departments, teams, reporting lines
  employees: "employees", // employee pickers / directory lookups
  roles: "roles",
  leaveTypes: "leaveTypes",
  holidays: "holidays",
} as const;

/** Returns the cached value or computes it once (concurrent callers share one load). */
export async function cached<T>(key: string, ttlMs: number, tags: string[], load: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.value as T;
  const pending = inflight.get(key);
  if (pending) return pending.promise as Promise<T>;

  const p = load()
    .then((value) => {
      // Only store if no invalidation happened while loading.
      if (inflight.get(key)?.promise === p) {
        if (store.size >= MAX_ENTRIES) store.delete(store.keys().next().value!);
        store.set(key, { value, expiresAt: Date.now() + ttlMs, tags });
      }
      return value;
    })
    .finally(() => {
      if (inflight.get(key)?.promise === p) inflight.delete(key);
    });
  inflight.set(key, { promise: p, tags });
  return p;
}

/** Drops every entry carrying any of the given tags (and in-flight loads for them). */
export function invalidate(...tags: string[]) {
  const set = new Set(tags);
  for (const [key, entry] of store) {
    if (entry.tags.some((t) => set.has(t))) store.delete(key);
  }
  // In-flight loads may already hold stale data; forget them so they aren't stored.
  for (const [key, entry] of inflight) {
    if (entry.tags.some((t) => set.has(t))) inflight.delete(key);
  }
}

export function invalidateKey(key: string) {
  store.delete(key);
  inflight.delete(key);
}
