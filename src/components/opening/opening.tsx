import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { profile } from "@/content/profile";
import { OpeningController } from "./opening-controller";

/** Stage lights sweeping behind the name: position (%), start and end angle. */
const BEAMS = [
  { x: 12, from: -26, to: 10 },
  { x: 31, from: 18, to: -14 },
  { x: 50, from: -8, to: 8 },
  { x: 69, from: 16, to: -18 },
  { x: 88, from: -12, to: 24 },
];

function letters(text: string) {
  return [...text].map((char, i) =>
    char === " " ? (
      <span key={i} className="opening-gap" />
    ) : (
      <span key={i} style={{ "--i": i } as CSSProperties}>
        {char}
      </span>
    ),
  );
}

/**
 * Opening title sequence of the home page, like the opening of a concert: a red horizon line, stage lights,
 * the name rising from the line, then the two halves of the curtain part on the site.
 * Pure CSS; it only plays once per tab, never with reduced motion or on a deep link (inline script in the
 * layout sets `data-intro="play"`), and any key, click or scroll skips it.
 */
export async function Opening() {
  const t = await getTranslations("opening");
  const [first, ...rest] = profile.name.split(" ");

  return (
    <div id="opening" className="opening no-print">
      <div aria-hidden className="opening-half opening-top">
        <div className="opening-beams">
          {BEAMS.map((b, i) => (
            <span
              key={b.x}
              style={{ "--x": `${b.x}%`, "--from": `${b.from}deg`, "--to": `${b.to}deg`, "--b": i } as CSSProperties}
            />
          ))}
        </div>
        <p className="opening-meta">
          <span>{profile.coordinates}</span>
          <span>{t("portfolio")}</span>
        </p>
        <p className="opening-first">{letters(first)}</p>
      </div>
      <div aria-hidden className="opening-half opening-bottom">
        <p className="opening-last">{letters(rest.join(" "))}</p>
        <p className="opening-sub">{t("tagline")}</p>
      </div>
      <div aria-hidden className="opening-line" />
      <button type="button" className="opening-skip" data-opening-skip>
        {t("skip")}
      </button>
      <OpeningController />
    </div>
  );
}
