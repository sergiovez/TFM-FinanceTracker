import { Link } from "react-router-dom";

// Página 404
export default function NotFound() {
  return (
    <section className="not-found">
      <h1>404</h1>
      <p>La página que buscas no existe.</p>

      {/* Volver a Home */}
      <Link to="/" className="cta">
        Volver al inicio
      </Link>
    </section>
  );
}
