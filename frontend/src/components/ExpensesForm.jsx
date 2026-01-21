import { useState } from "react";
import { createExpense } from "../api";
import { useError } from "../hooks/useError";

export default function ExpensesForm({ categories, onAddExpense }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { error, showError } = useError();

  async function handleSubmit(e) {
    e.preventDefault();

    if (amount <= 0) return showError("El importe debe ser mayor que 0");
    if (!category) return showError("Debes seleccionar una categoría");

    setSubmitting(true);

    try {
      const newExpense = await createExpense({
        amount: Number(amount),
        category: Number(category),
        date,
      });

      onAddExpense(newExpense);

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
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="expense-form">
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Importe"
        />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">-- Selecciona categoría --</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button type="submit" disabled={submitting}>
          {submitting ? "Añadiendo..." : "Añadir gasto"}
        </button>
      </div>
    </form>
  );
}
