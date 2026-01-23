// Importamos useState de React para manejar estado local
import { useState } from "react";
// Importamos función de API para crear categorías
import { createCategory } from "../api";
// Importamos hook personalizado para manejo de errores
import { useError } from "../hooks/useError";

// Funcion para crear nueva categoria
export default function CategoriesForm({ onAddCategory }) {
  // Estado para almacenar nombre de la categoria
  const [name, setName] = useState("");
  // Estado para almacenar mensaje de éxito tras añadir categoría
  const [success, setSuccess] = useState(null);
  // Estado booleano que indica si el formulario se está enviando
  const [submitting, setSubmitting] = useState(false);
  // Hook para manejar errores
  const { error, showError } = useError();

  // Función que se ejecuta al enviar el formulario
  async function handleSubmit(e) {
    // Evita que el formulario recargue la página
    e.preventDefault();
    // Validación: no permitir campos vacíos
    if (!name.trim()) return showError("El nombre de la categoría no puede estar vacío");

    setSubmitting(true);

    try {
      // Formateamos el nombre: primera letra mayúscula, resto minúsculas
      const formattedName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();
      // Llamamos a la API para crear categoría
      const newCategory = await createCategory({ name: formattedName });

      onAddCategory(newCategory);

      setName("");
      setSuccess("Categoría creada correctamente");
      // Mostramos mensaje de éxito temporal
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      showError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      {/* Mostramos error si existe */}
      {error && <p className="error">{error}</p>}
      {/* Mostramos mensaje de éxito si existe */}
      {success && <p className="success">{success}</p>}
      {/* Input para escribir nombre de categoría */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre categoría"
      />
      {/* Botón de envío */}
      <button type="submit" disabled={submitting}>
        {submitting ? "Añadiendo..." : "Añadir categoría"}
      </button>
    </form>
  );
}
