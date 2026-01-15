import { createContext, useContext, useState, useEffect } from "react";

// URL base de la API de autenticación
const API_BASE = "http://localhost:8000/api/auth";

// Función para obtener CSRF token desde cookie
function getCSRFToken() {
  const name = "csrftoken=";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name)) return cookie.substring(name.length);
  }
  return "";
}

// Helper fetch con sesión y CSRF
async function fetchWithSession(url, options = {}) {
  const opts = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  if (["POST", "PUT", "PATCH", "DELETE"].includes(opts.method?.toUpperCase())) {
    opts.headers["X-CSRFToken"] = getCSRFToken();
  }

  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) return res.json();
  return res;
}

// ---- CONTEXT ----
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar app, consultamos si ya hay sesión activa
  useEffect(() => {
    async function init() {
      try {
        // Solicita csrf cookie
        await fetch(`${API_BASE}/csrf/`, { credentials: "include" });
        const me = await fetchWithSession(`${API_BASE}/me/`);
        if (me.authenticated) setUser({ username: me.username });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Login
  async function login(username, password) {
    await fetch(`${API_BASE}/csrf/`, { credentials: "include" });
    await fetchWithSession(`${API_BASE}/login/`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    const me = await fetchWithSession(`${API_BASE}/me/`);
    if (me.authenticated) setUser({ username: me.username });
  }

  // Logout
  async function logout() {
    await fetchWithSession(`${API_BASE}/logout/`, { method: "POST" });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar contexto
export function useAuth() {
  return useContext(AuthContext);
}


