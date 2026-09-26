import "server-only";
import { profile } from "@/content/profile";

export type RepoSummary = {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  updatedAt: string;
};

export type GitHubData = {
  publicRepos: number;
  followers: number;
  languages: { name: string; count: number; share: number }[];
  recent: RepoSummary[];
  profileUrl: string;
  live: boolean;
};

type ApiUser = { public_repos: number; followers: number; html_url: string };
type ApiRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

/** Last known snapshot (09/2026) — shown if the API is down or rate-limited. */
const FALLBACK_REPOS: ApiRepo[] = [
  { name: "gestion-location-voitures", language: "HTML", pushed_at: "2026-06-08T00:00:00Z", description: "Application de gestion de location de voitures avec IA" },
  { name: "Mise-en-uvre-d-une-infrastructure-cloud-de-supervision-centralis-e-sous-AWS-", language: "Python", pushed_at: "2026-01-07T00:00:00Z", description: "Déploiement de Zabbix conteneurisé pour le monitoring d'un parc hybride (Linux & Windows)" },
  { name: "application_mobile", language: "Dart", pushed_at: "2026-01-06T00:00:00Z", description: null },
  { name: "exam-final-java", language: "Java", pushed_at: "2025-12-31T00:00:00Z", description: null },
  { name: "angular-app", language: "TypeScript", pushed_at: "2025-12-24T00:00:00Z", description: null },
  { name: "TP_SPRING_MVC_Thymleaf1-master", language: "Java", pushed_at: "2025-11-26T00:00:00Z", description: null },
  { name: "hospital", language: "Java", pushed_at: "2025-10-28T00:00:00Z", description: null },
  { name: "product-spring", language: "Java", pushed_at: "2025-10-22T00:00:00Z", description: null },
  { name: "ioc-dep", language: "Java", pushed_at: "2025-10-14T00:00:00Z", description: null },
].map((r) => ({ ...r, html_url: `${profile.github}/${r.name}`, fork: false, archived: false }));

function summarize(user: Pick<ApiUser, "public_repos" | "followers">, repos: ApiRepo[], live: boolean): GitHubData {
  const own = repos.filter((r) => !r.fork);
  const counts = new Map<string, number>();
  for (const repo of own) {
    if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1;
  const languages = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, share: count / total }));

  const recent = [...own]
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .slice(0, 4)
    .map((r) => ({ name: r.name, url: r.html_url, description: r.description, language: r.language, updatedAt: r.pushed_at }));

  return { publicRepos: user.public_repos, followers: user.followers, languages, recent, profileUrl: profile.github, live };
}

/** Public GitHub data, cached for an hour (ISR). Never throws. */
export async function getGitHubData(): Promise<GitHubData> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const init = { headers, next: { revalidate: 3600 } };
  const base = `https://api.github.com/users/${profile.githubUser}`;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(base, init),
      fetch(`${base}/repos?per_page=100&sort=pushed`, init),
    ]);
    if (!userRes.ok || !reposRes.ok) throw new Error(`GitHub API ${userRes.status}/${reposRes.status}`);
    const user = (await userRes.json()) as ApiUser;
    const repos = (await reposRes.json()) as ApiRepo[];
    return summarize(user, repos, true);
  } catch {
    return summarize({ public_repos: FALLBACK_REPOS.length, followers: 0 }, FALLBACK_REPOS, false);
  }
}
