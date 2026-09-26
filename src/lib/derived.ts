import { certifications, languages } from "@/content/certifications";
import { education } from "@/content/education";
import { experiences } from "@/content/experience";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import type { SkillId } from "@/types/content";

/** Headline numbers, always computed from the content files. */
export function getStats() {
  const degrees = education.filter((e) => e.isDegree);
  return {
    experiences: experiences.length,
    projects: projects.length,
    certifications: certifications.length,
    languages: languages.length,
    degrees: degrees.length,
    degreeCountries: [...new Set(degrees.map((d) => d.country.code))],
  };
}

export type SkillUsage = {
  experiences: { id: string; company: string }[];
  projects: { slug: string }[];
  certifications: { id: string; issuer: string }[];
};

/** Where each skill is actually used — drives the skills graph and its context labels. */
export function getSkillUsage(): Record<SkillId, SkillUsage> {
  const usage = Object.fromEntries(
    skills.map((s) => [s.id, { experiences: [], projects: [], certifications: [] } as SkillUsage]),
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
  return usage;
}
