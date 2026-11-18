import { CircleAlert } from 'lucide-react'

export default function ErrorMessage({ children }) {
  if (!children) return null
  return <div className="error-message" role="alert"><CircleAlert size={18} />{children}</div>
}
