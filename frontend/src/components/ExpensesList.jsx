import { deleteExpense } from "../api";
import { useError } from "../hooks/useError";

export default function ExpensesList({ expenses, setExpenses }) {
  const { error, showError } = useError();

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este gasto?")) return;

    try {
      await deleteExpense(id);

      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err) {
      showError(err);
    }
  }

  if (!expenses.length) return <p>No hay gastos.</p>;

  return (
    <div>
      {error && <p className="error">{error}</p>}
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
