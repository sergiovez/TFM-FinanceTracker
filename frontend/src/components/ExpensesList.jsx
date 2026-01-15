import React, { useEffect, useState } from "react";
import { fetchExpenses, deleteExpense } from "../api";

export default function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadExpenses() {
      try {
        const data = await fetchExpenses();
        if (!cancelled) {
          setExpenses(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      }
    }

    loadExpenses();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este gasto?")) return;

    try {
      await deleteExpense(id);
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Mis gastos</h2>
      <ul>
        {expenses.map(e => (
          <li key={e.id}>
            {e.date} - {e.category_name}: {e.amount} €
            <button onClick={() => handleDelete(e.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
