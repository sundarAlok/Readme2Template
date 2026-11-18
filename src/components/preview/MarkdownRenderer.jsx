import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import { resolveReadmeResource } from '../../services/readmeService'

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
  return (
    <article className={`markdown-body ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
        components={{
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
