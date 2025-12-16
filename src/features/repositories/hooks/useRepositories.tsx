import { useEffect, useMemo, useState } from "react";
import type { GitHubRepo } from "../../../services/github/types";
import { fetchOrganizationRepos } from "../../../services/github/api";
import { GitHubApiError } from "../../../services/github/errors";

export type RepoSort = "stars" | "updated" | "name";

export function useRepositories(orgs: string[]) {
  const [allRepos, setAllRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<GitHubApiError | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const results = await Promise.all(orgs.map((o) => fetchOrganizationRepos(o)));
        const merged = results.flat();

        // De-dupe by full_name
        const map = new Map<string, GitHubRepo>();
        for (const r of merged) map.set(r.full_name, r);

        if (!cancelled) setAllRepos(Array.from(map.values()));
      } catch (e) {
        if (!cancelled) setError(e instanceof GitHubApiError ? e : new GitHubApiError({
          message: "Unknown error",
          status: 0,
          url: "",
        }));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orgs.join("|")]);

  const languages = useMemo(() => {
    const set = new Set<string>();
    for (const r of allRepos) if (r.language) set.add(r.language);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allRepos]);

  return { allRepos, languages, loading, error };
}
