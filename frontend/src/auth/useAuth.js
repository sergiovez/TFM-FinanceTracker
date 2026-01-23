/*
AuthContext -> la caja vacia
AuthProvider -> quien llena la caja
useAuth -> quien lee la caja
*/

// Importamos el hook useContext de React
// Permite leer el valor de un contexto
import { useContext } from "react";

// Permite leer el valor de un contexto
import AuthContext from "./AuthContext";

export function useAuth() {
  // Leemos el valor actual del AuthContext
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
