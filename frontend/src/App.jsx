import { useState } from "react";
import "./App.css";

import { AuthProvider } from "./AuthContext";
import { useAuth } from "./useAuth";

import LoginForm from "./components/LoginForm";

import Dashboard from "./components/Dashboard";
import CategoriesForm from "./components/CategoriesForm";
import CategoriesList from "./components/CategoriesList";
import ExpensesForm from "./components/ExpensesForm";
import ExpensesList from "./components/ExpensesList";

function AppContent() {
  const { user, logout, loading } = useAuth();
  const [reloadCategories, setReloadCategories] = useState(false);
  const [reloadExpenses, setReloadExpenses] = useState(false);

  if (loading) return <p>Cargando...</p>;

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
        <Dashboard reload={reloadExpenses} />
      </section>

      <hr />

      <section>
        <h2>Categorías</h2>
        <CategoriesForm onSuccess={() => setReloadCategories(!reloadCategories)} />
        <CategoriesList key={reloadCategories} />
      </section>

      <hr />

      <section>
        <h2>Gastos</h2>
        <ExpensesForm onSuccess={() => setReloadExpenses(!reloadExpenses)} />
        <ExpensesList key={reloadExpenses} />
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
