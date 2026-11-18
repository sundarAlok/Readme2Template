import test from 'node:test'
import assert from 'node:assert/strict'
import { clearGitHubCache, fetchRepository } from '../src/services/githubService.js'

const originalFetch = globalThis.fetch

test.afterEach(() => {
  globalThis.fetch = originalFetch
  clearGitHubCache()
})

test('discovers README files at any depth using the recursive Git tree', async () => {
  const requests = []
  globalThis.fetch = async (url) => {
    requests.push(String(url))
    const payload = String(url).endsWith('/repos/octo/project')
      ? { name: 'project', default_branch: 'main', owner: { login: 'octo' } }
      : {
          truncated: false,
          tree: [
            { type: 'blob', path: 'README.md', sha: 'root', size: 12 },
            { type: 'blob', path: 'docs/README.md', sha: 'docs', size: 24 },
            { type: 'blob', path: 'src/readme.txt', sha: 'not-readme', size: 3 },
          ],
        }
    return new Response(JSON.stringify(payload), { status: 200 })
  }

  const result = await fetchRepository('octo', 'project')
  assert.deepEqual(result.readmes.map((readme) => readme.path), ['docs/README.md', 'README.md'])
  assert.equal(requests.length, 2)
})

test('falls back to directory traversal when GitHub truncates the recursive tree', async () => {
  globalThis.fetch = async (url) => {
    const value = String(url)
    let payload
    if (value.endsWith('/repos/octo/project')) {
      payload = { name: 'project', default_branch: 'main', owner: { login: 'octo' } }
    } else if (value.endsWith('/git/trees/main')) {
      payload = { truncated: true, sha: 'root-sha', tree: [] }
    } else if (value.endsWith('/git/trees/root-sha')) {
      payload = {
        truncated: false,
        tree: [
          { type: 'tree', path: 'docs', sha: 'docs-sha' },
          { type: 'blob', path: 'README.md', sha: 'root-readme', size: 15 },
        ],
      }
    } else {
      payload = {
        truncated: false,
        tree: [{ type: 'blob', path: 'README.md', sha: 'nested-readme', size: 25 }],
      }
    }
    return new Response(JSON.stringify(payload), { status: 200 })
  }

  const result = await fetchRepository('octo', 'project')
  assert.deepEqual(result.readmes.map((readme) => readme.path), ['docs/README.md', 'README.md'])
})

test('reports missing repositories and GitHub API rate limits clearly', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ message: 'Not Found' }), { status: 404 })
  await assert.rejects(() => fetchRepository('missing', 'repo'), /Repository or README file not found/)
  clearGitHubCache()

  globalThis.fetch = async () => new Response(JSON.stringify({ message: 'API rate limit exceeded' }), {
    status: 403,
    headers: { 'x-ratelimit-remaining': '0' },
  })
  await assert.rejects(() => fetchRepository('octo', 'repo'), /rate limit reached/)
})
