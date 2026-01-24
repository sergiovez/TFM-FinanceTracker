// Hooks de React
import { useEffect, useState, useCallback } from "react"; 
// API para borrar y obtener gastos
import { deleteExpense, fetchExpenses } from "../api";
// Hook para manejar errores
import { useError } from "../hooks/useError";
// Hook para emitir eventos entre componentes del dashboard
import { useDashboardEvents } from "../hooks/useDashboardEvents";

// Lista de gastos
export default function ExpensesList({ expenses, setExpenses }) {
  // Hook de errores
  const { error, showError } = useError();
  // Estado para mostrar si se está cargando la lista
  const [loading, setLoading] = useState(true);
  // Hook para emitir eventos
  const { emit } = useDashboardEvents();

  // Función para cargar gastos desde la API
  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  }, [setExpenses, showError]);

  // Cargamos gastos al montar el componente
  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  // Función para borrar un gasto
  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este gasto?")) return;
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter(e => e.id !== id));
      emit("expenseChanged");
    } catch (err) {
      showError(err);
    }
  }

  // Mostrar mensaje mientras carga
  if (loading) return <p>Cargando gastos...</p>;
  // Mostrar mensaje si no hay gastos
  if (!expenses.length) return <p>No hay gastos.</p>;

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <h2>Mis gastos</h2>
      <ul>
        {expenses.map(e => (
          <li key={e.id}>
            {e.date} - {e.category_name}: {e.amount} €
            <button className= "btn-delete" onClick={() => handleDelete(e.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
