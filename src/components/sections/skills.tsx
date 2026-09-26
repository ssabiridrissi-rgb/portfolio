import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { SkillsGraph } from "./skills-graph";

export async function Skills() {
  const t = await getTranslations("skills");
  return (
    <Section id="skills" eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} glow="right">
      <SkillsGraph />
    </Section>
  );
}
