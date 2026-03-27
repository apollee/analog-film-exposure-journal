import { useAuth } from "../hooks/useAuth";
import "./Navigation.css";

export default function Navigation() {
  const user = useAuth();

  return (
    <header className="top-nav">
      <div className="brand">
        <span className="brand-mark" aria-hidden>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <g fill="currentColor" fillRule="evenodd">
              <g transform="translate(-180 -3999)">
                <g transform="translate(56 160)">
                  <path d="M134.011,3848.5 C135.114,3848.5 136.011,3849.397 136.011,3850.5 C136.011,3851.603 135.114,3852.5 134.011,3852.5 C132.908,3852.5 132.011,3851.603 132.011,3850.5 C132.011,3849.397 132.908,3848.5 134.011,3848.5 L134.011,3848.5 Z M134.011,3854.5 C136.22,3854.5 138.011,3852.709 138.011,3850.5 C138.011,3848.291 136.22,3846.5 134.011,3846.5 C131.802,3846.5 130.011,3848.291 130.011,3850.5 C130.011,3852.709 131.802,3854.5 134.011,3854.5 L134.011,3854.5 Z M126,3857 L142,3857 L142,3845 L126,3845 L126,3857 Z M131,3843 L137,3843 L137,3841 L131,3841 L131,3843 Z M143,3843 L143,3841 L141,3841 L141,3843 L139,3843 L139,3839 L129,3839 L129,3843 L124,3843 L124,3859 L144,3859 L144,3843 L143,3843 Z" />
                </g>
              </g>
            </g>
          </svg>
        </span>
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
