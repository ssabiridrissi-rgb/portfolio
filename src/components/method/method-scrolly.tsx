"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { MethodStage, type StageLabels } from "./method-stage";

const chip =
  "group inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-xs text-fg transition-colors hover:border-accent/50";
const arrow = "size-3 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5";

export type MethodStepView = {
  id: string;
  title: string;
  body: string;
  proofs: { key: string; label: string; href?: string }[];
};

/**
 * Scrollytelling: the step crossing the middle of the viewport drives the sticky stage.
 * Without JS every step stays readable; the stage simply shows the first pose.
 */
export function MethodScrolly({
  steps,
  labels,
  stepLabel,
  proofLabel,
  visualLabel,
}: {
  steps: MethodStepView[];
  labels: StageLabels;
  stepLabel: string[];
  proofLabel: string;
  visualLabel: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    for (const el of refs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
      {/* Sticky stage — top on phones, right column on desktop */}
      <div className="no-print sticky top-16 z-10 -mx-4 bg-[color-mix(in_oklab,var(--bg)_94%,transparent)] px-4 pt-2 pb-3 sm:-mx-6 sm:px-6 lg:order-2 lg:top-24 lg:mx-0 lg:self-start lg:bg-transparent lg:p-0">
        <figure role="img" aria-label={visualLabel} className="relative mx-auto max-w-[22rem] overflow-hidden rounded-3xl border border-border bg-[radial-gradient(ellipse_at_top,var(--surface-2),var(--surface))] p-3 shadow-card sm:max-w-md lg:max-w-none lg:p-8">
          <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
          <div className="relative">
            <MethodStage step={active} labels={labels} />
          </div>
          <figcaption aria-hidden className="relative mt-1 flex items-center justify-between font-mono text-[0.68rem] tracking-widest text-subtle uppercase lg:mt-4">
            <span>
              {String(active + 1).padStart(2, "0")} — {steps[active]?.title}
            </span>
            <span className="flex gap-1.5">
              {steps.map((s, i) => (
                <span
                  key={s.id}
                  className={cn("h-1.5 rounded-full transition-all duration-500", i === active ? "w-6 bg-accent-2" : "w-1.5 bg-border-strong")}
                />
              ))}
            </span>
          </figcaption>
        </figure>
      </div>

      <ol className="relative lg:order-1">
        {steps.map((step, i) => (
          <li
            key={step.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-index={i}
            className={cn(
              "flex min-h-[46vh] flex-col justify-center py-8 transition-opacity duration-500 lg:min-h-[72vh] lg:py-0",
              i === active ? "opacity-100" : "opacity-40",
            )}
          >
            <p className="font-mono text-xs tracking-[0.25em] text-accent-fg uppercase">{stepLabel[i]}</p>
            <h3 className="mt-3 font-display text-4xl leading-none font-extrabold uppercase sm:text-5xl">{step.title}</h3>
            <p className="mt-4 max-w-md text-lead text-pretty text-muted">{step.body}</p>
            {step.proofs.length ? (
              <div className="mt-6">
                <p className="font-mono text-[0.68rem] tracking-widest text-subtle uppercase">{proofLabel}</p>
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {step.proofs.map((proof) => (
                    <li key={proof.key}>
                      {proof.href?.startsWith("#") ? (
                        <a href={proof.href} className={chip}>
                          {proof.label}
                          <ArrowUpRight className={arrow} aria-hidden />
                        </a>
                      ) : proof.href ? (
                        <Link href={proof.href} className={chip}>
                          {proof.label}
                          <ArrowUpRight className={arrow} aria-hidden />
                        </Link>
                      ) : (
                        <span className="inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs text-fg">{proof.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
