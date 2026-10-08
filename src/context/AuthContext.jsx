import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, clearQueryCache, refreshSession, setAccessToken, setSessionExpiredHandler } from "@/lib/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the session from the refresh cookie on first load.
  useEffect(() => {
    refreshSession()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
    setSessionExpiredHandler(() => {
      clearQueryCache();
      setUser(null);
    });
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.post("/auth/login", { email, password });
    clearQueryCache();
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setAccessToken(null);
      clearQueryCache();
      setUser(null);
    }
  }, []);

  const reload = useCallback(async () => {
    const me = await api.get("/auth/me");
    setUser(me);
    return me;
  }, []);

  const value = useMemo(() => {
    const perms = new Set(user?.permissions ?? []);
    return {
      user,
      loading,
      login,
      logout,
      reload,
      employeeId: user?.employee?.id ?? null,
      displayName: user?.employee ? `${user.employee.firstName} ${user.employee.lastName}` : user?.email ?? "",
      /** True when the user holds any of the given permission keys. UI hint only — the API enforces access. */
      can: (...keys) => keys.some((k) => perms.has(k)),
    };
  }, [user, loading, login, logout, reload]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
