import { GitHubApiError } from "./errors";
import type { RateLimitInfo } from "./errors";

// Parse rate limit headers
function parseRateLimit(headers: Headers): RateLimitInfo {
  const limit = headers.get("x-ratelimit-limit");
  const remaining = headers.get("x-ratelimit-remaining");
  const reset = headers.get("x-ratelimit-reset");

  return {
    limit: limit ? Number(limit) : undefined,
    remaining: remaining ? Number(remaining) : undefined,
    resetEpochSeconds: reset ? Number(reset) : undefined,
  };
}

async function safeJson(res: Response): Promise<unknown | undefined> {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return undefined;
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

// Generic GitHub API fetch function
export async function githubFetch<T>(
  url: string,
  init?: RequestInit
): Promise<{ data: T; rateLimit: RateLimitInfo }> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      ...(init?.headers || {}),
    },
  });

  const rateLimit = parseRateLimit(res.headers);

  if (!res.ok) {
    const payload = await safeJson(res);
    const message =
      (payload as any)?.message ||
      `GitHub request failed (${res.status})`;

    throw new GitHubApiError({
      message,
      status: res.status,
      url,
      rateLimit,
      payload,
    });
  }

  // Return JSON data and rate limit info
  const data = (await res.json()) as T;
  return { data, rateLimit };
}
