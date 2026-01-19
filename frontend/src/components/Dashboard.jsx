import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  fetchExpensesByCategory,
  fetchExpensesByMonth,
  fetchLatestExpenses,
} from "../api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [latestExpenses, setLatestExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setCategoryData(await fetchExpensesByCategory());
        setMonthlyData(await fetchExpensesByMonth());
        setLatestExpenses(await fetchLatestExpenses());
      } catch (err) {
        console.error("Error cargando dashboard:", err.message);
      }
    }
    loadData();
  }, []);

  // ---- Filtro por mes ----
  const filteredLatestExpenses = useMemo(() => {
    if (!selectedMonth) return latestExpenses;
    return latestExpenses.filter(
      e => String(e.date).slice(0, 7) === selectedMonth
    );
  }, [latestExpenses, selectedMonth]);

  const filteredCategoryData = useMemo(() => {
    if (!selectedMonth) return categoryData;
    return categoryData.filter(c => c.month === selectedMonth);
  }, [categoryData, selectedMonth]);

  // ---- Totales ----
  const totalLatest = filteredLatestExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  return (
    <div className="dashboard">
      {/* FILTRO */}
      <section>
        <h2>Resumen</h2>
        <label>
          Mes:&nbsp;
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            <option value="">Todos</option>
            {monthlyData.map(m => (
              <option key={m.month} value={m.month}>
                {m.month}
              </option>
            ))}
          </select>
        </label>
      </section>

      {/* GASTOS POR CATEGORÍA */}
      <section>
        <h2>Gastos por categoría</h2>
        {filteredCategoryData.length === 0 ? (
          <p>No hay datos</p>
        ) : (
          <PieChart width={300} height={300}>
            <Pie
              data={filteredCategoryData}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {filteredCategoryData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </section>

      {/* GASTOS MENSUALES */}
      <section>
        <h2>Gastos mensuales</h2>
        {monthlyData.length === 0 ? (
          <p>No hay datos</p>
        ) : (
          <ul>
            {monthlyData.map(item => (
              <li key={item.month}>
                <strong>{item.month}</strong>: {item.total} €
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ÚLTIMOS GASTOS */}
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
