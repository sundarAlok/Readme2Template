import test from 'node:test'
import assert from 'node:assert/strict'
import { extractHeadings } from '../src/utils/markdownUtils.js'

test('extracts table-of-contents headings with stable unique anchors', () => {
  assert.deepEqual(extractHeadings('## Getting started\n### Install\n## Getting started'), [
    { level: 2, text: 'Getting started', slug: 'getting-started', line: 1 },
    { level: 3, text: 'Install', slug: 'install', line: 2 },
    { level: 2, text: 'Getting started', slug: 'getting-started-1', line: 3 },
  ])
})
