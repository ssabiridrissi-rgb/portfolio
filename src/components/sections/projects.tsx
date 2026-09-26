import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/ui/external-link";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { profile } from "@/content/profile";
import { ProjectsExplorer } from "./projects-explorer";

export async function Projects() {
  const t = await getTranslations("projects");

  return (
    <Section id="projects" eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} glow="left">
      <ProjectsExplorer />
      <Reveal className="mt-14 flex justify-center">
        <Button asChild variant="secondary" size="lg">
          <ExternalLink href={profile.github}>
            <BrandLogo logo={{ icon: "github" }} />
            {t("exploreGithub")}
            <ArrowRight className="transition-transform duration-300 group-hover/button:translate-x-0.5" />
          </ExternalLink>
        </Button>
      </Reveal>
    </Section>
  );
}
