"use client";

import { Award, Briefcase, FolderGit2, Trophy } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { achievements } from "@/content/achievements";
import { certifications } from "@/content/certifications";
import { experiences } from "@/content/experience";
import { projects } from "@/content/projects";
import { skillCategories, skills } from "@/content/skills";
import { cn } from "@/lib/utils";
import type { SkillId } from "@/types/content";

type Target = { id: string; kind: "exp" | "proj" | "award" | "cert"; label: string; sub: string; skills: SkillId[] };

/** Achievements told through a project (SolarNav AI) are already listed as that project. */
const standaloneAchievements = achievements.filter((a) => !a.projectSlug && a.skills.length);
type Line = { d: string; key: string };

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function SkillsGraph() {
  const t = useTranslations("skills");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSkill, setActiveSkill] = useState<SkillId | null>(null);
  const [pinned, setPinned] = useState<SkillId | null>(null);
  const [activeTarget, setActiveTarget] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]);

  const targets = useMemo<Target[]>(
    () => [
      ...experiences
        .filter((e) => e.skills.length)
        .map((e) => ({ id: `exp:${e.id}`, kind: "exp" as const, label: e.company, sub: e.role[locale], skills: e.skills })),
      ...projects
        .filter((p) => p.skills.length)
        .map((p) => ({ id: `proj:${p.slug}`, kind: "proj" as const, label: p.title[locale], sub: p.subtitle[locale], skills: p.skills })),
      ...standaloneAchievements.map((a) => ({
        id: `award:${a.id}`,
        kind: "award" as const,
        label: a.name,
        sub: a.headline[locale],
        skills: a.skills,
      })),
      ...certifications.map((c) => ({
        id: `cert:${c.id}`,
        kind: "cert" as const,
        label: `${c.issuer} — ${c.title[locale]}`,
        sub: "",
        skills: c.skills,
      })),
    ],
    [locale],
  );

  const context = useMemo(() => {
    const map = new Map<SkillId, string>();
    for (const s of skills) {
      const companies = experiences.filter((e) => e.skills.includes(s.id)).map((e) => e.company);
      const count = projects.filter((p) => p.skills.includes(s.id)).length;
      const issuers = certifications.filter((c) => c.skills.includes(s.id)).map((c) => c.issuer);
      const events = standaloneAchievements.filter((a) => a.skills.includes(s.id)).map((a) => a.name);
      const parts: string[] = [];
      if (companies.length) parts.push(t("usedAt", { companies: companies.join(", ") }));
      if (count) parts.push(t("usedIn", { count }));
      if (events.length) parts.push(t("competed", { events: events.join(", ") }));
      if (issuers.length) parts.push(t("certified", { issuers: issuers.join(", ") }));
      if (parts.length) map.set(s.id, parts.join(" · "));
    }
    return map;
  }, [t]);

  const skill = pinned ?? activeSkill;
  const highlightedTargets = useMemo(
    () => new Set(skill ? targets.filter((x) => x.skills.includes(skill)).map((x) => x.id) : activeTarget ? [activeTarget] : []),
    [skill, activeTarget, targets],
  );
  const highlightedSkills = useMemo(() => {
    if (skill) return new Set<SkillId>([skill]);
    const target = targets.find((x) => x.id === activeTarget);
    return new Set<SkillId>(target?.skills ?? []);
  }, [skill, activeTarget, targets]);
  const focusMode = highlightedSkills.size > 0;

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container || !focusMode || !window.matchMedia("(min-width: 1024px)").matches) {
      setLines([]);
      return;
    }
    const box = container.getBoundingClientRect();
    const next: Line[] = [];
    for (const skillId of highlightedSkills) {
      const chip = container.querySelector<HTMLElement>(`[data-skill="${skillId}"]`);
      if (!chip) continue;
      const a = chip.getBoundingClientRect();
      for (const targetId of highlightedTargets) {
        const target = targets.find((x) => x.id === targetId);
        if (!target?.skills.includes(skillId)) continue;
        const el = container.querySelector<HTMLElement>(`[data-target="${targetId}"]`);
        if (!el) continue;
        const b = el.getBoundingClientRect();
        const x1 = a.right - box.left;
        const y1 = a.top + a.height / 2 - box.top;
        const x2 = b.left - box.left;
        const y2 = b.top + b.height / 2 - box.top;
        const mx = x1 + (x2 - x1) * 0.55;
        next.push({ key: `${skillId}-${targetId}`, d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}` });
      }
    }
    setLines(next);
  }, [focusMode, highlightedSkills, highlightedTargets, targets]);

  useIsoLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    // The usage rail is sticky, so lines must follow the scroll too.
    let frame = 0;
    const onChange = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onChange);
    if (focusMode) window.addEventListener("scroll", onChange, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange);
    };
  }, [measure, focusMode]);

  const kindIcon = { exp: Briefcase, proj: FolderGit2, award: Trophy, cert: Award } as const;

  return (
    <div ref={containerRef} className="relative grid gap-8 lg:grid-cols-[1fr_minmax(300px,360px)] lg:gap-24">
      <svg aria-hidden className="pointer-events-none absolute inset-0 z-10 hidden size-full overflow-visible lg:block">
        {lines.map((line) => (
          <g key={line.key}>
            <path d={line.d} fill="none" style={{ stroke: "var(--accent-2)" }} strokeOpacity={0.25} strokeWidth={4} />
            <path d={line.d} fill="none" className="flow-dash" style={{ stroke: "var(--accent-2)" }} strokeWidth={1.4} />
          </g>
        ))}
      </svg>

      <div className="grid gap-4 sm:grid-cols-2">
        {skillCategories.map((cat) => {
          const items = skills.filter((s) => s.category === cat.id);
          return (
            <div key={cat.id} className="rounded-3xl border border-border bg-surface p-5">
              <h3 className="mb-3.5 flex items-center justify-between font-mono text-[0.7rem] tracking-widest text-subtle uppercase">
                {cat.label[locale]}
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[0.65rem]">{items.length}</span>
              </h3>
              <ul className="flex flex-col gap-1.5">
                {items.map((s) => {
                  const on = highlightedSkills.has(s.id);
                  const ctx = context.get(s.id);
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        data-skill={s.id}
                        aria-pressed={pinned === s.id}
                        onMouseEnter={() => setActiveSkill(s.id)}
                        onMouseLeave={() => setActiveSkill(null)}
                        onFocus={() => setActiveSkill(s.id)}
                        onBlur={() => setActiveSkill(null)}
                        onClick={() => setPinned((p) => (p === s.id ? null : s.id))}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-xl border px-3 py-2 text-left transition-[opacity,border-color,background-color] duration-300",
                          on ? "border-accent-2/60 bg-accent-2/10" : "border-transparent hover:bg-surface-2",
                          focusMode && !on && "opacity-45",
                        )}
                      >
                        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-border bg-surface-2 text-fg">
                          {s.logo ? <BrandLogo logo={s.logo} className="size-4 text-[0.55rem]" /> : null}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-fg">{s.name}</span>
                          {ctx ? <span className="block text-xs leading-snug text-muted">{ctx}</span> : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-24">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-mono text-[0.7rem] tracking-widest text-subtle uppercase">{t("usageTitle")}</h3>
            {pinned ? (
              <button type="button" onClick={() => setPinned(null)} className="text-xs text-accent-fg hover:underline">
                {t("reset")}
              </button>
            ) : null}
          </div>
          <ul className="flex flex-col gap-1.5">
            {targets.map((target) => {
              const Icon = kindIcon[target.kind];
              const on = highlightedTargets.has(target.id);
              return (
                <li key={target.id}>
                  <div
                    data-target={target.id}
                    onMouseEnter={() => !pinned && setActiveTarget(target.id)}
                    onMouseLeave={() => setActiveTarget(null)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-3 py-2 transition-[opacity,border-color,background-color] duration-300",
                      on ? "border-accent/50 bg-accent/10" : "border-border bg-surface/70",
                      focusMode && !on && "opacity-40",
                    )}
                  >
                    <Icon className="size-4 shrink-0 text-accent-fg" aria-hidden />
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-fg">{target.label}</span>
                      {target.sub ? <span className="block truncate text-xs text-muted">{target.sub}</span> : null}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-subtle">{t("hint")}</p>
        </div>
      </div>
    </div>
  );
}
