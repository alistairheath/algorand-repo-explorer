import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { fetchRepositoryDetail, fetchRepositoryReadmeMarkdown } from "../../../services/github/api";
import type { GitHubRepo } from "../../../services/github/types";
import { GitHubApiError } from "../../../services/github/errors";

import FavoriteButton from "../../favorites/components/FavoriteButton";
import { formatCompactNumber, formatTimeAgo } from "../../../shared/utils/formatters";

type LoadState =
  | { status: "loading" }
  | { status: "error"; error: GitHubApiError }
  | { status: "ready"; repo: GitHubRepo; readme: string | null };

export default function RepoDetailPage() {
  const { owner, name } = useParams<{ owner: string; name: string }>();

  const [state, setState] = useState<LoadState>({ status: "loading" });

  const key = useMemo(() => `${owner}/${name}`, [owner, name]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!owner || !name) return;

      try {
        setState({ status: "loading" });

        const repo = await fetchRepositoryDetail(owner, name);
        const readme = await fetchRepositoryReadmeMarkdown(owner, name);

        if (!cancelled) setState({ status: "ready", repo, readme });
      } catch (e) {
        const err =
          e instanceof GitHubApiError
            ? e
            : new GitHubApiError({ message: "Unknown error", status: 0, url: "" });

        if (!cancelled) setState({ status: "error", error: err });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [key, owner, name]);

  if (state.status === "loading") {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-5 w-40" />
        <div className="skeleton h-32 w-full" />
        <div className="skeleton h-80 w-full" />
      </div>
    );
  }

  if (state.status === "error") {
    const isRateLimited =
      state.error.status === 403 && state.error.rateLimit?.remaining === 0;

    const isNotFound = state.error.status === 404;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <Link className="btn btn-ghost btn-sm" to="/repos">
            ← Back
          </Link>
        </div>

        <div className={`alert ${isRateLimited ? "alert-warning" : "alert-error"}`}>
          <span>
            {isNotFound
              ? "Repository not found."
              : isRateLimited
              ? "Rate limited by GitHub. Try again later."
              : `Failed to load repository: ${state.error.message}`}
          </span>
        </div>
      </div>
    );
  }

  const { repo, readme } = state;

  return (
    <div className="space-y-4 max-w-full w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-col md:flex-row">
        <div className="space-y-1">
          <Link className="btn btn-ghost btn-sm px-2" to="/repos">
            ← Back
          </Link>

          <div className="my-8">
            <h1 className="repo-detail-header text-2xl font-bold wrap-anywhere">{repo.full_name}</h1>
            {repo.description && <p className="opacity-80">{repo.description}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm opacity-80 my-6">
            {repo.language && <span className="badge badge-outline">{repo.language}</span>}
            {repo.archived && <span className="badge badge-neutral">Archived</span>}
            {repo.fork && <span className="badge badge-ghost">Fork</span>}
            <span>Updated {formatTimeAgo(repo.updated_at)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FavoriteButton fullName={repo.full_name} repoForToggle={repo} size="md" />
          <a className="btn btn-outline" href={repo.html_url} target="_blank" rel="noreferrer">
            Open on GitHub
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-sm opacity-70">⭐️ Stars</div>
            <div className="text-2xl font-bold">{formatCompactNumber(repo.stargazers_count)}</div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-sm opacity-70">🍴 Forks</div>
            <div className="text-2xl font-bold">{formatCompactNumber(repo.forks_count)}</div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-sm opacity-70">⚠️ Open issues</div>
            <div className="text-2xl font-bold">{formatCompactNumber(repo.open_issues_count)}</div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-sm opacity-70">🏠 Default branch</div>
            <div className="text-2xl font-bold">{repo.default_branch}</div>
          </div>
        </div>
      </div>

      {/* README */}
      <div className="readme card bg-base-100 shadow-xl">
        <div className="card-body prose max-w-none">
          <h2 className="text-xl font-bold m-0">📚 README</h2>

          {!readme ? (
            <div className="alert">
              <span>No README found for this repository.</span>
            </div>
          ) : (
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 border-b border-border pb-4 flex items-center gap-3">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => {
                  return (
                    <h2 className="text-2xl font-semibold text-foreground mt-6 mb-4 scroll-mt-20">
                      {children}
                    </h2>
                  );
                },
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-foreground/80 leading-relaxed mb-2">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 mb-2 text-foreground/80">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-2 text-foreground/80">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="text-foreground/80">
                  {children}
                </li>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-primary hover:text-primary/80 underline underline-offset-2"
                  >
                    {children}
                  </a>
                ),
                code: ({ className, children }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="px-1.5 py-0.5 rounded text-sm font-mono neutral">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block p-4 rounded-lg overflow-x-auto text-sm font-mono neutral">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="mockup-code mb-4 neutral-content">
                    {children}
                  </pre>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full border-collapse border border-border">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-muted/50">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-4 py-2 text-foreground/80">
                    {children}
                  </td>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/70 my-4">
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className="border-border my-8" />,
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">{children}</strong>
                ),
              }}
              >
                {readme}
              </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
