import { setRequestLocale } from "next-intl/server";
import { About } from "@/components/sections/about";
import { Certifications } from "@/components/sections/certifications";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { GitHubActivity } from "@/components/sections/github-activity";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Stats } from "@/components/sections/stats";
import type { Locale } from "@/i18n/routing";
import { personJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD built from our own static content only.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <Stats />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <GitHubActivity />
      <Education />
      <Certifications />
      <Contact />
    </>
  );
}
