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
  /** Caption on the portrait projection. */
  coordinates: string;
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

export type DiagramId = "autoloc" | "aws-zabbix" | "bi-medical" | "dw-hotel" | "procuretrace" | "solarnav";

/** Interactive demo rendered on a case-study page. */
export type DemoId = "solar-orbit";

export type RepoLink = { name: string; href: string; summary: Localized };

export type Project = {
  slug: string;
  title: Localized;
  subtitle: Localized;
  categories: ProjectCategory[];
  /** Missing → the date is simply not shown (see the TODOs in content). */
  date?: YearMonth;
  status: ProjectStatus;
  featured: boolean;
  /** Honest framing: academic, team, lab exercise… */
  context: Localized;
  summary: Localized;
  highlights: Localized[];
  skills: SkillId[];
  /** Extra stack items that are not first-class skills (libraries, services). */
  extraStack?: string[];
  /** `size` unknown → shown as "team project" without a head count. */
  team?: { size?: number; role: Localized };
  links: { github?: string; demo?: string };
  /** For grouped cards (several small repos). */
  repos?: RepoLink[];
  diagram?: DiagramId;
  demo?: DemoId;
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

export type AchievementKind = "competition" | "hackathon" | "leadership";

/** Visual drawn at the top of an achievement card (components/distinctions). */
export type AchievementVisual = "nxp-track" | "solar-orbit" | "supplier-board" | "medallion";

/** Competitions, hackathons and student leadership. */
export type Achievement = {
  id: string;
  kind: AchievementKind;
  /** Event, project or organisation name. */
  name: string;
  /** Short framing: organiser, type of event or organisation. */
  context: Localized;
  /** One-line result or role, shown large on the card. */
  headline: Localized;
  role: Localized;
  /** Missing (or missing month) → not shown. */
  date?: { year: number; month?: number };
  /** Final ranking, only when there is one. */
  rank?: number;
  /** Omitted when it would only repeat the role. */
  summary?: Localized;
  highlights: Localized[];
  skills: SkillId[];
  /** Case study with the full story. */
  projectSlug?: string;
  visual: AchievementVisual;
  logo: Logo;
};

export type MethodStepId = "sources" | "etl" | "warehouse" | "dashboard" | "decision";

/** One stage of the "raw data → decision" method; `skills` drive the "where I did it" proof. */
export type MethodStep = {
  id: MethodStepId;
  title: Localized;
  body: Localized;
  skills: SkillId[];
  /** Extra project slugs that prove the step when their `skills` can't (stack still TODO). */
  projects?: string[];
};
