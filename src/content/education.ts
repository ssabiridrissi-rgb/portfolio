import type { Education } from "@/types/content";

export const education: Education[] = [
  {
    id: "yiwu",
    school: "Yiwu Industrial and Commercial College",
    country: { code: "CN", label: { fr: "Chine", en: "China" } },
    degree: { fr: "Double diplomation en Big Data", en: "Double degree in Big Data" },
    start: "2025-10",
    end: "2028-09",
    ongoing: true,
    isDegree: true,
    highlight: { fr: "Parcours international", en: "International track" },
    logo: { monogram: "YW" },
  },
  {
    id: "mundiapolis-engineering",
    school: "Université Mundiapolis",
    country: { code: "MA", label: { fr: "Maroc", en: "Morocco" } },
    degree: { fr: "Diplôme d'ingénieur en informatique", en: "Engineering degree in Computer Science" },
    start: "2024-09",
    end: "2027-09",
    ongoing: true,
    isDegree: true,
    logo: { monogram: "UM" },
  },
  {
    id: "mundiapolis-prepa",
    school: "Université Mundiapolis",
    country: { code: "MA", label: { fr: "Maroc", en: "Morocco" } },
    degree: { fr: "Cycle préparatoire intégré", en: "Integrated preparatory cycle" },
    start: "2022-09",
    end: "2024-06",
    ongoing: false,
    isDegree: false,
    logo: { monogram: "UM" },
  },
];
