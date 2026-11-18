import ModernTemplate from './ModernTemplate'
import MinimalTemplate from './MinimalTemplate'
import DeveloperTemplate from './DeveloperTemplate'
import DocumentationTemplate from './DocumentationTemplate'
import PremiumTemplate from './PremiumTemplate'

export const templates = [
  { id: 'modern', name: 'Modern', description: 'Balanced space and a confident visual hierarchy.', Component: ModernTemplate },
  { id: 'minimal', name: 'Minimal', description: 'Quiet typography with a focus on the writing.', Component: MinimalTemplate },
  { id: 'developer', name: 'Developer', description: 'Technical layout with code-forward navigation.', Component: DeveloperTemplate },
  { id: 'documentation', name: 'Documentation', description: 'A docs-style sidebar and structured sections.', Component: DocumentationTemplate },
  { id: 'premium', name: 'Premium', description: 'Editorial cover, polished details, and a refined finish.', Component: PremiumTemplate },
]

export function getTemplate(id) {
  return templates.find((template) => template.id === id) || templates[0]
}
