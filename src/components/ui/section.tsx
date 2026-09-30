import type { ReactNode } from "react";
import type { SceneName } from "@/components/universe/scenes";
import { SECTIONS, type SectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { SplitWords } from "./split-words";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
  glow?: "left" | "right" | "center";
  headerAside?: ReactNode;
  /** Formation the particle universe takes while this section is on screen. */
  scene?: SceneName;
  /** `content-visibility: auto` — off for sections with sticky children. */
  deferRender?: boolean;
};

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className,
  glow,
  headerAside,
  scene,
  deferRender = true,
}: SectionProps) {
  const index = SECTIONS.indexOf(id as SectionId);
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-scene={scene}
      className={cn(deferRender && "cv-auto", "relative py-20 sm:py-28", className)}
    >
      {glow ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-10 -z-10 h-[420px] w-[520px] max-w-full rounded-full",
            glow === "left" && "left-0 bg-[radial-gradient(closest-side,var(--glow-1),transparent)]",
            glow === "right" && "right-0 bg-[radial-gradient(closest-side,var(--glow-3),transparent)]",
            glow === "center" && "left-1/2 -translate-x-1/2 bg-[radial-gradient(closest-side,var(--glow-2),transparent)]",
          )}
        />
      ) : null}
      <div className="container-page">
        <Reveal className="mb-12 flex flex-col gap-6 sm:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-3 text-sm text-muted">
              {index >= 0 ? <span className="font-mono text-xs text-accent-fg">{String(index + 1).padStart(2, "0")}</span> : null}
              <span aria-hidden className="h-px w-10 bg-border-strong" />
              {eyebrow}
            </p>
            <h2 id={`${id}-title`} className="text-h2 text-balance">
              {typeof title === "string" ? <SplitWords text={title} /> : title}
            </h2>
            {subtitle ? <p className="mt-5 text-lead text-pretty text-muted">{subtitle}</p> : null}
          </div>
          {headerAside}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
