import type { WireColor, WiringSection } from "@/lib/types";

export const WIRE_HEX: Record<WireColor, string> = {
  red: "#f43f5e",
  black: "#94a3b8",
  yellow: "#facc15",
  blue: "#38bdf8",
  green: "#39ff88",
  white: "#e2e8f0",
  orange: "#fb923c",
  purple: "#a78bfa",
};

const BOX_W = 210;
const BOX_H = 56;
const COL_X = [24, 426];
const ROW_GAP = 104;
const WIDTH = 660;

type Pt = { x: number; y: number };
function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

/** Lays nodes out in two columns and draws colour-coded, numbered wires between them. */
export function WiringDiagram({ wiring }: { wiring: WiringSection }) {
  const nodes = wiring.nodes.length ? wiring.nodes : Array.from(new Set(wiring.connections.flatMap((c) => [c.from, c.to])));
  const pos = new Map(nodes.map((n, i) => [n, { x: COL_X[i % 2], y: 24 + Math.floor(i / 2) * ROW_GAP, col: i % 2 }]));
  const rows = Math.ceil(nodes.length / 2);
  const height = 24 + rows * ROW_GAP - (ROW_GAP - BOX_H) + 24;
  const usage = new Map<string, number>();

  const anchor = (name: string, side: "left" | "right") => {
    const p = pos.get(name)!;
    const k = usage.get(name + side) ?? 0;
    usage.set(name + side, k + 1);
    return { x: side === "right" ? p.x + BOX_W : p.x, y: p.y + 12 + (k % 4) * 10 };
  };

  const wires = wiring.connections
    .filter((c) => pos.has(c.from) && pos.has(c.to))
    .map((c, i) => {
      const a = pos.get(c.from)!;
      const b = pos.get(c.to)!;
      // Stagger number badges along each wire so parallel wires don't overlap.
      const t = 0.3 + 0.2 * (i % 3);
      let d: string;
      let mid: Pt;
      if (a.col !== b.col) {
        const [l, r] = a.col === 0 ? [c.from, c.to] : [c.to, c.from];
        const s = anchor(l, "right");
        const e = anchor(r, "left");
        const dx = (e.x - s.x) / 2;
        d = `M${s.x},${s.y} C${s.x + dx},${s.y} ${e.x - dx},${e.y} ${e.x},${e.y}`;
        mid = bezier(s, { x: s.x + dx, y: s.y }, { x: e.x - dx, y: e.y }, e, t);
      } else {
        const side = a.col === 0 ? "right" : "left";
        const s = anchor(c.from, side);
        const e = anchor(c.to, side);
        const bulge = side === "right" ? 70 + (i % 3) * 18 : -(70 + (i % 3) * 18);
        d = `M${s.x},${s.y} C${s.x + bulge},${s.y} ${e.x + bulge},${e.y} ${e.x},${e.y}`;
        mid = bezier(s, { x: s.x + bulge, y: s.y }, { x: e.x + bulge, y: e.y }, e, t);
      }
      return { c, d, mid, n: i + 1 };
    });

  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-background-2">
      <svg viewBox={`0 0 ${WIDTH} ${Math.max(height, 120)}`} className="h-auto w-full" role="img" aria-labelledby="wiring-title wiring-desc">
        <title id="wiring-title">Wiring diagram</title>
        <desc id="wiring-desc">{wiring.summary}</desc>
        <defs>
          <pattern id="wd-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="#1f2a5a" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wd-grid)" />
        {wires.map(({ c, d, n }) => (
          <path key={`w${n}`} d={d} fill="none" stroke={WIRE_HEX[c.wire]} strokeWidth={2.6} strokeLinecap="round" opacity={0.92} />
        ))}
        {nodes.map((n) => {
          const p = pos.get(n)!;
          return (
            <g key={n}>
              <rect x={p.x} y={p.y} width={BOX_W} height={BOX_H} rx={12} fill="#0d1433" stroke="#3b82f6" strokeOpacity={0.6} strokeWidth={1.4} />
              <rect x={p.x + 10} y={p.y + 18} width={6} height={20} rx={2} fill="#39ff88" opacity={0.7} />
              <text x={p.x + 26} y={p.y + BOX_H / 2 + 5} fill="#e8ecff" fontSize={14} fontWeight={600} fontFamily="var(--font-inter), sans-serif">
                {n.length > 22 ? n.slice(0, 21) + "…" : n}
              </text>
            </g>
          );
        })}
        {wires.map(({ c, mid, n }) => (
          <g key={`n${n}`}>
            <circle cx={mid.x} cy={mid.y} r={10} fill="#060a1a" stroke={WIRE_HEX[c.wire]} strokeWidth={2} />
            <text x={mid.x} y={mid.y + 4} textAnchor="middle" fill="#e8ecff" fontSize={11} fontWeight={700} fontFamily="var(--font-inter), sans-serif">{n}</text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-border px-4 py-2 text-xs text-muted-foreground">Schematic overview: numbers match the connection table. Colours show suggested wire colours.</figcaption>
    </figure>
  );
}
