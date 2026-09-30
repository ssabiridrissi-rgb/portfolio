import type React from "react";
import { ArrowDown, ArrowRight, Mail, Trophy } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { CvMenu } from "@/components/layout/cv-menu";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/ui/external-link";
import { awards } from "@/content/achievements";
import { profile } from "@/content/profile";
import { InteractiveName } from "./interactive-name";
import { Portrait } from "./portrait";
import { Typewriter } from "./typewriter";

export async function Hero() {
  const t = await getTranslations("hero");
  const locale = await getLocale();

  const socials = [
    { href: profile.github, label: "GitHub", icon: <BrandLogo logo={{ icon: "github" }} className="size-[18px]" /> },
    { href: profile.linkedin, label: "LinkedIn", icon: <BrandLogo logo={{ icon: "linkedin" }} className="size-[18px]" /> },
    { href: `mailto:${profile.email}`, label: "Email", icon: <Mail className="size-[18px]" aria-hidden /> },
    { href: profile.whatsapp, label: "WhatsApp", icon: <BrandLogo logo={{ icon: "whatsapp" }} className="size-[18px]" /> },
  ];

  const chips = [
    { label: "Renault · Spotfire", className: "-left-4 top-[14%] sm:-left-10" },
    { label: "Power BI · DAX", className: "-right-3 top-[46%] sm:-right-8" },
    { label: "AWS · Docker", className: "-left-2 bottom-[12%] sm:-left-8" },
  ];
  // The best-ranked competition, straight from the content.
  const podium = awards.filter((a) => a.rank).sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))[0];
  const [firstName, ...lastNames] = profile.name.split(" ");

  return (
    <section
      aria-labelledby="hero-title"
      data-scene="hero"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-20"
    >
      {/* The particle galaxy (components/universe) turns behind the portrait; a stage light crosses the room.
          The glows double as the no-WebGL fallback. */}
      <div aria-hidden className="absolute inset-0 -z-20">
        <div className="hero-beam absolute inset-0" />
        <div className="absolute -top-40 left-1/4 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)]" />
        <div className="absolute top-1/3 right-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,var(--glow-3),transparent)]" />
      </div>

      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
        <div>
          <div className="fade-up" style={{ "--d": "0ms" } as React.CSSProperties}>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-full border border-success/30 bg-success-bg py-1.5 pr-3.5 pl-3 text-xs font-medium text-success transition-colors hover:border-success/60 sm:text-sm"
            >
              <span className="pulse-dot relative inline-block size-2 rounded-full bg-success" aria-hidden />
              {profile.availability.headline[locale]}
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </a>
          </div>

          <div>
            <p className="mt-9 font-mono text-sm text-muted">{t("hello")}</p>
            <InteractiveName id="hero-title" first={firstName} last={lastNames.join(" ")} />
          </div>

          <div>
            <p className="mt-7 max-w-xl text-lg font-medium text-fg/90 sm:text-xl">{profile.title[locale]}</p>
            <p className="mt-3 flex min-h-[1.75rem] items-center gap-2 font-mono text-base text-muted sm:text-lg">
              <span aria-hidden className="text-accent-fg">&gt;</span>
              <Typewriter phrases={profile.roles.map((r) => r[locale])} label={t("rolePrefix")} />
            </p>
          </div>

          <div>
            <p className="mt-7 max-w-xl text-lead text-pretty text-muted">
              {profile.valueProposition[locale]}
            </p>
          </div>

          <div className="fade-up mt-9 flex flex-wrap items-center gap-3" style={{ "--d": "240ms" } as React.CSSProperties}>
            <Button asChild size="lg" data-magnetic="">
              <a href="#projects">
                {t("viewProjects")}
                <ArrowRight className="transition-transform duration-300 group-hover/button:translate-x-0.5" />
              </a>
            </Button>
            <CvMenu />
          </div>

          <div className="fade-up" style={{ "--d": "300ms" } as React.CSSProperties}>
            <ul aria-label={t("socials")} className="mt-9 flex items-center gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <ExternalLink
                    href={s.href}
                    aria-label={s.label}
                    title={s.label}
                    data-magnetic=""
                    className="grid size-11 place-items-center rounded-full border border-border bg-surface text-muted transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent-fg"
                  >
                    {s.icon}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="fade-up relative mx-auto w-full max-w-[340px] sm:max-w-[420px]" style={{ "--d": "150ms" } as React.CSSProperties}>
          <Portrait
            alt={t("portraitAlt")}
            place={profile.coordinates}
            hintPointer={t("holoHint")}
            hintTouch={t("holoHintTouch")}
            cursorLabel={t("holoCursor")}
            scanLabel={t("scanLabel")}
            locale={locale}
          >
            {chips.map((chip, i) => (
              <span
                key={chip.label}
                aria-hidden
                className={`float-y absolute ${chip.className} hidden rounded-full border border-border-strong bg-surface px-3 py-1.5 font-mono text-[0.7rem] text-fg shadow-lg sm:inline-flex sm:items-center sm:gap-2`}
                style={{ "--float-delay": `${-i * 1.3}s`, "--float-duration": "5s" } as React.CSSProperties}
              >
                <span className="size-1.5 rounded-full bg-accent" />
                {chip.label}
              </span>
            ))}
            {podium ? (
              <a
                href="#distinctions"
                className="absolute -top-4 right-2 z-10 inline-flex items-center gap-2 rounded-full border border-bronze/40 bg-surface px-3 py-1.5 font-mono text-[0.7rem] text-fg shadow-[0_10px_30px_-10px_var(--bronze-glow)] transition-colors hover:border-bronze/70 sm:-right-6"
              >
                <Trophy className="size-3.5 text-bronze" aria-hidden />
                {podium.name} · {podium.headline[locale]}
              </a>
            ) : null}
          </Portrait>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.65rem] tracking-[0.25em] text-subtle uppercase transition-colors hover:text-fg sm:flex"
      >
        {t("scroll")}
        <span className="flex h-9 w-5.5 justify-center rounded-full border border-border-strong pt-1.5">
          <ArrowDown className="scroll-cue size-3" aria-hidden />
        </span>
      </a>
    </section>
  );
}
