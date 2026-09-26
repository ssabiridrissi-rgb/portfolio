import { ArrowLeft, Globe, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { PrintButton } from "@/components/layout/print-button";
import { BrandLogo } from "@/components/ui/brand-logo";
import { certifications, languages } from "@/content/certifications";
import { education } from "@/content/education";
import { experiences } from "@/content/experience";
import { getProject } from "@/content/projects";
import { profile } from "@/content/profile";
import { getSkill, skillCategories, skills } from "@/content/skills";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { buildMetadata, localizedUrl } from "@/lib/seo";
import { formatPeriod } from "@/lib/utils";
import type { SkillCategoryId } from "@/types/content";
import portrait from "../../../../public/images/saad-portrait.jpg";

type Props = { params: Promise<{ locale: Locale }> };

const TOP_PROJECTS = ["autoloc-ia", "supervision-aws-zabbix", "chaine-bi-centre-medical"];
const TOP_CATEGORIES: SkillCategoryId[] = ["bi-db", "data-ai", "cloud-devops", "dev"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "/recruteur", title: t("recruiterTitle"), description: t("recruiterDescription") });
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="print-avoid-break">
      <h2 className="mb-2.5 border-b border-border pb-1.5 font-mono text-[0.68rem] font-semibold tracking-widest text-accent-fg uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function RecruiterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("recruiter");
  const dataExperiences = experiences.filter((e) => e.isData);
  const topProjects = TOP_PROJECTS.map((slug) => getProject(slug)).filter((p) => p !== undefined);

  return (
    <div className="container-page pt-24 pb-16 print:max-w-none print:p-0">
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-accent-fg uppercase">{t("eyebrow")}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">{t("title")}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm text-muted hover:text-fg">
            <ArrowLeft className="size-4" aria-hidden />
            {t("back")}
          </Link>
          <PrintButton label={t("print")} />
        </div>
      </div>

      <article className="mx-auto max-w-[210mm] rounded-3xl border border-border bg-surface p-6 text-[0.9rem] shadow-card sm:p-10 print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <header className="flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-center">
          <Image src={portrait} alt="" width={96} height={120} className="h-[120px] w-24 rounded-2xl object-cover" placeholder="blur" />
          <div className="flex-1">
            <h2 className="font-display text-3xl font-semibold tracking-tight">{profile.name}</h2>
            <p className="mt-1 text-[0.95rem] text-fg/90">{profile.title[locale]}</p>
            <p className="mt-2 text-muted">{profile.valueProposition[locale]}</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success-bg px-3 py-1 text-xs font-medium text-success">
              <span className="size-1.5 rounded-full bg-success" aria-hidden />
              {profile.availability.headline[locale]} · {profile.availability.duration[locale]}
            </p>
          </div>
        </header>

        <div className="grid gap-8 pt-6 sm:grid-cols-[1.35fr_1fr]">
          <div className="flex flex-col gap-6">
            <Block title={t("profile")}>
              <ul className="space-y-1.5">
                {profile.tldr.map((l) => (
                  <li key={l.fr} className="flex gap-2">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent-2" />
                    {l[locale]}
                  </li>
                ))}
              </ul>
            </Block>

            <Block title={t("experience")}>
              <ul className="space-y-3">
                {dataExperiences.map((e) => (
                  <li key={e.id}>
                    <p className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="font-semibold">
                        {e.company}
                        {e.brand ? ` · ${e.brand}` : ""}
                      </span>
                      <span className="font-mono text-xs text-subtle">{formatPeriod(e.start, e.end, locale)}</span>
                    </p>
                    <p className="text-muted">{e.role[locale]}</p>
                    <p className="mt-1 text-sm">{e.bullets[0][locale]}</p>
                  </li>
                ))}
              </ul>
            </Block>

            <Block title={t("topProjects")}>
              <ul className="space-y-3">
                {topProjects.map((p) => (
                  <li key={p.slug}>
                    <p className="font-semibold">{p.title[locale]}</p>
                    <p className="text-sm text-muted">{p.subtitle[locale]}</p>
                    <p className="mt-0.5 font-mono text-[0.7rem] text-subtle">
                      {[...p.skills.map((s) => getSkill(s).name), ...(p.extraStack ?? [])].slice(0, 6).join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            </Block>
          </div>

          <div className="flex flex-col gap-6">
            <Block title={t("contact")}>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="size-3.5 text-accent-fg" aria-hidden />
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="size-3.5 text-accent-fg" aria-hidden />
                  <a href={`tel:${profile.phone.tel}`}>{profile.phone.display}</a>
                </li>
                <li className="flex items-center gap-2">
                  <BrandLogo logo={{ icon: "linkedin" }} className="size-3.5 text-accent-fg" />
                  <a href={profile.linkedin}>linkedin.com/in/saad-sabir-idrissi</a>
                </li>
                <li className="flex items-center gap-2">
                  <BrandLogo logo={{ icon: "github" }} className="size-3.5 text-accent-fg" />
                  <a href={profile.github}>github.com/{profile.githubUser}</a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-accent-fg" aria-hidden />
                  {profile.location[locale]} · {profile.mobility[locale]}
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="size-3.5 text-accent-fg" aria-hidden />
                  <a href={localizedUrl(locale, "/")}>{localizedUrl(locale, "/").replace("https://", "")}</a>
                </li>
              </ul>
            </Block>

            <Block title={t("topSkills")}>
              <dl className="space-y-2 text-sm">
                {TOP_CATEGORIES.map((id) => (
                  <div key={id}>
                    <dt className="font-semibold">{skillCategories.find((c) => c.id === id)?.label[locale]}</dt>
                    <dd className="text-muted">
                      {skills
                        .filter((s) => s.category === id)
                        .map((s) => s.name)
                        .join(", ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </Block>

            <Block title={t("education")}>
              <ul className="space-y-2 text-sm">
                {education
                  .filter((e) => e.isDegree)
                  .map((e) => (
                    <li key={e.id}>
                      <p className="font-semibold">{e.degree[locale]}</p>
                      <p className="text-muted">
                        {e.school} · {formatPeriod(e.start, e.end, locale)}
                      </p>
                    </li>
                  ))}
              </ul>
            </Block>

            <Block title={t("languages")}>
              <p className="text-sm">
                {languages.map((l) => `${l.name[locale]} (${l.cefr ?? l.level[locale]})`).join(" · ")}
              </p>
              <p className="mt-2 text-sm text-muted">{certifications.map((c) => `${c.issuer} ${c.title[locale]}`).join(" · ")}</p>
            </Block>
          </div>
        </div>
      </article>
    </div>
  );
}
