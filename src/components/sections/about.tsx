import { BrainCircuit, CalendarRange, Check, Clock, Cloud, Compass, Database, MapPin, Target } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/ui/brand-logo";
import { RevealGroup, RevealItem, Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { profile } from "@/content/profile";
import { getSkill, qualities } from "@/content/skills";

const STRENGTH_ICONS = { data: Database, ai: BrainCircuit, cloud: Cloud } as const;

export async function About() {
  const t = await getTranslations("about");
  const locale = await getLocale();
  const a = profile.availability;

  const looking = [
    { icon: Target, label: t("type"), value: a.type[locale] },
    { icon: Compass, label: t("domains"), value: a.domains.map((d) => d[locale]).join(" · ") },
    { icon: CalendarRange, label: t("period"), value: a.period[locale] },
    { icon: Clock, label: t("duration"), value: a.duration[locale] },
    { icon: MapPin, label: t("mobility"), value: `${profile.location[locale]} — ${profile.mobility[locale]}` },
  ];

  return (
    <Section id="about" eyebrow={t("eyebrow")} title={t("title")} glow="left" scene="about">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <Reveal className="space-y-5 text-lead text-pretty text-muted">
          {profile.about.map((paragraph, i) => (
            <p key={i} className={i === 0 ? "text-fg" : undefined}>
              {paragraph[locale]}
            </p>
          ))}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="font-mono text-xs tracking-widest text-subtle uppercase">{t("qualities")}</span>
            {qualities.map((q) => (
              <span key={q.fr} className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-fg">
                {q[locale]}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="relative overflow-hidden rounded-3xl border border-accent/25 bg-surface p-6 shadow-card sm:p-8">
          <div aria-hidden className="absolute -top-24 -right-24 size-56 rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)]" />
          <h3 className="font-display text-3xl leading-none font-extrabold text-fg uppercase">{t("tldrTitle")}</h3>
          <ul className="mt-5 space-y-3.5">
            {profile.tldr.map((line) => (
              <li key={line.fr} className="flex gap-3 text-[0.95rem] leading-relaxed">
                <Check className="mt-1 size-4 shrink-0 text-success" aria-hidden />
                <span>{line[locale]}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <h3 className="mt-20 mb-6 font-mono text-xs tracking-widest text-subtle uppercase">{t("bringTitle")}</h3>
      <RevealGroup className="grid gap-4 md:grid-cols-3">
        {profile.strengths.map((s) => {
          const Icon = STRENGTH_ICONS[s.id];
          return (
            <RevealItem key={s.id} className="spotlight group rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-7">
              <span className="grid size-11 place-items-center rounded-2xl border border-accent/25 bg-accent/10 text-accent-fg transition-transform duration-500 ease-out-expo group-hover:-rotate-6">
                <Icon className="size-5" aria-hidden />
              </span>
              <h4 className="mt-5 text-h3">{s.title[locale]}</h4>
              <p className="mt-2 text-muted">{s.body[locale]}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {s.skills.map((id) => {
                  const skill = getSkill(id);
                  return (
                    <li key={id} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2 py-1 font-mono text-xs text-muted">
                      {skill.logo ? <BrandLogo logo={skill.logo} className="size-3.5 text-[0.55rem]" /> : null}
                      {skill.name}
                    </li>
                  );
                })}
              </ul>
            </RevealItem>
          );
        })}
      </RevealGroup>

      <Reveal className="mt-4 rounded-3xl border border-border bg-[linear-gradient(135deg,var(--surface),var(--surface-2))] p-6 sm:p-8">
        <h3 className="font-display text-3xl leading-none font-extrabold uppercase">{t("lookingTitle")}</h3>
        <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
          {looking.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <dt className="flex items-center gap-2 font-mono text-[0.7rem] tracking-widest text-subtle uppercase">
                <Icon className="size-3.5" aria-hidden />
                {label}
              </dt>
              <dd className="text-[0.95rem] text-fg">{value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
