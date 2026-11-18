import { ArrowUpRight, Layers3, ShieldCheck, Sparkles } from 'lucide-react'
import { useRepository } from '../hooks/useRepository'
import Button from '../components/common/Button'
import ErrorMessage from '../components/common/ErrorMessage'
import ReadmeList from '../components/repository/ReadmeList'
import RepositoryInfo from '../components/repository/RepositoryInfo'
import RepositoryInput from '../components/repository/RepositoryInput'
import ReadmePreview from '../components/preview/ReadmePreview'

export default function Home() {
  const {
    repository,
    readmes,
    selectedReadme,
    markdown,
    loadingRepository,
    loadingReadme,
    error,
    loadRepository,
    selectReadme,
    reset,
  } = useRepository()

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="eyebrow"><Sparkles size={14} /> README, reimagined</div>
        <h1>Make your project's first impression <span>unforgettable.</span></h1>
        <p>Explore any public GitHub repository. Find every README, then give your documentation a design worth sharing.</p>
        <RepositoryInput onSubmit={loadRepository} loading={loadingRepository} />
        <ErrorMessage>{error}</ErrorMessage>
        <div className="trust-row">
          <span><ShieldCheck size={16} /> No sign-in required</span>
          <span><Layers3 size={16} /> Every nested README</span>
          <span><ArrowUpRight size={16} /> Free forever</span>
        </div>
      </section>

      {repository && (
        <section className="workspace">
          <div className="workspace-topline">
            <span>Repository workspace</span>
            <Button variant="text" onClick={reset}>Explore another repository</Button>
          </div>
          <RepositoryInfo repository={repository} />
          {readmes.length > 0 && (
            <div className="workspace-grid">
              <ReadmeList
                readmes={readmes}
                selectedPath={selectedReadme?.path}
                onSelect={selectReadme}
              />
              {selectedReadme ? (
                <ReadmePreview
                  markdown={markdown}
                  repository={repository}
                  readmePath={selectedReadme.path}
                  loading={loadingReadme}
                />
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
          <article><span>02</span><h2>Find every README</h2><p>Discover documentation from the repository root to nested folders.</p></article>
          <article><span>03</span><h2>Preview instantly</h2><p>Read the original Markdown with links, tables, images, and code intact.</p></article>
        </section>
      )}
    </div>
  )
}
