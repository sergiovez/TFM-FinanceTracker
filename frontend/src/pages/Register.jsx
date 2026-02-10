import { useState } from "react";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    username: "",
    email: ""
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Validación simple
    if (!form.name || !form.surname || !form.username || !form.email) {
      setError("Todos los campos son obligatorios");
      setSubmitting(false);
      return;
    }

    if (!form.email.includes("@")) {
      setError("Email no válido");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/register-request/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Error enviando solicitud");
        setSubmitting(false);
        return;
      }

      setSent(true);
    } catch {
      setError("Error enviando solicitud");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="register-card">
        <h2>Solicitud enviada</h2>
        <p className="success">
          Gracias 😊<br />
          Revisaremos tu solicitud y te contactaremos pronto.
        </p>
      </div>
    );
  }

  return (
    <form className="register-card" onSubmit={handleSubmit}>
      <h2>Solicitar acceso</h2>

      {error && <p className="error">{error}</p>}

      <div className="field">
        <span className="field-icon">👤</span>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <span className="field-icon">👤</span>
        <input
          type="text"
          name="surname"
          placeholder="Apellidos"
          value={form.surname}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <span className="field-icon">🏷️</span>
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <span className="field-icon">📧</span>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? <span className="spinner" /> : "Solicitar acceso"}
      </button>
    </form>
  );
}
