import { ContactRound, Mail, MapPin, Phone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ExternalLink } from "@/components/ui/external-link";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { profile } from "@/content/profile";
import { ContactForm } from "./contact-form";
import { CopyEmail } from "./copy-email";

function Row({ icon, label, children, action }: { icon: ReactNode; label: string; children: ReactNode; action?: ReactNode }) {
  return (
    <li className="flex items-center gap-4 py-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface-2 text-accent-fg [&_svg]:size-[18px]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[0.68rem] tracking-widest text-subtle uppercase">{label}</p>
        <div className="text-[0.95rem] break-words text-fg">{children}</div>
      </div>
      {action}
    </li>
  );
}

export async function Contact() {
  const t = await getTranslations("contact");
  const locale = await getLocale();
  const link = "hover:text-accent-fg underline-offset-4 hover:underline";

  return (
    <Section id="contact" eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} glow="left" scene="contact">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Reveal className="rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <ContactForm />
        </Reveal>

        <Reveal delay={0.08} className="flex flex-col rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <h3 className="font-mono text-[0.7rem] tracking-widest text-subtle uppercase">{t("direct")}</h3>
          <ul className="mt-2 divide-y divide-border">
            <Row icon={<Mail />} label="Email">
              <a href={`mailto:${profile.email}`} className={`${link} break-all`}>
                {profile.email}
              </a>
            </Row>
            <Row icon={<Phone />} label={t("phone")}>
              <a href={`tel:${profile.phone.tel}`} className={link}>
                {profile.phone.display}
              </a>
            </Row>
            <Row icon={<BrandLogo logo={{ icon: "whatsapp" }} />} label={t("whatsapp")}>
              <ExternalLink href={profile.whatsapp} className={link}>
                wa.me/212616428880
              </ExternalLink>
            </Row>
            <Row icon={<BrandLogo logo={{ icon: "linkedin" }} />} label="LinkedIn">
              <ExternalLink href={profile.linkedin} className={link}>
                in/saad-sabir-idrissi
              </ExternalLink>
            </Row>
            <Row icon={<BrandLogo logo={{ icon: "github" }} />} label="GitHub">
              <ExternalLink href={profile.github} className={link}>
                {profile.githubUser}
              </ExternalLink>
            </Row>
            <Row icon={<MapPin />} label={t("location")}>
              {profile.location[locale]} · {profile.mobility[locale]}
            </Row>
          </ul>
          <CopyEmail />
          <a
            href="/api/vcard"
            download
            className="group mt-6 flex items-center gap-4 rounded-2xl border border-dashed border-border-strong p-4 transition-colors hover:border-accent/60 hover:bg-surface-2"
          >
            <ContactRound className="size-5 text-accent-fg" aria-hidden />
            <span>
              <span className="block text-sm font-medium text-fg">{t("addContact")}</span>
              <span className="block text-xs text-muted">{t("addContactHint")}</span>
            </span>
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
