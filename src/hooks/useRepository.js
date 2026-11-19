import { useState } from 'react'
import { fetchMarkdownFile, fetchRepository } from '../services/githubService'
import { decodeReadmeContent } from '../services/readmeService'
import { parseGitHubUrl } from '../utils/parseGitHubUrl'

export function useRepository() {
  const [repository, setRepository] = useState(null)
  const [markdownFiles, setMarkdownFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [markdown, setMarkdown] = useState('')
  const [loadingRepository, setLoadingRepository] = useState(false)
  const [loadingReadme, setLoadingReadme] = useState(false)
  const [error, setError] = useState('')

  async function loadRepository(input) {
    setError('')
    setSelectedFile(null)
    setMarkdown('')
    setRepository(null)
    setMarkdownFiles([])
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
      setMarkdownFiles(result.markdownFiles)
      if (result.markdownFiles.length === 0) setError('No .md files were found in this repository.')
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoadingRepository(false)
    }
  }

  async function selectFile(fileEntry) {
    if (!repository) return
    setError('')
    setLoadingReadme(true)
    setSelectedFile(fileEntry)
    setMarkdown('')
    try {
      const file = await fetchMarkdownFile(
        repository.owner.login,
        repository.name,
        fileEntry.path,
        repository.default_branch,
      )
      setMarkdown(decodeReadmeContent(file))
    } catch (loadError) {
      setSelectedFile(null)
      setError(loadError.message)
    } finally {
      setLoadingReadme(false)
    }
  }

  function reset() {
    setRepository(null)
    setMarkdownFiles([])
    setSelectedFile(null)
    setMarkdown('')
    setError('')
  }

  return {
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
  }
}
