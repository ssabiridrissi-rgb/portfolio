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

/** Last known snapshot (11/2026) — shown if the API is down or rate-limited. */
const FALLBACK_REPOS: ApiRepo[] = [
  { name: "breast-cancer-ml-kubernetes", language: "Python", pushed_at: "2026-11-17T00:00:00Z", description: "Stack ML complète sur Kubernetes (Minikube) : API FastAPI, front Streamlit, stockage MinIO, cache Redis et Job d'entraînement scikit-learn" },
  { name: "helianthe-rag-assistant", language: "Python", pushed_at: "2026-11-12T00:00:00Z", description: "☀️ Hélianthe — Assistant RAG qui répond aux questions des étudiants à partir des documents officiels de l'école, avec citation des sources. FastAPI · React · LLM" },
  { name: "kubernetes-redis-pod", language: null, pushed_at: "2026-10-28T00:00:00Z", description: "Déploiement, validation (PING/SET/GET) et suppression d'un Pod Redis 7 sur un cluster Kubernetes Minikube" },
  { name: "iris-ml-docker-redis", language: "Python", pushed_at: "2026-10-15T00:00:00Z", description: "Pipeline ML Iris conteneurisé : entraînement Random Forest, API FastAPI, cache Redis, Docker Compose et scan de sécurité Trivy" },
  { name: "ml-api-docker-optimization", language: "Python", pushed_at: "2026-10-06T00:00:00Z", description: "Entraînement et déploiement d'un modèle ML via une API FastAPI conteneurisée, avec optimisation et benchmark des images Docker" },
  { name: "autoloc-ai-car-rental", language: "HTML", pushed_at: "2026-06-08T00:00:00Z", description: "🚗 AutoLoc — Application web de gestion de location de voitures avec assistant IA intégré (Flask · Groq LLaMA 3.3)" },
  { name: "aws-zabbix-monitoring", language: "Python", pushed_at: "2026-01-07T00:00:00Z", description: "Infrastructure de supervision centralisée sur AWS : Zabbix conteneurisé (Docker) pour monitorer un parc hybride Linux & Windows dans un VPC" },
  { name: "foodie-app-flutter", language: "Dart", pushed_at: "2026-01-06T00:00:00Z", description: "📱 Foodie App — Application mobile de recettes en Flutter (MVVM, Provider) : recherche, catégories et galerie via l'API TheMealDB" },
  { name: "digital-banking-spring-angular", language: "Java", pushed_at: "2025-12-31T00:00:00Z", description: "🏦 Digital Banking — Application bancaire full-stack : API REST Spring Boot (comptes, opérations, virements) et front Angular" },
  { name: "products-angular-spring", language: "TypeScript", pushed_at: "2025-12-24T00:00:00Z", description: "Application full-stack de gestion de produits : front Angular et API REST Spring Boot / Spring Data JPA" },
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
