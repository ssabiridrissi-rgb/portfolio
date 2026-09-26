/** Tiny window-event bus for UI that several unrelated components can open. */
export const UI_EVENTS = {
  openPalette: "ssi:open-palette",
  openTerminal: "ssi:open-terminal",
  cursorToggle: "ssi:cursor-toggle",
} as const;

export function emit(name: (typeof UI_EVENTS)[keyof typeof UI_EVENTS]) {
  window.dispatchEvent(new Event(name));
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
