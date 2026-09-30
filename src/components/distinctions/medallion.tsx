import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Monogram emblem with two slow orbits — the leadership cards. Pure CSS animation. */
export function Medallion({ monogram, className }: { monogram: string; className?: string }) {
  return (
    <div aria-hidden className={cn("relative grid aspect-square w-32 shrink-0 place-items-center sm:w-36", className)}>
      <div
        className="orbit-spin absolute inset-0 rounded-full border border-dashed border-border-strong"
        style={{ "--orbit-duration": "28s" } as CSSProperties}
      >
        <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-accent-2 shadow-[0_0_14px_var(--accent-2)]" />
      </div>
      <div
        data-reverse=""
        className="orbit-spin absolute inset-4 rounded-full border border-border"
        style={{ "--orbit-duration": "19s" } as CSSProperties}
      >
        <span className="absolute top-1/2 -right-1 size-1.5 -translate-y-1/2 rounded-full bg-accent-3 shadow-[0_0_10px_var(--accent-3)]" />
      </div>
      <div className="relative grid size-[4.5rem] place-items-center rounded-full border border-border-strong bg-[radial-gradient(circle_at_30%_25%,var(--surface-3),var(--surface))] shadow-[0_10px_40px_-12px_var(--glow-1)] sm:size-20">
        <span className="font-display text-3xl font-extrabold uppercase text-gradient">{monogram}</span>
      </div>
    </div>
  );
}
