import { ArrowLeft, ArrowRight, CalendarDays, Layers, Lightbulb, ListChecks, Target, Users, Workflow } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { StackTags, StatusBadge } from "@/components/sections/project-card";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/ui/external-link";
import { Reveal } from "@/components/ui/reveal";
import { ArchitectureDiagram } from "@/components/visuals/architecture-diagram";
import { caseStudyProjects, getProject, projectCategories } from "@/content/projects";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { formatMonth } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => caseStudyProjects.map((p) => ({ locale, slug: p.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project?.caseStudy) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    path: `/projets/${slug}`,
    title: t("caseStudyTitle", { project: project.title[locale] }),
    description: project.summary[locale],
    ogTitle: project.title[locale],
    ogSubtitle: project.subtitle[locale],
    type: "article",
  });
}

function Block({ icon, title, children, id }: { icon: ReactNode; title: string; children: ReactNode; id: string }) {
  return (
    <Reveal>
      <section aria-labelledby={id} className="border-t border-border pt-10">
        <h2 id={id} className="mb-5 flex items-center gap-3 font-display text-2xl font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent-fg [&_svg]:size-4">
            {icon}
          </span>
          {title}
        </h2>
        <div className="text-[1.02rem] leading-relaxed text-muted">{children}</div>
      </section>
    </Reveal>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = getProject(slug);
  if (!project?.caseStudy) notFound();
  const cs = project.caseStudy;
  const t = await getTranslations("caseStudy");
  const tp = await getTranslations("projects");

  const index = caseStudyProjects.findIndex((p) => p.slug === slug);
  const prev = caseStudyProjects[(index - 1 + caseStudyProjects.length) % caseStudyProjects.length];
  const next = caseStudyProjects[(index + 1) % caseStudyProjects.length];
  const categories = project.categories
    .map((c) => projectCategories.find((pc) => pc.id === c)?.label[locale])
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="relative pt-28 pb-10 sm:pt-32">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_top,var(--glow-1),transparent_65%)]" />
      <div className="container-page">
        <Reveal>
          <Link
            href={{ pathname: "/", hash: "projects" }}
            className="inline-flex items-center gap-2 rounded-full text-sm text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t("back")}
          </Link>
        </Reveal>

        <header className="mt-8 max-w-3xl">
          <Reveal delay={0.05} className="flex flex-wrap items-center gap-2">
            <StatusBadge project={project} />
            <Badge variant="accent">{categories}</Badge>
            {project.team ? (
              <Badge>
                <Users className="size-3" aria-hidden />
                {tp("team", { count: project.team.size })}
              </Badge>
            ) : null}
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-5 text-h2 text-balance">{project.title[locale]}</h1>
            <p className="mt-4 text-lead text-accent-fg">{project.subtitle[locale]}</p>
            <p className="mt-5 text-lead text-pretty text-muted">{project.summary[locale]}</p>
          </Reveal>
          <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-3">
            {project.links.github ? (
              <Button asChild>
                <ExternalLink href={project.links.github}>
                  <BrandLogo logo={{ icon: "github" }} />
                  {tp("viewCode")}
                </ExternalLink>
              </Button>
            ) : (
              <span className="inline-flex h-11 items-center gap-2 rounded-full border border-dashed border-border-strong px-5 text-sm text-subtle">
                <BrandLogo logo={{ icon: "github" }} />
                {tp("codeSoon")}
              </span>
            )}
            {project.links.demo ? (
              <Button asChild variant="secondary">
                <ExternalLink href={project.links.demo}>Demo</ExternalLink>
              </Button>
            ) : null}
          </Reveal>
        </header>

        {project.diagram ? (
          <Reveal delay={0.2} className="relative mt-14 overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-10">
            <div aria-hidden className="bg-grid absolute inset-0 opacity-70" />
            <div className="relative overflow-x-auto">
              <ArchitectureDiagram
                id={project.diagram}
                locale={locale}
                label={tp("diagram", { project: project.title[locale] })}
                className="mx-auto min-w-[640px] max-w-4xl"
              />
            </div>
          </Reveal>
        ) : null}

        <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_300px]">
          <div className="flex min-w-0 flex-col gap-12">
            <Block id="cs-context" icon={<CalendarDays />} title={t("context")}>
              <p>{cs.context[locale]}</p>
            </Block>
            <Block id="cs-problem" icon={<Target />} title={t("problem")}>
              <p className="text-fg">{cs.problem[locale]}</p>
            </Block>
            <Block id="cs-approach" icon={<Workflow />} title={t("approach")}>
              <ol className="space-y-4">
                {cs.approach.map((step, i) => (
                  <li key={step.fr} className="flex gap-4">
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-border-strong font-mono text-xs text-fg">
                      {i + 1}
                    </span>
                    <span>{step[locale]}</span>
                  </li>
                ))}
              </ol>
            </Block>
            <Block id="cs-architecture" icon={<Layers />} title={t("architecture")}>
              <p>{cs.architecture[locale]}</p>
            </Block>
            <Block id="cs-results" icon={<ListChecks />} title={t("results")}>
              <ul className="space-y-3">
                {cs.results.map((r) => (
                  <li key={r.fr} className="flex gap-3">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-success" />
                    <span className="text-fg/90">{r[locale]}</span>
                  </li>
                ))}
              </ul>
            </Block>
            {project.team ? (
              <Block id="cs-role" icon={<Users />} title={t("role")}>
                <p className="text-fg/90">{project.team.role[locale]}</p>
              </Block>
            ) : null}
            {cs.learned.length ? (
              <Block id="cs-learned" icon={<Lightbulb />} title={t("learned")}>
                <ul className="space-y-3">
                  {cs.learned.map((l) => (
                    <li key={l.fr} className="flex gap-3">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent-3" />
                      <span>{l[locale]}</span>
                    </li>
                  ))}
                </ul>
              </Block>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Reveal className="rounded-3xl border border-border bg-surface p-6 shadow-card">
              <dl className="space-y-5 text-sm">
                <div>
                  <dt className="font-mono text-[0.7rem] tracking-widest text-subtle uppercase">{t("date")}</dt>
                  <dd className="mt-1 text-fg">{formatMonth(project.date, locale)}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.7rem] tracking-widest text-subtle uppercase">{t("status")}</dt>
                  <dd className="mt-1.5">
                    <StatusBadge project={project} />
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.7rem] tracking-widest text-subtle uppercase">{t("category")}</dt>
                  <dd className="mt-1 text-fg">{categories}</dd>
                </div>
                <div>
                  <dt className="mb-2 font-mono text-[0.7rem] tracking-widest text-subtle uppercase">{t("stack")}</dt>
                  <dd>
                    <StackTags project={project} />
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.7rem] tracking-widest text-subtle uppercase">{t("links")}</dt>
                  <dd className="mt-1.5">
                    {project.links.github ? (
                      <ExternalLink href={project.links.github} className="inline-flex items-center gap-2 break-all text-accent-fg hover:underline">
                        <BrandLogo logo={{ icon: "github" }} />
                        GitHub
                      </ExternalLink>
                    ) : (
                      <span className="text-subtle">{tp("codeSoon")}</span>
                    )}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </aside>
        </div>

        <nav aria-label={`${t("previous")} / ${t("next")}`} className="mt-20 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
          <Link
            href={`/projets/${prev.slug}`}
            className="spotlight group rounded-3xl border border-border bg-surface p-6 transition-colors hover:border-border-strong"
          >
            <span className="flex items-center gap-2 font-mono text-xs tracking-widest text-subtle uppercase">
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
              {t("previous")}
            </span>
            <span className="mt-3 block font-display text-xl font-semibold">{prev.title[locale]}</span>
          </Link>
          <Link
            href={`/projets/${next.slug}`}
            className="spotlight group rounded-3xl border border-border bg-surface p-6 text-right transition-colors hover:border-border-strong"
          >
            <span className="flex items-center justify-end gap-2 font-mono text-xs tracking-widest text-subtle uppercase">
              {t("next")}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
            <span className="mt-3 block font-display text-xl font-semibold">{next.title[locale]}</span>
          </Link>
        </nav>
      </div>
    </article>
  );
}
