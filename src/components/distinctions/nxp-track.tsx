"use client";

import { useEffect, useRef } from "react";

/** A figure-eight circuit (viewBox 400 × 220), crossing itself in the middle. */
const TRACK = "M 200 110 C 250 40, 350 40, 350 110 C 350 180, 250 180, 200 110 C 150 40, 50 40, 50 110 C 50 180, 150 180, 200 110 Z";
const LAP_SECONDS = 6.5;
/** Comet trail behind the car: [length in 1/1000 of the lap, opacity]. */
const TRAIL: [number, number][] = [
  [170, 0.12],
  [95, 0.28],
  [42, 0.7],
];

/** The NXP Cup, in one loop: a small autonomous car laps a figure-eight, leaving a light trail. */
export function NxpTrack({ label }: { label: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);
  const trailRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const car = carRef.current;
    if (!svg || !path || !car) return;
    const total = path.getTotalLength();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const place = (progress: number) => {
      const d = (((progress % 1) + 1) % 1) * total;
      const p = path.getPointAtLength(d);
      const ahead = path.getPointAtLength((d + 1.5) % total);
      const angle = (Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180) / Math.PI;
      car.setAttribute("transform", `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${angle.toFixed(1)})`);
      const head = (d / total) * 1000;
      trailRefs.current.forEach((trail, i) => {
        if (!trail) return;
        const [length] = TRAIL[i];
        trail.style.strokeDashoffset = `${-(head - length)}`;
      });
    };

    let progress = 0.28;
    place(progress);
    if (reduced) return;

    let frame = 0;
    let last = 0;
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      progress += dt / LAP_SECONDS;
      place(progress);
    };
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      last = 0;
      if (entry.isIntersecting) frame = requestAnimationFrame(loop);
    });
    observer.observe(svg);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 400 220" role="img" aria-label={label} className="h-auto w-full overflow-visible">
      <defs>
        <radialGradient id="nxp-headlight" cx="0" cy="0.5" r="1">
          <stop offset="0" style={{ stopColor: "var(--accent-2)", stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: "var(--accent-2)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      {/* Asphalt with its kerb, then the centre line */}
      <path d={TRACK} fill="none" style={{ stroke: "var(--border-strong)" }} strokeWidth={30} strokeLinejoin="round" />
      <path d={TRACK} fill="none" style={{ stroke: "var(--surface-3)" }} strokeWidth={27} strokeLinejoin="round" />
      <path ref={pathRef} d={TRACK} fill="none" style={{ stroke: "var(--fg-subtle)" }} strokeOpacity={0.45} strokeWidth={1.2} strokeDasharray="6 9" />
      {/* Start / finish line, across the top of the right loop (where the track is horizontal) */}
      <g transform="translate(289 45)" opacity={0.75}>
        {Array.from({ length: 10 }, (_, i) => {
          const row = Math.floor(i / 2);
          const col = i % 2;
          return (
            <rect key={i} x={col * 5} y={row * 5} width={5} height={5} style={{ fill: (row + col) % 2 ? "var(--fg)" : "var(--surface)" }} />
          );
        })}
      </g>
      {TRAIL.map(([length, opacity], i) => (
        <path
          key={length}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          d={TRACK}
          pathLength={1000}
          fill="none"
          style={{ stroke: "var(--accent-2)", strokeDasharray: `${length} ${1000 - length}` }}
          strokeOpacity={opacity}
          strokeWidth={4 + i}
          strokeLinecap="round"
        />
      ))}
      <g ref={carRef}>
        <ellipse cx={22} cy={0} rx={22} ry={9} fill="url(#nxp-headlight)" />
        <rect x={-10} y={-6} width={20} height={12} rx={3.5} style={{ fill: "var(--accent)" }} />
        <rect x={1} y={-4} width={6} height={8} rx={1.5} style={{ fill: "var(--accent-2)" }} opacity={0.85} />
        <rect x={-8} y={-7.5} width={5} height={2} rx={1} style={{ fill: "var(--fg)" }} opacity={0.8} />
        <rect x={-8} y={5.5} width={5} height={2} rx={1} style={{ fill: "var(--fg)" }} opacity={0.8} />
        <rect x={4} y={-7.5} width={5} height={2} rx={1} style={{ fill: "var(--fg)" }} opacity={0.8} />
        <rect x={4} y={5.5} width={5} height={2} rx={1} style={{ fill: "var(--fg)" }} opacity={0.8} />
      </g>
    </svg>
  );
}
