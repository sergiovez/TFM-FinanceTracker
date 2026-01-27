import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import NavMenu from "./NavMenu";
import "./Header.css";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          Finance Tracker
        </Link>
      </div>

      {user && (
        <div className="header-center">
          <NavMenu />
        </div>
      )}

      <div className="header-right">
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="cta">
              Empieza ahora
            </Link>
          </>
        ) : (
          <>
            <span className="user">{user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
}
