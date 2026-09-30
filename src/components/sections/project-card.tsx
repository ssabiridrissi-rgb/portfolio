import { ArrowUpRight, Clock, Users } from "lucide-react";
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

/** Only for projects whose code is public — the others simply show no code link. */
function CodeLink({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const locale = useLocale();
  if (!project.links.github) return null;
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

/** Large bento card for featured projects. */
export function FeaturedProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const t = useTranslations("projects");
  const cursor = useTranslations("cursor");
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
            vertical={large}
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
              {project.team.size ? t("team", { count: project.team.size }) : t("teamProject")}
            </Badge>
          ) : null}
          {project.date ? <span className="font-mono text-xs text-subtle">{formatMonth(project.date, locale)}</span> : null}
        </div>
        <h3 className={cn("mt-4 font-display leading-none font-extrabold uppercase", large ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl")}>
          <Link
            href={`/projets/${project.slug}`}
            data-cursor={cursor("view")}
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
