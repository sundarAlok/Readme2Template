export function decodeReadmeContent(file) {
  if (!file || file.type !== 'file') {
    throw new Error('GitHub returned an unsupported Markdown file response.')
  }
  if (file.encoding === 'base64' && typeof file.content === 'string') {
    const binary = atob(file.content.replace(/\s/g, ''))
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
    return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
  }
  if (file.encoding === 'utf-8' && typeof file.content === 'string') {
    return file.content
  }
  throw new Error('This Markdown file is too large or uses an unsupported encoding.')
}

export function resolveReadmeResource(value, { owner, repo, branch, readmePath, image = false }) {
  if (!value) return ''
  if (value.startsWith('#')) return value
  if (/^mailto:/i.test(value)) return image ? '' : value
  if (/^data:/i.test(value)) return ''

  let url
  try {
    url = new URL(value.startsWith('//') ? `https:${value}` : value)
    if (!['https:', 'http:'].includes(url.protocol)) return ''
    return url.href
  } catch {
    const directory = readmePath.includes('/') ? readmePath.slice(0, readmePath.lastIndexOf('/') + 1) : ''
    const base = `https://readme.local/${directory}`
    const resolved = new URL(value, base)
    const path = resolved.pathname.split('/').filter(Boolean).map((part) => encodeURIComponent(decodeURIComponent(part))).join('/')
    const query = resolved.search
    const hash = resolved.hash
    if (image) return `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(branch)}/${path}${query}${hash}`
    return `https://github.com/${owner}/${repo}/blob/${encodeURIComponent(branch)}/${path}${query}${hash}`
  }
}
