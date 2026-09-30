"use client";

import { useEffect, useRef } from "react";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DURATION = 380;

/**
 * Text that scrambles and resolves when its link or button is hovered. The width is locked during
 * the effect so nothing around it moves; nothing happens with reduced motion.
 */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.closest("a, button");
    if (!el || !host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;

    const run = () => {
      cancelAnimationFrame(frame);
      el.style.width = `${el.getBoundingClientRect().width}px`;
      const start = performance.now();
      const chars = [...text];
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / DURATION);
        const settled = Math.floor(p * chars.length);
        el.textContent = chars
          .map((c, i) => {
            if (i < settled || !/\p{L}/u.test(c)) return c;
            const pool = c === c.toUpperCase() ? UPPER : LOWER;
            return pool[Math.floor(Math.random() * pool.length)];
          })
          .join("");
        if (p < 1) frame = requestAnimationFrame(tick);
        else {
          el.textContent = text;
          el.style.width = "";
        }
      };
      frame = requestAnimationFrame(tick);
    };

    host.addEventListener("pointerenter", run);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointerenter", run);
      el.textContent = text;
      el.style.width = "";
    };
  }, [text]);

  return (
    <span ref={ref} className={`inline-block whitespace-nowrap ${className ?? ""}`}>
      {text}
    </span>
  );
}
