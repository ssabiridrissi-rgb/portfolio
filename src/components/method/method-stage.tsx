import { Fragment, type CSSProperties, type ReactNode } from "react";

/*
 * The sticky visual of the method section (viewBox 520 × 420). Every group has one pose per
 * step; CSS transitions do the rest. Labels come from the content (step titles) and messages.
 */

type Pose = { x: number; y: number; s?: number; r?: number; o: number; d?: number };

function Group({ pose, children, className }: { pose: Pose; children: ReactNode; className?: string }) {
  const style: CSSProperties = {
    transform: `translate(${pose.x}px, ${pose.y}px) rotate(${pose.r ?? 0}deg) scale(${pose.s ?? 1})`,
    opacity: pose.o,
    transformBox: "fill-box",
    transformOrigin: "center",
    transition: "transform 0.9s var(--ease-out-expo), opacity 0.6s var(--ease-out-expo)",
    transitionDelay: `${pose.d ?? 0}ms`,
  };
  return (
    <g style={style} className={className}>
      {children}
    </g>
  );
}

const SOURCES = [
  { label: "XLSX", rows: [0.9, 0.55, 0.75], at: { x: 70, y: 80, r: -8 }, funnel: { x: 190, y: 58 } },
  { label: "CSV", rows: [0.6, 0.95, 0.4], at: { x: 440, y: 64, r: 7 }, funnel: { x: 237, y: 46 } },
  { label: "SQL", rows: [0.8, 0.45, 0.9], at: { x: 92, y: 300, r: 5 }, funnel: { x: 284, y: 46 } },
  { label: "API", rows: [0.5, 0.85, 0.65], at: { x: 430, y: 290, r: -6 }, funnel: { x: 331, y: 58 } },
];

const DIMS = [
  { x: 110, y: 104 },
  { x: 410, y: 104 },
  { x: 110, y: 316 },
  { x: 410, y: 316 },
];

const BARS = [0.35, 0.52, 0.44, 0.63, 0.58, 0.76, 0.7, 0.92];

export type StageLabels = {
  etl: string;
  fact: string;
  dim: string;
  kpi: string;
  recommendation: string;
  validated: string;
};

export function MethodStage({ step, labels }: { step: number; labels: StageLabels }) {
  const text = { fill: "var(--fg)", fontFamily: "var(--font-mono)" } as const;
  const muted = { fill: "var(--fg-muted)", fontFamily: "var(--font-mono)" } as const;

  return (
    <svg viewBox="0 0 520 420" className="h-auto w-full overflow-visible" aria-hidden>
      {/* 1 · Sources: messy files floating around */}
      {SOURCES.map((src, i) => {
        const pose: Pose =
          step === 0
            ? { ...src.at, o: 1, d: i * 60 }
            : step === 1
              ? { ...src.funnel, s: 0.62, o: 0.95, d: i * 70 }
              : { x: 260, y: 150, s: 0.2, o: 0, d: i * 40 };
        return (
          <Group key={src.label} pose={pose}>
            <g className="float-y" style={{ "--float-delay": `${i * -0.9}s`, "--float-duration": `${3.6 + i * 0.4}s` } as CSSProperties}>
              <rect x={-44} y={-30} width={88} height={60} rx={10} style={{ fill: "var(--surface-2)", stroke: "var(--border-strong)" }} />
              <text x={-32} y={-10} style={text} fontSize={11} fontWeight={600}>
                {src.label}
              </text>
              {src.rows.map((w, k) => (
                <rect key={k} x={-32} y={-1 + k * 9} width={64 * w} height={4.5} rx={2} style={{ fill: k === 1 ? "var(--warning)" : "var(--fg-subtle)" }} opacity={k === 1 ? 0.55 : 0.5} />
              ))}
            </g>
          </Group>
        );
      })}

      {/* 2 · ETL funnel with data falling through */}
      <Group pose={step === 1 ? { x: 0, y: 0, o: 1 } : step === 0 ? { x: 0, y: 10, o: 0.12 } : { x: 0, y: -16, o: 0 }}>
        <path d="M 150 86 L 370 86 L 290 190 L 290 214 L 230 214 L 230 190 Z" style={{ fill: "var(--accent-3)", stroke: "var(--accent-3)" }} fillOpacity={0.1} strokeOpacity={0.55} strokeWidth={1.4} />
        {[0, 1, 2].map((k) => (
          <line
            key={k}
            x1={240 + k * 20}
            y1={100}
            x2={250 + k * 10}
            y2={208}
            className="flow-dash"
            style={{ stroke: "var(--accent-2)", animationDuration: `${1 + k * 0.3}s` }}
            strokeWidth={1.6}
            strokeOpacity={0.8}
          />
        ))}
        <text x={260} y={146} textAnchor="middle" style={text} fontSize={15} fontWeight={700}>
          {labels.etl}
        </text>
      </Group>

      {/* Clean, typed rows coming out of the ETL */}
      {[0, 1, 2, 3, 4].map((k) => (
        <Group key={k} pose={step === 1 ? { x: 0, y: 0, o: 1, d: 250 + k * 90 } : step === 0 ? { x: 0, y: -12, o: 0 } : { x: 0, y: 30, o: 0, d: k * 30 }}>
          <rect x={205} y={228 + k * 15} width={110} height={9} rx={3} style={{ fill: "var(--accent-2)" }} opacity={0.75 - k * 0.08} />
          <rect x={205} y={228 + k * 15} width={24} height={9} rx={3} style={{ fill: "var(--accent)" }} />
        </Group>
      ))}

      {/* 3 · Star schema */}
      <Group pose={step === 2 ? { x: 0, y: 0, o: 1 } : step < 2 ? { x: 0, y: 24, s: 0.9, o: 0 } : { x: 0, y: -10, s: 0.85, o: 0 }}>
        {DIMS.map((dim) => (
          <line
            key={`l-${dim.x}-${dim.y}`}
            x1={260}
            y1={210}
            x2={dim.x}
            y2={dim.y}
            style={{
              stroke: "var(--accent)",
              strokeDasharray: 240,
              strokeDashoffset: step === 2 ? 0 : 240,
              transition: "stroke-dashoffset 1.1s var(--ease-out-expo) 250ms",
            }}
            strokeOpacity={0.6}
            strokeWidth={1.5}
          />
        ))}
        {DIMS.map((dim, i) => (
          <g key={`d-${dim.x}-${dim.y}`}>
            <rect x={dim.x - 50} y={dim.y - 24} width={100} height={48} rx={10} style={{ fill: "var(--surface-2)", stroke: "var(--border-strong)" }} />
            <text x={dim.x} y={dim.y + 4} textAnchor="middle" style={muted} fontSize={11}>
              {labels.dim}_{i + 1}
            </text>
          </g>
        ))}
        <rect x={190} y={176} width={140} height={68} rx={14} style={{ fill: "var(--surface-2)", stroke: "var(--accent)" }} strokeWidth={1.6} />
        <text x={260} y={206} textAnchor="middle" style={text} fontSize={14} fontWeight={700}>
          {labels.fact}
        </text>
        <text x={260} y={226} textAnchor="middle" style={muted} fontSize={10}>
          fact_*
        </text>
      </Group>

      {/* 4 · Dashboard */}
      <Group pose={step === 3 ? { x: 0, y: 0, o: 1 } : step < 3 ? { x: 0, y: 28, o: 0 } : { x: -118, y: 18, s: 0.56, o: 0.35 }}>
        <rect x={50} y={60} width={420} height={300} rx={18} style={{ fill: "var(--surface)", stroke: "var(--border-strong)" }} />
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <rect x={70 + k * 130} y={80} width={120} height={56} rx={10} style={{ fill: "var(--surface-2)", stroke: "var(--border)" }} />
            <text x={84 + k * 130} y={102} style={muted} fontSize={10}>
              {labels.kpi} {k + 1}
            </text>
            <rect x={84 + k * 130} y={112} width={[62, 48, 70][k]} height={10} rx={4} style={{ fill: k === 1 ? "var(--accent-2)" : "var(--fg)" }} opacity={0.8} />
          </g>
        ))}
        {BARS.map((h, k) => (
          <rect
            key={k}
            x={84 + k * 46}
            y={336 - h * 170}
            width={28}
            height={h * 170}
            rx={5}
            style={{
              fill: k === BARS.length - 1 ? "var(--accent-2)" : "var(--accent)",
              opacity: k === BARS.length - 1 ? 0.95 : 0.35 + h * 0.5,
              transformBox: "fill-box",
              transformOrigin: "bottom",
              transform: `scaleY(${step >= 3 ? 1 : 0.05})`,
              transition: `transform 0.9s var(--ease-out-expo) ${200 + k * 70}ms`,
            }}
          />
        ))}
        <polyline
          points={BARS.map((h, k) => `${98 + k * 46},${326 - h * 170}`).join(" ")}
          fill="none"
          style={{
            stroke: "var(--accent-3)",
            strokeDasharray: 520,
            strokeDashoffset: step >= 3 ? 0 : 520,
            transition: "stroke-dashoffset 1.4s var(--ease-out-expo) 500ms",
          }}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Group>

      {/* 5 · Decision: an explained ranking, signed off by a human */}
      <Group pose={step === 4 ? { x: 0, y: 0, o: 1, d: 150 } : { x: 40, y: 0, o: 0 }}>
        <rect x={250} y={70} width={240} height={280} rx={18} style={{ fill: "var(--surface)", stroke: "var(--accent-2)" }} strokeOpacity={0.6} strokeWidth={1.4} />
        <text x={272} y={104} style={text} fontSize={13} fontWeight={700}>
          {labels.recommendation}
        </text>
        {[0.92, 0.7, 0.52].map((w, k) => (
          <Fragment key={k}>
            <rect
              x={268}
              y={124 + k * 52}
              width={204}
              height={40}
              rx={10}
              style={{ fill: k === 0 ? "var(--accent-2)" : "var(--surface-2)", stroke: k === 0 ? "var(--accent-2)" : "none" }}
              fillOpacity={k === 0 ? 0.14 : 1}
              strokeOpacity={0.5}
            />
            <text x={282} y={149 + k * 52} style={k === 0 ? text : muted} fontSize={12} fontWeight={700}>
              {k + 1}
            </text>
            <rect x={302} y={140 + k * 52} width={150 * w} height={8} rx={4} style={{ fill: k === 0 ? "var(--accent-2)" : "var(--fg-subtle)" }} opacity={k === 0 ? 0.9 : 0.5} />
          </Fragment>
        ))}
        <g
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            transform: step === 4 ? "scale(1) rotate(-6deg)" : "scale(0.4) rotate(-30deg)",
            opacity: step === 4 ? 1 : 0,
            transition: "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 700ms, opacity 0.4s ease 700ms",
          }}
        >
          <rect x={300} y={292} width={140} height={38} rx={19} style={{ fill: "var(--success-bg)", stroke: "var(--success)" }} strokeWidth={1.5} />
          <path d="M 318 311 l 6 6 l 11 -12" fill="none" style={{ stroke: "var(--success)" }} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          <text x={344} y={316} style={{ fill: "var(--success)", fontFamily: "var(--font-mono)" }} fontSize={12} fontWeight={700}>
            {labels.validated}
          </text>
        </g>
      </Group>
    </svg>
  );
}
