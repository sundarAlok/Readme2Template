import { FileText } from 'lucide-react'

export default function ReadmeList({ readmes, selectedPath, onSelect }) {
  return (
    <section className="readme-list-panel">
      <div className="section-heading">
        <div><h2>README files</h2><span className="count-badge">{readmes.length}</span></div>
        <p>Select a file to preview its original content.</p>
      </div>
      <div className="readme-list" role="listbox" aria-label="Repository README files">
        {readmes.map((readme) => (
          <button
            type="button"
            role="option"
            aria-selected={selectedPath === readme.path}
            className={`readme-item ${selectedPath === readme.path ? 'is-selected' : ''}`}
            key={readme.path}
            onClick={() => onSelect(readme)}
          >
            <FileText size={17} />
            <span>{readme.path}</span>
            {Number.isFinite(readme.size) && <small>{Math.max(1, Math.round(readme.size / 1024))} KB</small>}
          </button>
        ))}
      </div>
    </section>
  )
}
