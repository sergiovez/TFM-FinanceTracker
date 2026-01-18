import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { fetchExpensesByCategory, fetchExpensesByMonth, fetchLatestExpenses } from '../api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [latestExpenses, setLatestExpenses] = useState([]);

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

  const totalLatest = latestExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="dashboard">
      <section>
        <h2>Gastos por categoría</h2>
        {categoryData.length === 0 ? (
          <p>No hay datos</p>
        ) : (
          <PieChart width={300} height={300}>
            <Pie
              data={categoryData}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </section>

      <section>
        <h2>Gastos mensuales</h2>
        {monthlyData.length === 0 ? (
          <p>No hay datos</p>
        ) : (
          <ul>
            {monthlyData.map(item => (
              <li key={item.month}>Mes {item.month}: {item.total} €</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Últimos gastos</h2>
        {latestExpenses.length === 0 ? (
          <p>No hay datos</p>
        ) : (
          <>
            <ul>
              {latestExpenses.map(e => (
                <li key={e.id}>{e.date} - {e.category} - {e.amount} €</li>
              ))}
            </ul>
            <p>Total últimos gastos: {totalLatest} €</p>
          </>
        )}
      </section>
    </div>
  );
}
