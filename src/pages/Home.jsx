import { ArrowUpRight, Layers3, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useRepository } from '../hooks/useRepository'
import { usePreference } from '../hooks/usePreference'
import { getTemplate } from '../templates'
import { getDesignTheme } from '../templates/designThemes'
import Button from '../components/common/Button'
import ErrorMessage from '../components/common/ErrorMessage'
import ReadmeList from '../components/repository/ReadmeList'
import RepositoryInfo from '../components/repository/RepositoryInfo'
import RepositoryInput from '../components/repository/RepositoryInput'
import ReadmePreview from '../components/preview/ReadmePreview'
import TemplateSelector from '../components/templates/TemplateSelector'

export default function Home() {
  const [savedTemplateId, saveTemplateId, templateError] = usePreference(
    'readme-designer-template',
    'minimal',
    (value) => getTemplate(value).id,
  )
  const [theme, setTheme, themeError] = usePreference(
    'readme-designer-theme',
    'light',
    (value) => value === 'dark' ? 'dark' : 'light',
  )
  const [savedDesignTheme, saveDesignTheme, designThemeError] = usePreference(
    'readme-designer-design-theme',
    'violet',
    (value) => getDesignTheme(value).id,
  )
  const [emojiMode, setEmojiMode, emojiModeError] = usePreference(
    'readme-designer-emoji-mode',
    'all',
    (value) => ['all', 'headings', 'none'].includes(value) ? value : 'all',
  )
  const [isOriginal, setIsOriginal] = useState(false)
  const [compare, setCompare] = useState(false)
  const templateId = getTemplate(savedTemplateId).id
  const {
    repository,
    markdownFiles,
    selectedFile,
    markdown,
    loadingRepository,
    loadingReadme,
    error,
    loadRepository,
    selectFile,
    reset,
  } = useRepository()
  const preferenceError = templateError || themeError || designThemeError || emojiModeError
  const designTheme = getDesignTheme(savedDesignTheme)

  function resetWorkspace() {
    reset()
    setIsOriginal(false)
    setCompare(false)
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="eyebrow">ONE WORKSPACE FOR YOUR MARKDOWN</div>
        <h1>Make your project docs <span>easy to explore.</span></h1>
        <p>Find any README or Markdown file in a public GitHub repository, preview it in a polished template, and export a page ready to share.</p>
        <RepositoryInput onSubmit={loadRepository} loading={loadingRepository} />
        <ErrorMessage>{error}</ErrorMessage>
        <div className="trust-row">
          <span><ShieldCheck size={16} /> No sign-in required</span>
          <span><Layers3 size={16} /> README + other Markdown files</span>
          <span><ArrowUpRight size={16} /> Free forever</span>
        </div>
      </section>

      {repository && (
        <section className="workspace">
          <div className="workspace-topline">
            <span>Repository workspace</span>
            <Button variant="text" onClick={resetWorkspace}>Explore another repository</Button>
          </div>
          <RepositoryInfo repository={repository} />
          {markdownFiles.length > 0 && (
            <div className="workspace-grid">
              <ReadmeList
                files={markdownFiles}
                selectedPath={selectedFile?.path}
                onSelect={selectFile}
              />
              {selectedFile ? (
                <div className="preview-column">
                  {!isOriginal && <TemplateSelector selectedId={templateId} onSelect={saveTemplateId} />}
                  <ReadmePreview
                    markdown={markdown}
                    repository={repository}
                    readmePath={selectedFile.path}
                    loading={loadingReadme}
                    templateId={templateId}
                    theme={theme}
                    onThemeChange={setTheme}
                    isOriginal={isOriginal}
                    onOriginalChange={setIsOriginal}
                    compare={compare}
                    onCompareChange={setCompare}
                    designTheme={designTheme}
                    onDesignThemeChange={saveDesignTheme}
                    emojiMode={emojiMode}
                    onEmojiModeChange={setEmojiMode}
                  />
                </div>
              ) : (
                <section className="preview-empty">
                  <div className="empty-icon"><Layers3 size={24} /></div>
                  <h2>Choose a README to preview</h2>
                  <p>Your original documentation will appear here.</p>
                </section>
              )}
            </div>
          )}
        </section>
      )}
      {!repository && (
        <section className="feature-cards" aria-label="How it works">
          <article><span>01</span><h2>Paste a repository</h2><p>Start with any public GitHub URL. No setup, accounts, or tokens.</p></article>
          <article><span>02</span><h2>Find README + other Markdown files</h2><p>Discover every README and .md document from the repository root to nested folders.</p></article>
          <article><span>03</span><h2>Preview instantly</h2><p>Read the original Markdown with links, tables, images, and code intact.</p></article>
        </section>
      )}
      {preferenceError && <p className="preference-error" role="status">{preferenceError}</p>}
    </div>
  )
}
