import { Big_Shoulders, DM_Mono, Instrument_Sans } from "next/font/google";

/** Text and UI. */
export const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

/** Condensed poster display — variable weight (animated in the hero) and optical sizes. */
export const poster = Big_Shoulders({
  subsets: ["latin"],
  variable: "--font-poster",
  display: "swap",
  axes: ["opsz"],
  // next/font has no metrics for this family: fall back on condensed system faces instead.
  adjustFontFallback: false,
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
});

/** Technical labels and readouts. */
export const mono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
  weight: ["400", "500"],
});

export const fontVariables = `${body.variable} ${poster.variable} ${mono.variable}`;
