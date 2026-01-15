import { useState } from "react";
import "./App.css";

import Dashboard from "./components/Dashboard";
import CategoriesForm from "./components/CategoriesForm";
import CategoriesList from "./components/CategoriesList";
import ExpensesForm from "./components/ExpensesForm";
import ExpensesList from "./components/ExpensesList";

function App() {

  const [reloadCategories, setReloadCategories] = useState(false);
  const [reloadExpenses, setReloadExpenses] = useState(false);

  return (
    <div className="app-container">
      <h1>Finance Tracker</h1>

      <section>
        <Dashboard />
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

export default App;

