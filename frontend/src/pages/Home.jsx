// Hero corporativo de la home pública
import Hero from "../components/Hero";

// Home pública (visible siempre, logueado o no)
export default function Home() {
  return (
    <section className="home">
      {/* Hero solo en Home */}
      <Hero />

      {/* Contenido corporativo ligero */}
      <section className="home-info">
        <h2>Una herramienta pensada para el control real de tus finanzas</h2>
        <p>
          Finance Tracker es una plataforma sólida y profesional orientada a la
          gestión de gastos personales mediante una API robusta y escalable.
        </p>
      </section>
    </section>
  );
}
