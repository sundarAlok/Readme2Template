import { Braces } from 'lucide-react'
import { extractHeadings } from '../utils/markdownUtils'
import MarkdownRenderer from '../components/preview/MarkdownRenderer'

export default function DeveloperTemplate(props) {
  const headings = extractHeadings(props.markdown)
  return (
    <div className="template template-developer">
      <div className="developer-bar"><Braces size={16} /><span>{props.repository.full_name}</span><code>{props.readmePath}</code></div>
      <div className="developer-layout">
        {headings.length > 0 && (
          <nav className="developer-toc" aria-label="Section navigation">
            <strong>ON THIS PAGE</strong>
            {headings.map((heading, index) => (
              <a key={`${heading.slug}-${index}`} className={`depth-${heading.level}`} href={`#${heading.slug}`}>{heading.text}</a>
            ))}
          </nav>
        )}
        <MarkdownRenderer {...props} />
      </div>
    </div>
  )
}
