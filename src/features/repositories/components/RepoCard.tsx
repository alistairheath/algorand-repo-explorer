import { Link } from "react-router-dom";
import type { GitHubRepo } from "../../../services/github/types";
import { formatCompactNumber, formatTimeAgo } from "../../../shared/utils/formatters";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "../../favorites/components/FavoriteButton";

export default function RepoCard({ repo }: { repo: GitHubRepo }) {
  const owner = repo.owner.login;
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate(`/repos/${owner}/${repo.name}`);
  };

  return (
    <div role="button"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetail();
        }
      }}
      className="repo-card card bg-base-100 shadow-xl hover:border-neutral border border-transparent hover:shadow-lg transition"
    >
      <div className="card-body gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 max-w-full flex flex-col gap-3">
            {repo.language && <span className="badge badge-primary my-auto">{repo.language}</span>}
            <Link
              to={`/repos/${owner}/${repo.name}`}
              className="link link-hover font-semibold text-xl break-words h-[2em]"
              >
              {repo.name}
            </Link>
            <div className="text-sm opacity-70 h-[2em]">{repo.full_name}</div>
          </div>

          <div className="flex flex-wrap items-center gap-2 absolute top-4 right-4">
            <FavoriteButton fullName={repo.full_name} repoForToggle={repo} size="sm" />
          </div>
        </div>

        {repo.description && (
          <p className="text-sm leading-relaxed line-clamp-3 my-4">{repo.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 text-sm mt-auto">
          <span className="opacity-70">⭐ {formatCompactNumber(repo.stargazers_count)}</span>
          <span className="opacity-70">🍴 {formatCompactNumber(repo.forks_count)}</span>
          <span className="opacity-70">🕓 {formatTimeAgo(repo.updated_at)}</span>
        </div>
      </div>
    </div>
  );
}
