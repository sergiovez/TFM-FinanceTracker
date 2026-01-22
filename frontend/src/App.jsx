import { useAuth } from "./useAuth";
import { AuthProvider } from "./AuthProvider";
import { useBootstrapData } from "./hooks/useBootstrapData";

import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import CategoriesForm from "./components/CategoriesForm";
import CategoriesList from "./components/CategoriesList";
import ExpensesForm from "./components/ExpensesForm";
import ExpensesList from "./components/ExpensesList";

function AppContent() {
  const { user, logout, loadingAuth } = useAuth();
  const {
    categories, setCategories,
    expenses, setExpenses,
    categoryData, monthlyData, latestExpenses,
    incomeSummary, loading
  } = useBootstrapData();

  if (loadingAuth || loading) return <p>Cargando...</p>;
  if (!user) return <LoginForm />;

  return (
    <div className="app-container">
      <header className="header">
        <h1>Finance Tracker</h1>
        <div>
          <span>{user.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <section>
        <Dashboard
          categories={categories}
          expenses={expenses}
          categoryData={categoryData}
          monthlyData={monthlyData}
          latestExpenses={latestExpenses}
          incomeSummary={incomeSummary}
          setCategories={setCategories}
          setExpenses={setExpenses}
        />
      </section>

      <hr />

      <section>
        <h2>Categorías</h2>
        <CategoriesForm onAddCategory={newCategory => setCategories([...categories, newCategory])} />
        <CategoriesList categories={categories} setCategories={setCategories} />
      </section>

      <hr />

      <section>
        <h2>Gastos</h2>
        <ExpensesForm categories={categories} onAddExpense={newExpense => setExpenses([...expenses, newExpense])} />
        <ExpensesList expenses={expenses} setExpenses={setExpenses} />
      </section>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
