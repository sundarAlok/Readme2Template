import { BookOpen } from 'lucide-react'
import { extractHeadings } from '../utils/markdownUtils'
import MarkdownRenderer from '../components/preview/MarkdownRenderer'

export default function DocumentationTemplate(props) {
  const headings = extractHeadings(props.markdown)
  return (
    <div className="template template-documentation">
      <aside className="documentation-sidebar">
        <div className="documentation-sidebar-title"><BookOpen size={16} /> DOCUMENTATION</div>
        <div className="documentation-project">{props.repository.name}</div>
        <span className="documentation-current">{props.readmePath}</span>
        <nav aria-label="Documentation sections">
          {headings.map((heading, index) => (
            <a key={`${heading.slug}-${index}`} className={`depth-${heading.level}`} href={`#${heading.slug}`}>{heading.text}</a>
          ))}
        </nav>
      </aside>
      <div className="documentation-content"><MarkdownRenderer {...props} /></div>
    </div>
  )
}
