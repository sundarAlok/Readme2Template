import { Moon, Sun } from 'lucide-react'
import Button from '../common/Button'

export default function PreviewToolbar({ theme, onThemeChange, isOriginal, onOriginalChange }) {
  return (
    <div className="preview-toolbar">
      <div className="preview-tabs" role="group" aria-label="Preview mode">
        <Button
          variant={isOriginal ? 'tab-active' : 'tab'}
          aria-pressed={isOriginal}
          onClick={() => onOriginalChange(true)}
        >
          Original
        </Button>
        <Button
          variant={!isOriginal ? 'tab-active' : 'tab'}
          aria-pressed={!isOriginal}
          onClick={() => onOriginalChange(false)}
        >
          Designed
        </Button>
      </div>
      <Button
        variant="icon"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} preview`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} preview`}
        onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
      >
        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
      </Button>
    </div>
  )
}
