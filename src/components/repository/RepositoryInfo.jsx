import { ExternalLink, GitFork, Star } from 'lucide-react'

export default function RepositoryInfo({ repository }) {
  return (
    <section className="repository-info" aria-label="Repository details">
      <div className="repo-title">
        <img src={repository.owner.avatar_url} alt="" />
        <div>
          <a href={repository.html_url} target="_blank" rel="noreferrer">
            {repository.full_name}<ExternalLink size={14} />
          </a>
          <p>{repository.description || 'No repository description provided.'}</p>
        </div>
      </div>
      <div className="repo-stats">
        {repository.language && <span>{repository.language}</span>}
        <span><Star size={15} />{repository.stargazers_count.toLocaleString()}</span>
        <span><GitFork size={15} />{repository.forks_count.toLocaleString()}</span>
      </div>
    </section>
  )
}
