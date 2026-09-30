"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { UI_EVENTS } from "@/lib/events";

const RADIUS = 200;

/**
 * The hero name as a poster: the first name in solid capitals, the last name outlined in red. Under the
 * pointer the outlined letters fill with light and the solid ones thicken (Big Shoulders variable weight);
 * when the page opens, a flare runs through the name once. Server-rendered as plain text (LCP).
 */
export function InteractiveName({ id, first, last }: { id: string; first: string; last: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const h1 = ref.current;
    if (!h1) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // The flare, once the hero is on screen (after the opening curtains, if they play).
    const ignite = () => h1.classList.add("is-lit");
    let igniteTimer = 0;
    if (document.documentElement.dataset.intro === "play") {
      window.addEventListener(UI_EVENTS.openingReveal, ignite, { once: true });
    } else {
      igniteTimer = window.setTimeout(ignite, 350);
    }

    if (!window.matchMedia("(pointer: fine) and (hover: hover)").matches) {
      return () => {
        window.clearTimeout(igniteTimer);
        window.removeEventListener(UI_EVENTS.openingReveal, ignite);
      };
    }

    const letters = [...h1.querySelectorAll<HTMLElement>("[data-letter]")];
    const values = letters.map(() => 0);
    let centers: { x: number; y: number }[] = [];
    const pointer = { x: -1e4, y: -1e4 };
    let frame = 0;
    let running = false;

    const measure = () => {
      const base = h1.getBoundingClientRect();
      centers = letters.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 };
      });
    };

    const tick = () => {
      let settling = false;
      letters.forEach((el, i) => {
        const c = centers[i];
        const d = Math.hypot(pointer.x - c.x, (pointer.y - c.y) * 1.25);
        const f = Math.max(0, 1 - d / RADIUS);
        const target = f * f * (3 - 2 * f);
        values[i] += (target - values[i]) * 0.18;
        if (Math.abs(target - values[i]) > 0.004) settling = true;
        el.style.setProperty("--f", values[i].toFixed(3));
      });
      frame = settling ? requestAnimationFrame(tick) : 0;
      running = settling;
    };
    const wake = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const base = h1.getBoundingClientRect();
      pointer.x = e.clientX - base.left;
      pointer.y = e.clientY - base.top;
      wake();
    };
    const onLeave = () => {
      pointer.x = pointer.y = -1e4;
      wake();
    };

    measure();
    const section = h1.closest("section") ?? h1;
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(h1);
    document.fonts?.ready.then(measure).catch(() => undefined);
    section.addEventListener("pointermove", onMove as EventListener, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    return () => {
      window.clearTimeout(igniteTimer);
      window.removeEventListener(UI_EVENTS.openingReveal, ignite);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      section.removeEventListener("pointermove", onMove as EventListener);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const letters = (text: string, kind: "s" | "o") =>
    [...text].map((char, i) =>
      char === " " ? (
        " "
      ) : (
        <span key={i} data-letter={kind} style={{ "--li": i } as CSSProperties}>
          {char}
        </span>
      ),
    );

  return (
    <h1 ref={ref} id={id} aria-label={`${first} ${last}`} className="hero-name text-display mt-4">
      <span aria-hidden className="block whitespace-nowrap">
        {letters(first, "s")}
      </span>
      <span aria-hidden className="block whitespace-nowrap">
        {letters(last, "o")}
      </span>
    </h1>
  );
}
