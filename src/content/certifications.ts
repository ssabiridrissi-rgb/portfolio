import type { Certification, Language } from "@/types/content";

// The NXP Cup lives in content/achievements.ts (it's a competition, not a certification).
export const certifications: Certification[] = [
  {
    id: "cisco-data-analytics",
    issuer: "Cisco",
    title: { fr: "Data Analytics Essentials", en: "Data Analytics Essentials" },
    logo: { icon: "cisco" },
    // TODO(saad): ajouter credentialUrl (lien Credly / Cisco NetAcad) pour afficher le bouton « Vérifier ».
    skills: ["data-analysis"],
  },
  {
    id: "alx-ai",
    issuer: "ALX",
    title: { fr: "AI Career Essentials", en: "AI Career Essentials" },
    logo: { monogram: "ALX" },
    skills: ["llm"],
  },
  {
    id: "aws-cloud",
    issuer: "AWS",
    title: { fr: "Certification Cloud", en: "Cloud certification" },
    logo: { monogram: "AWS", color: "#FF9900" },
    skills: ["aws"],
  },
  {
    id: "huawei-cloud",
    issuer: "Huawei",
    title: { fr: "Certification Cloud", en: "Cloud certification" },
    logo: { icon: "huawei" },
    skills: ["huawei-cloud"],
  },
];

export const languages: Language[] = [
  { name: { fr: "Arabe", en: "Arabic" }, level: { fr: "Langue maternelle", en: "Native" }, native: true },
  { name: { fr: "Français", en: "French" }, level: { fr: "Courant", en: "Fluent" } },
  { name: { fr: "Anglais", en: "English" }, level: { fr: "Intermédiaire avancé", en: "Upper-intermediate" }, cefr: "B2" },
];
