import { useState, useEffect } from "react";
import { updateExpense, fetchCategories } from "../api";
import { useError } from "../hooks/useError";
import "./EditExpenseModal.css";

export default function EditExpenseModal({ expense, onClose, onSaved }) {
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);
  const [description, setDescription] = useState(expense.description || "");
  const [date, setDate] = useState(expense.date);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

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
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (amount <= 0) return showError("El importe debe ser mayor que 0");
    if (!category) return showError("Debes seleccionar una categoría");

    setSubmitting(true);
    try {
      await updateExpense(expense.id, {
        amount: Number(amount),
        category: Number(category),
        description,
        date,
      });

      onSaved();   // refrescar lista
      onClose();   // cerrar modal
    } catch (err) {
      showError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Editar gasto</h3>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
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

          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descripción"
          />

          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
