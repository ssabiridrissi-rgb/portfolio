import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { DiagramId, Localized } from "@/types/content";
import { diagrams, type FlowDiagram, type FlowNode, type StarDiagram, type Tone } from "./diagram-data";

const NODE_W = 150;
const NODE_H = 58;
const GAP_Y = 22;
const PAD = 26;

const TONE: Record<Tone, { stroke: string; dot: string }> = {
  accent: { stroke: "var(--accent)", dot: "var(--accent)" },
  cyan: { stroke: "var(--accent-2)", dot: "var(--accent-2)" },
  violet: { stroke: "var(--accent-3)", dot: "var(--accent-3)" },
  neutral: { stroke: "var(--border-strong)", dot: "var(--fg-subtle)" },
};

type Box = { x: number; y: number; node: FlowNode };

function text(value: string | Localized | undefined, locale: Locale) {
  if (value === undefined) return "";
  return typeof value === "string" ? value : value[locale];
}

function NodeBox({ box, locale, uid }: { box: Box; locale: Locale; uid: string }) {
  const tone = TONE[box.node.tone ?? "neutral"];
  return (
    <g>
      <rect
        x={box.x}
        y={box.y}
        width={NODE_W}
        height={NODE_H}
        rx={12}
        style={{ fill: "var(--surface-2)", stroke: tone.stroke, strokeOpacity: box.node.tone === "neutral" ? 1 : 0.65 }}
        strokeWidth={1.2}
        filter={`url(#${uid}-shadow)`}
      />
      <circle cx={box.x + 14} cy={box.y + 20} r={3} style={{ fill: tone.dot }} />
      <text x={box.x + 24} y={box.y + 24} style={{ fill: "var(--fg)", fontFamily: "var(--font-sans)" }} fontSize={13} fontWeight={600}>
        {text(box.node.label, locale)}
      </text>
      {box.node.sub ? (
        <text x={box.x + 14} y={box.y + 43} style={{ fill: "var(--fg-muted)", fontFamily: "var(--font-mono)" }} fontSize={10}>
          {text(box.node.sub, locale)}
        </text>
      ) : null}
    </g>
  );
}

function Defs({ uid }: { uid: string }) {
  return (
    <defs>
      <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" style={{ fill: "var(--accent-2)" }} />
      </marker>
      <filter id={`${uid}-shadow`} x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.18" />
      </filter>
    </defs>
  );
}

function Edge({ d, uid }: { d: string; uid: string }) {
  return (
    <g>
      <path d={d} fill="none" style={{ stroke: "var(--border-strong)" }} strokeWidth={1.4} />
      <path d={d} fill="none" className="flow-dash" style={{ stroke: "var(--accent-2)" }} strokeWidth={1.6} markerEnd={`url(#${uid}-arrow)`} />
    </g>
  );
}

function Flow({ diagram, locale, uid }: { diagram: FlowDiagram; locale: Locale; uid: string }) {
  const cols = diagram.columns.length;
  const maxRows = Math.max(...diagram.columns.map((c) => c.length));
  const hasGroups = Boolean(diagram.groups?.length);
  const groupPad = hasGroups ? 34 : 0;
  const colGap = 64;
  const width = PAD * 2 + cols * NODE_W + (cols - 1) * colGap + groupPad;
  const contentH = maxRows * NODE_H + (maxRows - 1) * GAP_Y;
  const height = Math.max(190, contentH + PAD * 2 + groupPad * 2);

  const boxes = new Map<string, Box>();
  diagram.columns.forEach((column, ci) => {
    const colH = column.length * NODE_H + (column.length - 1) * GAP_Y;
    const x = PAD + ci * (NODE_W + colGap) + (hasGroups && ci >= 2 ? groupPad / 2 : 0);
    column.forEach((node, ri) => {
      boxes.set(node.id, { x, y: (height - colH) / 2 + ri * (NODE_H + GAP_Y), node });
    });
  });

  const edgePath = (from: Box, to: Box) => {
    if (Math.abs(from.x - to.x) < 1) {
      const x = from.x + NODE_W / 2;
      return `M ${x} ${from.y + NODE_H} L ${x} ${to.y - 2}`;
    }
    const x1 = from.x + NODE_W;
    const y1 = from.y + NODE_H / 2;
    const x2 = to.x - 2;
    const y2 = to.y + NODE_H / 2;
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="presentation">
      <Defs uid={uid} />
      {diagram.groups?.map((group, gi) => {
        const members = group.nodes.map((id) => boxes.get(id)).filter((b): b is Box => Boolean(b));
        const inset = gi === 0 ? 12 : 34;
        const x = Math.min(...members.map((b) => b.x)) - inset;
        const y = Math.min(...members.map((b) => b.y)) - inset - 14;
        const w = Math.max(...members.map((b) => b.x + NODE_W)) + inset - x;
        const h = Math.max(...members.map((b) => b.y + NODE_H)) + inset - y;
        const tone = TONE[group.tone ?? "neutral"];
        return (
          <g key={gi}>
            <rect x={x} y={y} width={w} height={h} rx={16} fill="none" style={{ stroke: tone.stroke }} strokeOpacity={0.45} strokeDasharray="5 5" />
            <text x={x + 12} y={y + 15} style={{ fill: tone.stroke, fontFamily: "var(--font-mono)" }} fontSize={9.5} fontWeight={600}>
              {text(group.label, locale)}
            </text>
          </g>
        );
      })}
      {diagram.edges.map((edge) => {
        const from = boxes.get(edge.from);
        const to = boxes.get(edge.to);
        if (!from || !to) return null;
        return <Edge key={`${edge.from}-${edge.to}`} d={edgePath(from, to)} uid={uid} />;
      })}
      {[...boxes.values()].map((box) => (
        <NodeBox key={box.node.id} box={box} locale={locale} uid={uid} />
      ))}
    </svg>
  );
}

function Star({ diagram, locale, uid }: { diagram: StarDiagram; locale: Locale; uid: string }) {
  const width = diagram.consumer ? 760 : 560;
  const height = 330;
  const cx = 280;
  const cy = height / 2;
  const rx = 205;
  const ry = 118;
  const fact: Box = { x: cx - NODE_W / 2, y: cy - NODE_H / 2, node: diagram.fact };
  const dims: Box[] = diagram.dimensions.map((node, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / diagram.dimensions.length;
    return { x: cx + rx * Math.cos(angle) - NODE_W / 2, y: cy + ry * Math.sin(angle) - NODE_H / 2, node };
  });
  const consumer: Box | null = diagram.consumer ? { x: width - PAD - NODE_W, y: cy - NODE_H / 2, node: diagram.consumer } : null;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="presentation">
      <Defs uid={uid} />
      {dims.map((d) => (
        <line
          key={d.node.id}
          x1={cx}
          y1={cy}
          x2={d.x + NODE_W / 2}
          y2={d.y + NODE_H / 2}
          style={{ stroke: "var(--accent)" }}
          strokeOpacity={0.45}
          strokeWidth={1.4}
          strokeDasharray="4 5"
        />
      ))}
      {consumer ? (
        <Edge
          uid={uid}
          d={`M ${Math.max(...dims.map((d) => d.x + NODE_W)) + 6} ${cy} L ${consumer.x - 2} ${cy}`}
        />
      ) : null}
      {dims.map((d) => (
        <NodeBox key={d.node.id} box={d} locale={locale} uid={uid} />
      ))}
      <NodeBox box={fact} locale={locale} uid={uid} />
      {consumer ? <NodeBox box={consumer} locale={locale} uid={uid} /> : null}
    </svg>
  );
}

/** Architecture schema for a project, drawn in the site's colours (inline SVG, theme-aware). */
export function ArchitectureDiagram({
  id,
  locale,
  label,
  className,
}: {
  id: DiagramId;
  locale: Locale;
  label: string;
  className?: string;
}) {
  const diagram = diagrams[id];
  const uid = `dg-${id}`;
  return (
    <figure role="img" aria-label={label} className={cn("relative", className)}>
      {diagram.kind === "flow" ? <Flow diagram={diagram} locale={locale} uid={uid} /> : <Star diagram={diagram} locale={locale} uid={uid} />}
    </figure>
  );
}

const DOT: Record<Tone, string> = {
  accent: "bg-accent",
  cyan: "bg-accent-2",
  violet: "bg-accent-3",
  neutral: "bg-subtle",
};

/**
 * Card-sized preview: flow diagrams become a readable HTML pipeline (SVG text would be too small),
 * star schemas keep their SVG.
 */
export function DiagramPreview({
  id,
  locale,
  label,
  className,
  vertical = false,
}: {
  id: DiagramId;
  locale: Locale;
  label: string;
  className?: string;
  vertical?: boolean;
}) {
  const diagram = diagrams[id];
  if (diagram.kind === "star") return <ArchitectureDiagram id={id} locale={locale} label={label} className={className} />;

  return (
    <figure role="img" aria-label={label} className={cn("relative", className)}>
      {diagram.groups?.length ? (
        <figcaption className="mb-3 flex flex-wrap gap-1.5">
          {diagram.groups.map((g) => (
            <span key={text(g.label, locale)} className="rounded-md border border-dashed border-border-strong px-2 py-0.5 font-mono text-[0.65rem] text-muted">
              {text(g.label, locale)}
            </span>
          ))}
        </figcaption>
      ) : null}
      <ol className={cn("flex", vertical ? "flex-col items-center gap-1" : "flex-wrap items-center gap-x-1.5 gap-y-2.5")}>
        {diagram.columns.map((column, ci) => (
          <li key={ci} className={cn("flex items-center", vertical ? "flex-col gap-1" : "gap-1.5")}>
            {ci > 0 ? (
              <ArrowRight aria-hidden className={cn("size-3.5 shrink-0 text-accent-2", vertical && "rotate-90")} />
            ) : null}
            <div className={cn("flex gap-1.5", vertical ? "flex-row flex-wrap justify-center" : "flex-col")}>
              {column.map((node) => (
                <div key={node.id} className="rounded-xl border border-border-strong bg-surface-2 px-2.5 py-1.5 shadow-sm">
                  <p className="flex items-center gap-1.5 text-[0.8rem] leading-tight font-semibold text-fg">
                    <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", DOT[node.tone ?? "neutral"])} />
                    {text(node.label, locale)}
                  </p>
                  {node.sub ? <p className="mt-0.5 font-mono text-[0.65rem] leading-tight text-muted">{text(node.sub, locale)}</p> : null}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
