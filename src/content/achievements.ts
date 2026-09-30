import type { Achievement } from "@/types/content";

/**
 * Competitions, hackathons and student leadership — in display order.
 * Only what Saad has confirmed; everything else is a TODO(saad) and stays off the screen.
 */
export const achievements: Achievement[] = [
  {
    id: "nxp-cup-2025",
    kind: "competition",
    name: "NXP Cup 2025",
    context: { fr: "Compétition de voitures autonomes", en: "Autonomous car competition" },
    headline: { fr: "3ᵉ place", en: "3rd place" },
    // TODO(saad): préciser ton rôle dans l'équipe (vision, contrôle moteur, intégration…).
    role: { fr: "En équipe", en: "Team member" },
    // TODO(saad): mois de la finale.
    date: { year: 2025 },
    rank: 3,
    summary: {
      fr: "Une voiture miniature qui doit suivre la piste toute seule, le plus vite possible, sans jamais en sortir. En équipe, face à des écoles d'ingénieurs de tout le pays, nous décrochons la 3ᵉ place.",
      en: "A small car that has to follow the track on its own, as fast as possible, without ever leaving it. As a team, up against engineering schools from across the country, we took 3rd place.",
    },
    highlights: [],
    skills: ["arduino"],
    visual: "nxp-track",
    logo: { icon: "nxp" },
  },
  {
    id: "solarnav-ai",
    kind: "hackathon",
    name: "SolarNav AI",
    context: { fr: "Hackathon GoMyCode", en: "GoMyCode hackathon" },
    headline: { fr: "Responsable data", en: "Data lead" },
    role: { fr: "Responsable de la partie data de l'équipe", en: "Data lead of the team" },
    // TODO(saad): date du hackathon (et classement éventuel).
    summary: {
      fr: "Des panneaux solaires qui suivent le soleil\u00a0: un bras robotisé les oriente, un modèle d'IA hybride calcule le meilleur angle. J'ai construit les 40\u202f000 exemples sur lesquels il apprend.",
      en: "Solar panels that follow the sun: a robotic arm turns them and a hybrid AI model works out the best angle. I built the 40,000 examples it learns from.",
    },
    highlights: [
      {
        fr: "60\u00a0% d'orbites réelles (ISS, Hubble, NOAA-19), 40\u00a0% de scénarios simulés",
        en: "60% real orbits (ISS, Hubble, NOAA-19), 40% simulated scenarios",
      },
      {
        fr: "Modèle hybride\u00a0: 99\u00a0% des prédictions à ±2°, contre 92\u00a0% sans la physique",
        en: "Hybrid model: 99% of predictions within ±2°, versus 92% without the physics",
      },
    ],
    skills: ["python", "machine-learning", "data-analysis"],
    projectSlug: "solarnav-ai",
    visual: "solar-orbit",
    logo: { monogram: "GMC" },
  },
  {
    id: "casablanca-ai-lab",
    kind: "hackathon",
    name: "Casablanca AI Lab",
    context: { fr: "Hackathon · secteur automobile", en: "Hackathon · automotive" },
    headline: { fr: "Dashboard achats", en: "Procurement dashboard" },
    // TODO(saad): projet solo ou en équipe ? Lien éventuel avec ProcureTrace AI ?
    role: { fr: "Conception du dashboard", en: "Dashboard design" },
    date: { year: 2026, month: 9 },
    summary: {
      fr: "Un dashboard interactif qui compare les fournisseurs de pièces automobiles et fait ressortir, pièce par pièce, l'offre au meilleur prix.",
      en: "An interactive dashboard that compares automotive parts suppliers and picks out, part by part, the best-priced offer.",
    },
    highlights: [],
    // TODO(saad): outil utilisé pour le dashboard (Power BI ? Streamlit ?) et résultat du hackathon.
    skills: [],
    visual: "supplier-board",
    logo: { monogram: "AI" },
  },
  {
    id: "gentech",
    kind: "leadership",
    name: "GenTech",
    // TODO(saad): confirmer « club d'ingénierie » et ajouter la date de création.
    context: { fr: "Club d'ingénierie · Université Mundiapolis", en: "Engineering club · Mundiapolis University" },
    headline: { fr: "Membre fondateur", en: "Founding member" },
    // TODO(saad): si tu diriges le pôle, remplacer « Chargé » par « Responsable ».
    role: { fr: "Membre fondateur · Chargé des ressources humaines", en: "Founding member · HR officer" },
    // TODO(saad): une phrase d'actions concrètes (événements organisés, recrutement de membres…) → `summary`.
    highlights: [],
    skills: [],
    visual: "medallion",
    logo: { monogram: "GT" },
  },
  {
    id: "legends",
    kind: "leadership",
    name: "Legends",
    // TODO(saad): type d'association et école/ville.
    context: { fr: "Association", en: "Association" },
    headline: { fr: "Ressources humaines", en: "Human resources" },
    role: { fr: "Chargé des ressources humaines", en: "HR officer" },
    // TODO(saad): période et une phrase d'actions concrètes → `date` et `summary`.
    highlights: [],
    skills: [],
    visual: "medallion",
    logo: { monogram: "LG" },
  },
];

/** Competitions and hackathons (leadership roles are counted separately). */
export const awards = achievements.filter((a) => a.kind !== "leadership");
export const leadership = achievements.filter((a) => a.kind === "leadership");
