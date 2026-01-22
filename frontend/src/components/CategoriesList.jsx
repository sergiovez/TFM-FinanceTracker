import { useEffect, useState, useCallback } from "react";
import { fetchCategories, deleteCategory, updateCategory } from "../api";
import { useError } from "../hooks/useError";
import { useDashboardEvents } from "../hooks/useDashboardEvents";

export default function CategoriesList({ categories, setCategories }) {
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error, showError } = useError();
  const { emit } = useDashboardEvents();

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  }, [setCategories, showError]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  async function saveEdit(id) {
    try {
      await updateCategory(id, { name: editingName });
      setCategories(categories.map(c => c.id === id ? { ...c, name: editingName } : c));
      setEditingId(null);
      setSuccess("Categoría actualizada");
      setTimeout(() => setSuccess(null), 2000);
      emit("categoryChanged");
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
      emit("categoryChanged");
    } catch (err) {
      showError(
        err?.response?.data?.detail ||
        "No se puede eliminar la categoría porque tiene gastos asociados"
      );
    }
  }

  if (loading) return <p>Cargando categorías...</p>;

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
                  <input value={editingName} onChange={e => setEditingName(e.target.value)} />
                  <button onClick={() => saveEdit(c.id)}>Guardar</button>
                  <button onClick={() => setEditingId(null)}>Cancelar</button>
                </>
              ) : (
                <>
                  <span>{c.name}</span>
                  <button onClick={() => { setEditingId(c.id); setEditingName(c.name); }}>Editar</button>
                  <button onClick={() => handleDelete(c.id)}>Eliminar</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
