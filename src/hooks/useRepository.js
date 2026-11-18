import { useState } from 'react'
import { fetchReadmeFile, fetchRepository } from '../services/githubService'
import { decodeReadmeContent } from '../services/readmeService'
import { parseGitHubUrl } from '../utils/parseGitHubUrl'

export function useRepository() {
  const [repository, setRepository] = useState(null)
  const [readmes, setReadmes] = useState([])
  const [selectedReadme, setSelectedReadme] = useState(null)
  const [markdown, setMarkdown] = useState('')
  const [loadingRepository, setLoadingRepository] = useState(false)
  const [loadingReadme, setLoadingReadme] = useState(false)
  const [error, setError] = useState('')

  async function loadRepository(input) {
    setError('')
    setSelectedReadme(null)
    setMarkdown('')
    setRepository(null)
    setReadmes([])
    let parsed
    try {
      parsed = parseGitHubUrl(input)
    } catch (loadError) {
      setError(loadError.message)
      return
    }

    setLoadingRepository(true)
    try {
      const result = await fetchRepository(parsed.owner, parsed.repo)
      setRepository(result.repository)
      setReadmes(result.readmes)
      if (result.readmes.length === 0) setError('No README.md files were found in this repository.')
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoadingRepository(false)
    }
  }

  async function selectReadme(readme) {
    if (!repository) return
    setError('')
    setLoadingReadme(true)
    setSelectedReadme(readme)
    setMarkdown('')
    try {
      const file = await fetchReadmeFile(
        repository.owner.login,
        repository.name,
        readme.path,
        repository.default_branch,
      )
      setMarkdown(decodeReadmeContent(file))
    } catch (loadError) {
      setSelectedReadme(null)
      setError(loadError.message)
    } finally {
      setLoadingReadme(false)
    }
  }

  function reset() {
    setRepository(null)
    setReadmes([])
    setSelectedReadme(null)
    setMarkdown('')
    setError('')
  }

  return {
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
  }
}
