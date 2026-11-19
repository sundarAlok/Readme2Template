export default function Navbar() {
  return (
    <header className="navbar">
      <a className="brand" href="/" aria-label="Readme2Template home">
        <img className="brand-logo" src="/favicon.svg" alt="" width="34" height="34" />
        <span>Readme2Template</span>
      </a>
      <a
        className="navbar-link"
        href="https://github.com/sundarAlok"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Sundar Alok on GitHub"
        title="Visit Sundar Alok on GitHub"
      >
        <svg className="github-icon" viewBox="0 0 19 19" aria-hidden="true">
          <use href="/icons.svg#github-icon" />
        </svg>
        <span>GitHub</span>
      </a>
    </header>
  )
}
