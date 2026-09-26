import type { MetadataRoute } from "next";
import { caseStudyProjects } from "@/content/projects";
import { routing } from "@/i18n/routing";
import { localizedUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    { path: "/", priority: 1, changeFrequency: "monthly" as const },
    { path: "/recruteur", priority: 0.6, changeFrequency: "monthly" as const },
    ...caseStudyProjects.map((p) => ({ path: `/projets/${p.slug}`, priority: 0.8, changeFrequency: "monthly" as const })),
  ];

  return paths.flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, path)])),
      },
    })),
  );
}
