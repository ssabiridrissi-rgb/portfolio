import { brandIcons } from "@/lib/brand-icons";
import { cn } from "@/lib/utils";
import type { Logo } from "@/types/content";

type Props = {
  logo: Logo;
  className?: string;
  /** Render brand icons in their brand colour instead of the current text colour. */
  colored?: boolean;
  title?: string;
};

/** Brand icon from simple-icons, or a monogram tile when no icon exists. */
export function BrandLogo({ logo, className, colored = false, title }: Props) {
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };

  if ("icon" in logo) {
    const icon = brandIcons[logo.icon];
    return (
      <svg viewBox="0 0 24 24" className={cn("size-4 shrink-0", className)} fill={colored ? icon.hex : "currentColor"} {...a11y}>
        <path d={icon.path} />
      </svg>
    );
  }
  return (
    <span
      className={cn(
        "inline-grid size-4 shrink-0 place-items-center rounded-[0.3rem] bg-surface-3 font-mono text-[0.5em] leading-none font-bold tracking-tight text-fg",
        className,
      )}
      style={logo.color ? { boxShadow: `inset 0 -2px 0 ${logo.color}` } : undefined}
      {...a11y}
    >
      {logo.monogram}
    </span>
  );
}
