import { useEffect, useRef, useState } from 'react'
import { FileText } from 'lucide-react'
import Loader from '../common/Loader'
import MarkdownRenderer from './MarkdownRenderer'
import PreviewToolbar from './PreviewToolbar'
import { getTemplate } from '../../templates'
import { downloadHtmlFile, exportRenderedHtml } from '../../services/exportService'

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
  compare,
  onCompareChange,
  designTheme,
  onDesignThemeChange,
}) {
  const { Component: TemplateComponent } = getTemplate(templateId)
  const [maximized, setMaximized] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const feedbackTimer = useRef(null)
  const exportRef = useRef(null)

  useEffect(() => {
    if (!maximized) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function handleKeyDown(event) {
      if (event.key === 'Escape') setMaximized(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [maximized])

  useEffect(() => () => window.clearTimeout(feedbackTimer.current), [])

  function showFeedback(type, message) {
    window.clearTimeout(feedbackTimer.current)
    setFeedback({ type, message })
    feedbackTimer.current = window.setTimeout(() => setFeedback(null), 3500)
  }

  function createExport() {
    if (!exportRef.current) throw new Error('Switch to Designed or Compare view before exporting.')
    return exportRenderedHtml(exportRef.current, {
      title: `${repository.full_name} - ${readmePath}`,
      templateId,
      theme,
      designTheme: designTheme.id,
    })
  }

  function download() {
    try {
      const html = createExport()
      const filename = `${repository.full_name}-${readmePath.split('/').pop()}`
        .replace(/[^a-z0-9._-]+/gi, '-')
        .replace(/-+/g, '-')
      downloadHtmlFile(html, `${filename}.html`)
      showFeedback('success', 'Standalone HTML downloaded.')
    } catch (error) {
      showFeedback('error', `Download failed: ${error.message}`)
    }
  }

  async function copyHtml() {
    try {
      const html = createExport()
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard access is unavailable in this browser.')
      await navigator.clipboard.writeText(html)
      showFeedback('success', 'Standalone HTML copied to clipboard.')
    } catch (error) {
      showFeedback('error', `Could not copy HTML: ${error.message}`)
    }
  }

  const contentStyle = {
    '--design-gradient': designTheme.gradient,
    '--design-start': designTheme.start,
    '--design-end': designTheme.end,
  }

  return (
    <section className={`preview-panel ${maximized ? 'is-maximized' : ''}`}>
      <div className="preview-header">
        <div><FileText size={17} /><strong>{readmePath || 'Markdown preview'}</strong></div>
        <span>{compare ? 'Side-by-side comparison' : isOriginal ? 'Original markdown' : 'Live design'}</span>
      </div>
      <PreviewToolbar
        theme={theme}
        onThemeChange={onThemeChange}
        isOriginal={isOriginal}
        onOriginalChange={onOriginalChange}
        compare={compare}
        onCompareChange={onCompareChange}
        designTheme={designTheme}
        onDesignThemeChange={onDesignThemeChange}
        onDownload={download}
        onCopy={copyHtml}
        exportDisabled={loading || isOriginal}
        maximized={maximized}
        onMaximize={() => setMaximized((value) => !value)}
        feedback={feedback}
      />
      <div className={`preview-content preview-theme-${theme}`} style={contentStyle}>
        {loading ? <div className="preview-loading"><Loader label="Loading Markdown file" /></div> : compare ? (
          <div className="comparison-view">
            <section className="comparison-pane">
              <h3>Original · {readmePath}</h3>
              <MarkdownRenderer markdown={markdown} repository={repository} readmePath={readmePath} />
            </section>
            <section className="comparison-pane">
              <h3>Designed · {getTemplate(templateId).name}</h3>
              <div ref={exportRef}>
                <TemplateComponent markdown={markdown} repository={repository} readmePath={readmePath} />
              </div>
            </section>
          </div>
        ) : isOriginal ? (
          <MarkdownRenderer markdown={markdown} repository={repository} readmePath={readmePath} />
        ) : (
          <div ref={exportRef}>
            <TemplateComponent markdown={markdown} repository={repository} readmePath={readmePath} />
          </div>
        )}
      </div>
    </section>
  )
}
