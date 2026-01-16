import { createContext, useEffect, useState, useCallback } from "react";
import { getCSRF, login as apiLogin, logout as apiLogout, fetchMe } from "./api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    window.logout = logout;
    return () => {
      delete window.logout;
    };
  }, [logout]);

  useEffect(() => {
    async function init() {
      try {
        await getCSRF();              
        const me = await fetchMe();  
        if (me?.authenticated) {
          setUser({ username: me.username });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const login = useCallback(async (username, password) => {
    await apiLogin(username, password);
    const me = await fetchMe();
    if (me?.authenticated) {
      setUser({ username: me.username });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
