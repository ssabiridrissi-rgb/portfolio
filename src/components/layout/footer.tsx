import { ArrowUp, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ExternalLink } from "@/components/ui/external-link";
import { profile } from "@/content/profile";
import { Link } from "@/i18n/navigation";
import { SECTIONS } from "@/lib/sections";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const year = new Date().getFullYear();

  const socials = [
    { href: profile.github, label: "GitHub", icon: <BrandLogo logo={{ icon: "github" }} /> },
    { href: profile.linkedin, label: "LinkedIn", icon: <BrandLogo logo={{ icon: "linkedin" }} /> },
    { href: profile.whatsapp, label: "WhatsApp", icon: <BrandLogo logo={{ icon: "whatsapp" }} /> },
  ];

  return (
    <footer className="no-print relative mt-10 border-t border-border">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--accent),transparent)] opacity-50" />
      <div className="container-page grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="flex items-center gap-2.5 font-display text-lg font-semibold">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-button font-mono text-[0.68rem] font-bold text-accent-contrast">
              {profile.initials}
            </span>
            {profile.name}
          </p>
          <p className="mt-4 text-sm text-muted">{t("tagline")}</p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-5 inline-flex items-center gap-2 text-sm text-accent-fg underline-offset-4 hover:underline"
          >
            <Mail className="size-4" aria-hidden />
            {profile.email}
          </a>
        </div>

        <div>
          <h2 className="font-mono text-xs tracking-widest text-subtle uppercase">{t("quickLinks")}</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {SECTIONS.map((id) => (
              <li key={id}>
                <Link href={{ pathname: "/", hash: id }} className="text-muted transition-colors hover:text-fg">
                  {nav(id)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/recruteur" className="text-muted transition-colors hover:text-fg">
                {nav("recruiter")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-xs tracking-widest text-subtle uppercase">{t("elsewhere")}</h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {socials.map((s) => (
              <li key={s.label}>
                <ExternalLink href={s.href} className="inline-flex items-center gap-2.5 text-muted transition-colors hover:text-fg">
                  {s.icon}
                  {s.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-start justify-between gap-4 py-6 text-xs text-subtle sm:flex-row sm:items-center">
          <p>
            {t("rights", { year })} · {t("built")}
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-muted transition-colors hover:border-border-strong hover:text-fg"
            lang={locale}
          >
            <ArrowUp className="size-3.5" aria-hidden />
            {t("backToTop")}
          </a>
        </div>
      </div>
    </footer>
  );
}
