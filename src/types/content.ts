import type { BrandIconKey } from "@/lib/brand-icons";

/** Any user-facing text that must exist in both languages. */
export type Localized = { fr: string; en: string };

/** `YYYY-MM` */
export type YearMonth = `${number}-${number}`;

/** Either a simple-icons brand key, or a short monogram rendered as a badge. */
export type Logo = { icon: BrandIconKey } | { monogram: string; color?: string };

export type CvLink = { href: string; label: Localized; description: Localized };

export type Profile = {
  name: string;
  initials: string;
  title: Localized;
  shortTitle: Localized;
  roles: Localized[];
  valueProposition: Localized;
  githubBio: string;
  about: Localized[];
  email: string;
  phone: { display: string; tel: string };
  whatsapp: string;
  linkedin: string;
  github: string;
  githubUser: string;
  location: Localized;
  mobility: Localized;
  drivingLicense: Localized;
  cvs: CvLink[];
  availability: {
    headline: Localized;
    type: Localized;
    domains: Localized[];
    period: Localized;
    duration: Localized;
  };
  strengths: { id: "data" | "ai" | "cloud"; title: Localized; body: Localized; skills: SkillId[] }[];
  tldr: Localized[];
};

export type SkillCategoryId = "data-ai" | "bi-db" | "cloud-devops" | "dev" | "design" | "embedded";

export type SkillId =
  | "python"
  | "numpy"
  | "machine-learning"
  | "data-mining"
  | "data-analysis"
  | "kmeans"
  | "llm"
  | "sql"
  | "postgresql"
  | "data-warehouse"
  | "etl-pentaho"
  | "power-bi"
  | "dax"
  | "spotfire"
  | "excel"
  | "aws"
  | "huawei-cloud"
  | "docker"
  | "docker-compose"
  | "linux"
  | "zabbix"
  | "sonarcloud"
  | "git"
  | "java"
  | "spring-boot"
  | "flask"
  | "c"
  | "flutter"
  | "angular"
  | "html-css-js"
  | "uml"
  | "merise"
  | "arduino";

export type Skill = {
  id: SkillId;
  name: string;
  category: SkillCategoryId;
  logo?: Logo;
};

export type SkillCategory = {
  id: SkillCategoryId;
  label: Localized;
};

export type ExperienceKind = "work" | "apprenticeship" | "internship" | "observation";

export type Experience = {
  id: string;
  company: string;
  brand?: string;
  logo: Logo;
  role: Localized;
  kind: ExperienceKind;
  location: string;
  start: YearMonth;
  end: YearMonth;
  isData: boolean;
  bullets: Localized[];
  skills: SkillId[];
};

export type ProjectCategory = "data-bi" | "ai" | "cloud-devops" | "web-backend" | "mobile";

export type ProjectStatus = "done" | "in-progress";

export type DiagramId = "autoloc" | "aws-zabbix" | "bi-medical" | "dw-hotel" | "procuretrace";

export type RepoLink = { name: string; href: string; summary: Localized };

export type Project = {
  slug: string;
  title: Localized;
  subtitle: Localized;
  categories: ProjectCategory[];
  date: YearMonth;
  status: ProjectStatus;
  featured: boolean;
  /** Honest framing: academic, team, lab exercise… */
  context: Localized;
  summary: Localized;
  highlights: Localized[];
  skills: SkillId[];
  /** Extra stack items that are not first-class skills (libraries, services). */
  extraStack?: string[];
  team?: { size: number; role: Localized };
  links: { github?: string; demo?: string };
  /** For grouped cards (several small repos). */
  repos?: RepoLink[];
  diagram?: DiagramId;
  caseStudy?: CaseStudy;
};

export type CaseStudy = {
  context: Localized;
  problem: Localized;
  approach: Localized[];
  architecture: Localized;
  results: Localized[];
  learned: Localized[];
};

export type Education = {
  id: string;
  school: string;
  country: { code: "MA" | "CN"; label: Localized };
  degree: Localized;
  start: YearMonth;
  end: YearMonth;
  ongoing: boolean;
  /** Counts as a degree (vs. a preparatory cycle). */
  isDegree: boolean;
  highlight?: Localized;
  logo: Logo;
};

export type Certification = {
  id: string;
  issuer: string;
  title: Localized;
  kind: "certification" | "competition";
  logo: Logo;
  credentialUrl?: string;
  skills: SkillId[];
};

export type Language = {
  name: Localized;
  level: Localized;
  /** CEFR label when one is known — never invented. */
  cefr?: string;
  native?: boolean;
};
