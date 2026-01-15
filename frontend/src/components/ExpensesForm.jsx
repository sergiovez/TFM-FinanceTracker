import React, { useState } from "react"; 
import { createExpense } from "../api";

export default function ExpensesForm({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await createExpense({ amount, category, date });
      onSuccess();
      setAmount("");
      setCategory("");
      setDate("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Importe" required />
      <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Categoría" required />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <button type="submit">Añadir gasto</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

