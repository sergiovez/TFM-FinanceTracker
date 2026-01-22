import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useError } from "../hooks/useError";

export default function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { error, showError } = useError();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await login(username, password);
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
        {error && <p className="error">{error}</p>}
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />
        <button type="submit" disabled={submitting}>{submitting ? "Entrando..." : "Entrar"}</button>
      </form>
    </div>
  );
}
