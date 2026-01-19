import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  fetchExpensesByCategory,
  fetchExpensesByMonth,
  fetchLatestExpenses,
} from "../api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const MONTH_NAMES = {
  "01": "Enero",
  "02": "Febrero",
  "03": "Marzo",
  "04": "Abril",
  "05": "Mayo",
  "06": "Junio",
  "07": "Julio",
  "08": "Agosto",
  "09": "Septiembre",
  "10": "Octubre",
  "11": "Noviembre",
  "12": "Diciembre",
};

export default function Dashboard({ reload }) {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [latestExpenses, setLatestExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    loadData();
  }, [reload]);

  async function loadData() {
    try {
      setCategoryData(await fetchExpensesByCategory());
      setMonthlyData(await fetchExpensesByMonth());
      setLatestExpenses(await fetchLatestExpenses());
    } catch (err) {
      console.error("Error cargando dashboard:", err.message);
    }
  }

  const filteredLatestExpenses = useMemo(() => {
    if (!selectedMonth) return latestExpenses;
    return latestExpenses.filter(
      e => String(e.date).slice(5, 7) === selectedMonth
    );
  }, [latestExpenses, selectedMonth]);

  const totalLatest = filteredLatestExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  return (
    <div className="dashboard">
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
      </section>
      <section>
        <h2>Gastos por categoría</h2>

        {categoryData.length === 0 ? (
          <p>No hay datos</p>
        ) : (
          <PieChart width={350} height={250}>
            <Pie
              data={categoryData}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {categoryData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </section>

      <section>
        <h2>Gastos mensuales</h2>
        <ul className="monthly-list">
          {monthlyData.map(item => (
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
            <p><strong>Total:</strong> {totalLatest} €</p>
          </>
        )}
      </section>
    </div>
  );
}
