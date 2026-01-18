import React, { useEffect, useState } from "react";
import { fetchCategories, deleteCategory, updateCategory } from "../api";

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        if (!cancelled) setCategories(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }
    loadCategories();
    return () => { cancelled = true; };
  }, []);

  async function saveEdit(id) {
    try {
      await updateCategory(id, { name: editingName });
      const data = await fetchCategories();
      setCategories(data);
      setEditingId(null);
      setSuccess("Categoría actualizada");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) { setError(err.message); }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    try {
      await deleteCategory(id);
      const data = await fetchCategories();
      setCategories(data);
      setSuccess("Categoría eliminada");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) { setError(err.message); }
  }

  if (error) return <p className="error">{error}</p>;
  if (!categories.length) return <p>No hay categorías.</p>;

  return (
    <div>
      {success && <p className="success">{success}</p>}
      <h2>Mis categorías</h2>
      <ul>
        {categories.map(c => (
          <li key={c.id}>
            {editingId === c.id ? (
              <>
                <input
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                />
                <button onClick={() => saveEdit(c.id)}>Guardar</button>
                <button onClick={() => setEditingId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                {c.name}
                <button onClick={() => setEditingId(c.id)}>Editar</button>
                <button onClick={() => handleDelete(c.id)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
