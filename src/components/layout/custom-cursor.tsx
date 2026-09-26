"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { readStorage, UI_EVENTS, writeStorage } from "@/lib/events";

const STORAGE_KEY = "ssi-cursor";

/** Discreet follower ring — desktop (fine pointer) only, never with reduced motion, can be turned off. */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

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
      const target = e.target as Element | null;
      setHovering(Boolean(target?.closest("a, button, [role='button'], input, textarea, select, [cmdk-item]")));
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

  return (
    <motion.div
      aria-hidden
      className="no-print pointer-events-none fixed top-0 left-0 z-[95] rounded-full border border-accent-2/70 mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: hovering ? 44 : 22,
        height: hovering ? 44 : 22,
        opacity: visible ? 1 : 0,
        backgroundColor: hovering ? "rgba(34, 211, 238, 0.12)" : "rgba(34, 211, 238, 0)",
      }}
      transition={{ duration: 0.2 }}
    />
  );
}
