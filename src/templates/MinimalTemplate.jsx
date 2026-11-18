import MarkdownRenderer from '../components/preview/MarkdownRenderer'

export default function MinimalTemplate(props) {
  return (
    <div className="template template-minimal">
      <MarkdownRenderer {...props} />
    </div>
  )
}
