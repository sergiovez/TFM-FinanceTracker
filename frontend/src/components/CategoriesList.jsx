import React, { useEffect, useState } from "react";
import { fetchCategories, deleteCategory, updateCategory } from "../api";

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveEdit(id) {
    setError(null);
    try {
      await updateCategory(id, { name: editingName });
      await loadCategories();
      setEditingId(null);
      setSuccess("Categoría actualizada");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    setError(null);

    try {
      await deleteCategory(id);
      await loadCategories();
      setSuccess("Categoría eliminada");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      // ⬅️ AQUÍ está la clave: NO borramos la lista
      setError(err.message || "No se puede eliminar la categoría");
    }
  }

  return (
    <div>
      <h2>Mis categorías</h2>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {!categories.length ? (
        <p>No hay categorías.</p>
      ) : (
        <ul>
          {categories.map(c => (
            <li key={c.id} className="category-item">
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
                  <span>{c.name}</span>

                  <div className="category-actions">
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setEditingId(c.id);
                        setEditingName(c.name);
                      }}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(c.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
