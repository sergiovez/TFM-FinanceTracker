// Hooks de React para manejar estado, efectos y callbacks
import { useEffect, useState, useCallback } from "react";
// Importamos funciones de API para CRUD de categorías
import { fetchCategories, deleteCategory, updateCategory } from "../api";
// Hook para manejar errores
import { useError } from "../hooks/useError";
// Hook para emitir y escuchar eventos globales del dashboard
import { useDashboardEvents } from "../hooks/useDashboardEvents";

import "./CategoriesList.css";

// Componente para listar categorias
export default function CategoriesList() {
  // Estado de categorías
  const [categories, setCategories] = useState([]);
  // Estado del ID de categoría que estamos editando
  const [editingId, setEditingId] = useState(null);
  // Estado del nombre temporal mientras editamos
  const [editingName, setEditingName] = useState("");
  // Estado para mostrar mensaje de éxito
  const [success, setSuccess] = useState(null);
  // Estado para mostrar si se está cargando
  const [loading, setLoading] = useState(true);

  // Hook para errores
  const { error, showError } = useError();
  // Hook para eventos del dashboard
  const { emit } = useDashboardEvents();

  // Función para cargar categorías desde API
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
  }, [showError]);

  // Efecto para cargar categorías al montar el componente
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Función para guardar edición de categoría
  async function saveEdit(id) {
    try {
      await updateCategory(id, { name: editingName });
      setCategories(
        categories.map(c =>
          c.id === id ? { ...c, name: editingName } : c
        )
      );
      setEditingId(null);
      setSuccess("Categoría actualizada");
      setTimeout(() => setSuccess(null), 2000);
      emit("categoryChanged");
    } catch (err) {
      showError(err);
    }
  }

  // Función para eliminar categoría
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
          "No se puede eliminar la categoría"
      );
    }
  }

  // Mostrar mensaje de carga mientras se obtienen categorías
  if (loading) return <p>Cargando categorías...</p>;

  return (
    <div className="categories-list">
      <h2>Mis categorías</h2>
      {/* Mensajes de error y éxito */}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {/* Lista de categorias */}
      {!categories.length ? (
        <p>No hay categorías.</p>
      ) : (
        <ul>
          {categories.map(c => {
            const isGlobal = c.is_global;

            return (
              <li key={c.id} className="category-item">
                {editingId === c.id ? (
                  <>
                    <input
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                      disabled={isGlobal}
                    />
                    <div className="category-actions">
                      <button disabled={isGlobal} onClick={() => saveEdit(c.id)}>
                        Guardar
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => setEditingId(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* 🔥 AQUÍ ESTABA EL ERROR: FALTABA EL NOMBRE */}
                    <span className="category-name">{c.name}</span>

                    <div className="category-actions">
                      <button
                        disabled={isGlobal}
                        onClick={() => {
                          setEditingId(c.id);
                          setEditingName(c.name);
                        }}
                      >
                        Editar
                      </button>

                      <button
                        className="btn-delete"
                        disabled={isGlobal}
                        onClick={() => handleDelete(c.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
