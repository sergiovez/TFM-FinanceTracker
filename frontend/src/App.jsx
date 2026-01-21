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

  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);

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
        <Dashboard 
          expenses={expenses} 
          categories={categories} 
        />
      </section>

      <hr />

      <section>
        <h2>Categorías</h2>
        <CategoriesForm
          // CAMBIO B3: callback para agregar directamente la nueva categoría
          onAddCategory={(newCategory) => setCategories([...categories, newCategory])}
        />
        <CategoriesList
          categories={categories}
          setCategories={setCategories} // CAMBIO B3: pasamos setCategories para borrar/editar
        />
      </section>

      <hr />

      <section>
        <h2>Gastos</h2>
        <ExpensesForm
          categories={categories} // CAMBIO B3: recibimos categorías ya cargadas
          onAddExpense={(newExpense) => setExpenses([...expenses, newExpense])} 
        />
        <ExpensesList
          expenses={expenses}
          setExpenses={setExpenses} // CAMBIO B3: actualizar el estado directamente
        />
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
