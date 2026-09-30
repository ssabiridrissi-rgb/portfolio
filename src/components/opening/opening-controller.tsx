"use client";

import { useEffect } from "react";
import { UI_EVENTS } from "@/lib/events";

/** Timeline of the CSS sequence (globals.css, "Opening"): the curtains part at OPEN_AT and are gone at END. */
const OPEN_AT = 2800;
const END = 3800;

/**
 * Drives the opening title sequence: announces the reveal (the universe and the 3D portrait start their own
 * entrance), lets any key, click, wheel or touch skip straight to the curtains, and cleans up at the end.
 */
export function OpeningController() {
  useEffect(() => {
    const html = document.documentElement;
    const overlay = document.getElementById("opening");
    if (!overlay || html.dataset.intro !== "play") return;

    const timers: number[] = [];
    const clock = () => {
      const time = overlay.getAnimations({ subtree: true })[0]?.currentTime;
      return typeof time === "number" ? time : 0;
    };
    const reveal = () => {
      if (html.dataset.intro !== "play") return;
      html.dataset.intro = "open";
      window.dispatchEvent(new Event(UI_EVENTS.openingReveal));
    };
    const finish = () => {
      detach();
      if (html.dataset.intro === "open" || html.dataset.intro === "play") html.dataset.intro = "done";
    };
    const skip = () => {
      if (html.dataset.intro !== "play") return;
      // Jump the whole CSS timeline to the moment the curtains part.
      const skipped = OPEN_AT - clock();
      for (const animation of overlay.getAnimations({ subtree: true })) {
        const time = animation.currentTime;
        if (typeof time === "number" && time < OPEN_AT) animation.currentTime = time + skipped;
      }
      timers.forEach((id) => window.clearTimeout(id));
      reveal();
      timers.push(window.setTimeout(finish, END - OPEN_AT));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key === "Shift" || e.metaKey || e.ctrlKey || e.altKey) return;
      skip();
    };

    const detach = () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      overlay.removeEventListener("pointerdown", skip);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });
    overlay.addEventListener("pointerdown", skip);
    const now = clock();
    timers.push(window.setTimeout(reveal, Math.max(0, OPEN_AT - now)));
    timers.push(window.setTimeout(finish, Math.max(0, END - now)));

    return detach;
  }, []);

  return null;
}
