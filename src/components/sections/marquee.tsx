import { getLocale, getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { profile } from "@/content/profile";
import { getSkill } from "@/content/skills";
import { cn } from "@/lib/utils";
import type { SkillId } from "@/types/content";
import { MarqueeSkew } from "./marquee-skew";

/** The tools shown in the second row — names come from the skills content. */
const TOOLS: SkillId[] = ["power-bi", "spotfire", "postgresql", "etl-pentaho", "python", "machine-learning", "aws", "docker"];

function Row({ items, reverse = false, big = false, duration }: { items: string[]; reverse?: boolean; big?: boolean; duration: string }) {
  return (
    <div className="marquee" data-reverse={reverse ? "" : undefined} style={{ "--marquee-duration": duration } as CSSProperties}>
      {[0, 1].map((copy) => (
        <ul key={copy} className="marquee-track" aria-hidden={copy === 1 ? true : undefined}>
          {items.map((item, i) => (
            <li key={`${item}-${i}`} className="marquee-item flex items-center">
              <span
                className={cn(
                  "font-display whitespace-nowrap",
                  big
                    ? cn("text-[clamp(3.2rem,9vw,7.6rem)] leading-none font-extrabold uppercase", i % 2 ? "text-fg" : "text-outline")
                    : "font-sans text-[clamp(1.2rem,2.8vw,2.1rem)] font-medium tracking-tight text-subtle",
                )}
              >
                {item}
              </span>
              {big ? (
                <span aria-hidden className="mx-6 font-display text-[clamp(2.6rem,7vw,6rem)] leading-none font-extrabold text-accent-fg sm:mx-10">
                  /
                </span>
              ) : (
                <span aria-hidden className="mx-5 size-1.5 shrink-0 rounded-full bg-accent sm:mx-8" />
              )}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

/** Giant typographic band between the hero and the story. Decorative and duplicated, so print skips it. */
export async function Marquee() {
  const t = await getTranslations("marquee");
  const locale = await getLocale();
  const domains = profile.availability.domains.map((d) => d[locale]);
  const tools = TOOLS.map((id) => getSkill(id).name);

  return (
    <section aria-label={t("label")} className="no-print relative flex flex-col gap-3 overflow-hidden py-14 sm:gap-5 sm:py-20">
      <MarqueeSkew />
      <Row items={domains} big duration="42s" />
      <Row items={tools} reverse duration="36s" />
    </section>
  );
}
