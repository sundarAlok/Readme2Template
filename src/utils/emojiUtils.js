const emojiPattern = /(?:\p{Regional_Indicator}{2}|[0-9#*]\uFE0F?\u20E3|(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F)[\uFE0F\uFE0E]?\p{Emoji_Modifier}?(?:\u200D(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F)[\uFE0F\uFE0E]?\p{Emoji_Modifier}?)*(?:[\u{E0020}-\u{E007F}]+)?)/gu

export const emojiModes = Object.freeze(['all', 'headings', 'none'])

export function normalizeEmojiMode(value) {
  return emojiModes.includes(value) ? value : 'all'
}

function stripEmojis(value) {
  return value.replace(emojiPattern, '').replace(/[ \t]{2,}/g, ' ')
}

function filterEmojiNodes(node, mode, insideHeading = false) {
  if (!node || typeof node !== 'object') return

  const preserve = mode === 'headings' && (insideHeading || node.type === 'heading')
  if (!preserve) {
    if (['text', 'inlineCode', 'code'].includes(node.type) && typeof node.value === 'string') {
      node.value = stripEmojis(node.value)
    }
    if (typeof node.alt === 'string') node.alt = stripEmojis(node.alt)
    if (typeof node.title === 'string') node.title = stripEmojis(node.title)
  }

  node.children?.forEach((child) => filterEmojiNodes(child, mode, preserve))
}

export function filterEmojiTree(tree, mode) {
  const normalizedMode = normalizeEmojiMode(mode)
  if (normalizedMode !== 'all') filterEmojiNodes(tree, normalizedMode)
  return tree
}

export function emojiFilterPlugin(mode) {
  const normalizedMode = normalizeEmojiMode(mode)
  return () => (tree) => filterEmojiTree(tree, normalizedMode)
}
