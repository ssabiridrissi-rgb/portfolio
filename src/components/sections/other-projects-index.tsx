"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ExternalLink } from "@/components/ui/external-link";
import { projectCategories } from "@/content/projects";
import { cn, formatMonth } from "@/lib/utils";
import type { Project } from "@/types/content";
import { StackTags } from "./project-card";

const PREVIEW_WIDTH = 320;

/**
 * The smaller projects as an editorial index: one large poster line per project. On desktop a preview
 * card follows the pointer over the hovered row; on touch screens the summary sits under the title.
 */
export function OtherProjectsIndex({ projects }: { projects: Project[] }) {
  const cursor = useTranslations("cursor");
  const locale = useLocale();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => {
    setFinePointer(window.matchMedia("(pointer: fine) and (hover: hover)").matches);
  }, []);

  const onMove = (e: ReactPointerEvent) => {
    const left = Math.min(e.clientX + 28, window.innerWidth - PREVIEW_WIDTH - 16);
    x.set(left);
    y.set(e.clientY + 24);
  };

  const current = projects.find((p) => p.slug === hovered) ?? null;
  const categories = (p: Project) =>
    p.categories.map((c) => projectCategories.find((pc) => pc.id === c)?.label[locale]).filter(Boolean).join(" · ");

  const preview = (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[60]"
      style={{ x: reduced ? x : sx, y: reduced ? y : sy, width: PREVIEW_WIDTH }}
    >
      <AnimatePresence mode="wait">
        {current ? (
          <motion.div
            key={current.slug}
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-accent/30 bg-surface p-5 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)]"
          >
            <p className="font-mono text-[0.68rem] text-accent-fg">{current.context[locale]}</p>
            <p className="mt-2 text-sm leading-relaxed text-fg/90">{current.summary[locale]}</p>
            <div className="mt-4">
              <StackTags project={current} limit={4} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div onPointerMove={finePointer ? onMove : undefined} onPointerLeave={() => setHovered(null)}>
      <ol className="border-t border-border">
        {projects.map((project, i) => {
          const open = expanded === project.slug;
          const row = (
            <>
              <span className="font-mono text-xs text-accent-fg">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0">
                <span className="block font-display text-3xl leading-none font-bold uppercase transition-[translate,color] duration-500 ease-out-expo group-hover:translate-x-2 group-hover:text-accent-fg sm:text-4xl">
                  {project.title[locale]}
                </span>
                <span className={cn("mt-1.5 block text-sm text-muted", finePointer && "sr-only")}>{project.summary[locale]}</span>
              </span>
              <span className="hidden text-sm text-muted md:block">{categories(project)}</span>
              <span className="hidden font-mono text-xs text-subtle sm:block">
                {project.date ? formatMonth(project.date, locale) : null}
              </span>
              <span aria-hidden className="text-subtle transition-colors group-hover:text-accent-fg">
                {project.repos ? (
                  <ChevronDown className={cn("size-5 transition-transform duration-300", open && "rotate-180")} />
                ) : project.links.github ? (
                  <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                ) : null}
              </span>
            </>
          );
          const rowClass =
            "group grid w-full grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-4 py-6 text-left sm:grid-cols-[2.5rem_1fr_auto_auto] md:grid-cols-[2.5rem_1fr_12rem_6rem_1.5rem]";

          return (
            <li key={project.slug} className="border-b border-border" onPointerEnter={() => setHovered(project.slug)}>
              {project.links.github ? (
                <ExternalLink href={project.links.github} data-cursor={cursor("open")} className={rowClass}>
                  {row}
                </ExternalLink>
              ) : project.repos ? (
                <button type="button" aria-expanded={open} onClick={() => setExpanded(open ? null : project.slug)} className={rowClass}>
                  {row}
                </button>
              ) : (
                <div className={rowClass}>{row}</div>
              )}
              {project.repos ? (
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="grid gap-2 overflow-hidden pb-6 pl-[3.25rem] sm:grid-cols-2 sm:pl-[3.5rem]"
                    >
                      {project.repos.map((repo) => (
                        <li key={repo.name}>
                          <ExternalLink
                            href={repo.href}
                            className="flex items-start gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm transition-colors hover:border-accent/50"
                          >
                            <BrandLogo logo={{ icon: "github" }} className="mt-0.5 size-3.5 text-subtle" />
                            <span className="min-w-0">
                              <span className="block truncate font-mono text-xs text-fg">{repo.name}</span>
                              <span className="block text-xs text-muted">{repo.summary[locale]}</span>
                            </span>
                          </ExternalLink>
                        </li>
                      ))}
                    </motion.ul>
                  ) : null}
                </AnimatePresence>
              ) : null}
            </li>
          );
        })}
      </ol>

      {/* Portal: the section's content-visibility containment would otherwise trap a fixed element. */}
      {finePointer ? createPortal(preview, document.body) : null}
    </div>
  );
}
