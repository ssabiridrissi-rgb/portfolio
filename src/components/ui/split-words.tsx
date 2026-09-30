import { Fragment, type CSSProperties } from "react";

/** Splits a title into words; `*like this*` marks words set in gold italic (see `.text-h2 em`). */
function tokenize(text: string) {
  let italic = false;
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((raw) => {
      let word = raw;
      if (word.startsWith("*")) {
        italic = true;
        word = word.slice(1);
      }
      const closes = word.endsWith("*");
      if (closes) word = word.slice(0, -1);
      const token = { word, italic };
      if (closes) italic = false;
      return token;
    });
}

/** The title without its emphasis markers (for plain-text uses). */
export function plainTitle(text: string) {
  return text.replace(/\*/g, "");
}

/**
 * Words rise one after another when the enclosing `[data-reveal]` becomes visible.
 * Pure CSS (globals.css `.split-w`); the text stays readable without JS.
 */
export function SplitWords({ text }: { text: string }) {
  const tokens = tokenize(text);
  return tokens.map(({ word, italic }, i) => (
    <Fragment key={`${word}-${i}`}>
      <span className="split-w">
        <span style={{ "--i": i } as CSSProperties}>{italic ? <em>{word}</em> : word}</span>
      </span>
      {i < tokens.length - 1 ? " " : null}
    </Fragment>
  ));
}
