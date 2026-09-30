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
import { LightsOff } from "@/components/layout/lights-off";
import { Navbar } from "@/components/layout/navbar";
import { MagneticTracker } from "@/components/providers/magnetic-tracker";
import { Providers } from "@/components/providers/providers";
import { RevealObserver } from "@/components/providers/reveal-observer";
import { SectionSizeWarmup } from "@/components/providers/section-size-warmup";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { UniverseLoader } from "@/components/universe/universe-loader";
import { profile } from "@/content/profile";
import { routing } from "@/i18n/routing";
import { OPENING_KEY } from "@/lib/events";
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
    { media: "(prefers-color-scheme: dark)", color: "#070606" },
    { media: "(prefers-color-scheme: light)", color: "#f5f4f2" },
  ],
  colorScheme: "dark light",
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });
  // Before the first paint: scroll reveals only apply when JS runs, and the opening title sequence plays on
  // the home page once per tab — never on a deep link or with reduced motion. A timer ends it if React never runs.
  const homes = JSON.stringify(routing.locales.map((l) => `/${l}`));
  const bootScript = [
    "var d=document.documentElement;d.classList.add('js');",
    "try{var p=location.pathname;if(p.length>1&&p.charAt(p.length-1)==='/')p=p.slice(0,-1);",
    `if(${homes}.indexOf(p)>-1&&!location.hash&&!sessionStorage.getItem('${OPENING_KEY}')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){`,
    `d.dataset.intro='play';sessionStorage.setItem('${OPENING_KEY}','1');`,
    "setTimeout(function(){if(d.dataset.intro!=='done')d.dataset.intro='done'},6000)}}catch(e){}",
  ].join("");

  return (
    <html lang={locale} className={`dark ${fontVariables}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
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
            {/* Fixed WebGL particle universe behind the whole site, started once the page is idle. */}
            <UniverseLoader name={profile.name.split(" ")[0]} />
            <Navbar />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
            <CommandPaletteLoader />
            <CustomCursor />
            <LightsOff />
            <RevealObserver />
            <MagneticTracker />
            <SectionSizeWarmup />
            <SmoothScroll />
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
