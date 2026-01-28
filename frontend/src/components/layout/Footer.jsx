import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Footer.css";

// Footer corporativo
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Copyright */}
        <p>© 2026 Finance Tracker</p>

        {/* Contacto */}
        <p>Contacto: sergiovez13@gmail.com | Avenida Cesareo Alierta, Zaragoza</p>

        {/* Redes sociales */}
        <div className="socials">
          <a href="https://github.com/sergiovez" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/sergio-vez/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        </div>

        {/* Aviso Legal */}
        <p>
          <Link to="/legal">Aviso Legal</Link>
        </p>
      </div>
    </footer>
  );
}
