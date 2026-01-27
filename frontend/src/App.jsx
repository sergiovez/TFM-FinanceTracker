// React Router para navegación SPA
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Proveedor de autenticación global
import { AuthProvider } from "./auth/AuthProvider";

// Hook para acceder al estado de autenticación
import { useAuth } from "./auth/useAuth";

// Layout principal (Header + Footer)
import MainLayout from "./layouts/MainLayout";

// Páginas
import Home from "./pages/Home";
import Summary from "./pages/Summary";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Categorías
import NewCategory from "./pages/categories/NewCategory";
import ListCategories from "./pages/categories/ListCategories";

// Gastos
import NewExpense from "./pages/expenses/NewExpense";
import ListExpenses from "./pages/expenses/ListExpenses";

// Componentes
import LoginForm from "./components/LoginForm";

// Estilos globales
import "./App.css";

// ------------------------------------------------------------
// Ruta protegida (solo usuarios logueados)
// ------------------------------------------------------------
function PrivateRoute({ children }) {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) return <p>Cargando...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// ------------------------------------------------------------
// App
// ------------------------------------------------------------
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Layout principal: Header + Footer */}
          <Route element={<MainLayout />}>

            {/* Home pública */}
            <Route path="/" element={<Home />} />

            {/* Login */}
            <Route path="/login" element={<LoginForm />} />

            {/* Registro */}
            <Route path="/register" element={<Register />} />

            {/* Resumen (Dashboard) protegido */}
            <Route
              path="/summary"
              element={
                <PrivateRoute>
                  <Summary />
                </PrivateRoute>
              }
            />

            {/* Categorías protegidas */}
            <Route
              path="/categories/new"
              element={
                <PrivateRoute>
                  <NewCategory />
                </PrivateRoute>
              }
            />
            <Route
              path="/categories/list"
              element={
                <PrivateRoute>
                  <ListCategories />
                </PrivateRoute>
              }
            />

            {/* Gastos protegidos */}
            <Route
              path="/expenses/new"
              element={
                <PrivateRoute>
                  <NewExpense />
                </PrivateRoute>
              }
            />
            <Route
              path="/expenses/list"
              element={
                <PrivateRoute>
                  <ListExpenses />
                </PrivateRoute>
              }
            />

            {/* Página no encontrada */}
            <Route path="*" element={<NotFound />} />

          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
