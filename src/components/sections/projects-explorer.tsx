"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { EASE } from "@/components/ui/reveal";
import { featuredProjects, otherProjects, projectCategories } from "@/content/projects";
import { cn } from "@/lib/utils";
import type { ProjectCategory } from "@/types/content";
import { CompactProjectCard, FeaturedProjectCard } from "./project-card";

type Filter = ProjectCategory | "all";

const cardMotion = {
  layout: true,
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
  transition: { duration: 0.4, ease: EASE },
} as const;

export function ProjectsExplorer() {
  const t = useTranslations("projects");
  const locale = useLocale();
  const [filter, setFilter] = useState<Filter>("all");

  const match = (categories: ProjectCategory[]) => filter === "all" || categories.includes(filter);
  const featured = featuredProjects.filter((p) => match(p.categories));
  const others = otherProjects.filter((p) => match(p.categories));
  const countFor = (id: Filter) =>
    [...featuredProjects, ...otherProjects].filter((p) => id === "all" || p.categories.includes(id)).length;

  return (
    <LayoutGroup>
      <div role="group" aria-label={t("filterLabel")} className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {projectCategories.map((cat) => {
          const active = filter === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(cat.id)}
              className={cn(
                "relative inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300",
                active ? "border-transparent text-accent-contrast" : "border-border text-muted hover:border-border-strong hover:text-fg",
              )}
            >
              {active ? (
                <motion.span
                  layoutId="project-filter"
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-button"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              {cat.label[locale]}
              <span className={cn("font-mono text-[0.7rem]", active ? "text-accent-contrast/80" : "text-subtle")}>
                {countFor(cat.id)}
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {t("count", { count: featured.length + others.length })}
      </p>

      <motion.div layout className="grid gap-4 lg:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {featured.map((project, i) => {
            const large = filter === "all" && i === 0;
            return (
              <motion.div key={project.slug} {...cardMotion} className={cn(large && "lg:col-span-2")}>
                <FeaturedProjectCard project={project} large={large} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence initial={false}>
        {others.length ? (
          <motion.div key="others" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 className="mt-16 mb-6 font-mono text-xs tracking-widest text-subtle uppercase">{t("others")}</h3>
            <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {others.map((project) => (
                  <motion.div key={project.slug} {...cardMotion}>
                    <CompactProjectCard project={project} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {featured.length + others.length === 0 ? <p className="py-10 text-center text-muted">{t("empty")}</p> : null}
    </LayoutGroup>
  );
}
