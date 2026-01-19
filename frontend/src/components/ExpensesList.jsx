import React, { useEffect, useState } from "react";
import { fetchExpenses, deleteExpense } from "../api";

export default function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadExpenses() {
      try {
        const data = await fetchExpenses();
        if (!cancelled) setExpenses(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }
    loadExpenses();
    return () => { cancelled = true; };
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este gasto?")) return;
    try {
      await deleteExpense(id);
      const data = await fetchExpenses();
      setExpenses(data);
      setSuccess("Gasto eliminado");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <p className="error">{error}</p>;
  if (!expenses.length) return <p>No hay gastos.</p>;

  return (
    <div>
      {success && <p className="success">{success}</p>}
      <h2>Mis gastos</h2>
      <ul>
        {expenses.map(e => (
          <li key={e.id}>
            {e.date} - {e.category_name}: {e.amount} €
            <button className="btn-delete" onClick={() => handleDelete(e.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
