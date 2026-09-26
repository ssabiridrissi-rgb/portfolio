import { ArrowUpRight, Clock, FolderGit2, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Badge, Tag } from "@/components/ui/badge";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/ui/external-link";
import { DiagramPreview } from "@/components/visuals/architecture-diagram";
import { getSkill } from "@/content/skills";
import { Link } from "@/i18n/navigation";
import { cn, formatMonth } from "@/lib/utils";
import type { Project } from "@/types/content";

export function StatusBadge({ project }: { project: Project }) {
  const t = useTranslations("projects");
  return project.status === "in-progress" ? (
    <Badge variant="warning">
      <Clock className="size-3" aria-hidden />
      {t("inProgress")}
    </Badge>
  ) : (
    <Badge variant="success">{t("done")}</Badge>
  );
}

export function StackTags({ project, limit }: { project: Project; limit?: number }) {
  const items = [
    ...project.skills.map((id) => {
      const s = getSkill(id);
      return { key: id, name: s.name, logo: s.logo };
    }),
    ...(project.extraStack ?? []).map((name) => ({ key: name, name, logo: undefined })),
  ];
  const shown = limit ? items.slice(0, limit) : items;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
      {shown.map((item) => (
        <li key={item.key}>
          <Tag>
            {item.logo ? <BrandLogo logo={item.logo} className="size-3.5 text-[0.5rem]" /> : null}
            {item.name}
          </Tag>
        </li>
      ))}
      {limit && items.length > limit ? (
        <li>
          <Tag>+{items.length - limit}</Tag>
        </li>
      ) : null}
    </ul>
  );
}

function CodeLink({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const locale = useLocale();
  if (project.links.github) {
    return (
      <Button asChild variant="secondary" size="sm">
        <ExternalLink href={project.links.github}>
          <BrandLogo logo={{ icon: "github" }} />
          {t("github")}
          <span className="sr-only"> — {project.title[locale]}</span>
        </ExternalLink>
      </Button>
    );
  }
  return (
    <span className="inline-flex h-9 items-center gap-2 rounded-full border border-dashed border-border-strong px-3.5 text-xs text-subtle">
      <BrandLogo logo={{ icon: "github" }} className="size-3.5" />
      {t("codeSoon")}
    </span>
  );
}

/** Large bento card for featured projects. */
export function FeaturedProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const t = useTranslations("projects");
  const locale = useLocale();

  return (
    <article
      className={cn(
        "spotlight group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card transition-colors duration-500 hover:border-border-strong",
        large && "lg:grid lg:grid-cols-[0.95fr_1.05fr]",
      )}
    >
      {project.diagram ? (
        <div
          className={cn(
            "relative border-b border-border bg-[radial-gradient(ellipse_at_top,var(--surface-2),var(--surface))] p-5 sm:p-6",
            large && "lg:order-2 lg:flex lg:items-center lg:border-b-0 lg:border-l",
          )}
        >
          <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
          <DiagramPreview
            id={project.diagram}
            locale={locale}
            label={t("diagram", { project: project.title[locale] })}
            className="relative w-full transition-transform duration-700 ease-out-expo group-hover:translate-y-[-2px]"
          />
        </div>
      ) : null}

      <div className={cn("flex flex-1 flex-col p-6 sm:p-7", large && "lg:p-10")}>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge project={project} />
          {project.team ? (
            <Badge>
              <Users className="size-3" aria-hidden />
              {t("team", { count: project.team.size })}
            </Badge>
          ) : null}
          <span className="font-mono text-xs text-subtle">{formatMonth(project.date, locale)}</span>
        </div>
        <h3 className={cn("mt-4 font-display font-semibold tracking-tight", large ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl")}>
          <Link
            href={`/projets/${project.slug}`}
            className="outline-none after:absolute after:inset-0 after:z-0 after:content-[''] focus-visible:underline"
          >
            {project.title[locale]}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm text-accent-fg">{project.subtitle[locale]}</p>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{project.summary[locale]}</p>

        {large && project.highlights.length ? (
          <ul className="mt-5 space-y-2">
            {project.highlights.map((h) => (
              <li key={h.fr} className="flex gap-3 text-sm text-fg/90">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent-2" />
                {h[locale]}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6">
          <StackTags project={project} limit={large ? undefined : 5} />
        </div>

        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-2 pt-7">
          <Button asChild size="sm">
            <Link href={`/projets/${project.slug}`}>
              {t("caseStudy")}
              <ArrowUpRight className="transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
            </Link>
          </Button>
          <CodeLink project={project} />
        </div>
      </div>
    </article>
  );
}

/** Compact card for the "other projects" grid. */
export function CompactProjectCard({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const locale = useLocale();

  return (
    <article className="spotlight group relative flex h-full flex-col rounded-3xl border border-border bg-surface p-6 shadow-card transition-colors duration-500 hover:border-border-strong">
      <div className="flex items-center justify-between gap-3">
        <span className="grid size-10 place-items-center rounded-xl border border-border bg-surface-2 text-accent-fg">
          <FolderGit2 className="size-5" aria-hidden />
        </span>
        <span className="font-mono text-xs text-subtle">{formatMonth(project.date, locale)}</span>
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">
        {project.links.github ? (
          <ExternalLink
            href={project.links.github}
            className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline"
          >
            {project.title[locale]}
          </ExternalLink>
        ) : (
          project.title[locale]
        )}
      </h3>
      <p className="mt-1 font-mono text-xs text-subtle">{project.context[locale]}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{project.summary[locale]}</p>

      {project.repos ? (
        <ul className="relative z-10 mt-4 space-y-2">
          {project.repos.map((repo) => (
            <li key={repo.name}>
              <ExternalLink
                href={repo.href}
                className="group/repo flex items-start gap-2 rounded-xl border border-border bg-surface-2/60 px-3 py-2 text-sm transition-colors hover:border-border-strong"
              >
                <BrandLogo logo={{ icon: "github" }} className="mt-0.5 size-3.5 text-subtle" />
                <span className="min-w-0">
                  <span className="block truncate font-mono text-xs text-fg">{repo.name}</span>
                  <span className="block text-xs text-muted">{repo.summary[locale]}</span>
                </span>
              </ExternalLink>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto pt-5">
        <StackTags project={project} limit={4} />
        <div className="mt-4 flex items-center justify-between text-sm">
          {project.links.github ? (
            <span className="inline-flex items-center gap-1.5 text-accent-fg">
              {t("viewCode")}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </span>
          ) : project.repos ? null : (
            <span className="text-xs text-subtle">{t("codeSoon")}</span>
          )}
        </div>
      </div>
    </article>
  );
}
