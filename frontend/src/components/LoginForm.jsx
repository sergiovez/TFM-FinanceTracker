// Hook para manejar estado en React
import { useState } from "react";
// Hook personalizado para manejar autenticación
import { useAuth } from "../auth/useAuth";
// Hook personalizado para manejar errores temporales
import { useError } from "../hooks/useError";

// Formulario de login
export default function LoginForm() {
  // Extraemos la función login del contexto de Auth
  const { login } = useAuth();
  // Estado para almacenar username y password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Estado para controlar si el formulario se está enviando
  const [submitting, setSubmitting] = useState(false);
  // Hook para manejar errores
  const { error, showError } = useError();

  // Función que se ejecuta al enviar el formulario
  async function handleSubmit(e) {
    // Evita recargar la página
    e.preventDefault();
    // Evita recargar la página
    setSubmitting(true);

    try {
      // Llamamos a login con username y password
      await login(username, password);
      // Limpiamos los campos si login correcto
      setUsername("");
      setPassword("");
    } catch (err) {
      showError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Mensaje de error si existe */}
        {error && <p className="error">{error}</p>}
        {/* Input de usuario */}
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" required />
        {/* Input de contraseña */}
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />
        {/* Botón de envío */}
        <button type="submit" disabled={submitting}>{submitting ? "Entrando..." : "Entrar"}</button>
      </form>
    </div>
  );
}
