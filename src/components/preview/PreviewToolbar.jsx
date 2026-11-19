import { Clipboard, Download, Maximize2, Minimize2, Moon, Sun } from 'lucide-react'
import Button from '../common/Button'
import { designThemes } from '../../templates/designThemes'

export default function PreviewToolbar({
  theme,
  onThemeChange,
  isOriginal,
  onOriginalChange,
  compare,
  onCompareChange,
  designTheme,
  onDesignThemeChange,
  onDownload,
  onCopy,
  maximized,
  onMaximize,
  feedback,
  exportDisabled,
}) {
  return (
    <>
      <div className="preview-toolbar">
        <div className="preview-tabs" role="group" aria-label="Preview mode">
          <Button
            variant={isOriginal ? 'tab-active' : 'tab'}
            aria-pressed={isOriginal}
            onClick={() => {
              onOriginalChange(true)
              onCompareChange(false)
            }}
          >
            Original
          </Button>
          <Button
            variant={!isOriginal && !compare ? 'tab-active' : 'tab'}
            aria-pressed={!isOriginal && !compare}
            onClick={() => {
              onOriginalChange(false)
              onCompareChange(false)
            }}
          >
            Designed
          </Button>
          <Button
            variant={compare ? 'tab-active' : 'tab'}
            aria-pressed={compare}
            onClick={() => {
              onOriginalChange(false)
              onCompareChange(true)
            }}
          >
            Compare
          </Button>
        </div>
        <div className="preview-actions">
          <Button variant="icon" aria-label="Download standalone HTML" title="Download standalone HTML" disabled={exportDisabled} onClick={onDownload}>
            <Download size={15} /><span>Download</span>
          </Button>
          <Button variant="icon" aria-label="Copy standalone HTML" title="Copy standalone HTML" disabled={exportDisabled} onClick={onCopy}>
            <Clipboard size={15} /><span>Copy HTML</span>
          </Button>
          <Button
            variant="icon"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} preview`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} preview`}
            onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
          </Button>
          <Button
            variant="icon"
            aria-label={maximized ? 'Minimize preview' : 'Maximize preview'}
            title={maximized ? 'Minimize preview' : 'Maximize preview'}
            onClick={onMaximize}
          >
            {maximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span>{maximized ? 'Minimize' : 'Maximize'}</span>
          </Button>
        </div>
      </div>
      <div className="preview-customization">
        <fieldset className="theme-picker">
          <legend>Design theme</legend>
          <div className="theme-options">
            {designThemes.map((option) => (
              <button
                type="button"
                key={option.id}
                className={`theme-option ${designTheme.id === option.id ? 'is-selected' : ''}`}
                style={{ background: option.gradient }}
                aria-label={`${option.name} theme`}
                aria-pressed={designTheme.id === option.id}
                title={option.name}
                onClick={() => onDesignThemeChange(option.id)}
              />
            ))}
          </div>
          <span className="theme-name">{designTheme.name}</span>
        </fieldset>
        {feedback && <span className={`export-feedback ${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.message}</span>}
      </div>
    </>
  )
}
