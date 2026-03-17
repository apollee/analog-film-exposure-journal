import { useAuth } from "../hooks/useAuth";
import "./Navigation.css";

export default function Navigation() {
  const user = useAuth();

  return (
    <header className="top-nav">
      <div className="brand">
        <span className="brand-mark" aria-hidden />
        <span className="brand-title">Analog Journal</span>
      </div>

      <div className="nav-user">
        {user ? (
          <>
            <span className="user-chip">{user.userDetails}</span>
            <a className="icon-link" href="/.auth/logout?post_logout_redirect_uri=/">
              Logout
            </a>
          </>
        ) : (
          <a className="icon-link" href="/.auth/login/aad?post_login_redirect_uri=/journal-rolls">
            Login
          </a>
        )}
      </div>
    </header>
  );
}
