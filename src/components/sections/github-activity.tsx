import { ArrowUpRight, FolderGit2, Info } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/ui/external-link";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { getGitHubData } from "@/lib/github";

/** GitHub's own language colours for the stacked bar. */
const LANGUAGE_COLORS: Record<string, string> = {
  Java: "#b07219",
  Python: "#3572A5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "Jupyter Notebook": "#DA5B0B",
};

function relative(date: string, locale: string) {
  const diff = (Date.parse(date) - Date.now()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
  ];
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  for (const [unit, seconds] of units) {
    if (Math.abs(diff) >= seconds) return rtf.format(Math.round(diff / seconds), unit);
  }
  return rtf.format(Math.round(diff / 60), "minute");
}

async function Activity() {
  const t = await getTranslations("github");
  const locale = await getLocale();
  const data = await getGitHubData();

  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <Reveal className="flex flex-col gap-4">
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-7">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-2xl border border-border bg-surface-2">
              <BrandLogo logo={{ icon: "github" }} className="size-7" />
            </span>
            <div>
              <p className="font-mono text-sm text-muted">@{data.profileUrl.split("/").pop()}</p>
              <p className="font-display text-4xl font-semibold tracking-tight">
                <span className="text-gradient">{data.publicRepos}</span>{" "}
                <span className="text-base font-normal text-muted">{t("repos")}</span>
              </p>
            </div>
          </div>

          <h3 className="mt-8 font-mono text-[0.7rem] tracking-widest text-subtle uppercase">{t("languages")}</h3>
          <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-surface-2" aria-hidden>
            {data.languages.map((l) => (
              <span key={l.name} style={{ width: `${l.share * 100}%`, backgroundColor: LANGUAGE_COLORS[l.name] ?? "var(--accent)" }} />
            ))}
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {data.languages.map((l) => (
              <li key={l.name} className="flex items-center gap-2">
                <span aria-hidden className="size-2.5 rounded-full" style={{ backgroundColor: LANGUAGE_COLORS[l.name] ?? "var(--accent)" }} />
                <span className="text-fg">{l.name}</span>
                <span className="font-mono text-xs text-subtle">{Math.round(l.share * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>

        <Button asChild variant="secondary" size="lg" className="self-start">
          <ExternalLink href={data.profileUrl}>
            {t("viewProfile")}
            <ArrowUpRight />
          </ExternalLink>
        </Button>

        {!data.live ? (
          <p className="flex items-start gap-2 text-xs text-subtle">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {t("fallback")}
          </p>
        ) : null}
      </Reveal>

      <Reveal delay={0.08} className="rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-7">
        <h3 className="font-mono text-[0.7rem] tracking-widest text-subtle uppercase">{t("recent")}</h3>
        <ul className="mt-4 divide-y divide-border">
          {data.recent.map((repo) => (
            <li key={repo.name}>
              <ExternalLink href={repo.url} className="group flex items-start gap-4 py-4">
                <FolderGit2 className="mt-0.5 size-5 shrink-0 text-accent-fg" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-mono text-sm text-fg group-hover:text-accent-fg">{repo.name}</span>
                  {repo.description ? <span className="mt-1 line-clamp-2 block text-sm text-muted">{repo.description}</span> : null}
                  <span className="mt-2 flex items-center gap-3 text-xs text-subtle">
                    {repo.language ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: LANGUAGE_COLORS[repo.language] ?? "var(--accent)" }} />
                        {repo.language}
                      </span>
                    ) : null}
                    <span>{t("updated", { date: relative(repo.updatedAt, locale) })}</span>
                  </span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </ExternalLink>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]" aria-busy="true">
      {[0, 1].map((i) => (
        <div key={i} className="h-80 animate-pulse rounded-3xl border border-border bg-surface" />
      ))}
    </div>
  );
}

export async function GitHubActivity() {
  const t = await getTranslations("github");
  return (
    <Section id="github" eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} glow="center">
      <Suspense fallback={<Skeleton />}>
        <Activity />
      </Suspense>
    </Section>
  );
}
