import { useEffect, useMemo, useState, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {
  fetchExpensesByCategory,
  fetchExpensesByMonth,
  fetchLatestExpenses,
  fetchIncomeSummary,
} from "../api";
import { useError } from "../hooks/useError";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const MONTH_NAMES = {
  "01": "Enero", "02": "Febrero", "03": "Marzo", "04": "Abril",
  "05": "Mayo", "06": "Junio", "07": "Julio", "08": "Agosto",
  "09": "Septiembre", "10": "Octubre", "11": "Noviembre", "12": "Diciembre",
};

export default function Dashboard({ refreshKey }) {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [latestExpenses, setLatestExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [incomeSummary, setIncomeSummary] = useState({
    income: 0,
    expenses: 0,
    savings: 0,
  });
  const [loading, setLoading] = useState(true);
  const { error, showError } = useError();

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [catData, monthData, latest] = await Promise.all([
        fetchExpensesByCategory(),
        fetchExpensesByMonth(),
        fetchLatestExpenses(),
      ]);

      const summary = await fetchIncomeSummary("all");

      setCategoryData(catData);
      setMonthlyData(monthData);
      setLatestExpenses(latest);
      setIncomeSummary(summary);
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard, refreshKey]);

  // ===== FILTROS =====

  const filteredLatestExpenses = useMemo(() => {
    if (!selectedMonth) return latestExpenses;
    return latestExpenses.filter(
      e => String(e.date).slice(5, 7) === selectedMonth
    );
  }, [latestExpenses, selectedMonth]);

  const filteredCategoryData = useMemo(() => {
    if (!selectedMonth) return categoryData;
    return categoryData.filter(c => c.month === selectedMonth);
  }, [categoryData, selectedMonth]);

  const filteredMonthlyData = useMemo(() => {
    if (!selectedMonth) return monthlyData;
    return monthlyData.filter(m => m.month === selectedMonth);
  }, [monthlyData, selectedMonth]);

  const totalLatest = filteredLatestExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  if (loading) return <p>Cargando dashboard...</p>;

  return (
    <div className="dashboard">
      {error && <p className="error">{error}</p>}

      <section>
        <h2>Resumen</h2>
        <select
          className="input"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
        >
          <option value="">Todos</option>
          {monthlyData.map(m => (
            <option key={m.month} value={m.month}>
              {MONTH_NAMES[m.month]}
            </option>
          ))}
        </select>

        <div>
          <p>Ingresos: {incomeSummary.income} €</p>
          <p>Gastos: {incomeSummary.expenses} €</p>
          <p>Ahorro: {incomeSummary.savings} €</p>
        </div>
      </section>

      <section>
        <h2>Gastos por categoría</h2>
        {filteredCategoryData.length === 0 ? (
          <p>No hay datos</p>
        ) : (
          <PieChart width={350} height={250}>
            <Pie
              data={filteredCategoryData}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ value }) => `${value} €`}
            >
              {filteredCategoryData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip formatter={value => `${value} €`} />
          </PieChart>
        )}
      </section>

      <section>
        <h2>Gastos mensuales</h2>
        <ul className="monthly-list">
          {filteredMonthlyData.map(item => (
            <li key={item.month}>
              <strong>{MONTH_NAMES[item.month]}</strong>: {item.total} €
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Últimos gastos</h2>
        {filteredLatestExpenses.length === 0 ? (
          <p>No hay datos</p>
        ) : (
          <>
            <ul>
              {filteredLatestExpenses.map(e => (
                <li key={e.id}>
                  {e.date} — {e.category} — {e.amount} €
                </li>
              ))}
            </ul>
            <p>
              <strong>Total:</strong> {totalLatest} €
            </p>
          </>
        )}
      </section>
    </div>
  );
}
