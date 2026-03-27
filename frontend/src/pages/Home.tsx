import "./Home.css";

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-mark">
          <div className="home-mark-box">
            <svg viewBox="0 0 20 20" aria-hidden="true" className="home-mark-icon">
              <g fill="currentColor" fillRule="evenodd">
                <g transform="translate(-180 -3999)">
                  <g transform="translate(56 160)">
                    <path d="M134.011,3848.5 C135.114,3848.5 136.011,3849.397 136.011,3850.5 C136.011,3851.603 135.114,3852.5 134.011,3852.5 C132.908,3852.5 132.011,3851.603 132.011,3850.5 C132.011,3849.397 132.908,3848.5 134.011,3848.5 L134.011,3848.5 Z M134.011,3854.5 C136.22,3854.5 138.011,3852.709 138.011,3850.5 C138.011,3848.291 136.22,3846.5 134.011,3846.5 C131.802,3846.5 130.011,3848.291 130.011,3850.5 C130.011,3852.709 131.802,3854.5 134.011,3854.5 L134.011,3854.5 Z M126,3857 L142,3857 L142,3845 L126,3845 L126,3857 Z M131,3843 L137,3843 L137,3841 L131,3841 L131,3843 Z M143,3843 L143,3841 L141,3841 L141,3843 L139,3843 L139,3839 L129,3839 L129,3843 L124,3843 L124,3859 L144,3859 L144,3843 L143,3843 Z" />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>
        <h1>Analog Journal</h1>
        <p className="home-tagline">– record your exposures, master your craft –</p>
      </section>

      <section className="home-card">
        <div className="home-card-accent" aria-hidden />
        <div>
          <h2>Open Journal</h2>
          <p className="home-card-sub">Welcome back, photographer</p>
        </div>

        <div className="home-actions">
          <a
            className="home-btn"
            href="/.auth/login/aad?post_login_redirect_uri=/journal-rolls"
          >
            [ Log In ]
          </a>
          <a
            className="home-link"
            href="/.auth/login/aad?post_login_redirect_uri=/journal-rolls"
          >
            Start a new journal? Sign up
          </a>
        </div>
      </section>

      <p className="home-quote">
        “The camera is an instrument that teaches people how to see without a camera.” — Dorothea Lange
      </p>
    </main>
  );
}
