import { MoveUpRight } from 'lucide-react'
import MarkdownRenderer from '../components/preview/MarkdownRenderer'

export default function PremiumTemplate(props) {
  return (
    <div className="template template-premium">
      <header className="premium-cover">
        <div className="premium-kicker">PROJECT / {props.repository.language || 'OPEN SOURCE'}</div>
        <div className="premium-project">{props.repository.full_name}<MoveUpRight size={18} /></div>
        {props.repository.description && <p>{props.repository.description}</p>}
      </header>
      <div className="premium-content"><MarkdownRenderer {...props} /></div>
      <footer className="premium-footer"><span>THE PROJECT NOTES</span><span>{props.readmePath}</span></footer>
    </div>
  )
}
