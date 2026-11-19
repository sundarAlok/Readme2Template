import test from 'node:test'
import assert from 'node:assert/strict'
import { decodeReadmeContent, resolveReadmeResource } from '../src/services/readmeService.js'

test('decodes UTF-8 README content from GitHub base64', () => {
  const bytes = new TextEncoder().encode('# Hello 🌱')
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
  const content = btoa(binary)
  assert.equal(decodeReadmeContent({ type: 'file', encoding: 'base64', content }), '# Hello 🌱')
})

test('rejects unsupported GitHub content responses', () => {
  assert.throws(() => decodeReadmeContent({ type: 'file', encoding: 'none' }), /too large|unsupported/)
  assert.throws(() => decodeReadmeContent({ type: 'dir' }), /unsupported Markdown file/)
})

test('resolves relative README links and images from nested directories', () => {
  const context = {
    owner: 'octo',
    repo: 'project',
    branch: 'main',
    readmePath: 'docs/guide/README.md',
  }
  assert.equal(
    resolveReadmeResource('../../assets/diagram.svg', context),
    'https://github.com/octo/project/blob/main/assets/diagram.svg',
  )
  assert.equal(
    resolveReadmeResource('../images/cover.png', { ...context, image: true }),
    'https://raw.githubusercontent.com/octo/project/main/docs/images/cover.png',
  )
})

test('rejects unsafe resource schemes', () => {
  const context = { owner: 'octo', repo: 'project', branch: 'main', readmePath: 'README.md' }
  assert.equal(resolveReadmeResource('javascript:alert(1)', context), '')
  assert.equal(resolveReadmeResource('data:image/svg+xml,bad', { ...context, image: true }), '')
})
