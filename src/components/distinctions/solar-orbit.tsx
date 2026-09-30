"use client";

import { Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";

/*
 * SolarNav AI, explained by playing with it: a satellite circles the Earth (top view, sun on
 * the left). Its panel follows the documented physics rule — tilt = 90° − sun elevation, folded
 * to 0° in the Earth's shadow. Dust and heat only show the *direction* of the correction the
 * model learns (tilt further / turn away); the sizes are illustrative, never displayed as figures.
 */

const CX = 236;
const CY = 120;
const EARTH_R = 34;
const ORBIT_R = 86;
const PERIOD = 14;
const DEG = 180 / Math.PI;
const PANEL = 15;

type Correction = "none" | "dust" | "heat" | "both";

function compute(theta: number, dust: number, temperature: number) {
  const x = CX + ORBIT_R * Math.cos(theta);
  const y = CY + ORBIT_R * Math.sin(theta);
  const sunlit = !(x > CX && Math.abs(y - CY) < EARTH_R);
  // Local zenith = radial direction, sun direction = (−1, 0).
  const elevation = Math.asin(Math.max(-1, Math.min(1, -Math.cos(theta)))) * DEG;
  const physics = sunlit ? Math.min(180, Math.max(0, 90 - elevation)) : 0;
  const dustShift = sunlit ? (dust / 100) * 12 : 0;
  const heatShift = sunlit && temperature > 100 ? Math.min(1, (temperature - 100) / 50) * 10 : 0;
  const tilt = physics + dustShift + heatShift;
  const side = Math.sin(theta) >= 0 ? 1 : -1;
  const normal = theta + side * (tilt / DEG);
  const correction: Correction =
    dustShift > 0.5 && heatShift > 0.5 ? "both" : dustShift > 0.5 ? "dust" : heatShift > 0.5 ? "heat" : "none";
  return { x, y, sunlit, elevation, physics, normal, correction };
}

export function SolarOrbit({ variant = "card" }: { variant?: "card" | "full" }) {
  const t = useTranslations("solar");
  const uid = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const satRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGRectElement>(null);
  const panelRef = useRef<SVGLineElement>(null);
  const normalRef = useRef<SVGLineElement>(null);
  const rayRef = useRef<SVGLineElement>(null);
  const elevationRef = useRef<HTMLElement>(null);
  const sunlitRef = useRef<HTMLElement>(null);
  const angleRef = useRef<HTMLElement>(null);
  const correctionRef = useRef<HTMLElement>(null);
  const positionRef = useRef<HTMLInputElement>(null);

  const theta = useRef(2.35);
  const [playing, setPlaying] = useState(false);
  const [dust, setDust] = useState(20);
  const [temperature, setTemperature] = useState(40);
  const settings = useRef({ dust, temperature });
  const labels = useRef({ sunlit: "", shadow: "", fold: "", none: "", dust: "", heat: "" });

  /** Writes the current frame straight into the SVG and the readouts (no React render per frame). */
  const paint = useCallback(() => {
    const f = compute(theta.current, settings.current.dust, settings.current.temperature);
    const l = labels.current;
    satRef.current?.setAttribute("transform", `translate(${f.x.toFixed(2)} ${f.y.toFixed(2)})`);
    bodyRef.current?.setAttribute("transform", `rotate(${((theta.current * DEG) % 360).toFixed(1)})`);
    const along = f.normal + Math.PI / 2;
    const px = (Math.cos(along) * PANEL).toFixed(2);
    const py = (Math.sin(along) * PANEL).toFixed(2);
    const panel = panelRef.current;
    if (panel) {
      panel.setAttribute("x1", px);
      panel.setAttribute("y1", py);
      panel.setAttribute("x2", String(-Number(px)));
      panel.setAttribute("y2", String(-Number(py)));
      panel.style.stroke = f.sunlit ? "var(--accent-2)" : "var(--fg-subtle)";
    }
    normalRef.current?.setAttribute("x2", (Math.cos(f.normal) * 20).toFixed(2));
    normalRef.current?.setAttribute("y2", (Math.sin(f.normal) * 20).toFixed(2));
    // Light reaching the panel ∝ cos(angle between its normal and the sun direction).
    const facing = Math.max(0, -Math.cos(f.normal));
    rayRef.current?.setAttribute("stroke-opacity", f.sunlit ? (0.15 + 0.6 * facing).toFixed(2) : "0");
    if (elevationRef.current) elevationRef.current.textContent = `${Math.round(f.elevation)}°`;
    if (sunlitRef.current) sunlitRef.current.textContent = f.sunlit ? `1 · ${l.sunlit}` : `0 · ${l.shadow}`;
    if (angleRef.current) angleRef.current.textContent = f.sunlit ? `${Math.round(f.physics)}°` : `0° · ${l.fold}`;
    if (correctionRef.current) {
      correctionRef.current.textContent =
        f.correction === "both" ? `${l.dust} + ${l.heat}` : f.correction === "none" ? l.none : l[f.correction];
    }
    const position = positionRef.current;
    if (position && document.activeElement !== position) {
      position.value = String(Math.round((((theta.current * DEG) % 360) + 360) % 360));
    }
  }, []);

  // Repaint whenever a setting or the language changes (also while paused).
  useEffect(() => {
    settings.current = { dust, temperature };
    labels.current = {
      sunlit: t("sunlit"),
      shadow: t("shadow"),
      fold: t("fold"),
      none: t("correctionNone"),
      dust: t("correctionDust"),
      heat: t("correctionHeat"),
    };
    paint();
  }, [dust, temperature, t, paint]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !playing) return;
    let frame = 0;
    let last = 0;
    let visible = true;
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible) {
        last = 0;
        return;
      }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      theta.current = (theta.current + (dt * Math.PI * 2) / PERIOD) % (Math.PI * 2);
      paint();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(svg);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [playing, paint]);

  // Autoplay once, unless the visitor prefers reduced motion.
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(true);
  }, []);

  const onPosition = (e: ChangeEvent<HTMLInputElement>) => {
    setPlaying(false);
    theta.current = (Number(e.target.value) / DEG) % (Math.PI * 2);
    paint();
  };

  const full = variant === "full";
  const rays = [34, 62, 90, 118, 146, 174, 202];

  return (
    <div className="flex flex-col gap-4">
      <svg ref={svgRef} viewBox="0 0 400 240" role="img" aria-label={t("label")} className="h-auto w-full overflow-visible">
        <defs>
          <radialGradient id={`${uid}-sun`}>
            <stop offset="0" style={{ stopColor: "var(--warning)", stopOpacity: 0.9 }} />
            <stop offset="0.45" style={{ stopColor: "var(--warning)", stopOpacity: 0.35 }} />
            <stop offset="1" style={{ stopColor: "var(--warning)", stopOpacity: 0 }} />
          </radialGradient>
          <linearGradient id={`${uid}-earth`} x1="0" x2="1">
            <stop offset="0" style={{ stopColor: "var(--accent-2)", stopOpacity: 0.95 }} />
            <stop offset="0.55" style={{ stopColor: "var(--accent)", stopOpacity: 0.75 }} />
            <stop offset="1" style={{ stopColor: "var(--surface-3)", stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id={`${uid}-shadow`} x1="0" x2="1">
            <stop offset="0" style={{ stopColor: "var(--bg)", stopOpacity: 0.85 }} />
            <stop offset="1" style={{ stopColor: "var(--bg)", stopOpacity: 0 }} />
          </linearGradient>
        </defs>

        {/* Sunlight */}
        {rays.map((y, i) => (
          <line
            key={y}
            x1={52}
            y1={y}
            x2={396}
            y2={y}
            className="flow-dash"
            style={{ stroke: "var(--warning)", animationDuration: `${2.4 + (i % 3) * 0.5}s` }}
            strokeOpacity={0.14}
            strokeWidth={1}
          />
        ))}
        <circle cx={26} cy={CY} r={30} fill={`url(#${uid}-sun)`} />
        <circle cx={26} cy={CY} r={10} style={{ fill: "var(--warning)" }} />
        <text x={26} y={CY + 44} textAnchor="middle" style={{ fill: "var(--fg-muted)", fontFamily: "var(--font-mono)" }} fontSize={10}>
          {t("sun")}
        </text>

        {/* Earth and its shadow */}
        <rect x={CX} y={CY - EARTH_R} width={400 - CX} height={EARTH_R * 2} fill={`url(#${uid}-shadow)`} />
        <circle cx={CX} cy={CY} r={ORBIT_R} fill="none" style={{ stroke: "var(--border-strong)" }} strokeDasharray="3 5" />
        <circle cx={CX} cy={CY} r={EARTH_R} fill={`url(#${uid}-earth)`} />
        <text x={CX} y={CY + 4} textAnchor="middle" style={{ fill: "var(--bg)", fontFamily: "var(--font-mono)" }} fontSize={9.5} fontWeight={600}>
          {t("earth")}
        </text>

        {/* Satellite */}
        <g ref={satRef}>
          <line ref={rayRef} x1={0} y1={0} x2={-78} y2={0} style={{ stroke: "var(--warning)" }} strokeWidth={2} strokeLinecap="round" />
          <line ref={normalRef} x1={0} y1={0} x2={20} y2={0} style={{ stroke: "var(--accent-3)" }} strokeWidth={1.2} strokeDasharray="2 2" />
          <rect ref={bodyRef} x={-4.5} y={-4.5} width={9} height={9} rx={2} style={{ fill: "var(--fg)" }} />
          <line ref={panelRef} x1={0} y1={-PANEL} x2={0} y2={PANEL} strokeWidth={4.5} strokeLinecap="round" />
        </g>
      </svg>

      <dl className={cn("grid grid-cols-3 gap-2 font-mono text-[0.68rem] sm:gap-x-4 sm:text-[0.72rem]", full && "sm:grid-cols-4")}>
        <Readout label="is_sunlit" valueRef={sunlitRef} />
        <Readout label="sun_elevation" valueRef={elevationRef} />
        <Readout label={t("angle")} valueRef={angleRef} accent />
        {full ? <Readout label={t("correction")} valueRef={correctionRef} className="col-span-3 sm:col-span-1" /> : null}
      </dl>
      {!full ? (
        <p className="-mt-1 flex flex-wrap items-center gap-x-2 font-mono text-[0.7rem] text-subtle">
          {t("correction")}
          <span aria-hidden>→</span>
          <span ref={correctionRef} className="text-fg" />
        </p>
      ) : null}

      <div className={cn("grid items-end gap-3", full ? "sm:grid-cols-[auto_1fr_1fr_1fr]" : "grid-cols-[auto_1fr_1fr]")}>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? t("pause") : t("play")}
          title={playing ? t("pause") : t("play")}
          className="grid size-9 place-items-center rounded-full border border-border-strong bg-surface-2 text-fg transition-colors hover:border-accent/60"
        >
          {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
        </button>
        {full ? (
          <Slider id={`${uid}-pos`} label={t("position")} min={0} max={359} defaultValue={135} inputRef={positionRef} onChange={onPosition} unit="°" />
        ) : null}
        <Slider
          id={`${uid}-dust`}
          label={<VariableLabel name="dust_level" human={t("dust")} />}
          min={0}
          max={100}
          step={5}
          value={dust}
          onChange={(e) => setDust(Number(e.target.value))}
          unit="%"
        />
        <Slider
          id={`${uid}-temp`}
          label={<VariableLabel name="surface_temp" human={t("temperature")} />}
          min={-150}
          max={150}
          step={10}
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          unit="°C"
        />
      </div>
      <p className="text-xs text-subtle">
        <span className="font-mono text-accent-fg">{t("rule")}</span> — {t("note")}
      </p>
    </div>
  );
}

function Readout({
  label,
  valueRef,
  accent = false,
  className,
}: {
  label: string;
  valueRef: React.RefObject<HTMLElement | null>;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 rounded-xl border border-border bg-surface-2/70 px-2.5 py-2 sm:px-3", className)}>
      <dt className="truncate text-subtle">{label}</dt>
      <dd ref={valueRef} className={cn("mt-0.5 text-[0.8rem] leading-snug break-words sm:text-sm", accent ? "text-accent-fg" : "text-fg")} />
    </div>
  );
}

/** Model input name, with its plain-language label when there is room. */
function VariableLabel({ name, human }: { name: string; human: string }) {
  return (
    <>
      <span className="sr-only">{human} — </span>
      {name}
      <span aria-hidden className="hidden sm:inline"> · {human}</span>
    </>
  );
}

function Slider({
  id,
  label,
  unit,
  inputRef,
  value,
  defaultValue,
  ...props
}: {
  id: string;
  label: React.ReactNode;
  unit: string;
  min: number;
  max: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="flex items-baseline justify-between gap-2 font-mono text-[0.68rem] text-subtle">
        <span className="truncate">{label}</span>
        {value !== undefined ? (
          <span className="shrink-0 text-fg">
            {value}
            {unit}
          </span>
        ) : null}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="range"
        value={value}
        defaultValue={defaultValue}
        aria-valuetext={value !== undefined ? `${value} ${unit}` : undefined}
        className="mt-1.5 h-1.5 w-full cursor-pointer accent-accent-2"
        {...props}
      />
    </div>
  );
}
