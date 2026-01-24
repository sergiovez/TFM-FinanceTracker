// Hook personalizado para acceder al estado de autenticación
import { useAuth } from "./auth/useAuth"; 
// Provees cotexto de auth
import { AuthProvider } from "./auth/AuthProvider"; 
// Carag inicial de datos del dashboard
import { useBootstrapData } from "./hooks/useBootstrapData"; 
// Estilos
import './App.css';

// Componentes principales de la aplicación
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import CategoriesForm from "./components/CategoriesForm";
import CategoriesList from "./components/CategoriesList";
import ExpensesForm from "./components/ExpensesForm";
import ExpensesList from "./components/ExpensesList";

// ------------------------------------------------------------
// App
// ------------------------------------------------------------
function AppContent() {
  // Obtenemos usuario, logout y estado de carga de auth
  const { user, logout, loadingAuth } = useAuth(); 

  // Carga inicial de todos los datos del dashboard
  const {
    categories, setCategories,
    expenses, setExpenses,
    categoryData, monthlyData, latestExpenses,
    incomeSummary, loading
  } = useBootstrapData();

  // Si está cargando autenticación o datos iniciales, mostramos mensaje
  if (loadingAuth || loading) return <p>Cargando...</p>;
  
  // Si no hay usuario logueado, mostramos formulario de login
  if (!user) return <LoginForm />;

  // Contenido principal de la app
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1>Finance Tracker</h1>
        <div>
          <span>{user.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {/* Dashboard */}
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

      {/* Sección de categorías */}
      <section>
        <h2>Categorías</h2>
        <CategoriesForm onAddCategory={newCategory => setCategories([...categories, newCategory])} />
        <CategoriesList categories={categories} setCategories={setCategories} />
      </section>

      <hr />

      {/* Sección de gastos */}
      <section>
        <h2>Gastos</h2>
        <ExpensesForm categories={categories} onAddExpense={newExpense => setExpenses([...expenses, newExpense])} />
        <ExpensesList expenses={expenses} setExpenses={setExpenses} />
      </section>
    </div>
  );
}

// App envuelta en proveedor de Auth para poder usar useAuth en cualquier componente
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
