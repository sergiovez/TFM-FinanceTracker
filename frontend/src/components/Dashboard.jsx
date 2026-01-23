// Hooks React
import { useMemo, useState } from "react";
// Componentes de gráficas Recharts
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
// Componentes de gráficas Recharts
import { parseISO, format } from "date-fns";

// Librería para formatear fechas
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
// Mapeo de meses a nombres en español
const MONTH_NAMES = {
  "01": "Enero", "02": "Febrero", "03": "Marzo", "04": "Abril",
  "05": "Mayo", "06": "Junio", "07": "Julio", "08": "Agosto",
  "09": "Septiembre", "10": "Octubre", "11": "Noviembre", "12": "Diciembre",
};

// Componente principal del Dashboard
export default function Dashboard({
  categoryData,
  monthlyData,
  latestExpenses,
  incomeSummary
}) {
  // Estado para mes seleccionado en filtros
  const [selectedMonth, setSelectedMonth] = useState("");

  // ===== FILTROS =====
  // Filtramos los últimos gastos por mes
  const filteredLatestExpenses = useMemo(() => {
    if (!selectedMonth) return latestExpenses;
    return latestExpenses.filter(e => format(parseISO(e.date), "MM") === selectedMonth);
  }, [latestExpenses, selectedMonth]);

  // Filtramos datos de gastos por categoría según mes
  const filteredCategoryData = useMemo(() => {
    if (!selectedMonth) return categoryData;
    return categoryData.filter(c => c.month === selectedMonth);
  }, [categoryData, selectedMonth]);

   // Filtramos datos de gastos mensuales
  const filteredMonthlyData = useMemo(() => {
    if (!selectedMonth) return monthlyData;
    return monthlyData.filter(m => m.month === selectedMonth);
  }, [monthlyData, selectedMonth]);

  // Calculamos total de los últimos gastos filtrados
  const totalLatest = filteredLatestExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="dashboard">
      {/* Resumen de ingresos, gastos y ahorro */}
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
      
      {/* Gráfico de gastos por categoría */}
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
      
      {/* Lista de gastos mensuales */}
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
      
      {/* Lista de últimos gastos */}
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
