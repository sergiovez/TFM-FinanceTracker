// NavLink para navegación activa
import { NavLink } from "react-router-dom";
import "./NavMenu.css"; // Estilos específicos del menú

// Menú principal de navegación (solo usuarios logueados)
export default function NavMenu() {
  return (
    <nav className="nav-menu">
      {/* Link único al resumen */}
      <NavLink to="/summary" className="nav-link">Resumen</NavLink>

      {/* Dropdown Categorías */}
      <div className="dropdown">
        <button className="dropbtn">Categorías</button>
        <div className="dropdown-content">
          <NavLink to="/categories/new">Nueva categoría</NavLink>
          <NavLink to="/categories/list">Mis categorías</NavLink>
        </div>
      </div>

      {/* Dropdown Gastos */}
      <div className="dropdown">
        <button className="dropbtn">Gastos</button>
        <div className="dropdown-content">
          <NavLink to="/expenses/new">Nuevo gasto</NavLink>
          <NavLink to="/expenses/list">Mis gastos</NavLink>
        </div>
      </div>
    </nav>
  );
}
