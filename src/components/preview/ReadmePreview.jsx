import { FileText } from 'lucide-react'
import Loader from '../common/Loader'
import MarkdownRenderer from './MarkdownRenderer'

export default function ReadmePreview({ markdown, repository, readmePath, loading }) {
  return (
    <section className="preview-panel">
      <div className="preview-header">
        <div><FileText size={17} /><strong>{readmePath || 'README preview'}</strong></div>
        <span>Original markdown</span>
      </div>
      <div className="preview-content">
        {loading ? <div className="preview-loading"><Loader label="Loading README" /></div> : (
          <MarkdownRenderer markdown={markdown} repository={repository} readmePath={readmePath} />
        )}
      </div>
    </section>
  )
}
