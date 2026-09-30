import { getLocale, getTranslations } from "next-intl/server";
import { MethodScrolly } from "@/components/method/method-scrolly";
import { Section } from "@/components/ui/section";
import { methodSteps } from "@/content/method";
import { getProofs } from "@/lib/derived";

/** "From raw data to a decision" — each step lists the real jobs and projects where it was done. */
export async function Method() {
  const t = await getTranslations("method");
  const locale = await getLocale();

  const steps = methodSteps.map((step) => ({
    id: step.id,
    title: step.title[locale],
    body: step.body[locale],
    proofs: getProofs(step, locale).slice(0, 4),
  }));

  return (
    <Section
      id="method"
      eyebrow={t("eyebrow")}
      title={t("title")}
      subtitle={t("subtitle")}
      glow="center"
      scene="method"
      // Sticky children: skip content-visibility for this one.
      deferRender={false}
    >
      <MethodScrolly
        steps={steps}
        stepLabel={steps.map((_, i) => t("step", { n: String(i + 1).padStart(2, "0") }))}
        proofLabel={t("proof")}
        visualLabel={t("visualLabel")}
        labels={{
          etl: steps.find((s) => s.id === "etl")?.title ?? "ETL",
          fact: t("fact"),
          dim: t("dim"),
          kpi: t("kpi"),
          recommendation: t("recommendation"),
          validated: t("validated"),
        }}
      />
    </Section>
  );
}
