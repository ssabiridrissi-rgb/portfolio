import { ArrowUpRight, Trophy, Users, Zap } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Medallion } from "@/components/distinctions/medallion";
import { NxpTrack } from "@/components/distinctions/nxp-track";
import { SolarOrbit } from "@/components/distinctions/solar-orbit";
import { SupplierBoard } from "@/components/distinctions/supplier-board";
import { Badge, Tag } from "@/components/ui/badge";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { achievements } from "@/content/achievements";
import { getSkill } from "@/content/skills";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn, formatMonth } from "@/lib/utils";
import type { Achievement } from "@/types/content";

function when(a: Achievement, locale: Locale) {
  if (!a.date) return null;
  return a.date.month ? formatMonth(`${a.date.year}-${String(a.date.month).padStart(2, "0")}`, locale) : String(a.date.year);
}

function Visual({ achievement, trackLabel }: { achievement: Achievement; trackLabel: string }) {
  switch (achievement.visual) {
    case "nxp-track":
      return <NxpTrack label={trackLabel} />;
    case "solar-orbit":
      return <SolarOrbit />;
    case "supplier-board":
      return <SupplierBoard />;
    default:
      return null;
  }
}

function Skills({ achievement }: { achievement: Achievement }) {
  if (!achievement.skills.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
      {achievement.skills.map((id) => {
        const skill = getSkill(id);
        return (
          <li key={id}>
            <Tag>
              {skill.logo ? <BrandLogo logo={skill.logo} className="size-3.5 text-[0.5rem]" /> : null}
              {skill.name}
            </Tag>
          </li>
        );
      })}
    </ul>
  );
}

/** Wide card with the podium number in bronze and the animated circuit. */
async function TrophyCard({ a }: { a: Achievement }) {
  const t = await getTranslations("distinctions");
  const locale = await getLocale();
  const date = when(a, locale);
  return (
    <article className="spotlight tilt relative grid overflow-hidden rounded-[2rem] border border-bronze/30 bg-surface shadow-card lg:grid-cols-[0.95fr_1.05fr]">
      <span aria-hidden className="holo" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 size-96 rounded-full bg-[radial-gradient(closest-side,var(--bronze-glow),transparent)]"
      />
      <div className="relative flex flex-col p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="bronze">
            <Trophy className="size-3" aria-hidden />
            {t("competition")}
          </Badge>
          {date ? <span className="font-mono text-xs text-subtle">{date}</span> : null}
        </div>
        {a.rank ? (
          <p aria-hidden className="mt-6 flex items-start font-display leading-[0.78] font-extrabold">
            <span className="text-bronze text-[clamp(6.5rem,15vw,11rem)]">{a.rank}</span>
            <span className="text-bronze mt-[0.2em] text-[clamp(2rem,4.5vw,3.4rem)]">{t("ordinal", { rank: a.rank })}</span>
          </p>
        ) : null}
        <h3 className="mt-5 font-display text-4xl leading-none font-extrabold uppercase">{a.name}</h3>
        <p className="mt-1.5 text-sm font-medium text-bronze">
          {a.context[locale]} · {a.headline[locale]}
        </p>
        {a.summary ? <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted">{a.summary[locale]}</p> : null}
        <div className="mt-6 flex flex-wrap items-center gap-1.5">
          <Tag>
            <Users className="size-3.5" aria-hidden />
            {a.role[locale]}
          </Tag>
          <Skills achievement={a} />
        </div>
      </div>
      <div className="relative flex items-center border-t border-border bg-[radial-gradient(ellipse_at_center,var(--surface-2),var(--surface))] p-6 sm:p-10 lg:border-t-0 lg:border-l">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
        <div className="relative w-full">
          <Visual achievement={a} trackLabel={t("trackLabel")} />
        </div>
      </div>
    </article>
  );
}

/** Hackathon card: the visual on one side, the story on the other (no tilt — the visuals have controls). */
async function HackathonCard({ a, flip = false }: { a: Achievement; flip?: boolean }) {
  const t = await getTranslations("distinctions");
  const locale = await getLocale();
  const date = when(a, locale);
  return (
    <article className="spotlight relative grid overflow-hidden rounded-[2rem] border border-border bg-surface shadow-card lg:grid-cols-[1.08fr_0.92fr]">
      <span aria-hidden className="holo" />
      <div
        className={cn(
          "relative flex items-center border-b border-border bg-[radial-gradient(ellipse_at_top,var(--surface-2),var(--surface))] p-5 sm:p-8 lg:border-b-0",
          flip ? "lg:order-2 lg:border-l" : "lg:border-r",
        )}
      >
        <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
        <div className="relative w-full">
          <Visual achievement={a} trackLabel={t("trackLabel")} />
        </div>
      </div>
      <div className="relative flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">
            <Zap className="size-3" aria-hidden />
            {t("hackathon")}
          </Badge>
          <Badge>{a.headline[locale]}</Badge>
          {date ? <span className="font-mono text-xs text-subtle">{date}</span> : null}
        </div>
        <h3 className="mt-4 font-display text-4xl leading-none font-extrabold uppercase">{a.name}</h3>
        <p className="mt-1 text-sm text-accent-fg">{a.context[locale]}</p>
        {a.summary ? <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{a.summary[locale]}</p> : null}
        {a.highlights.length ? (
          <ul className="mt-5 space-y-2.5">
            {a.highlights.map((h) => (
              <li key={h.fr} className="flex gap-3 text-sm text-fg/90">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent-2" />
                {h[locale]}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Skills achievement={a} />
        </div>
        {a.projectSlug ? (
          <div className="mt-7">
            <Button asChild size="sm" data-magnetic="">
              <Link href={`/projets/${a.projectSlug}`}>
                {t("caseStudy")}
                <ArrowUpRight className="transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

async function LeadershipCard({ a }: { a: Achievement }) {
  const t = await getTranslations("distinctions");
  const locale = await getLocale();
  const monogram = "monogram" in a.logo ? a.logo.monogram : a.name.slice(0, 2).toUpperCase();
  return (
    <article className="spotlight tilt relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-card sm:flex-row sm:items-center sm:p-8">
      <span aria-hidden className="holo" />
      <Medallion monogram={monogram} />
      <div className="relative min-w-0">
        <Badge variant="violet">
          <Users className="size-3" aria-hidden />
          {t("leadership")}
        </Badge>
        <h3 className="mt-3 font-display text-3xl leading-none font-extrabold uppercase">{a.name}</h3>
        <p className="mt-0.5 text-sm text-muted">{a.context[locale]}</p>
        <p className="mt-4 font-medium text-fg">{a.role[locale]}</p>
        {a.summary ? <p className="mt-1.5 text-sm leading-relaxed text-muted">{a.summary[locale]}</p> : null}
      </div>
    </article>
  );
}

export async function Distinctions() {
  const t = await getTranslations("distinctions");
  const competitions = achievements.filter((a) => a.kind === "competition");
  const hackathons = achievements.filter((a) => a.kind === "hackathon");
  const leadership = achievements.filter((a) => a.kind === "leadership");

  return (
    <Section id="distinctions" eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} glow="right" scene="distinctions">
      <div className="flex flex-col gap-4">
        {competitions.map((a) => (
          <Reveal key={a.id} y={24}>
            <TrophyCard a={a} />
          </Reveal>
        ))}
        {hackathons.map((a, i) => (
          <Reveal key={a.id} y={24}>
            <HackathonCard a={a} flip={i % 2 === 1} />
          </Reveal>
        ))}
        <RevealGroup className="grid gap-4 md:grid-cols-2">
          {leadership.map((a) => (
            <RevealItem key={a.id} className="h-full">
              <LeadershipCard a={a} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
