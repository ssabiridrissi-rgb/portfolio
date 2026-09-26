/** Home page section ids, in page order. Keys match `nav.*` messages. */
export const SECTIONS = [
  "about",
  "experience",
  "projects",
  "skills",
  "github",
  "education",
  "certifications",
  "contact",
] as const;

export type SectionId = (typeof SECTIONS)[number];

/** The subset shown in the desktop navbar. */
export const PRIMARY_SECTIONS: SectionId[] = ["about", "experience", "projects", "skills", "contact"];
