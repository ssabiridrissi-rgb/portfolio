"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { readStorage, UI_EVENTS, writeStorage } from "@/lib/events";

const STORAGE_KEY = "cursor-pref";
const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, [cmdk-item], [data-cursor]";

type Hover = { active: boolean; label: string | null };

/**
 * The visitor carries the light: a warm pool of light follows the pointer (dark theme), with a precise
 * gold dot and a ring that turns into a label over elements marked `data-cursor="…"`.
 * Fine pointers only, never with reduced motion, can be turned off from the palette.
 * The native cursor stays visible (usability).
 */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [hover, setHover] = useState<Hover>({ active: false, label: null });
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const ringX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.45 });
  const ringY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.45 });
  const lightX = useSpring(x, { stiffness: 70, damping: 20, mass: 0.9 });
  const lightY = useSpring(y, { stiffness: 70, damping: 20, mass: 0.9 });

  useEffect(() => {
    setSupported(window.matchMedia("(pointer: fine) and (hover: hover)").matches);
    setEnabled(readStorage(STORAGE_KEY) !== "off");
    const onToggle = () =>
      setEnabled((prev) => {
        writeStorage(STORAGE_KEY, prev ? "off" : "on");
        return !prev;
      });
    window.addEventListener(UI_EVENTS.cursorToggle, onToggle);
    return () => window.removeEventListener(UI_EVENTS.cursorToggle, onToggle);
  }, []);

  const active = supported && enabled && !reduced;

  useEffect(() => {
    if (!active) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = (e.target as Element | null)?.closest<HTMLElement>(INTERACTIVE);
      const label = target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor || null;
      setHover((prev) => (prev.active === Boolean(target) && prev.label === label ? prev : { active: Boolean(target), label }));
    };
    const onLeave = () => setVisible(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [active, x, y]);

  if (!active) return null;

  const size = hover.label ? 0 : hover.active ? 46 : 28;

  return (
    <>
      <motion.div
        aria-hidden
        className="no-print pointer-events-none fixed top-0 left-0 z-[90] size-[620px] rounded-full bg-[radial-gradient(closest-side,var(--light-pool),transparent)]"
        style={{ x: lightX, y: lightY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      <motion.div
        aria-hidden
        className="no-print pointer-events-none fixed top-0 left-0 z-[96] size-1.5 rounded-full bg-accent"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible && !hover.label ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        aria-hidden
        className="no-print pointer-events-none fixed top-0 left-0 z-[95] flex items-center justify-center"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {hover.label ? (
            <motion.span
              key={`label-${hover.label}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: visible ? 1 : 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-full bg-accent px-3.5 py-1.5 font-mono text-[0.7rem] whitespace-nowrap text-accent-contrast shadow-[0_8px_30px_-6px_var(--glow-1)]"
            >
              {hover.label}
            </motion.span>
          ) : (
            <motion.span
              key="ring"
              className="relative block rounded-full border border-accent/70"
              initial={false}
              animate={{ width: size, height: size, opacity: visible ? 1 : 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.22 }}
            >
              <motion.span
                className="absolute inset-0 rounded-full bg-accent"
                initial={false}
                animate={{ opacity: hover.active ? 0.12 : 0 }}
                transition={{ duration: 0.22 }}
              />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
