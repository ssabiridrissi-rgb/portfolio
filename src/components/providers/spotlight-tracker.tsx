"use client";

import { useEffect } from "react";

/**
 * One delegated pointer listener for every `.spotlight` card: sets --mx / --my (px) and
 * --px / --py (0–1) on the hovered card, so cards can stay server components
 * (glow, border, `.tilt` and `.holo` all read these variables).
 */
export function SpotlightTracker() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const card = (event.target as Element | null)?.closest<HTMLElement>(".spotlight");
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);
        card.style.setProperty("--px", (x / rect.width).toFixed(3));
        card.style.setProperty("--py", (y / rect.height).toFixed(3));
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
    };
  }, []);
  return null;
}
