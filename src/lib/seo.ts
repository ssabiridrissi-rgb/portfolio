import type { Metadata } from "next";
import { certifications } from "@/content/certifications";
import { education } from "@/content/education";
import { profile } from "@/content/profile";
import { skills } from "@/content/skills";
import { routing, type Locale } from "@/i18n/routing";
import { siteUrl } from "./utils";

const OG_LOCALE: Record<Locale, string> = { fr: "fr_FR", en: "en_US" };

/** `path` is locale-less and starts with "/" (e.g. "/" or "/projets/autoloc-ia"). */
export function localizedUrl(locale: Locale, path: string) {
  const clean = path === "/" ? "" : path;
  return `${siteUrl()}/${locale}${clean}`;
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  ogTitle,
  ogSubtitle,
  type = "website",
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogSubtitle?: string;
  type?: "website" | "article" | "profile";
}): Metadata {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, path)]));
  const og = new URLSearchParams({ locale });
  if (ogTitle) og.set("title", ogTitle);
  if (ogSubtitle) og.set("subtitle", ogSubtitle);
  const ogImage = `${siteUrl()}/api/og?${og.toString()}`;

  return {
    metadataBase: new URL(siteUrl()),
    title,
    description,
    alternates: {
      canonical: localizedUrl(locale, path),
      languages: { ...languages, "x-default": localizedUrl(routing.defaultLocale, path) },
    },
    openGraph: {
      type,
      url: localizedUrl(locale, path),
      title,
      description,
      siteName: profile.name,
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** schema.org Person — rendered as JSON-LD on the home page. */
export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: localizedUrl(locale, "/"),
    image: `${siteUrl()}/images/saad-portrait.jpg`,
    jobTitle: profile.title[locale],
    description: profile.valueProposition[locale],
    email: `mailto:${profile.email}`,
    telephone: profile.phone.tel,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Casablanca",
      addressCountry: "MA",
    },
    sameAs: [profile.github, profile.linkedin],
    alumniOf: education
      .filter((e) => e.isDegree)
      .map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
    knowsAbout: skills.map((s) => s.name),
    knowsLanguage: ["ar", "fr", "en"],
    hasCredential: certifications
      .filter((c) => c.kind === "certification")
      .map((c) => ({
        "@type": "EducationalOccupationalCredential",
        name: `${c.issuer} — ${c.title[locale]}`,
        credentialCategory: "certification",
      })),
  };
}
