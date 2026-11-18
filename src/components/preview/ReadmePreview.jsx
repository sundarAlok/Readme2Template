import { FileText } from 'lucide-react'
import Loader from '../common/Loader'
import MarkdownRenderer from './MarkdownRenderer'
import PreviewToolbar from './PreviewToolbar'
import { getTemplate } from '../../templates'

export default function ReadmePreview({
  markdown,
  repository,
  readmePath,
  loading,
  templateId,
  theme,
  onThemeChange,
  isOriginal,
  onOriginalChange,
}) {
  const { Component: TemplateComponent } = getTemplate(templateId)
  return (
    <section className="preview-panel">
      <div className="preview-header">
        <div><FileText size={17} /><strong>{readmePath || 'README preview'}</strong></div>
        <span>{isOriginal ? 'Original markdown' : 'Live design'}</span>
      </div>
      <PreviewToolbar
        theme={theme}
        onThemeChange={onThemeChange}
        isOriginal={isOriginal}
        onOriginalChange={onOriginalChange}
      />
      <div className={`preview-content preview-theme-${theme}`}>
        {loading ? <div className="preview-loading"><Loader label="Loading README" /></div> : isOriginal ? (
          <MarkdownRenderer markdown={markdown} repository={repository} readmePath={readmePath} />
        ) : (
          <TemplateComponent markdown={markdown} repository={repository} readmePath={readmePath} />
        )}
      </div>
    </section>
  )
}
