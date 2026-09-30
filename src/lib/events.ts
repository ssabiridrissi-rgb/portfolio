/** Tiny window-event bus for UI that several unrelated components can open. */
export const UI_EVENTS = {
  openPalette: "ui:open-palette",
  openTerminal: "ui:open-terminal",
  cursorToggle: "ui:cursor-toggle",
  lightsToggle: "ui:lights-toggle",
  /** The opening title sequence parts its curtains: the universe and the 3D portrait start their entrance. */
  openingReveal: "ui:opening-reveal",
} as const;

/** sessionStorage key: the opening title sequence already played in this tab (see the layout's inline script). */
export const OPENING_KEY = "opening-played";

export function emit(name: (typeof UI_EVENTS)[keyof typeof UI_EVENTS]) {
  window.dispatchEvent(new Event(name));
}

/** Plays the opening title sequence again: forget that it played, then load the home page afresh. */
export function replayOpening(locale: string) {
  try {
    window.sessionStorage.removeItem(OPENING_KEY);
  } catch {
    // ignore
  }
  window.location.assign(`/${locale}`);
}

/** localStorage can throw (private mode, blocked storage) — never let it break the page. */
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}
