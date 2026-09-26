import { ChartColumn, MapPin } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge, Tag } from "@/components/ui/badge";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { experiences } from "@/content/experience";
import { getSkill } from "@/content/skills";
import { cn, formatPeriod } from "@/lib/utils";
import { TimelineProgress } from "./timeline-progress";

export async function Experience() {
  const t = await getTranslations("experience");
  const locale = await getLocale();

  return (
    <Section id="experience" eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} glow="right">
      <TimelineProgress>
        <ol className="relative flex flex-col gap-10 md:gap-6">
          {experiences.map((exp, i) => {
            const right = i % 2 === 1;
            return (
              <li key={exp.id} className={cn("relative grid md:grid-cols-2 md:gap-16", i > 0 && "md:-mt-24")}>
                {/* Node on the line */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-7 left-5 z-10 grid size-4 -translate-x-1/2 place-items-center rounded-full border-2 bg-bg md:left-1/2",
                    exp.isData ? "border-accent-2 shadow-[0_0_0_6px_var(--glow-2)]" : "border-border-strong",
                  )}
                >
                  {exp.isData ? <span className="size-1.5 rounded-full bg-accent-2" /> : null}
                </span>

                <Reveal
                  y={20}
                  className={cn("pl-12 md:pl-0", right ? "md:col-start-2" : "md:col-start-1 md:text-right")}
                >
                  <article
                    className={cn(
                      "spotlight rounded-3xl border bg-surface p-6 text-left shadow-card sm:p-7",
                      exp.isData ? "border-accent/25" : "border-border",
                    )}
                  >
                    <header className="flex items-start gap-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-border bg-surface-2 text-fg">
                        <BrandLogo logo={exp.logo} className="size-6 text-[0.62rem]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-xl font-semibold tracking-tight">
                            {exp.company}
                            {exp.brand ? <span className="text-muted"> · {exp.brand}</span> : null}
                          </h3>
                          {exp.isData ? (
                            <Badge variant="accent">
                              <ChartColumn className="size-3" aria-hidden />
                              {t("data")}
                            </Badge>
                          ) : null}
                        </div>
                        <p className="mt-1 text-[0.95rem] text-fg/90">{exp.role[locale]}</p>
                        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                          <span>{t(`kind.${exp.kind}`)}</span>
                          <span aria-hidden className="text-subtle">
                            •
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3.5" aria-hidden />
                            {exp.location}
                          </span>
                          <span aria-hidden className="text-subtle md:hidden">
                            •
                          </span>
                          <span className="md:hidden">{formatPeriod(exp.start, exp.end, locale)}</span>
                        </p>
                      </div>
                    </header>
                    <ul className="mt-5 space-y-2.5">
                      {exp.bullets.map((b) => (
                        <li key={b.fr} className="flex gap-3 text-[0.95rem] leading-relaxed text-muted">
                          <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-accent-2" />
                          <span>{b[locale]}</span>
                        </li>
                      ))}
                    </ul>
                    {exp.skills.length ? (
                      <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Stack">
                        {exp.skills.map((id) => {
                          const s = getSkill(id);
                          return (
                            <li key={id}>
                              <Tag>
                                {s.logo ? <BrandLogo logo={s.logo} className="size-3.5 text-[0.5rem]" /> : null}
                                {s.name}
                              </Tag>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </article>
                </Reveal>

                {/* Period on the opposite side (desktop) */}
                <div
                  className={cn(
                    "hidden md:block",
                    right ? "md:col-start-1 md:row-start-1 md:text-right" : "md:col-start-2 md:row-start-1",
                  )}
                >
                  <p className="mt-6 font-mono text-sm tracking-wider text-muted uppercase">
                    {formatPeriod(exp.start, exp.end, locale)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </TimelineProgress>
    </Section>
  );
}
