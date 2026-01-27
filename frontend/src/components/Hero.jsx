import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import "./Hero.css";

// Hero principal de la Home pública
export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="hero">
      {/* Título principal */}
      <h1>Finance Tracker llega para quedarse</h1>

      {/* Subtítulo */}
      <p>Tu nueva API de gestión de gastos</p>

      {/* CTA solo si NO está logueado */}
      {!user && (
        <Link to="/register" className="cta">
          Empieza ahora
        </Link>
      )}

      {/* Si está logueado */}
      {user && (
        <Link to="/summary" className="cta secondary">
          Ir al resumen
        </Link>
      )}
    </section>
  );
}
