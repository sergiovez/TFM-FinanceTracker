// Hook para manejar estado en React
import { useState } from "react";
// Hook personalizado para manejar autenticación
import { useAuth } from "../auth/useAuth";
// Hook personalizado para manejar errores temporales
import { useError } from "../hooks/useError";
// Hook para navegar en React Router
import { useNavigate } from "react-router-dom";

import { getCSRF } from "../api";

import "./LoginForm.css";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate(); // <-- Hook para redirigir

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { error, showError } = useError();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await getCSRF();
      await login(username, password);
      setUsername("");
      setPassword("");

      // Redirigimos a la página de resumen tras login
      navigate("/summary");
    } catch (err) {
      showError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
