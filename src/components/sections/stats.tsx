import { getTranslations } from "next-intl/server";
import { CountUp } from "@/components/ui/count-up";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { getStats } from "@/lib/derived";
import { Flag } from "@/components/ui/flag";
import { cn } from "@/lib/utils";

/** Hairlines between cells: 2 columns on phones, 3 on tablets, 6 in one row on desktop. */
function separators(i: number) {
  return [
    i % 2 === 1 ? "border-l" : "border-l-0",
    i >= 2 ? "border-t" : "border-t-0",
    i % 3 !== 0 ? "sm:border-l" : "sm:border-l-0",
    i >= 3 ? "sm:border-t" : "sm:border-t-0",
    i > 0 ? "lg:border-l" : "lg:border-l-0",
    "lg:border-t-0",
  ].join(" ");
}

export async function Stats() {
  const t = await getTranslations("stats");
  const stats = getStats();

  const items = [
    { value: stats.experiences, label: t("experiences") },
    { value: stats.projects, label: t("projects") },
    { value: stats.awards, label: t("awards") },
    { value: stats.certifications, label: t("certifications") },
    { value: stats.languages, label: t("languages") },
    { value: stats.degrees, label: t("degrees"), flags: stats.degreeCountries },
  ];

  return (
    <section aria-label={t("label")} className="relative">
      <div className="container-page">
        <RevealGroup className="grid grid-cols-2 border-y border-border sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item, i) => (
            <RevealItem
              key={item.label}
              className={cn("flex flex-col gap-2 border-border px-4 py-7 sm:px-6", separators(i))}
            >
              <p className="font-display text-6xl leading-none font-extrabold sm:text-7xl">
                <span className="text-gradient">
                  <CountUp value={item.value} />
                </span>
                {item.flags ? (
                  <span aria-hidden className="ml-3 inline-flex gap-1.5 align-middle text-2xl">
                    {item.flags.map((code) => (
                      <Flag key={code} code={code} />
                    ))}
                  </span>
                ) : null}
                <span className="sr-only"> {item.label}</span>
              </p>
              <p aria-hidden className="text-sm text-muted">
                {item.label}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
