import React, { useEffect, useState } from "react";
import {
  fetchCategories,
  deleteCategory,
  updateCategory,
} from "../api";

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const data = await fetchCategories();
        if (!cancelled) {
          setCategories(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  function startEdit(category) {
    setEditingId(category.id);
    setEditingName(category.name);
  }

  async function saveEdit(id) {
    try {
      await updateCategory(id, { name: editingName });
      const data = await fetchCategories();
      setCategories(data);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar esta categoría?")) return;

    try {
      await deleteCategory(id);
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <p className="error">{error}</p>;

  return (
    <div>
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
                <button onClick={() => startEdit(c)}>Editar</button>
                <button onClick={() => handleDelete(c.id)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
