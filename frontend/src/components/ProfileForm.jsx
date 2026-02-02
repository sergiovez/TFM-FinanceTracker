import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";

import "./ProfileForm.css";

export default function ProfileForm() {
  const { user, setUser, logout } = useAuth();

  const [form, setForm] = useState({
    password: "",
    name: "",
    surname: "",
    email: "",
    monthly_income: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // =========================
  // Cargar datos del perfil
  // =========================
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/auth/me/", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("No se pudo cargar el perfil");

        const data = await res.json();

        setForm({
          password: "",
          name: data.name || "",
          surname: data.surname || "",
          email: data.email || "",
          monthly_income: data.monthly_income || "",
        });
      } catch (err) {
        setError(err.message);
      }
    }

    loadProfile();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // =========================
  // Guardar perfil
  // =========================
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/me/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        throw new Error("Error al guardar perfil");
      }

      const updatedUser = await res.json();

      // Actualizamos usuario global (header, dashboard, etc.)
      setUser(updatedUser);

      setSuccess("Perfil actualizado correctamente");
      setTimeout(() => setSuccess(null), 2000);

      // Si ha cambiado la contraseña → logout recomendado
      if (form.password) {
        setTimeout(() => logout(), 1500);
      }

      setForm(prev => ({ ...prev, password: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile-container">
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>Mi perfil</h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="form-group">
          <label>Usuario</label>
          <input type="text" value={user.username} disabled />
        </div>

        <div className="form-group">
          <label>Nueva contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Nueva contraseña"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Apellido</label>
          <input
            type="text"
            name="surname"
            value={form.surname}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Ingreso mensual (€)</label>
          <input
            type="number"
            name="monthly_income"
            value={form.monthly_income}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
