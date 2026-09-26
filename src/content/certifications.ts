import type { Certification, Language } from "@/types/content";

export const certifications: Certification[] = [
  {
    id: "cisco-data-analytics",
    issuer: "Cisco",
    title: { fr: "Data Analytics Essentials", en: "Data Analytics Essentials" },
    kind: "certification",
    logo: { icon: "cisco" },
    // TODO(saad): ajouter credentialUrl (lien Credly / Cisco NetAcad) pour afficher le bouton « Vérifier ».
    skills: ["data-analysis"],
  },
  {
    id: "alx-ai",
    issuer: "ALX",
    title: { fr: "AI Career Essentials", en: "AI Career Essentials" },
    kind: "certification",
    logo: { monogram: "ALX" },
    skills: ["llm"],
  },
  {
    id: "aws-cloud",
    issuer: "AWS",
    // TODO(saad): [À CONFIRMER] intitulé exact (ex. « AWS Certified Cloud Practitioner »).
    title: { fr: "Certification Cloud", en: "Cloud certification" },
    kind: "certification",
    logo: { monogram: "AWS", color: "#FF9900" },
    skills: ["aws"],
  },
  {
    id: "huawei-cloud",
    issuer: "Huawei",
    // TODO(saad): [À CONFIRMER] intitulé exact (ex. « HCIA-Cloud Service »).
    title: { fr: "Certification Cloud", en: "Cloud certification" },
    kind: "certification",
    logo: { icon: "huawei" },
    skills: ["huawei-cloud"],
  },
  {
    id: "nxp-cup",
    issuer: "NXP Cup",
    title: { fr: "Intelligent Car Racing — compétition", en: "Intelligent Car Racing — competition" },
    kind: "competition",
    logo: { icon: "nxp" },
    skills: ["arduino"],
  },
];

export const languages: Language[] = [
  { name: { fr: "Arabe", en: "Arabic" }, level: { fr: "Langue maternelle", en: "Native" }, native: true },
  { name: { fr: "Français", en: "French" }, level: { fr: "Courant", en: "Fluent" } },
  { name: { fr: "Anglais", en: "English" }, level: { fr: "Intermédiaire avancé", en: "Upper-intermediate" }, cefr: "B2" },
];
