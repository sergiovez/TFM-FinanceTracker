/*
AuthContext -> la caja vacia
AuthProvider -> quien llena la caja
useAuth -> quien lee la caja
*/

// Importamos la función createContext de React
// Sirve para crear un "contexto" global accesible desde cualquier componente
import { createContext } from "react";

// Creamos el contexto de autenticación
// El valor inicial es null porque al inicio no sabemos si hay usuario logueado
const AuthContext = createContext(null);

// Exportamos el contexto para poder usarlo en:
// - AuthProvider (para proveer datos)
// - useAuth (para consumirlos)
export default AuthContext;
