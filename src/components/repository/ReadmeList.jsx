import { FileText } from 'lucide-react'

export default function ReadmeList({ files, selectedPath, onSelect }) {
  return (
    <section className="readme-list-panel">
      <div className="section-heading">
        <div>                <h2>README + Markdown files</h2><span className="count-badge">{files.length}</span></div>
        <p>Select a README or other .md file to preview its original content.</p>
      </div>
      <div className="readme-list" role="listbox" aria-label="Repository README and Markdown files">
        {files.map((file) => (
          <button
            type="button"
            role="option"
            aria-selected={selectedPath === file.path}
            className={`readme-item ${selectedPath === file.path ? 'is-selected' : ''}`}
            key={file.path}
            onClick={() => onSelect(file)}
          >
            <FileText size={17} />
            <span>{file.path}</span>
            {Number.isFinite(file.size) && <small>{Math.max(1, Math.round(file.size / 1024))} KB</small>}
          </button>
        ))}
      </div>
    </section>
  )
}
