import test from 'node:test'
import assert from 'node:assert/strict'
import { emojiFilterPlugin, filterEmojiTree, normalizeEmojiMode } from '../src/utils/emojiUtils.js'

function createTree() {
  return {
    type: 'root',
    children: [
      { type: 'heading', depth: 1, children: [{ type: 'text', value: 'Project 🚀' }] },
      { type: 'paragraph', children: [{ type: 'text', value: 'Body 👋🏽 with a family 👨‍👩‍👧‍👦' }] },
      { type: 'paragraph', children: [{ type: 'inlineCode', value: 'const icon = "🔥"' }] },
      { type: 'code', value: 'print("✨")' },
      {
        type: 'paragraph',
        children: [{
          type: 'link',
          url: 'https://example.com/🚀',
          title: 'Launch 🚀',
          children: [{ type: 'text', value: 'Link 🎉' }],
        }],
      },
      { type: 'paragraph', children: [{ type: 'image', alt: 'Photo 📸', url: '/photo.png' }] },
      { type: 'heading', depth: 2, children: [{ type: 'text', value: 'Section 📚' }] },
    ],
  }
}

test('keeps heading emojis and removes emojis elsewhere in headings-only mode', () => {
  const tree = filterEmojiTree(createTree(), 'headings')
  assert.equal(tree.children[0].children[0].value, 'Project 🚀')
  assert.equal(tree.children[1].children[0].value, 'Body with a family ')
  assert.equal(tree.children[2].children[0].value, 'const icon = ""')
  assert.equal(tree.children[3].value, 'print("")')
  assert.equal(tree.children[4].children[0].title, 'Launch ')
  assert.equal(tree.children[4].children[0].url, 'https://example.com/🚀')
  assert.equal(tree.children[5].children[0].alt, 'Photo ')
  assert.equal(tree.children[6].children[0].value, 'Section 📚')
})

test('removes emojis from headings and body content in remove-all mode', () => {
  const tree = filterEmojiTree(createTree(), 'none')
  assert.equal(tree.children[0].children[0].value, 'Project ')
  assert.equal(tree.children[1].children[0].value, 'Body with a family ')
  assert.equal(tree.children[6].children[0].value, 'Section ')
})

test('leaves the Markdown tree unchanged when all emojis are shown', () => {
  const tree = createTree()
  const heading = tree.children[0].children[0].value
  assert.equal(filterEmojiTree(tree, 'all'), tree)
  assert.equal(tree.children[0].children[0].value, heading)
  assert.equal(tree.children[1].children[0].value, 'Body 👋🏽 with a family 👨‍👩‍👧‍👦')
})

test('defaults invalid emoji preferences to showing all emojis', () => {
  assert.equal(normalizeEmojiMode('unsupported'), 'all')
  const tree = createTree()
  emojiFilterPlugin('unsupported')()(tree)
  assert.equal(tree.children[0].children[0].value, 'Project 🚀')
})

test('removes flags and keycap emojis without stripping text-style copyright symbols', () => {
  const tree = {
    type: 'paragraph',
    children: [{ type: 'text', value: 'Flags 🇺🇸 keycap 1️⃣ symbol © emoji ©️' }],
  }
  filterEmojiTree(tree, 'none')
  assert.equal(tree.children[0].value, 'Flags keycap symbol © emoji ')
})
