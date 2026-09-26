import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
  glow?: "left" | "right" | "center";
  headerAside?: ReactNode;
};

export function Section({ id, eyebrow, title, subtitle, children, className, glow, headerAside }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("cv-auto relative py-20 sm:py-28", className)}>
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
            <p className="mb-4 inline-flex items-center gap-3 font-mono text-xs font-medium tracking-[0.2em] text-accent-fg uppercase">
              <span aria-hidden className="h-px w-8 bg-gradient-accent" />
              {eyebrow}
            </p>
            <h2 id={`${id}-title`} className="text-h2 text-balance">
              {title}
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
