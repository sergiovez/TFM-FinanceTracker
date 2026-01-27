// Outlet permite renderizar la página hija dentro del layout
import { Outlet } from "react-router-dom";

// Componentes estructurales
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import "./MainLayout.css";

// Layout principal de la app
export default function MainLayout() {
  return (
    <div className="app-layout">
      {/* Header corporativo */}
      <Header />

      {/* Contenido dinámico según ruta */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer corporativo */}
      <Footer />
    </div>
  );
}
