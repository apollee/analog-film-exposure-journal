import "./Home.css";

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-mark">
          <div className="home-mark-box">
            <span className="home-mark-icon" aria-hidden />
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
