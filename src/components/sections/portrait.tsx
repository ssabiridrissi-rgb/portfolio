"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import portrait from "../../../public/images/saad-portrait.jpg";

const Hologram = dynamic(() => import("@/components/portrait/hologram").then((m) => m.Hologram), { ssr: false });

const CORNERS = [
  "top-3 left-3 border-t border-l",
  "top-3 right-3 border-t border-r",
  "bottom-3 left-3 border-b border-l",
  "bottom-3 right-3 border-b border-r",
];

/**
 * The portrait: a framed photograph (LCP element, and the fallback without WebGL) that rebuilds itself as a
 * 3D point cloud once the page is idle — the frame dissolves and the bust floats over a red emitter.
 */
export function Portrait({
  alt,
  children,
  place,
  hintPointer,
  hintTouch,
  cursorLabel,
  scanLabel,
  locale,
}: {
  alt: string;
  children?: ReactNode;
  place: string;
  hintPointer: string;
  hintTouch: string;
  cursorLabel: string;
  scanLabel: string;
  locale: string;
}) {
  const [load, setLoad] = useState(false);
  const [points, setPoints] = useState<number | null>(null);

  // The 3D engine stays out of the critical path: downloaded once the browser is idle.
  useEffect(() => {
    const go = () => setLoad(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(go, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(go, 600);
    return () => window.clearTimeout(id);
  }, []);

  const on = points !== null;

  return (
    <div data-holo={on ? "on" : undefined} className="portrait relative mx-auto w-full max-w-[420px]">
      <div aria-hidden className="absolute -inset-16 -z-10 rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)]" />
      <div className="portrait-frame relative rounded-[1.6rem] border border-accent/25 bg-surface p-2 shadow-[0_50px_120px_-50px_rgb(0_0_0/0.85)]">
        <div data-cursor={cursorLabel} className="relative touch-pan-y">
          <div className="portrait-box relative overflow-hidden rounded-[1.15rem] bg-surface-2">
            <Image
              src={portrait}
              alt={alt}
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 85vw"
              className="portrait-photo aspect-[4/5] h-auto w-full object-cover"
            />
          </div>
          <div aria-hidden className="holo-emitter pointer-events-none absolute inset-x-[6%] -bottom-7 h-14" />
          {load ? <Hologram className="holo-canvas absolute" onState={setPoints} /> : null}
          {CORNERS.map((c) => (
            <span key={c} aria-hidden className={`pointer-events-none absolute size-4 border-accent/80 ${c}`} />
          ))}
          <div
            aria-hidden
            className="portrait-scan pointer-events-none absolute top-3.5 left-9 flex items-center gap-2 font-mono text-[0.6rem] tracking-wider whitespace-nowrap text-muted uppercase"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            {scanLabel}
            {points ? <span className="text-subtle">· {points.toLocaleString(locale)} pts</span> : null}
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="mt-6 flex items-center justify-between gap-3 px-1 font-mono text-[0.6rem] tracking-wider whitespace-nowrap text-subtle uppercase"
      >
        <span>{place}</span>
        <span className="hidden pointer-fine:inline">{hintPointer}</span>
        <span className="pointer-fine:hidden">{hintTouch}</span>
      </div>
      {children}
    </div>
  );
}
