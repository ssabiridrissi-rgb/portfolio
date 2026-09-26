import type { Localized, Skill, SkillCategory } from "@/types/content";

export const skillCategories: SkillCategory[] = [
  { id: "data-ai", label: { fr: "Data & IA", en: "Data & AI" } },
  { id: "bi-db", label: { fr: "BI & Bases de données", en: "BI & Databases" } },
  { id: "cloud-devops", label: { fr: "Cloud & DevOps", en: "Cloud & DevOps" } },
  { id: "dev", label: { fr: "Développement", en: "Software development" } },
  { id: "design", label: { fr: "Conception", en: "Modelling" } },
  { id: "embedded", label: { fr: "Embarqué", en: "Embedded" } },
];

export const skills: Skill[] = [
  // Data & IA
  { id: "python", name: "Python", category: "data-ai", logo: { icon: "python" } },
  { id: "numpy", name: "NumPy", category: "data-ai", logo: { icon: "numpy" } },
  { id: "machine-learning", name: "Machine Learning", category: "data-ai", logo: { icon: "scikitlearn" } },
  { id: "data-mining", name: "Data Mining", category: "data-ai", logo: { monogram: "DM" } },
  { id: "data-analysis", name: "Data Analysis", category: "data-ai", logo: { icon: "jupyter" } },
  { id: "kmeans", name: "K-means", category: "data-ai", logo: { monogram: "K" } },
  { id: "llm", name: "LLM (Groq · Llama 3.3)", category: "data-ai", logo: { monogram: "AI" } },

  // BI & bases de données
  { id: "sql", name: "SQL", category: "bi-db", logo: { monogram: "SQL" } },
  { id: "postgresql", name: "PostgreSQL", category: "bi-db", logo: { icon: "postgresql" } },
  { id: "data-warehouse", name: "Data Warehouse (étoile)", category: "bi-db", logo: { monogram: "DW" } },
  { id: "etl-pentaho", name: "ETL (Pentaho)", category: "bi-db", logo: { monogram: "ETL" } },
  { id: "power-bi", name: "Power BI", category: "bi-db", logo: { monogram: "BI", color: "#F2C811" } },
  { id: "dax", name: "DAX", category: "bi-db", logo: { monogram: "DAX" } },
  { id: "spotfire", name: "TIBCO Spotfire", category: "bi-db", logo: { monogram: "SF" } },
  { id: "excel", name: "Excel", category: "bi-db", logo: { monogram: "XL", color: "#21A366" } },

  // Cloud & DevOps
  { id: "aws", name: "AWS (EC2, VPC)", category: "cloud-devops", logo: { monogram: "AWS", color: "#FF9900" } },
  { id: "huawei-cloud", name: "Huawei Cloud", category: "cloud-devops", logo: { icon: "huawei" } },
  { id: "docker", name: "Docker", category: "cloud-devops", logo: { icon: "docker" } },
  { id: "docker-compose", name: "Docker Compose", category: "cloud-devops", logo: { icon: "docker" } },
  { id: "linux", name: "Linux", category: "cloud-devops", logo: { icon: "linux" } },
  { id: "zabbix", name: "Zabbix", category: "cloud-devops", logo: { monogram: "Z", color: "#D40000" } },
  { id: "sonarcloud", name: "SonarCloud", category: "cloud-devops", logo: { icon: "sonarqubecloud" } },
  { id: "git", name: "Git & GitHub", category: "cloud-devops", logo: { icon: "git" } },

  // Développement
  { id: "java", name: "Java", category: "dev", logo: { icon: "openjdk" } },
  { id: "spring-boot", name: "Spring Boot", category: "dev", logo: { icon: "springboot" } },
  { id: "flask", name: "Python / Flask", category: "dev", logo: { icon: "flask" } },
  { id: "c", name: "C", category: "dev", logo: { icon: "c" } },
  { id: "flutter", name: "Dart / Flutter", category: "dev", logo: { icon: "flutter" } },
  { id: "angular", name: "TypeScript / Angular", category: "dev", logo: { icon: "angular" } },
  { id: "html-css-js", name: "HTML5 · CSS3 · JavaScript", category: "dev", logo: { icon: "javascript" } },

  // Conception
  { id: "uml", name: "UML", category: "design", logo: { icon: "uml" } },
  { id: "merise", name: "Merise (MCD)", category: "design", logo: { monogram: "MCD" } },

  // Embarqué
  { id: "arduino", name: "Arduino (NXP Cup)", category: "embedded", logo: { icon: "arduino" } },
];

export const qualities: Localized[] = [
  { fr: "Flexibilité", en: "Flexibility" },
  { fr: "Adaptabilité", en: "Adaptability" },
  { fr: "Curiosité", en: "Curiosity" },
];

export function getSkill(id: Skill["id"]): Skill {
  const skill = skills.find((s) => s.id === id);
  if (!skill) throw new Error(`Unknown skill: ${id}`);
  return skill;
}
