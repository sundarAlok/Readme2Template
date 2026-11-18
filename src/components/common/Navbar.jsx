import { GitBranch } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="navbar">
      <a className="brand" href="/" aria-label="GitHub README Designer home">
        <span className="brand-mark"><GitBranch size={20} /></span>
        <span>README Designer</span>
      </a>
      <a className="navbar-link" href="https://github.com" target="_blank" rel="noreferrer">
        GitHub
      </a>
    </header>
  )
}
