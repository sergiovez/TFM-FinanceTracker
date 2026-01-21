import { useEffect, useState, useCallback } from "react"; 
import { deleteExpense, fetchExpenses } from "../api";
import { useError } from "../hooks/useError";

export default function ExpensesList({ expenses, setExpenses }) {
  const { error, showError } = useError();
  const [loading, setLoading] = useState(true);

  const loadExpenses = useCallback(async () => {
    let isMounted = true;
    setLoading(true);

    try {
      const data = await fetchExpenses();
      if (isMounted) setExpenses(data);
    } catch (err) {
      if (isMounted) showError(err);
    } finally {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [setExpenses, showError]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este gasto?")) return;
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err) {
      showError(err);
    }
  }

  if (loading) return <p>Cargando gastos...</p>;
  if (!expenses.length) return <p>No hay gastos.</p>;

  return (
    <div>
      {error && <p className="error">{error}</p>}
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
