import { useState, useEffect, useCallback } from "react";
import AuthContext from "./AuthContext";
import { getCSRF, login as apiLogin, logout as apiLogout, fetchMe } from "../api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const logout = useCallback(async () => {
    try { await apiLogout(); } catch {} 
    finally { setUser(null); }
  }, []);

  useEffect(() => {
    if (import.meta.env.DEV) {
      window.logout = logout;
      return () => { delete window.logout; };
    }
  }, [logout]);

  useEffect(() => {
    async function init() {
      try {
        await getCSRF();
        const me = await fetchMe();
        setUser(me?.authenticated ? { username: me.username } : null);
      } catch {
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    }
    init();
  }, []);

  const login = useCallback(async (username, password) => {
    await apiLogin(username, password);
    const me = await fetchMe();
    if (me?.authenticated) setUser({ username: me.username });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
