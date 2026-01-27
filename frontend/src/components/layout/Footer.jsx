import { FaInstagram, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

// Footer corporativo
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Copyright */}
        <p>© 2026 Finance Tracker</p>

        {/* Contacto */}
        <p>Contacto: contacto@tudominio.com | Calle Ejemplo 123, Ciudad</p>

        {/* Redes sociales */}
        <div className="socials">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        </div>

        {/* Aviso Legal */}
        <p>
          <a href="/legal">Aviso Legal</a>
        </p>
      </div>
    </footer>
  );
}
