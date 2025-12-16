import { githubFetch } from "./http";
import type { GitHubReadme, GitHubRepo } from "./types";
import { cacheGet, cacheSet } from "../cache";
import { TTL, keyOrgRepos, keyRepoDetail, keyReadme } from "./cacheKeys";

const BASE = "https://api.github.com";

export async function fetchOrganizationRepos(org: string): Promise<GitHubRepo[]> {
  const cacheKey = keyOrgRepos(org);

  const cached = await cacheGet<GitHubRepo[]>(cacheKey);
  if (cached) return cached;

  const url = `${BASE}/orgs/${encodeURIComponent(org)}/repos?per_page=100&type=public&sort=updated`;
  const { data } = await githubFetch<GitHubRepo[]>(url);

  await cacheSet(cacheKey, data, TTL.orgRepos);
  return data;
}

export async function fetchRepositoryDetail(owner: string, name: string): Promise<GitHubRepo> {
  const cacheKey = keyRepoDetail(owner, name);

  const cached = await cacheGet<GitHubRepo>(cacheKey);
  if (cached) return cached;

  const url = `${BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
  const { data } = await githubFetch<GitHubRepo>(url);

  await cacheSet(cacheKey, data, TTL.repoDetail);
  return data;
}

type ReadmeCacheValue = { markdown: string | null };

export async function fetchRepositoryReadmeMarkdown(
  owner: string,
  name: string
): Promise<string | null> {
  const cacheKey = keyReadme(owner, name);

  const cached = await cacheGet<ReadmeCacheValue>(cacheKey);
  if (cached) return cached.markdown;

  // Fetch meta then raw markdown
  const metaUrl = `${BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
    name
  )}/readme`;

  const { data: meta } = await githubFetch<GitHubReadme>(metaUrl);

  let markdown: string | null = null;

  if (meta.download_url) {
    const rawRes = await fetch(meta.download_url);
    if (rawRes.ok) markdown = await rawRes.text();
  }

  await cacheSet<ReadmeCacheValue>(cacheKey, { markdown }, TTL.readme);
  return markdown;
}
