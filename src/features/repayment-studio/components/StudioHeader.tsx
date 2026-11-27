export function StudioHeader() {
  return (
    <header className="site-header">
      <div className="page-shell header-inner">
        <a className="brand" href="#top" aria-label="FinTrace Startseite">
          <span aria-hidden="true">F</span>FinTrace
        </a>
        <nav aria-label="Hauptnavigation">
          <a href="#prinzip">Prinzip</a>
          <a href="#studio">Studio</a>
          <a href="#referenzfaelle">Referenzfälle</a>
          <a href="#engineering">Engineering</a>
          <a
            className="github-link"
            href="https://github.com/yongshicc/fintrace"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
