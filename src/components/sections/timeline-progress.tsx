"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

/** Vertical line that fills as the timeline scrolls through the viewport. */
export function TimelineProgress({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <div ref={ref} className="relative">
      <div aria-hidden className="absolute top-0 bottom-0 left-5 w-px bg-border md:left-1/2 md:-translate-x-1/2" />
      <motion.div
        aria-hidden
        style={{ scaleY }}
        className="absolute top-0 bottom-0 left-5 w-px origin-top bg-[linear-gradient(to_bottom,var(--accent),var(--accent-2),var(--accent-3))] md:left-1/2 md:-translate-x-1/2"
      />
      {children}
    </div>
  );
}
