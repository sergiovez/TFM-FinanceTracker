import { useState } from "react";
import { createCategory } from "../api";
import { useError } from "../hooks/useError";

export default function CategoriesForm({ onAddCategory }) {
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { error, showError } = useError();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return showError("El nombre de la categoría no puede estar vacío");

    setSubmitting(true);

    try {
      const formattedName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();
      const newCategory = await createCategory({ name: formattedName });

      onAddCategory(newCategory);

      setName("");
      setSuccess("Categoría creada correctamente");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      showError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre categoría"
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Añadiendo..." : "Añadir categoría"}
      </button>
    </form>
  );
}
