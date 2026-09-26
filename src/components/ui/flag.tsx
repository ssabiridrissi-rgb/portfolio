import { cn } from "@/lib/utils";

/** Inline SVG flags — emoji flags don't render on Windows. */
export function Flag({ code, className, title }: { code: "MA" | "CN"; className?: string; title?: string }) {
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };
  if (code === "MA") {
    return (
      <svg viewBox="0 0 30 20" className={cn("inline-block h-[0.8em] w-auto rounded-[2px]", className)} {...a11y}>
        <rect width="30" height="20" fill="#c1272d" />
        <path
          d="M15 6.2l1.06 3.26h3.43l-2.78 2.02 1.06 3.26L15 12.72l-2.77 2.02 1.06-3.26-2.78-2.02h3.43z"
          fill="none"
          stroke="#006233"
          strokeWidth="0.9"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 30 20" className={cn("inline-block h-[0.8em] w-auto rounded-[2px]", className)} {...a11y}>
      <rect width="30" height="20" fill="#de2910" />
      <path d="M5 3l.88 2.7h2.85l-2.3 1.67.88 2.7L5 8.4l-2.3 1.67.88-2.7-2.3-1.67h2.84z" fill="#ffde00" />
      <circle cx="10" cy="2" r="0.8" fill="#ffde00" />
      <circle cx="12" cy="4" r="0.8" fill="#ffde00" />
      <circle cx="12" cy="7" r="0.8" fill="#ffde00" />
      <circle cx="10" cy="9" r="0.8" fill="#ffde00" />
    </svg>
  );
}
