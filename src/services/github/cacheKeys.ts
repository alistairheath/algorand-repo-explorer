export const TTL = {
  orgRepos: 10 * 60 * 1000,      // 10 minutes
  repoDetail: 30 * 60 * 1000,    // 30 minutes
  readme: 60 * 60 * 1000,        // 1 hour
};

export function keyOrgRepos(org: string) {
  return `github:orgRepos:${org.toLowerCase()}`;
}

export function keyRepoDetail(owner: string, name: string) {
  return `github:repo:${owner.toLowerCase()}/${name.toLowerCase()}`;
}

export function keyReadme(owner: string, name: string) {
  return `github:readme:${owner.toLowerCase()}/${name.toLowerCase()}`;
}
