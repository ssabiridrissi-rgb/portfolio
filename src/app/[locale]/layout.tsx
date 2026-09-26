import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CommandPaletteLoader } from "@/components/command/command-palette-loader";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/components/providers/providers";
import { RevealObserver } from "@/components/providers/reveal-observer";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { buildMetadata } from "@/lib/seo";
import "../globals.css";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    ...buildMetadata({ locale, path: "/", title: t("title"), description: t("description"), type: "profile" }),
    applicationName: "Saad Sabir Idrissi — Portfolio",
    authors: [{ name: "Saad Sabir Idrissi", url: "https://github.com/ssabiridrissi-rgb" }],
    creator: "Saad Sabir Idrissi",
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07090f" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
  colorScheme: "dark light",
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <html lang={locale} className={`dark ${fontVariables}`} suppressHydrationWarning>
      <head>
        {/* Scroll-reveal styles only apply when JS runs, so content is never hidden without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body id="top" className="grain min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-gradient-button px-4 py-2 text-sm font-medium text-accent-contrast focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t("skip")}
        </a>
        <NextIntlClientProvider>
          <Providers>
            <Navbar />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
            <CommandPaletteLoader />
            <CustomCursor />
            <RevealObserver />
          </Providers>
        </NextIntlClientProvider>
        {/* Analytics scripts only exist on Vercel deployments. */}
        {process.env.VERCEL ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
