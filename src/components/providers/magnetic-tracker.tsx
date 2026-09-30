"use client";

import { useEffect } from "react";

const PULL = 0.3;
const MAX_OFFSET = 10;

/**
 * One delegated listener: any `[data-magnetic]` element leans towards the pointer while hovered.
 * Fine pointers only, never with reduced motion. Styles live in globals.css.
 */
export function MagneticTracker() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine) and (hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let current: HTMLElement | null = null;
    let frame = 0;
    const clamp = (v: number) => Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, v * PULL));

    const release = () => {
      if (!current) return;
      current.style.removeProperty("--mag-x");
      current.style.removeProperty("--mag-y");
      current = null;
    };

    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = (event.target as Element | null)?.closest<HTMLElement>("[data-magnetic]") ?? null;
        if (el !== current) release();
        if (!el) return;
        current = el;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mag-x", `${clamp(event.clientX - (rect.left + rect.width / 2))}px`);
        el.style.setProperty("--mag-y", `${clamp(event.clientY - (rect.top + rect.height / 2))}px`);
      });
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", release);
    return () => {
      cancelAnimationFrame(frame);
      release();
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", release);
    };
  }, []);

  return null;
}
