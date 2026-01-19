import React, { useState } from "react";
import { createCategory } from "../api";

export default function CategoriesForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("El nombre de la categoría no puede estar vacío");
      return;
    }

    setSubmitting(true);

    try {
      const formattedName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();
      await createCategory({ name: formattedName });
      setName("");
      onSuccess();
      setSuccess("Categoría creada correctamente");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className= "category-form" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <input
        type="text"
        value={name}
        onChange={e => {
          setName(e.target.value);
          if (error) setError(null);
        }}
        placeholder="Nombre categoría"
      />

      <button type="submit" disabled={submitting}>
        {submitting ? "Añadiendo..." : "Añadir categoría"}
      </button>
    </form>
  );
}
