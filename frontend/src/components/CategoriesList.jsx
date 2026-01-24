// Hooks de React para manejar estado, efectos y callbacks
import { useEffect, useState, useCallback } from "react";
// Importamos funciones de API para CRUD de categorías
import { fetchCategories, deleteCategory, updateCategory } from "../api";
// Hook para manejar errores
import { useError } from "../hooks/useError";
// Hook para emitir y escuchar eventos globales del dashboard
import { useDashboardEvents } from "../hooks/useDashboardEvents";

// Funcion para listar categorias
export default function CategoriesList({ categories, setCategories }) {
  // Estado del ID de categoría que estamos editando
  const [editingId, setEditingId] = useState(null);
  // Estado del nombre temporal mientras editamos
  const [editingName, setEditingName] = useState("");
  // Estado para mostrar mensaje de éxito
  const [success, setSuccess] = useState(null);
  // Estado para mostrar mensaje de éxito
  const [loading, setLoading] = useState(true);
  // Hook para errores
  const { error, showError } = useError();

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
  }, [setCategories, showError]);

  // Efecto para cargar categorías al montar el componente
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Función para guardar edición de categoría
  async function saveEdit(id) {
    try {
      // Llamada API para actualizar categoría
      await updateCategory(id, { name: editingName });
      // Actualizamos estado de categorías localmente
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
    // Confirmación del usuario
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    try {
      // Llamada API para borrar categoría
      await deleteCategory(id);
      // Actualizamos estado local eliminando categoría borrada
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
    <div>
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
            // Una categoría es global si no tiene usuario
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
                    {!isGlobal && (
                      <div className="category-actions">
                        <button onClick={() => saveEdit(c.id)}>
                          Guardar
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => setEditingId(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <span>
                      {c.name}
                      {isGlobal && " (global)"}
                    </span>
                    {!isGlobal && (
                      <div className="category-actions">
                        <button
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
                    )}
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
