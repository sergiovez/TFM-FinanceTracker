import React, { useEffect, useState } from "react";
import { fetchExpenses } from "../api";

export default function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchExpenses();
        setExpenses(data);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Mis gastos</h2>
      <ul>
        {expenses.map(e => (
          <li key={e.id}>
            {e.date} - {e.category_name}: {e.amount} €
          </li>
        ))}
      </ul>
    </div>
  );
}

