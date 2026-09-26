import { GraduationCap } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Flag } from "@/components/ui/flag";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { education } from "@/content/education";
import { cn, formatPeriod } from "@/lib/utils";

export async function Education() {
  const t = await getTranslations("education");
  const locale = await getLocale();

  return (
    <Section
      id="education"
      eyebrow={t("eyebrow")}
      title={t("title")}
      subtitle={t("subtitle")}
      glow="center"
      headerAside={
        <Reveal delay={0.1} className="shrink-0">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-accent-3/30 bg-accent-3/10 px-4 py-2 text-sm font-medium">
            <Flag code="MA" className="h-3.5" />
            <span aria-hidden className="text-subtle">
              ↔
            </span>
            <Flag code="CN" className="h-3.5" />
            {t("doubleDegree")}
          </span>
        </Reveal>
      }
    >
      <RevealGroup className="grid gap-4 md:grid-cols-3">
        {education.map((e) => (
          <RevealItem
            key={e.id}
            className={cn(
              "spotlight relative flex flex-col rounded-3xl border bg-surface p-6 shadow-card sm:p-7",
              e.highlight ? "border-accent-3/35" : "border-border",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="grid size-12 place-items-center rounded-2xl border border-border bg-surface-2 text-accent-fg">
                <GraduationCap className="size-5" aria-hidden />
              </span>
              <div className="flex flex-wrap justify-end gap-1.5">
                {e.highlight ? <Badge variant="violet">{e.highlight[locale]}</Badge> : null}
                {e.ongoing ? <Badge variant="success">{t("ongoing")}</Badge> : null}
              </div>
            </div>
            <h3 className="mt-6 font-display text-xl leading-snug font-semibold tracking-tight">{e.degree[locale]}</h3>
            <p className="mt-2 text-muted">{e.school}</p>
            <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm">
              <span className="inline-flex items-center gap-2 text-fg">
                <Flag code={e.country.code} className="h-3" />
                {e.country.label[locale]}
              </span>
              <span className="font-mono text-xs text-subtle">{formatPeriod(e.start, e.end, locale)}</span>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
