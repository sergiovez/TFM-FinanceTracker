// Hook para manejar estado en React
import { useState, useEffect } from "react";
// API para crear gastos y obtener categorías
import { createExpense, fetchCategories } from "../api";
// Hook para manejar errores
import { useError } from "../hooks/useError";
// Hook para emitir eventos
import { useDashboardEvents } from "../hooks/useDashboardEvents";

// Formulario de gastos
export default function ExpensesForm() {
  const [amount, setAmount] = useState(""); // Importe
  const [category, setCategory] = useState(""); // Categoría seleccionada
  const [date, setDate] = useState(""); // Fecha del gasto
  const [success, setSuccess] = useState(null); // Mensaje de éxito
  const [submitting, setSubmitting] = useState(false); // Estado de envío
  const [categories, setCategories] = useState([]); // Lista de categorías
  const [loadingCategories, setLoadingCategories] = useState(true); // Cargando categorías

  const { error, showError } = useError(); // Hook para errores
  const { emit } = useDashboardEvents(); // Hook para emitir eventos

  // Cargar categorías al montar el componente
  useEffect(() => {
    async function loadCategories() {
      setLoadingCategories(true);
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        showError(err);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  // Función que se ejecuta al enviar el formulario
  async function handleSubmit(e) {
    e.preventDefault();

    // Validaciones
    if (amount <= 0) return showError("El importe debe ser mayor que 0");
    if (!category) return showError("Debes seleccionar una categoría");

    setSubmitting(true);

    try {
      // Llamada a la API para crear gasto
      const newExpense = await createExpense({
        amount: Number(amount),
        category: Number(category),
        date,
      });

      setSuccess(`Gasto de ${newExpense.amount} € añadido correctamente`);

      // Limpiamos campos y mostramos mensaje de éxito
      setAmount("");
      setCategory("");
      setDate("");
      setSuccess("Gasto añadido correctamente");
      setTimeout(() => setSuccess(null), 2000);

      // Emitimos evento global para refrescar dashboard
      emit("expenseChanged");
    } catch (err) {
      showError(err);
    } finally {
      setSubmitting(false);
    }
  }

  // Mostrar mensaje mientras se cargan categorías
  if (loadingCategories) return <p>Cargando categorías...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nuevo gasto</h2>

      {/* Mensaje de error si existe */}
      {error && <p className="error">{error}</p>}
      {/* Mensaje de éxito si existe */}
      {success && <p className="success">{success}</p>}

      <div className="expense-form">
        {/* Importe del gasto */}
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Importe"
        />

        {/* Categoria del gasto */}
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">-- Selecciona categoría --</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Fecha del gasto */}
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        {/* Botón de envío */}
        <button type="submit" disabled={submitting}>
          {submitting ? "Añadiendo..." : "Añadir gasto"}
        </button>
      </div>
    </form>
  );
}
