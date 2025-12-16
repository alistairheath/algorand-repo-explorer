import { describe, it, expect, vi, beforeEach } from "vitest";

import * as http from "./http";
import * as cache from "../cache";
import { fetchOrganizationRepos, fetchRepositoryDetail, fetchRepositoryReadmeMarkdown } from "./api";
import type { GitHubRepo } from "./types";
import { ORGANIZATIONS } from "../../config";

const orgs = ORGANIZATIONS.map((o) => o.id);

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("github api", () => {
  it("returns cached org repos without calling githubFetch", async () => {
    vi.spyOn(cache, "cacheGet").mockResolvedValue([{ id: 1 } as any]);
    const fetchSpy = vi.spyOn(http, "githubFetch");

    const repos = await fetchOrganizationRepos(orgs[0]);

    expect(repos).toHaveLength(1);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("fetches org repos and caches on miss", async () => {
    vi.spyOn(cache, "cacheGet").mockResolvedValue(null);

    vi.spyOn(http, "githubFetch").mockResolvedValue({
      data: [{ id: 123, full_name: "x/y" } as GitHubRepo],
      rateLimit: {},
    });

    const setSpy = vi.spyOn(cache, "cacheSet").mockResolvedValue();

    const repos = await fetchOrganizationRepos("facebook");

    expect(repos[0].id).toBe(123);
    expect(setSpy).toHaveBeenCalledTimes(1);
  });

  it("fetches repo detail and caches on miss", async () => {
    vi.spyOn(cache, "cacheGet").mockResolvedValue(null);

    vi.spyOn(http, "githubFetch").mockResolvedValue({
      data: { id: 5, full_name: "a/b" } as any,
      rateLimit: {},
    });

    const repo = await fetchRepositoryDetail("a", "b");
    expect(repo.full_name).toBe("a/b");
  });

  it("fetches README markdown via meta download_url and caches result", async () => {
    // cache miss for readme wrapper
    vi.spyOn(cache, "cacheGet").mockResolvedValue(null);

    // meta endpoint
    vi.spyOn(http, "githubFetch").mockResolvedValue({
      data: { download_url: "https://example.com/readme.md" } as any,
      rateLimit: {},
    });

    // raw markdown fetch
    const fetchMock = vi.spyOn(globalThis, "fetch" as any).mockResolvedValue({
      ok: true,
      text: async () => "# Hello\n",
    } as any);

    const setSpy = vi.spyOn(cache, "cacheSet").mockResolvedValue();

    const md = await fetchRepositoryReadmeMarkdown("a", "b");

    expect(md).toContain("# Hello");
    expect(fetchMock).toHaveBeenCalledWith("https://example.com/readme.md");
    expect(setSpy).toHaveBeenCalledTimes(1);
  });
});
