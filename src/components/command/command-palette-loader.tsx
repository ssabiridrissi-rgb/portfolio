"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { UI_EVENTS } from "@/lib/events";

const CommandPalette = dynamic(() => import("./command-palette").then((m) => m.CommandPalette), { ssr: false });

/**
 * Keeps cmdk + the dialog out of the initial bundle: the palette is only
 * downloaded the first time someone presses ⌘K / Ctrl+K or clicks the search button.
 */
export function CommandPaletteLoader() {
  const [initial, setInitial] = useState<"palette" | "terminal" | null>(null);

  useEffect(() => {
    if (initial) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setInitial("palette");
      }
    };
    const onPalette = () => setInitial("palette");
    const onTerminal = () => setInitial("terminal");
    window.addEventListener("keydown", onKey);
    window.addEventListener(UI_EVENTS.openPalette, onPalette);
    window.addEventListener(UI_EVENTS.openTerminal, onTerminal);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(UI_EVENTS.openPalette, onPalette);
      window.removeEventListener(UI_EVENTS.openTerminal, onTerminal);
    };
  }, [initial]);

  return initial ? <CommandPalette initial={initial} /> : null;
}
