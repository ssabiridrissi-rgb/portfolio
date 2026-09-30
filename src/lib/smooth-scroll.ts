import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

/**
 * Scrolls to an element with the site's rhythm: Lenis when it runs, native smooth scroll otherwise.
 * Both honour the sections' `scroll-margin-top` (room for the fixed navbar).
 */
export function scrollToElement(el: HTMLElement) {
  if (instance) {
    instance.scrollTo(el, { duration: 1.1, force: true });
    return;
  }
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
