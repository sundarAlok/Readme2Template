import { ArrowRight, GitBranch } from 'lucide-react'
import { useState } from 'react'
import Button from '../common/Button'
import Loader from '../common/Loader'

export default function RepositoryInput({ onSubmit, loading }) {
  const [url, setUrl] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(url)
  }

  return (
    <form className="repository-form" onSubmit={handleSubmit}>
      <label htmlFor="repository-url">Public GitHub repository URL</label>
      <div className="input-row">
        <GitBranch className="input-icon" size={20} aria-hidden="true" />
        <input
          id="repository-url"
          type="url"
          inputMode="url"
          placeholder="https://github.com/owner/repository"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader label="Discovering" /> : <>Explore README <ArrowRight size={17} /></>}
        </Button>
      </div>
      <p className="form-hint">Public repositories only. No account or token required.</p>
    </form>
  )
}
