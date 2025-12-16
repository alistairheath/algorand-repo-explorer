// Types for GitHub repository owners
export type GitHubRepoOwner = {
  login: string;
  avatar_url: string;
  html_url: string;
};

// Types for GitHub repositories
export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;

  html_url: string;
  homepage: string | null;
  language: string | null;

  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;

  watchers_count?: number;
  default_branch: string;

  updated_at: string;
  created_at: string;

  owner: GitHubRepoOwner;

  archived: boolean;
  fork: boolean;
  private: boolean;
};

// Types for GitHub readme (markdown) files
export type GitHubReadme = {
  name: string;
  path: string;
  sha: string;
  size: number;
  html_url: string;
  download_url: string | null;
  type: "file";
  content?: string; // base64 sometimes included
  encoding?: "base64";
};
