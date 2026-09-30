"use client";

import { useEffect, useRef } from "react";

/** Leans the marquee words with the scroll speed (sets --skew on the parent section). */
export function MarqueeSkew() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let frame = 0;
    let skew = 0;
    let target = 0;
    let lastY = window.scrollY;

    const tick = () => {
      skew += (target - skew) * 0.14;
      target *= 0.9;
      host.style.setProperty("--skew", `${skew.toFixed(2)}deg`);
      frame = Math.abs(skew) > 0.05 || Math.abs(target) > 0.05 ? requestAnimationFrame(tick) : 0;
    };
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (!visible) return;
      target = Math.max(-12, Math.min(12, -delta * 0.3));
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(host);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <span ref={ref} hidden />;
}
