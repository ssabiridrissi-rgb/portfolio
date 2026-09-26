import { BadgeCheck, Languages, Trophy } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ExternalLink } from "@/components/ui/external-link";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { certifications, languages } from "@/content/certifications";

export async function Certifications() {
  const t = await getTranslations("certifications");
  const locale = await getLocale();

  return (
    <Section id="certifications" eyebrow={t("eyebrow")} title={t("title")}>
      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {certifications.map((c) => (
          <RevealItem key={c.id} className="spotlight group flex flex-col rounded-3xl border border-border bg-surface p-6 shadow-card">
            <span className="grid size-12 place-items-center rounded-2xl border border-border bg-surface-2 text-fg transition-transform duration-500 ease-out-expo group-hover:scale-105">
              <BrandLogo logo={c.logo} className="size-6 text-[0.62rem]" title={c.issuer} />
            </span>
            <p className="mt-5 font-mono text-xs tracking-wider text-subtle uppercase">{c.issuer}</p>
            <h3 className="mt-1.5 font-display text-lg leading-snug font-semibold">{c.title[locale]}</h3>
            <div className="mt-auto flex items-center justify-between gap-2 pt-5">
              {c.kind === "competition" ? (
                <Badge variant="warning">
                  <Trophy className="size-3" aria-hidden />
                  {t("competition")}
                </Badge>
              ) : (
                <Badge>
                  <BadgeCheck className="size-3" aria-hidden />
                  {t("certification")}
                </Badge>
              )}
              {c.credentialUrl ? (
                <ExternalLink href={c.credentialUrl} className="text-sm text-accent-fg underline-offset-4 hover:underline">
                  {t("verify")}
                </ExternalLink>
              ) : null}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-14">
        <h3 className="mb-5 flex items-center gap-2 font-mono text-xs tracking-widest text-subtle uppercase">
          <Languages className="size-4" aria-hidden />
          {t("languagesTitle")}
        </h3>
        <ul className="grid gap-4 sm:grid-cols-3">
          {languages.map((l) => (
            <li key={l.name.fr} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4">
              <span className="font-display text-lg font-semibold">{l.name[locale]}</span>
              <span className="flex items-center gap-2 text-sm text-muted">
                {l.level[locale]}
                {l.cefr ? <Badge variant="accent">{l.cefr}</Badge> : null}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
