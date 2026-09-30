import type { MethodStep } from "@/types/content";

/**
 * "From raw data to a decision" — each stage lists the skills that prove it,
 * so the "where I did it" chips are computed from real experiences and projects.
 */
export const methodSteps: MethodStep[] = [
  {
    id: "sources",
    title: { fr: "Sources", en: "Sources" },
    body: {
      fr: "Exports Excel, historiques de ventes, bases opérationnelles\u00a0: la donnée arrive rarement propre. Je commence par comprendre d'où elle vient, à quel niveau de détail, et où elle est incomplète.",
      en: "Excel exports, sales history, operational databases: data rarely arrives clean. I start by understanding where it comes from, how detailed it is, and where it has gaps.",
    },
    skills: ["excel", "sql", "data-analysis"],
  },
  {
    id: "etl",
    title: { fr: "ETL", en: "ETL" },
    body: {
      fr: "J'automatise l'extraction, la transformation et le chargement avec Pentaho plutôt qu'à la main\u00a0: nettoyage, mise en forme, règles métier.",
      en: "I automate extraction, transformation and loading with Pentaho instead of doing it by hand: cleaning, reshaping, business rules.",
    },
    skills: ["etl-pentaho"],
  },
  {
    id: "warehouse",
    title: { fr: "Data warehouse", en: "Data warehouse" },
    body: {
      fr: "Je modélise un entrepôt en étoile sous PostgreSQL\u00a0: une table de faits au bon grain, entourée des dimensions qui répondent aux questions métier.",
      en: "I model a star-schema warehouse in PostgreSQL: a fact table at the right grain, surrounded by the dimensions that answer the business questions.",
    },
    skills: ["data-warehouse", "postgresql"],
  },
  {
    id: "dashboard",
    title: { fr: "Dashboards", en: "Dashboards" },
    body: {
      fr: "Power BI et ses mesures DAX, ou TIBCO Spotfire chez Renault\u00a0: des tableaux de bord construits autour de KPI qu'une direction lit d'un coup d'œil.",
      en: "Power BI with DAX measures, or TIBCO Spotfire at Renault: dashboards built around KPIs that managers can read at a glance.",
    },
    skills: ["power-bi", "dax", "spotfire"],
  },
  {
    id: "decision",
    title: { fr: "Décision", en: "Decision" },
    body: {
      fr: "Dernière étape\u00a0: aider à trancher. Recommandation multicritère explicable avec validation humaine, segmentation K-means, modèle hybride physique + IA.",
      en: "The last step: helping people decide. Explainable multi-criteria recommendations with human sign-off, K-means segmentation, a hybrid physics + AI model.",
    },
    // Not "llm": AutoLoc's assistant was written by a teammate.
    skills: ["machine-learning", "kmeans"],
    projects: ["procuretrace-ai"],
  },
];
