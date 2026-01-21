import { useEffect, useState } from "react";
import { fetchCategories, deleteCategory, updateCategory } from "../api";
import { useError } from "../hooks/useError";

export default function CategoriesList({ categories, setCategories }) {
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [success, setSuccess] = useState(null);
  const { error, showError } = useError();

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        showError(err);
      }
    }
    loadCategories();
  }, [setCategories, showError]);

  async function saveEdit(id) {
    try {
      await updateCategory(id, { name: editingName });

      setCategories(categories.map(c => (c.id === id ? { ...c, name: editingName } : c)));

      setEditingId(null);
      setSuccess("Categoría actualizada");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      showError(err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar esta categoría?")) return;

    try {
      await deleteCategory(id);

      setCategories(categories.filter(c => c.id !== id));

      setSuccess("Categoría eliminada");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      showError(err);
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
                    <button onClick={() => { setEditingId(c.id); setEditingName(c.name); }}>Editar</button>
                    <button className="btn-delete" onClick={() => handleDelete(c.id)}>Eliminar</button>
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
