"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { UI_EVENTS } from "@/lib/events";

/**
 * Easter egg ("lights off", from the ⌘K palette or the terminal): the room goes dark and the pointer
 * becomes a torch. Escape or the same command switches the lights back on.
 */
export function LightsOff() {
  const t = useTranslations("lights");
  const [on, setOn] = useState(false);
  const shade = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toggle = () => setOn((v) => !v);
    window.addEventListener(UI_EVENTS.lightsToggle, toggle);
    return () => window.removeEventListener(UI_EVENTS.lightsToggle, toggle);
  }, []);

  useEffect(() => {
    if (!on) return;
    let frame = 0;
    const place = (x: number, y: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        shade.current?.style.setProperty("--fx", `${x}px`);
        shade.current?.style.setProperty("--fy", `${y}px`);
      });
    };
    place(window.innerWidth / 2, window.innerHeight / 2);
    const onMove = (e: PointerEvent) => place(e.clientX, e.clientY);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOn(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [on]);

  return (
    <AnimatePresence>
      {on ? (
        <motion.div key="lights-off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          <div
            ref={shade}
            aria-hidden
            className="no-print pointer-events-none fixed inset-0 z-[85] bg-[radial-gradient(circle_230px_at_var(--fx)_var(--fy),transparent_0%,var(--torch-edge)_45%,var(--torch-dark)_78%)]"
          />
          <p
            role="status"
            className="no-print fixed bottom-6 left-1/2 z-[86] -translate-x-1/2 rounded-full border border-accent/40 bg-surface px-4 py-2 font-mono text-xs text-fg"
          >
            {t("hint")}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
