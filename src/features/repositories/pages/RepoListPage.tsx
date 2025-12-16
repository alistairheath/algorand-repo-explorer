import { useMemo, useState } from "react";
import RepoCard from "../components/RepoCard";
import RepoSkeleton from "../components/RepoSkeleton";
import { useRepositories } from "../hooks/useRepositories";
import type { RepoSort } from "../hooks/useRepositories";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useOnlineStatus } from "../../../shared/hooks/useOnlineStatus";
import { ORGANIZATIONS } from "../../../config";

const ORGS = ORGANIZATIONS.map(org => org.slug);

const PAGE_SIZE = 12;

export default function RepoListPage() {
  const online = useOnlineStatus();

  // Filters
  const [org, setOrg] = useState<string>("all");
  const [sort, setSort] = useState<RepoSort>("stars");
  const [language, setLanguage] = useState<string>("all");
  const [query, setQuery] = useState<string>("");

  // Pagination
  const [page, setPage] = useState<number>(1);

  const debouncedQuery = useDebounce(query, 250);

  const orgsToFetch = org === "all" ? ORGS : [org];
  const { allRepos, languages, loading, error } = useRepositories(orgsToFetch);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    let list = allRepos;

    if (language !== "all") {
      list = list.filter((r) => r.language === language);
    }

    if (q) {
      list = list.filter((r) => {
        const hay = `${r.name} ${r.full_name} ${r.description ?? ""}`.toLowerCase();
        return hay.includes(q);
      });
    }

    const sorted = [...list].sort((a, b) => {
      if (sort === "stars") return b.stargazers_count - a.stargazers_count;
      if (sort === "updated")
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      return a.name.localeCompare(b.name);
    });

    return sorted;
  }, [allRepos, debouncedQuery, language, sort]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  // Reset pagination when filters change
  // (simple approach: reset page when inputs change)
  // We do it inline with memo dependencies by keying off values:
  const resetKey = `${org}|${sort}|${language}|${debouncedQuery}|${allRepos.length}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => setPage(1), [resetKey]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold my-8">📦 Repositories</h1>
          <p className="opacity-70 text-sm">
            Browse repos from across the Algorand ecosystem.
          </p>
        </div>

        {!online && (
          <div className="alert alert-warning py-2">
            <span>You’re offline. Showing cached and loaded results.</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="card bg-base-100 my-12">
        <div className="card-body gap-4 p-0">
          {/* ORG CHIPS */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn btn-sm rounded-box ${
                org === "all" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setOrg("all")}
            >
              All
            </button>

            {ORGS.map((o) => {
              const selected = org === o;
              const label =
                o === "perawallet" ? "Pera Wallet" :
                o === "algorandfoundation" ? "Algorand Foundation" :
                o === "algorand" ? "Algorand" :
                o;

              return (
                <button
                  key={o}
                  type="button"
                  className={`btn btn-sm rounded-box ${
                    selected ? "btn-primary" : "btn-outline"
                  }`}
                  onClick={() => setOrg(o)}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* SEARCH + DROPDOWNS */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search grows */}
            <label className="input input-bordered flex items-center gap-2 w-full md:flex-1">
              {/* Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-5 w-5 opacity-60"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3m1.3-5.2a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              <input
                type="text"
                className="grow"
                placeholder="Search repositories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>

            {/* Right-side filters shrink */}
            <div className="flex gap-3 md:justify-end">
              <div className="relative flex-grow">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-12">
                  ↕️
                </span>
                <select
                  className="select select-bordered w-full md:w-auto min-w-44 pl-10"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as RepoSort)}
                >
                  <option value="updated">Recently Updated</option>
                  <option value="stars">Stars</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <div className="relative flex-grow">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-12">
                  🌐
                </span>
                <select
                  className="select select-bordered w-full md:w-auto min-w-44 pl-10"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="all">All Languages</option>
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-3 md:grid-cols-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <RepoSkeleton key={i} />
          ))}
        </div>
      )}

      {/* List */}
      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="alert">
              <span>No repos match your filters.</span>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              {visible.map((repo) => (
                <RepoCard key={repo.full_name} repo={repo} />
              ))}
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center pt-2">
              <button className="btn btn-outline" onClick={() => setPage((p) => p + 1)}>
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
