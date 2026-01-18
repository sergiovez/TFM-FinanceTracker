import React, { useState } from "react";
import { createExpense } from "../api";

export default function ExpensesForm({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await createExpense({ amount, category, date });
      setAmount("");
      setCategory("");
      setDate("");
      onSuccess();
      setSuccess("Gasto añadido correctamente");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <input
        type="number"
        value={amount}
        onChange={e => { setAmount(e.target.value); if(error) setError(null); }}
        placeholder="Importe"
        required
      />
      <input
        type="text"
        value={category}
        onChange={e => { setCategory(e.target.value); if(error) setError(null); }}
        placeholder="Categoría"
        required
      />
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Añadiendo..." : "Añadir gasto"}
      </button>
    </form>
  );
}
