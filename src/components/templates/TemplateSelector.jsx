import { templates } from '../../templates'
import TemplateCard from './TemplateCard'

export default function TemplateSelector({ selectedId, onSelect }) {
  return (
    <section className="template-selector" aria-label="Choose a README design">
      <div className="section-heading template-selector-heading">
        <div><h2>Choose a design</h2><span className="count-badge">5 templates</span></div>
        <p>Switch styles instantly. Your source README stays unchanged.</p>
      </div>
      <div className="template-gallery">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={selectedId === template.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}
