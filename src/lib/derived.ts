import { achievements, awards, leadership } from "@/content/achievements";
import { certifications, languages } from "@/content/certifications";
import { education } from "@/content/education";
import { experiences } from "@/content/experience";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import type { Locale } from "@/i18n/routing";
import type { MethodStep, SkillId } from "@/types/content";

/** Headline numbers, always computed from the content files. */
export function getStats() {
  const degrees = education.filter((e) => e.isDegree);
  return {
    experiences: experiences.length,
    projects: projects.length,
    certifications: certifications.length,
    awards: awards.length,
    leadership: leadership.length,
    languages: languages.length,
    degrees: degrees.length,
    degreeCountries: [...new Set(degrees.map((d) => d.country.code))],
  };
}

export type SkillUsage = {
  experiences: { id: string; company: string }[];
  projects: { slug: string }[];
  certifications: { id: string; issuer: string }[];
  achievements: { id: string; name: string }[];
};

/** Where each skill is actually used — drives the skills graph and its context labels. */
export function getSkillUsage(): Record<SkillId, SkillUsage> {
  const usage = Object.fromEntries(
    skills.map((s) => [s.id, { experiences: [], projects: [], certifications: [], achievements: [] } as SkillUsage]),
  ) as Record<SkillId, SkillUsage>;

  for (const exp of experiences) {
    for (const id of exp.skills) usage[id].experiences.push({ id: exp.id, company: exp.company });
  }
  for (const project of projects) {
    for (const id of project.skills) usage[id].projects.push({ slug: project.slug });
  }
  for (const cert of certifications) {
    for (const id of cert.skills) usage[id].certifications.push({ id: cert.id, issuer: cert.issuer });
  }
  // Achievements backed by a project are already counted through that project.
  for (const a of achievements.filter((x) => !x.projectSlug)) {
    for (const id of a.skills) usage[id].achievements.push({ id: a.id, name: a.name });
  }
  return usage;
}

export type Proof = { key: string; label: string; href?: string };

/**
 * Real places where a set of skills was used: experiences first, then projects —
 * the "where I did it" chips of the method section.
 */
export function getProofs(step: Pick<MethodStep, "skills" | "projects">, locale: Locale): Proof[] {
  const wanted = new Set(step.skills);
  const extraProjects = step.projects ?? [];
  const fromExperiences = experiences
    .filter((e) => e.skills.some((s) => wanted.has(s)))
    .map((e) => ({ key: `exp:${e.id}`, label: e.brand ? `${e.company} · ${e.brand}` : e.company, href: "#experience" }));
  const projectHits = projects.filter((p) => extraProjects.includes(p.slug) || p.skills.some((s) => wanted.has(s)));
  const fromProjects = projectHits.map((p) => ({
    key: `proj:${p.slug}`,
    label: p.title[locale],
    href: p.caseStudy ? `/projets/${p.slug}` : undefined,
  }));
  return [...fromExperiences, ...fromProjects];
}
