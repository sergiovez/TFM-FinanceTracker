import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale";

import "./Dashboard.css";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed"];

const MONTH_NAMES = {
  "01": "Enero", "02": "Febrero", "03": "Marzo", "04": "Abril",
  "05": "Mayo", "06": "Junio", "07": "Julio", "08": "Agosto",
  "09": "Septiembre", "10": "Octubre", "11": "Noviembre", "12": "Diciembre",
};

function normalizeMonth(month) {
  if (typeof month === "string" && month.includes("-")) {
    return month.split("-")[1];
  }
  if (typeof month === "number") {
    return String(month).padStart(2, "0");
  }
  return month;
}

function monthLabel(month) {
  const m = normalizeMonth(month);
  return MONTH_NAMES[m] || m;
}

export default function Dashboard({
  categoryData = [],
  monthlyData = [],
  latestExpenses = [],
  incomeSummary = { income: 0 },
}) {
  const [selectedMonth, setSelectedMonth] = useState("");

  const filteredLatestExpenses = useMemo(() => {
    const list = selectedMonth
      ? latestExpenses.filter(
          e => format(parseISO(e.date), "MM") === selectedMonth
        )
      : latestExpenses;

    return list.slice(0, 10);
  }, [latestExpenses, selectedMonth]);

  const filteredCategoryData = useMemo(() => {
    if (!selectedMonth) return categoryData;
    return categoryData.filter(
      c => normalizeMonth(c.month) === selectedMonth
    );
  }, [categoryData, selectedMonth]);

  const groupedCategoryData = useMemo(() => {
    const map = {};
    filteredCategoryData.forEach(item => {
      if (!map[item.category]) {
        map[item.category] = {
          category: item.category,
          total: Number(item.total),
        };
      } else {
        map[item.category].total += Number(item.total);
      }
    });
    return Object.values(map);
  }, [filteredCategoryData]);

  const filteredMonthlyData = useMemo(() => {
    if (!selectedMonth) return monthlyData;
    return monthlyData.filter(
      m => normalizeMonth(m.month) === selectedMonth
    );
  }, [monthlyData, selectedMonth]);

  const income = useMemo(() => {
    if (selectedMonth) return incomeSummary.income;
    const months = new Set(monthlyData.map(m => m.month));
    return incomeSummary.income * months.size;
  }, [selectedMonth, incomeSummary.income, monthlyData]);

  const expenses = filteredMonthlyData.reduce(
    (sum, m) => sum + Number(m.total),
    0
  );

  const savings = income - expenses;

  return (
    <div className="dashboard">
      {/* RESUMEN */}
      <section className="dashboard-card summary">
        <div className="summary-header">
          <h2>Resumen</h2>

          <select
            className="dashboard-select"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            <option value="">📅 Todos los meses</option>
            {monthlyData.map(m => {
              const normalized = normalizeMonth(m.month);
              return (
                <option key={m.month} value={normalized}>
                  {monthLabel(m.month)}
                </option>
              );
            })}
          </select>
        </div>

        <div className="summary-cards">
          <div className="kpi">
            <span>💰 Ingresos</span>
            <strong>{income.toFixed(2)} €</strong>
          </div>

          <div className="kpi">
            <span>💸 Gastos</span>
            <strong>{expenses.toFixed(2)} €</strong>
          </div>

          <div className={`kpi ${savings >= 0 ? "positive" : "negative"}`}>
            <span>💚 Ahorro</span>
            <strong>{savings.toFixed(2)} €</strong>
          </div>
        </div>
      </section>

      {/* GRAFICO */}
      <section className="dashboard-card">
        <h2>Gastos por categoría</h2>

        {groupedCategoryData.length === 0 ? (
          <p>No hay datos</p>
        ) : (
          <div className="chart-wrapper">
            <PieChart width={320} height={260}>
              <Pie
                data={groupedCategoryData}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
              >
                {groupedCategoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, _, props) => {
                  const total = groupedCategoryData.reduce(
                    (s, i) => s + i.total,
                    0
                  );
                  const percent = ((value / total) * 100).toFixed(1);
                  return [`${value} € (${percent}%)`, props.payload.category];
                }}
              />

              <Legend />
            </PieChart>

            <div className="chart-center">
              <span>Total</span>
              <strong>{expenses.toFixed(2)} €</strong>
            </div>
          </div>
        )}
      </section>

      {/* ÚLTIMOS GASTOS */}
      <section className="dashboard-card">
        <h2>Últimos gastos</h2>

        <ul className="expense-list">
          {filteredLatestExpenses.map(e => (
            <li key={e.id}>
              <div>
                <strong>{e.category}</strong>
                <span>
                  {format(parseISO(e.date), "d MMM", { locale: es })}
                </span>
              </div>
              <span className="amount">- {e.amount} €</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
