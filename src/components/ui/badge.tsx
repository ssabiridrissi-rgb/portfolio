import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-mono text-[0.7rem] font-medium tracking-wider uppercase",
  {
    variants: {
      variant: {
        default: "border-border bg-surface-2 px-2.5 py-1 text-muted",
        accent: "border-accent/30 bg-accent/10 px-2.5 py-1 text-accent-fg",
        success: "border-success/30 bg-success-bg px-2.5 py-1 text-success",
        warning: "border-warning/30 bg-warning-bg px-2.5 py-1 text-warning",
        violet: "border-accent-3/30 bg-accent-3/10 px-2.5 py-1 text-fg",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({ className, variant, ...props }: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/** Tech tag (stack item). */
export function Tag({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2/70 px-2 py-0.5 font-mono text-xs text-muted",
        className,
      )}
      {...props}
    />
  );
}
