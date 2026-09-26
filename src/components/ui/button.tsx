import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,color,box-shadow,transform,border-color,filter] duration-300 ease-out-expo disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-button text-accent-contrast shadow-[0_8px_30px_-8px_var(--glow-1)] hover:shadow-[0_10px_40px_-6px_var(--glow-1)] hover:brightness-110",
        secondary: "border border-border-strong bg-surface text-fg hover:border-accent/60 hover:bg-surface-2",
        ghost: "text-muted hover:bg-surface-2 hover:text-fg",
        outline: "border border-border text-fg hover:border-border-strong hover:bg-surface-2",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-[0.95rem]",
        icon: "size-10",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
