// Hooks básicos de React
// useState → guardar datos
// useEffect → ejecutar al montar
// useCallback → evitar recrear funciones
import { useState, useEffect, useCallback } from "react";
import {
  fetchExpensesByCategory,
  fetchExpensesByMonth,
  fetchLatestExpenses,
  fetchIncomeSummary,
  fetchExpenses,
  fetchCategories
} from "../api";
// Hook personalizado para gestión de errores
import { useError } from "../hooks/useError";

// Crea todos los esyados iniciales vacios de dashboard
export function useBootstrapData() {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [latestExpenses, setLatestExpenses] = useState([]);
  const [incomeSummary, setIncomeSummary] = useState({ income: 0, expenses: 0, savings: 0 });
  const [loading, setLoading] = useState(true);
  const { error, showError } = useError();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Obtiene JSON con los datos
      const [cats, exps, catData, monthData, latest, summary] = await Promise.all([
        fetchCategories(),
        fetchExpenses(),
        fetchExpensesByCategory(),
        fetchExpensesByMonth(),
        fetchLatestExpenses(),
        fetchIncomeSummary("all")
      ]);
      // Guarda los datos en el estado
      setCategories(cats);
      setExpenses(exps);
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

  // Arranca todo el dashboard
  useEffect(() => { load(); }, [load]);

  // Store del dashboard
  return {
    categories, setCategories,
    expenses, setExpenses,
    categoryData,
    monthlyData,
    latestExpenses,
    incomeSummary,
    loading,
    error,
    reload: load // Refresca todo
  };
}
