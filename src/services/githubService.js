const API_ROOT = 'https://api.github.com'
const requestCache = new Map()

function getErrorMessage(response, payload) {
  if (response.status === 404) {
    return 'Repository or README file not found. Check the URL and confirm the repository is public.'
  }
  if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
    const resetAt = Number(response.headers.get('x-ratelimit-reset'))
    const resetText = Number.isFinite(resetAt)
      ? ` Try again after ${new Date(resetAt * 1000).toLocaleTimeString()}.`
      : ' Try again later.'
    return `GitHub API rate limit reached.${resetText}`
  }
  if (response.status === 401 || response.status === 403) {
    return 'GitHub could not provide this public repository data. The API may be rate-limited.'
  }
  if (response.status === 451) {
    return 'GitHub cannot provide this repository because of a legal restriction.'
  }
  return payload?.message || `GitHub request failed (${response.status}). Please try again.`
}

async function request(path, { signal, cache = true } = {}) {
  const url = `${API_ROOT}${path}`
  if (cache && requestCache.has(url)) {
    return requestCache.get(url)
  }

  let response
  try {
    response = await fetch(url, {
      signal,
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Network request to GitHub failed. Check your connection and try again.', { cause: error })
  }

  let payload
  try {
    payload = await response.json()
  } catch {
    throw new Error('GitHub returned an unsupported response. Please try again later.')
  }
  if (!response.ok) {
    throw new Error(getErrorMessage(response, payload))
  }
  if (cache) requestCache.set(url, payload)
  return payload
}

function isReadme(path) {
  return /(^|\/)readme\.md$/i.test(path)
}

async function getTree(owner, repo, treeSha, signal) {
  return request(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees/${encodeURIComponent(treeSha)}`, { signal })
}

async function discoverReadmes(owner, repo, defaultBranch, signal) {
  const recursiveTree = await getTree(owner, repo, defaultBranch, signal)
  if (!recursiveTree.truncated) {
    return recursiveTree.tree.filter((item) => item.type === 'blob' && isReadme(item.path))
      .map(({ path, sha, size }) => ({ path, sha, size }))
      .sort((left, right) => left.path.localeCompare(right.path))
  }

  const found = []
  const visited = new Set()
  const rootTree = await getTree(owner, repo, recursiveTree.sha, signal)
  const queue = [...rootTree.tree]

  while (queue.length) {
    const entries = queue.splice(0, 100)
    await Promise.all(entries.map(async (item) => {
      if (item.type === 'blob' && isReadme(item.path)) {
        found.push({ path: item.path, sha: item.sha, size: item.size })
        return
      }
      if (item.type !== 'tree' || visited.has(item.sha)) return
      visited.add(item.sha)
      const child = await getTree(owner, repo, item.sha, signal)
      child.tree.forEach((entry) => {
        queue.push({ ...entry, path: `${item.path}/${entry.path}` })
      })
    }))
  }

  return found.sort((left, right) => left.path.localeCompare(right.path))
}

export async function fetchRepository(owner, repo, { signal } = {}) {
  const repository = await request(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, { signal })
  const readmes = await discoverReadmes(owner, repo, repository.default_branch, signal)
  return { repository, readmes }
}

export async function fetchReadmeFile(owner, repo, path, branch, { signal } = {}) {
  return request(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(branch)}`, { signal, cache: false })
}

export function clearGitHubCache() {
  requestCache.clear()
}
