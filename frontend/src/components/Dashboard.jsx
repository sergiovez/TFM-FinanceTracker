import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { parseISO, format } from "date-fns";

import "./Dashboard.css"

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"];

const MONTH_NAMES = {
  "01": "Enero", "02": "Febrero", "03": "Marzo", "04": "Abril",
  "05": "Mayo", "06": "Junio", "07": "Julio", "08": "Agosto",
  "09": "Septiembre", "10": "Octubre", "11": "Noviembre", "12": "Diciembre",
};

export default function Dashboard({
  categoryData = [],
  monthlyData = [],
  latestExpenses = [],
  incomeSummary = { income: 0 }
}) {
  const [selectedMonth, setSelectedMonth] = useState("");

  const filteredLatestExpenses = useMemo(() => {
    if (!selectedMonth) return latestExpenses;
    return latestExpenses.filter(e => format(parseISO(e.date), "MM") === selectedMonth);
  }, [latestExpenses, selectedMonth]);

  const filteredCategoryData = useMemo(() => {
    if (!selectedMonth) return categoryData;
    return categoryData.filter(c => c.month === selectedMonth);
  }, [categoryData, selectedMonth]);

  const filteredMonthlyData = useMemo(() => {
    if (!selectedMonth) return monthlyData;
    return monthlyData.filter(m => m.month === selectedMonth);
  }, [monthlyData, selectedMonth]);

  const income = incomeSummary.income;
  const expenses = filteredMonthlyData.reduce((sum, m) => sum + Number(m.total), 0);
  const savings = income - expenses;

  return (
    <div className="dashboard">
      <section className="dashboard-card">
        <h2>Resumen</h2>

        <select
          className="dashboard-select"
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

        <div className="summary-values">
          <p><strong>Ingresos:</strong> {income} €</p>
          <p><strong>Gastos:</strong> {expenses} €</p>
          <p><strong>Ahorro:</strong> {savings} €</p>
        </div>
      </section>

      <section className="dashboard-card">
        <h2>Gastos por categoría</h2>

        {filteredCategoryData.length === 0 ? (
          <p>No hay datos</p>
        ) : (
          <PieChart width={320} height={240}>
            <Pie
              data={filteredCategoryData}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {filteredCategoryData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </section>

      <section className="dashboard-card">
        <h2>Últimos gastos</h2>
        <ul className="expense-list">
          {filteredLatestExpenses.map(e => (
            <li key={e.id}>
              {e.date} — {e.category} — {e.amount} €
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
