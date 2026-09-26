import { getTranslations } from "next-intl/server";
import { CountUp } from "@/components/ui/count-up";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { getStats } from "@/lib/derived";
import { Flag } from "@/components/ui/flag";
import { cn } from "@/lib/utils";

export async function Stats() {
  const t = await getTranslations("stats");
  const stats = getStats();

  const items = [
    { value: stats.experiences, label: t("experiences") },
    { value: stats.projects, label: t("projects") },
    { value: stats.certifications, label: t("certifications") },
    { value: stats.languages, label: t("languages") },
    { value: stats.degrees, label: t("degrees"), flags: stats.degreeCountries },
  ];

  return (
    <section aria-label={t("label")} className="relative">
      <div className="container-page">
        <RevealGroup className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item, i) => (
            <RevealItem
              key={item.label}
              className={cn(
                "flex flex-col gap-1.5 bg-surface p-6 sm:p-7",
                i === items.length - 1 && "col-span-2 lg:col-span-1",
              )}
            >
              <p className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
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
