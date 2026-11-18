import test from 'node:test'
import assert from 'node:assert/strict'
import { parseGitHubUrl } from '../src/utils/parseGitHubUrl.js'

test('parses a repository URL and strips a trailing slash or .git suffix', () => {
  assert.deepEqual(parseGitHubUrl('https://github.com/octo-org/project/'), {
    owner: 'octo-org',
    repo: 'project',
  })
  assert.deepEqual(parseGitHubUrl('github.com/octo-org/project.git'), {
    owner: 'octo-org',
    repo: 'project',
  })
})

test('rejects non-GitHub hosts and non-repository paths', () => {
  assert.throws(() => parseGitHubUrl('https://gitlab.com/octo/project'), /github\.com/)
  assert.throws(() => parseGitHubUrl('https://github.com/octo'), /format/)
  assert.throws(() => parseGitHubUrl(''), /Enter a GitHub/)
})
