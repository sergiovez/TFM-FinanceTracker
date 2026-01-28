/*
AuthContext -> la caja vacia
AuthProvider -> quien llena la caja
useAuth -> quien lee la caja
*/

import { useState, useEffect, useCallback } from "react";

// Importamos el contexto para poder proveerlo
import AuthContext from "./AuthContext";

// Importamos funciones de la API (backend Django).
// Habla con Django no directamente sino a traves de la API
import { getCSRF, login as apiLogin, logout as apiLogout, fetchMe } from "../api";

// Componente que envuelve la aplicación y proporciona el estado de autenticación global
export function AuthProvider({ children }) {

  // Estado del usuario autenticado (null → no logueado, { username } → logueado
  const [user, setUser] = useState(null);

  // Indica si aún estamos comprobando la sesión
  const [loadingAuth, setLoadingAuth] = useState(true);

   // Función de logout (useCallback evita que se recree en cada render)
  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Error en logout:", err);
    } finally {
      setUser(null);
    }
  }, []);


  // Logout desde consola (desarrollo)
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.logout = logout;
      return () => { delete window.logout; };
    }
  }, [logout]);


  // Hace que F5 no cierre sesion
  useEffect(() => {
    async function init() {
      try {
        // Pedimos la cookie CSRF a Django
        await getCSRF();
        // Preguntamos quién soy
        const me = await fetchMe();
        // Si está autenticado, guardamos el usuario
        setUser(me?.authenticated ? { username: me.username } : null);
      } catch {
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    }
    // Ejecutamos la inicialización
    init();
  }, []);

  // Función de login (useCallback evita que se recree en cada render)
  const login = useCallback(async (username, password) => {
    // Enviamos credenciales al backend
    await apiLogin(username, password);
     // Volvemos a preguntar quién somos
    const me = await fetchMe();
    // Si todo va bien, actualizamos el usuario
    if (me?.authenticated) setUser({ username: me.username });
  }, []);

  // Cualquier componente puede tener el usuario actual, 
  // las funciones de login y logout y la carga (evitar renders incorrectos)
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
