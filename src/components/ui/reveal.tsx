import type { ComponentProps, CSSProperties } from "react";

type RevealProps = ComponentProps<"div"> & {
  /** Delay in seconds. */
  delay?: number;
  /** Vertical offset in px before reveal. */
  y?: number;
};

/**
 * Fade + translate on scroll. Pure CSS (`[data-reveal]` in globals.css) toggled by a single
 * IntersectionObserver (<RevealObserver />) — no per-element JS, visible without JS and in reduced motion.
 */
export function Reveal({ delay = 0, y = 16, style, ...props }: RevealProps) {
  return (
    <div
      data-reveal=""
      style={{ ...style, "--reveal-delay": `${Math.round(delay * 1000)}ms`, "--reveal-y": `${y}px` } as CSSProperties}
      {...props}
    />
  );
}

/** Container whose <RevealItem> children appear with a 60 ms stagger. */
export function RevealGroup(props: ComponentProps<"div">) {
  return <div data-reveal-group="" {...props} />;
}

export function RevealItem(props: ComponentProps<"div">) {
  return <div data-reveal="" {...props} />;
}
