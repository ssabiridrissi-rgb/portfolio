"use client";

import { useEffect } from "react";
import { setLenis } from "@/lib/smooth-scroll";

/**
 * Inertial smooth scrolling (Lenis) for mouse and trackpad. Touch keeps the native momentum;
 * nothing runs with reduced motion. Same-page anchor links glide to their section, and scrolling
 * pauses while a dialog or the mobile menu is open.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: import("lenis").default | null = null;
    let cancelled = false;

    const syncLock = () => {
      if (!lenis) return;
      const locked = document.body.hasAttribute("data-scroll-locked") || document.documentElement.style.overflow === "hidden";
      if (locked) lenis.stop();
      else lenis.start();
    };

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        lerp: 0.11,
        autoRaf: true,
        prevent: (node) => Boolean(node.closest("[data-lenis-prevent], [cmdk-list], [role='dialog'], [role='menu']")),
      });
      setLenis(lenis);
      syncLock();
    });

    // Capture phase: runs before Next's <Link>, which then leaves the cancelled click alone.
    const onClick = (e: MouseEvent) => {
      if (!lenis || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href*='#']");
      if (!link || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      // Lenis applies the target's scroll-margin-top (room for the fixed navbar).
      lenis.scrollTo(target, { duration: 1.1 });
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick, true);

    const lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked", "style"] });
    lockObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });

    return () => {
      cancelled = true;
      document.removeEventListener("click", onClick, true);
      lockObserver.disconnect();
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
