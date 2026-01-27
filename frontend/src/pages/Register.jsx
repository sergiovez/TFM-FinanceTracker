import { useState } from "react";

// Página de registro (NO crea usuario)
export default function Register() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    // Llamada simple al backend
    await fetch("/api/register-request/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    setSent(true);
  }

  if (sent) {
    return <p>Gracias. Te contactaremos pronto.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Solicitar acceso</h2>
      <input
        type="email"
        placeholder="Tu email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
