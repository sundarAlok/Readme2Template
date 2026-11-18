export function extractHeadings(markdown) {
  const headings = []
  const slugCounts = new Map()
  let offset = 0
  let line = 1
  for (const match of markdown.matchAll(/^(#{1,4})\s+(.+?)\s*#*\s*$/gm)) {
    line += (markdown.slice(offset, match.index).match(/\n/g) || []).length
    const text = match[2].replace(/[`*_~]/g, '').trim()
    offset = match.index + match[0].length
    if (!text) continue
    const baseSlug = slugifyHeading(text)
    const duplicates = slugCounts.get(baseSlug) || 0
    slugCounts.set(baseSlug, duplicates + 1)
    headings.push({ level: match[1].length, text, slug: duplicates ? `${baseSlug}-${duplicates}` : baseSlug, line })
  }
  return headings
}

export function slugifyHeading(text) {
  return text.toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
}
