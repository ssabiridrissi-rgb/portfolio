import type { Experience } from "@/types/content";

/** Reverse chronological order (most recent first). */
export const experiences: Experience[] = [
  {
    id: "wafa-ima",
    company: "Wafa IMA Assistance",
    logo: { monogram: "WI", color: "#E30613" },
    role: { fr: "Chargé d'assistance clients", en: "Customer assistance officer" },
    kind: "work",
    location: "Casablanca",
    start: "2026-06",
    end: "2026-08",
    isData: false,
    bullets: [
      {
        fr: "Assistance aux clients en cas de panne ou d'accident et traitement des demandes de véhicule de remplacement.",
        en: "Helped customers after breakdowns or accidents and handled their requests for replacement vehicles.",
      },
    ],
    skills: [],
  },
  {
    id: "renault",
    company: "Renault",
    brand: "Dacia",
    logo: { icon: "renault" },
    role: {
      fr: "Alternance — Analyse de données commerciales",
      en: "Work-study — Sales data analysis",
    },
    kind: "apprenticeship",
    location: "Casablanca",
    start: "2026-02",
    end: "2026-06",
    isData: true,
    bullets: [
      {
        fr: "Développement de tableaux de bord TIBCO Spotfire pour suivre les KPI de l'activité commerciale Dacia.",
        en: "Built TIBCO Spotfire dashboards to track the KPIs of Dacia's sales activity.",
      },
      {
        fr: "Exploitation et analyse de l'historique des ventes pour mettre en évidence les tendances de performance.",
        en: "Analysed historical sales data to bring out performance trends.",
      },
      {
        fr: "Collaboration avec l'équipe marketing digital pour appuyer ses analyses avec des données de vente.",
        en: "Worked with the digital marketing team to support their analyses with sales data.",
      },
    ],
    skills: ["spotfire", "sql", "data-analysis"],
  },
  {
    id: "breakline",
    company: "Breakline Franchise",
    logo: { monogram: "BF" },
    role: { fr: "Stage — Analyse de données de ventes", en: "Internship — Sales data analysis" },
    kind: "internship",
    location: "Casablanca",
    start: "2025-07",
    end: "2025-08",
    isData: true,
    bullets: [
      {
        fr: "Analyse des ventes d'une marque de design d'intérieur au Maroc par modèle et identification des best-sellers.",
        en: "Analysed an interior-design brand's sales in Morocco by model and identified its best-sellers.",
      },
      {
        fr: "Conception de tableaux de bord Power BI pour visualiser et suivre les volumes de ventes.",
        en: "Designed Power BI dashboards to visualise and monitor sales volumes.",
      },
    ],
    skills: ["power-bi", "excel", "data-analysis"],
  },
  {
    id: "allianz",
    company: "Allianz Assurance",
    logo: { monogram: "AZ", color: "#003781" },
    role: {
      fr: "Stage d'observation — Département informatique",
      en: "Observation internship — IT department",
    },
    kind: "observation",
    location: "Casablanca",
    start: "2023-07",
    end: "2023-08",
    isData: false,
    bullets: [
      {
        fr: "Observation des activités, processus et outils informatiques du secteur de l'assurance.",
        en: "Observed the IT activities, processes and tools used in the insurance sector.",
      },
    ],
    skills: [],
  },
];
