import type { Locale } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Stats />
      <About />
    </>
  );
}
