// Hook para manejar estado en React
import { useState } from "react";
// API para crear gastos
import { createExpense } from "../api";
// Hook de errores
import { useError } from "../hooks/useError";

// Formulario de gastos
export default function ExpensesForm({ categories, onAddExpense }) {
  const [amount, setAmount] = useState(""); // Importe
  const [category, setCategory] = useState(""); // Categoría seleccionada
  const [date, setDate] = useState(""); // Fecha del gasto
  const [success, setSuccess] = useState(null); // Mensaje de éxito
  const [submitting, setSubmitting] = useState(false); // Carga
  const { error, showError } = useError();

  async function handleSubmit(e) {
    e.preventDefault();

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

      onAddExpense(newExpense);

      // Limpiamos campos
      setAmount("");
      setCategory("");
      setDate("");
      setSuccess("Gasto añadido correctamente");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      showError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nuevo gasto</h2>
      {/* Mensaje de error si existe */}
      {error && <p className="error">{error}</p>}
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
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        {/* Botón de envío */}
        <button type="submit" disabled={submitting}>
          {submitting ? "Añadiendo..." : "Añadir gasto"}
        </button>
      </div>
    </form>
  );
}
