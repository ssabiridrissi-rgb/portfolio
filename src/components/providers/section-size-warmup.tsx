"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * `.cv-auto` sections start with a 1000 px placeholder height. Once the page is idle, lay them all
 * out for a couple of frames so the browser records their real size (`contain-intrinsic-size: auto`):
 * the first render stays light, and anchor links / the palette land exactly on their section.
 */
export function SectionSizeWarmup() {
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    const run = () => {
      const root = document.documentElement;
      root.classList.add("cv-warm");
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => root.classList.remove("cv-warm"));
      });
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 2500 });
      return () => {
        window.cancelIdleCallback(id);
        cancelAnimationFrame(frame);
      };
    }
    const id = window.setTimeout(run, 1200);
    return () => {
      window.clearTimeout(id);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
