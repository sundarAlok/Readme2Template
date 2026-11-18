import { Sparkles } from 'lucide-react'
import MarkdownRenderer from '../components/preview/MarkdownRenderer'

export default function ModernTemplate(props) {
  const { repository } = props
  return (
    <div className="template template-modern">
      <div className="template-modern-accent"><Sparkles size={16} /> PROJECT OVERVIEW</div>
      <div className="template-modern-content">
        <MarkdownRenderer {...props} />
      </div>
      <div className="template-credit">Built with GitHub README Designer <span>·</span> {repository.full_name}</div>
    </div>
  )
}
