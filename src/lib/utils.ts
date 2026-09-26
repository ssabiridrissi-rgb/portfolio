import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/i18n/routing";
import type { Localized } from "@/types/content";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Picks the right language from a bilingual content value. */
export function tr(value: Localized, locale: Locale): string {
  return value[locale];
}

/** Formats a `YYYY-MM` string as "févr. 2026" / "Feb 2026". */
export function formatMonth(ym: string, locale: Locale): string {
  const [year, month] = ym.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatPeriod(start: string, end: string | null, locale: Locale): string {
  const endLabel = end ? formatMonth(end, locale) : locale === "fr" ? "aujourd'hui" : "present";
  return `${formatMonth(start, locale)} — ${endLabel}`;
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://saad-sabir-idrissi.vercel.app").replace(/\/$/, "");
}
