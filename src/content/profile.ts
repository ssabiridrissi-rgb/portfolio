import type { Profile } from "@/types/content";

export const profile: Profile = {
  name: "Saad Sabir Idrissi",
  initials: "SSI",
  title: {
    fr: "Élève Ingénieur Informatique — Data & Intelligence Artificielle",
    en: "Computer Engineering Student — Data & Artificial Intelligence",
  },
  shortTitle: {
    fr: "Élève Ingénieur Data & IA",
    en: "Data & AI Engineering Student",
  },
  roles: [
    { fr: "Data Analyst", en: "Data Analyst" },
    { fr: "BI Developer", en: "BI Developer" },
    { fr: "AI Engineer en devenir", en: "Aspiring AI Engineer" },
    { fr: "Cloud & DevOps enthusiast", en: "Cloud & DevOps enthusiast" },
  ],
  valueProposition: {
    fr: "Je transforme des données brutes en décisions : data warehouses, dashboards et IA explicable.",
    en: "I turn raw data into decisions: data warehouses, dashboards and explainable AI.",
  },
  githubBio: "Apprenti Ingénieur en génie informatique",
  about: [
    {
      fr: "Élève ingénieur en informatique à l'Université Mundiapolis (Casablanca), je prépare en parallèle une double diplomation en Big Data avec le Yiwu Industrial and Commercial College, en Chine.",
      en: "I'm a computer engineering student at Mundiapolis University in Casablanca, and I'm also working towards a double degree in Big Data with Yiwu Industrial and Commercial College in China.",
    },
    {
      fr: "Mon terrain de jeu : la donnée de bout en bout. Je modélise des entrepôts en étoile, j'alimente des pipelines ETL et je construis des tableaux de bord qui servent des décisions réelles, comme chez Renault (Dacia) sous TIBCO Spotfire ou chez Breakline sous Power BI.",
      en: "I work with data from end to end. I design star-schema warehouses, build ETL pipelines and create dashboards that people use to make real decisions: in TIBCO Spotfire at Renault (Dacia) and in Power BI at Breakline.",
    },
    {
      fr: "Je m'oriente vers l'IA appliquée et l'aide à la décision explicable, avec un socle solide en cloud (AWS, Docker) et en développement (Java/Spring, Python).",
      en: "I'm moving towards applied AI and explainable decision support, with a solid grounding in cloud (AWS, Docker) and software development (Java/Spring, Python).",
    },
  ],
  email: "saadsabiridrissi@gmail.com",
  phone: { display: "+212 6 16 42 88 80", tel: "+212616428880" },
  whatsapp: "https://wa.me/212616428880",
  linkedin: "https://www.linkedin.com/in/saad-sabir-idrissi",
  github: "https://github.com/ssabiridrissi-rgb",
  githubUser: "ssabiridrissi-rgb",
  location: { fr: "Casablanca, Maroc", en: "Casablanca, Morocco" },
  // TODO(saad): préciser si tu es aussi ouvert à l'international.
  mobility: { fr: "Mobilité nationale", en: "Open to relocate within Morocco" },
  drivingLicense: { fr: "Permis B", en: "Driving licence (B)" },
  cvs: [
    {
      href: "/cv/Saad_Sabir_Idrissi_CV_Data_BI.pdf",
      label: { fr: "CV Data & BI", en: "Data & BI résumé" },
      description: {
        fr: "Data warehouses, ETL, Power BI, Spotfire",
        en: "Data warehouses, ETL, Power BI, Spotfire",
      },
    },
    {
      href: "/cv/Saad_Sabir_Idrissi_CV_IA.pdf",
      label: { fr: "CV IA & Aide à la décision", en: "AI & Decision support résumé" },
      description: {
        fr: "IA explicable, recommandation, ML",
        en: "Explainable AI, recommendation, ML",
      },
    },
  ],
  availability: {
    headline: {
      fr: "Disponible pour un stage PFE — dès février 2027",
      en: "Available for a final-year internship — from Feb 2027",
    },
    type: {
      fr: "Stage de fin d'études (PFE)",
      en: "Final-year engineering internship (PFE)",
    },
    domains: [
      { fr: "Data Science", en: "Data Science" },
      { fr: "Data Engineering", en: "Data Engineering" },
      { fr: "Business Intelligence", en: "Business Intelligence" },
      { fr: "IA appliquée", en: "Applied AI" },
    ],
    period: { fr: "À partir de février 2027", en: "From February 2027" },
    // TODO(saad): [À CONFIRMER] durée exacte du PFE.
    duration: { fr: "4 à 6 mois", en: "4 to 6 months" },
  },
  strengths: [
    {
      id: "data",
      title: { fr: "Data & BI", en: "Data & BI" },
      body: {
        fr: "Modélisation en étoile, pipelines ETL et dashboards orientés KPI, déjà utilisés en entreprise.",
        en: "Star-schema modelling, ETL pipelines and KPI dashboards, already used in real companies.",
      },
      skills: ["data-warehouse", "etl-pentaho", "power-bi", "spotfire"],
    },
    {
      id: "ai",
      title: { fr: "IA appliquée", en: "Applied AI" },
      body: {
        fr: "Clustering, recommandation multicritère explicable et intégration de LLM dans des applications.",
        en: "Clustering, explainable multi-criteria recommendation and LLMs built into applications.",
      },
      skills: ["machine-learning", "kmeans", "llm", "python"],
    },
    {
      id: "cloud",
      title: { fr: "Cloud & DevOps", en: "Cloud & DevOps" },
      body: {
        fr: "Réseau AWS, supervision conteneurisée avec Zabbix et Docker Compose, workflow Git en équipe.",
        en: "AWS networking, containerised monitoring with Zabbix and Docker Compose, team Git workflow.",
      },
      skills: ["aws", "docker", "zabbix", "git"],
    },
  ],
  tldr: [
    {
      fr: "Élève ingénieur Data & IA, double diplôme Maroc / Chine (Big Data).",
      en: "Data & AI engineering student, double degree Morocco / China (Big Data).",
    },
    {
      fr: "2 expériences data en entreprise : Renault (Dacia) et Breakline Franchise.",
      en: "2 data roles in industry: Renault (Dacia) and Breakline Franchise.",
    },
    {
      fr: "Stack : SQL, PostgreSQL, Pentaho, Power BI, Spotfire, Python, AWS, Docker.",
      en: "Stack: SQL, PostgreSQL, Pentaho, Power BI, Spotfire, Python, AWS, Docker.",
    },
    {
      fr: "Recherche un stage PFE en Data, BI ou IA appliquée — mobilité nationale.",
      en: "Looking for a final-year internship in Data, BI or applied AI, anywhere in Morocco.",
    },
  ],
};
