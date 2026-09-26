"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/** Types and erases each phrase in turn. The first phrase is server-rendered in full. */
export function Typewriter({ phrases, label }: { phrases: string[]; label: string }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(phrases[0] ?? "");
  const [phase, setPhase] = useState<"hold" | "erase" | "type">("hold");

  useEffect(() => {
    if (phrases.length < 2) return;
    const current = phrases[index];
    let delay = 0;
    let next: () => void;

    if (reduced) {
      // No typing effect: swap whole phrases slowly.
      delay = 2800;
      next = () => {
        const i = (index + 1) % phrases.length;
        setIndex(i);
        setText(phrases[i]);
      };
    } else if (phase === "hold") {
      delay = 1700;
      next = () => setPhase("erase");
    } else if (phase === "erase") {
      delay = 28;
      next = () => {
        if (text.length === 0) {
          setIndex((index + 1) % phrases.length);
          setPhase("type");
        } else setText(text.slice(0, -1));
      };
    } else {
      delay = 55;
      next = () => {
        if (text.length === current.length) setPhase("hold");
        else setText(current.slice(0, text.length + 1));
      };
    }

    const id = window.setTimeout(next, delay);
    return () => window.clearTimeout(id);
  }, [index, phase, phrases, reduced, text]);

  return (
    <span className="inline-flex items-center">
      <span className="sr-only">
        {label} {phrases.join(", ")}
      </span>
      <span aria-hidden className="text-fg">
        {text}
      </span>
      <span aria-hidden className="caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[1px] bg-accent-2" />
    </span>
  );
}
