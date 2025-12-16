export type RateLimitInfo = {
  limit?: number;
  remaining?: number;
  resetEpochSeconds?: number;
};

export class GitHubApiError extends Error {
  status: number;
  url: string;
  rateLimit?: RateLimitInfo;
  payload?: unknown;

  constructor(opts: {
    message: string;
    status: number;
    url: string;
    rateLimit?: RateLimitInfo;
    payload?: unknown;
  }) {
    super(opts.message);
    this.name = "GitHubApiError";
    this.status = opts.status;
    this.url = opts.url;
    this.rateLimit = opts.rateLimit;
    this.payload = opts.payload;
  }
}
