import { useState, useEffect, useCallback } from "react";
import {
  fetchExpensesByCategory,
  fetchExpensesByMonth,
  fetchLatestExpenses,
  fetchIncomeSummary,
  fetchExpenses,
  fetchCategories
} from "../api";
import { useError } from "../hooks/useError";

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
      const [cats, exps, catData, monthData, latest, summary] = await Promise.all([
        fetchCategories(),
        fetchExpenses(),
        fetchExpensesByCategory(),
        fetchExpensesByMonth(),
        fetchLatestExpenses(),
        fetchIncomeSummary("all")
      ]);
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

  useEffect(() => { load(); }, [load]);

  return {
    categories, setCategories,
    expenses, setExpenses,
    categoryData,
    monthlyData,
    latestExpenses,
    incomeSummary,
    loading,
    error,
    reload: load
  };
}
