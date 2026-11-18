import { createElement } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import { resolveReadmeResource } from '../../services/readmeService'
import { extractHeadings, slugifyHeading } from '../../utils/markdownUtils'

function getText(children) {
  return children.map((child) => {
    if (typeof child === 'string' || typeof child === 'number') return String(child)
    if (Array.isArray(child)) return getText(child)
    return child?.props?.children ? getText([child.props.children]) : ''
  }).join('')
}

function safeExternalUrl(value) {
  try {
    const url = new URL(value)
    return ['https:', 'http:', 'mailto:'].includes(url.protocol)
  } catch {
    return value.startsWith('#')
  }
}

export default function MarkdownRenderer({ markdown, repository, readmePath, className = '' }) {
  const context = {
    owner: repository.owner.login,
    repo: repository.name,
    branch: repository.default_branch,
    readmePath,
  }
  const headingSlugs = new Map(extractHeadings(markdown).map((heading) => [heading.line, heading.slug]))
  function renderHeading(tag) {
    return ({ node, children, ...props }) => {
      const line = node?.position?.start?.line
      const slug = headingSlugs.get(line) || slugifyHeading(getText([children]))
      return createElement(tag, { ...props, id: slug }, children)
    }
  }
  return (
    <article className={`markdown-body ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
        components={{
          h1: renderHeading('h1'),
          h2: renderHeading('h2'),
          h3: renderHeading('h3'),
          h4: renderHeading('h4'),
          h5: renderHeading('h5'),
          h6: renderHeading('h6'),
          a: ({ href = '', children, ...props }) => {
            const resolved = resolveReadmeResource(href, context)
            return safeExternalUrl(resolved)
              ? <a href={resolved} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
              : <span>{children}</span>
          },
          img: ({ src = '', alt = '', ...props }) => {
            const resolved = resolveReadmeResource(src, { ...context, image: true })
            return resolved
              ? <img src={resolved} alt={alt} loading="lazy" {...props} />
              : <span className="broken-image-label">{alt || 'Image unavailable'}</span>
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  )
}
