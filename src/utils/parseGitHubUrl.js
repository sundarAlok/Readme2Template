export function parseGitHubUrl(input) {
  const value = input.trim()
  if (!value) {
    throw new Error('Enter a GitHub repository URL.')
  }

  let url
  try {
    url = new URL(value.includes('://') ? value : `https://${value}`)
  } catch {
    throw new Error('Enter a valid GitHub repository URL, such as https://github.com/owner/repository.')
  }

  if (url.protocol !== 'https:' || url.hostname.toLowerCase() !== 'github.com') {
    throw new Error('Only public repositories hosted at github.com are supported.')
  }

  const segments = url.pathname.split('/').filter(Boolean)
  if (segments.length !== 2) {
    throw new Error('Use a repository URL in the format github.com/owner/repository.')
  }

  const [owner, rawRepository] = segments
  const repository = rawRepository.replace(/\.git$/i, '')
  if (!owner || !repository || owner.includes(':') || repository.includes(':')) {
    throw new Error('Enter a valid GitHub repository URL.')
  }

  return { owner, repo: repository }
}
