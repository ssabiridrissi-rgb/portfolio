"use client";

import { Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/*
 * The Casablanca AI Lab dashboard idea: for each part reference, suppliers are ranked by price
 * and the cheapest one stands out. Relative bar widths only — illustrative, never shown as
 * figures (the real dashboard's data is not public).
 */
const SUPPLIERS = ["A", "B", "C", "D"] as const;
const PRICES: Record<number, number[]> = {
  1: [0.82, 0.64, 0.91, 0.73],
  2: [0.58, 0.79, 0.69, 0.88],
  3: [0.76, 0.86, 0.52, 0.66],
};
const PARTS = [1, 2, 3];
const ROW = 42;
const CYCLE_MS = 3200;

export function SupplierBoard() {
  const t = useTranslations("distinctions");
  const ref = useRef<HTMLDivElement>(null);
  const [part, setPart] = useState(1);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (entry.isIntersecting) timer = window.setInterval(() => setPart((p) => (p % PARTS.length) + 1), CYCLE_MS);
    });
    observer.observe(el);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [auto]);

  const prices = PRICES[part];
  const order = SUPPLIERS.map((name, i) => ({ name, price: prices[i] })).sort((a, b) => a.price - b.price);
  const rank = new Map(order.map((s, i) => [s.name, i]));

  return (
    <div ref={ref} role="group" aria-label={t("boardLabel")} className="flex flex-col gap-4">
      <div role="group" aria-label={t("parts")} className="flex gap-1.5">
        {PARTS.map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={part === p}
            onClick={() => {
              setAuto(false);
              setPart(p);
            }}
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-[0.7rem] transition-colors duration-300",
              part === p ? "border-accent/50 bg-accent/15 text-fg" : "border-border text-muted hover:text-fg",
            )}
          >
            {t("part", { n: String(p).padStart(2, "0") })}
          </button>
        ))}
      </div>

      <div className="relative" style={{ height: ROW * SUPPLIERS.length }}>
        {SUPPLIERS.map((name, i) => {
          const position = rank.get(name) ?? i;
          const best = position === 0;
          return (
            <div
              key={name}
              className="absolute inset-x-0 flex items-center gap-3 transition-transform duration-700 ease-out-expo"
              style={{ transform: `translateY(${position * ROW}px)`, height: ROW - 8 }}
            >
              <span className="w-24 shrink-0 truncate font-mono text-[0.72rem] text-muted sm:w-28">{t("supplier", { name })}</span>
              <div className="relative h-full flex-1 overflow-hidden rounded-lg border border-border bg-surface-2/60">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-lg transition-[width,background-color] duration-700 ease-out-expo",
                    best ? "bg-gradient-accent" : "bg-surface-3",
                  )}
                  style={{ width: `${prices[i] * 100}%` }}
                />
                {best ? (
                  <span className="absolute top-1/2 right-1.5 inline-flex -translate-y-1/2 items-center gap-1 rounded-md bg-surface/90 px-1.5 py-0.5 font-mono text-[0.66rem] font-semibold text-fg">
                    <Crown className="size-3.5 text-accent-fg" aria-hidden />
                    {t("bestPrice")}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      <p className="font-mono text-[0.68rem] text-subtle">{t("illustration")}</p>
    </div>
  );
}
