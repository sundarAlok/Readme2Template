import { BookOpen, Braces, Check, Gem, LayoutTemplate } from 'lucide-react'

const icons = {
  modern: LayoutTemplate,
  minimal: Check,
  developer: Braces,
  documentation: BookOpen,
  premium: Gem,
}

export default function TemplateCard({ template, selected, onSelect }) {
  const Icon = icons[template.id]
  return (
    <button
      type="button"
      className={`template-card ${selected ? 'is-selected' : ''}`}
      aria-pressed={selected}
      onClick={() => onSelect(template.id)}
    >
      <span className={`template-card-art art-${template.id}`} aria-hidden="true">
        <span className="art-header"><Icon size={13} /><i /></span>
        <span className="art-title" />
        <span className="art-line wide" />
        <span className="art-line" />
        <span className="art-block" />
      </span>
      <span className="template-card-copy">
        <strong>{template.name}</strong>
        <small>{template.description}</small>
      </span>
    </button>
  )
}
