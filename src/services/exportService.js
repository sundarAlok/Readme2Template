const templateNames = new Set(['modern', 'minimal', 'developer', 'documentation', 'premium'])
const designThemes = {
  violet: { start: '#262b3c', end: '#64578c' },
  'hot-pink': { start: '#702248', end: '#f04e82' },
  green: { start: '#145447', end: '#63ad78' },
  'blue-violet': { start: '#174b81', end: '#7659d8' },
  golden: { start: '#704b16', end: '#dfab4e' },
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

function isSafeUrl(value) {
  try {
    return ['https:', 'http:', 'mailto:'].includes(new URL(value).protocol)
  } catch {
    return value.startsWith('#')
  }
}

export function sanitizeRenderedMarkup(markup) {
  const template = document.createElement('template')
  template.innerHTML = markup
  template.content.querySelectorAll('script, iframe, object, embed, form, base, meta, link, style').forEach((node) => node.remove())
  template.content.querySelectorAll('*').forEach((node) => {
    for (const attribute of [...node.attributes]) {
      const name = attribute.name.toLowerCase()
      if (name.startsWith('on') || ['srcdoc', 'formaction', 'style'].includes(name)) {
        node.removeAttribute(attribute.name)
      }
    }
    if (node.hasAttribute('href') && !isSafeUrl(node.getAttribute('href'))) node.removeAttribute('href')
    if (node.hasAttribute('src') && !['https:', 'http:'].includes(new URL(node.getAttribute('src'), window.location.href).protocol)) {
      node.removeAttribute('src')
    }
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noopener noreferrer')
    }
    if (node.tagName === 'INPUT') {
      const allowedCheckbox = node.getAttribute('type') === 'checkbox'
      if (!allowedCheckbox) node.remove()
      else node.setAttribute('disabled', '')
    }
  })
  return template.innerHTML
}

export function createStandaloneHtml({
  markup,
  title,
  templateId,
  theme,
  designTheme,
}) {
  const safeTemplate = templateNames.has(templateId) ? templateId : 'modern'
  const safeTheme = theme === 'dark' ? 'dark' : 'light'
  const safeDesignTheme = designThemes[designTheme] ? designTheme : 'violet'
  const safeDesign = designThemes[safeDesignTheme]
  const safeGradient = `linear-gradient(125deg,${safeDesign.start},${safeDesign.end})`
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="${safeTheme}">
  <title>${escapeHtml(title)}</title>
  <style>
    :root{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#31394a;background:${safeTheme === 'dark' ? '#151b28' : '#fff'};--accent:${safeDesign.end};--design-gradient:${safeGradient};--design-start:${safeDesign.start};--design-end:${safeDesign.end}}
    *{box-sizing:border-box}body{max-width:1040px;margin:0 auto;padding:clamp(20px,5vw,56px);line-height:1.7;overflow-wrap:anywhere}
    .markdown-body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:15px}.markdown-body>:first-child{margin-top:0}
    .markdown-body h1,.markdown-body h2,.markdown-body h3,.markdown-body h4{margin:1.5em 0 .65em;color:${safeTheme === 'dark' ? '#eef0f5' : '#20283a'};line-height:1.25}
    .markdown-body h1{padding-bottom:.3em;border-bottom:1px solid #e9ebf0;font-size:2em}.markdown-body h2{padding-bottom:.3em;border-bottom:1px solid #e9ebf0;font-size:1.5em}
    .markdown-body p,.markdown-body ul,.markdown-body ol,.markdown-body blockquote,.markdown-body table{margin:0 0 16px}
    .markdown-body a{color:var(--accent);text-decoration:none}.markdown-body a:hover{text-decoration:underline}
    .markdown-body img{max-width:100%;height:auto}.markdown-body pre{overflow:auto;padding:16px;border-radius:9px;background:${safeTheme === 'dark' ? '#202a3a' : '#f5f6f8'};font-size:13px}
    .markdown-body :not(pre)>code{padding:2px 5px;border-radius:5px;background:${safeTheme === 'dark' ? '#293348' : '#f0f1f4'}}
    .markdown-body blockquote{padding:2px 0 2px 15px;border-left:3px solid var(--accent);color:#72798a}
    .markdown-body table{display:block;width:100%;overflow:auto;border-collapse:collapse}.markdown-body th,.markdown-body td{padding:7px 12px;border:1px solid #e1e4eb;text-align:left}.markdown-body th{background:#f6f7fa}
    .markdown-body hr{height:1px;border:0;background:#e8eaf0}
    .hljs-comment,.hljs-quote{color:#6a737d}.hljs-keyword,.hljs-selector-tag,.hljs-subst{color:#d73a49}.hljs-number,.hljs-literal,.hljs-variable,.hljs-template-variable,.hljs-tag .hljs-attr{color:#005cc5}
    .hljs-string,.hljs-doctag{color:#032f62}.hljs-title,.hljs-section,.hljs-selector-id{color:#6f42c1}.hljs-type,.hljs-class .hljs-title{color:#e36209}
    .hljs-attribute,.hljs-name,.hljs-regexp,.hljs-link{color:#22863a}.hljs-symbol,.hljs-bullet{color:#735c0f}
    .template{min-width:0}.template-modern{max-width:950px;margin:0 auto}.template-modern-accent{display:flex;align-items:center;gap:8px;min-height:90px;margin-bottom:20px;padding:24px;border-radius:12px;background:var(--design-gradient);color:#fff;font-size:13px;font-weight:800;letter-spacing:.1em}
    .template-modern .markdown-body{max-width:820px;margin:0 auto}.template-credit,.premium-footer{margin-top:30px;padding-top:12px;border-top:1px solid #e9ebf0;color:#8b909e;font-size:11px;text-align:center}
    .template-minimal{max-width:720px;margin:18px auto}.template-minimal .markdown-body{font-size:16px;line-height:1.85}
    .template-developer,.template-premium{overflow:hidden;border:1px solid #dfe4ec;border-radius:12px}.developer-bar{display:flex;gap:12px;padding:13px 17px;background:var(--design-gradient);color:#fff;font-size:13px}.developer-layout{display:grid;grid-template-columns:minmax(130px,190px) minmax(0,1fr);gap:24px;padding:24px}
    .developer-toc,.documentation-sidebar nav{display:grid;align-content:start;gap:9px}.developer-toc a,.documentation-sidebar a{color:#667085;font-size:12px;text-decoration:none}
    .template-developer .markdown-body pre{background:#1d2739;color:#e1e6f0}.template-documentation{display:grid;grid-template-columns:minmax(150px,210px) minmax(0,1fr);gap:28px}
    .documentation-sidebar{align-self:start;padding:12px 16px 12px 0;border-right:1px solid #e8eaf0}.documentation-sidebar-title{width:fit-content;color:transparent;background-image:var(--design-gradient);background-clip:text;-webkit-text-fill-color:transparent;font-weight:800}.documentation-sidebar-title svg{color:var(--design-end);-webkit-text-fill-color:initial}.documentation-project{margin:14px 0;font-weight:800}
    .documentation-sidebar nav .depth-2{padding-left:9px}.documentation-sidebar nav .depth-3{padding-left:18px}
    .premium-cover{padding:36px;background:var(--design-gradient);color:#fff}.premium-project{font-size:28px;font-weight:800}.premium-content{padding:clamp(20px,5vw,48px)}
    @media(max-width:700px){body{padding:20px}.developer-layout,.template-documentation{grid-template-columns:1fr;gap:14px;padding:16px}.documentation-sidebar{border-right:0;border-bottom:1px solid #e8eaf0}.premium-cover{padding:24px}}
  </style>
</head>
<body class="template-${safeTemplate} preview-theme-${safeTheme}">
${markup}
</body>
</html>`
}

export function exportRenderedHtml(element, options) {
  return createStandaloneHtml({
    ...options,
    markup: sanitizeRenderedMarkup(typeof element === 'string' ? element : element.innerHTML),
  })
}

export function downloadHtmlFile(html, filename) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
