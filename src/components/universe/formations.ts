import type { FormationName } from "./scenes";

/**
 * Point clouds for the particle universe. Each formation returns exactly `n` points as
 * [x, y, z, w] (world units, y up, z towards the camera). `w` packs the local swirl speed
 * (0–0.99 rad/s around the formation's own Y axis) plus 2 when the point is a highlight.
 * Everything is seeded, so a formation is identical on every visit.
 */

const TAU = Math.PI * 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rand = () => number;

function gauss(r: Rand) {
  let u = 0;
  while (u === 0) u = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * r());
}

class Cloud {
  readonly data: Float32Array;
  private count = 0;
  constructor(private readonly n: number) {
    this.data = new Float32Array(n * 4);
  }
  get full() {
    return this.count >= this.n;
  }
  push(x: number, y: number, z: number, swirl = 0, hot = false) {
    if (this.count >= this.n) return;
    const k = this.count * 4;
    this.data[k] = x;
    this.data[k + 1] = y;
    this.data[k + 2] = z;
    this.data[k + 3] = Math.min(Math.max(swirl, 0), 0.99) + (hot ? 2 : 0);
    this.count++;
  }
  /** Random order, so morphs look like a swarm re-forming rather than a sliding block. */
  shuffled(r: Rand) {
    const d = this.data;
    for (let i = this.n - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      for (let c = 0; c < 4; c++) {
        const tmp = d[i * 4 + c];
        d[i * 4 + c] = d[j * 4 + c];
        d[j * 4 + c] = tmp;
      }
    }
    return d;
  }
}

function fibonacci(k: number, total: number, radius: number): [number, number, number] {
  const y = 1 - (2 * (k + 0.5)) / total;
  const ring = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = k * GOLDEN_ANGLE;
  return [Math.cos(theta) * ring * radius, y * radius, Math.sin(theta) * ring * radius];
}

/** Hero: a two-armed spiral galaxy with differential rotation, dense enough to read around the portrait. */
function galaxy(n: number, r: Rand) {
  const c = new Cloud(n);
  for (let i = 0; i < n; i++) {
    const u = i / n;
    if (u < 0.07) {
      const rad = Math.abs(gauss(r)) * 0.09;
      const th = r() * TAU;
      c.push(Math.cos(th) * rad, gauss(r) * 0.035, Math.sin(th) * rad, 0.6, r() < 0.2);
    } else if (u < 0.9) {
      const t = Math.pow(r(), 0.85);
      const rad = 0.16 + t * 1.3;
      const th = (i % 2) * Math.PI + rad * 2.3 + gauss(r) * (0.13 + 0.12 * (1 - t));
      const spread = gauss(r) * 0.035;
      c.push(Math.cos(th) * rad + spread, gauss(r) * 0.025 * (1.1 - t), Math.sin(th) * rad + spread, 0.2 / (rad + 0.3), r() < 0.03);
    } else {
      const rad = 0.3 + Math.sqrt(r()) * 1.45;
      const th = r() * TAU;
      c.push(Math.cos(th) * rad, gauss(r) * 0.1, Math.sin(th) * rad, 0.05);
    }
  }
  return c;
}

/** About: a data planet with a rotating ring. */
function planet(n: number, r: Rand) {
  const c = new Cloud(n);
  const sphere = Math.floor(n * 0.6);
  for (let i = 0; i < sphere; i++) {
    const [x, y, z] = fibonacci(i, sphere, 0.6);
    c.push(x + gauss(r) * 0.006, y + gauss(r) * 0.006, z + gauss(r) * 0.006, 0, r() < 0.03);
  }
  while (!c.full) {
    const rad = 0.9 + Math.pow(r(), 1.5) * 0.52;
    const th = r() * TAU;
    c.push(Math.cos(th) * rad, gauss(r) * 0.01, Math.sin(th) * rad, 0.14 / rad, r() < 0.01);
  }
  return c;
}

/** Method: an ETL funnel — wide at the top, spinning faster as data narrows down. */
function vortex(n: number, r: Rand) {
  const c = new Cloud(n);
  for (let i = 0; i < n; i++) {
    if (i / n < 0.9) {
      const t = r();
      const rad = 0.1 + 0.95 * Math.pow(1 - t, 1.7) + gauss(r) * 0.018;
      const th = r() * TAU;
      c.push(Math.cos(th) * rad, 0.95 - t * 1.75, Math.sin(th) * rad, 0.3 + 0.65 * t, r() < 0.015);
    } else {
      const rad = Math.abs(gauss(r)) * 0.035;
      const th = r() * TAU;
      c.push(Math.cos(th) * rad, -0.82 - r() * 0.55, Math.sin(th) * rad, 0.95, r() < 0.3);
    }
  }
  return c;
}

/** Experience: a double helix with rungs — a career's DNA. */
function helix(n: number, r: Rand) {
  const c = new Cloud(n);
  const radius = 0.42;
  const turns = 5 * Math.PI;
  for (let i = 0; i < n; i++) {
    if (i / n < 0.82) {
      const t = r();
      const th = t * turns + (i % 2) * Math.PI;
      c.push(Math.cos(th) * radius + gauss(r) * 0.016, (t - 0.5) * 2.3 + gauss(r) * 0.008, Math.sin(th) * radius + gauss(r) * 0.016, 0.3, r() < 0.02);
    } else {
      const t = (Math.floor(r() * 24) + 0.5) / 24;
      const th = t * turns;
      const s = r() * 2 - 1;
      c.push(Math.cos(th) * radius * s, (t - 0.5) * 2.3, Math.sin(th) * radius * s, 0.3);
    }
  }
  return c;
}

/** Projects: a 3D bar chart on a floor grid, drawn mostly by its edges. */
function bars(n: number, r: Rand) {
  const c = new Cloud(n);
  const cols = 7;
  const rows = 4;
  const gap = 0.3;
  const half = 0.075;
  const base = -0.66;
  const list: { x: number; z: number; h: number }[] = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const trend = 0.25 + 0.75 * (i / (cols - 1));
      const wave = 0.62 + 0.38 * Math.sin(i * 1.3 + j * 2.1) ** 2;
      list.push({ x: (i - (cols - 1) / 2) * gap, z: (j - (rows - 1) / 2) * gap, h: 0.18 + 1.05 * trend * wave });
    }
  }
  const tallest = Math.max(...list.map((b) => b.h));
  const total = list.reduce((sum, b) => sum + b.h + 0.3, 0);
  const floor = Math.floor(n * 0.12);
  for (let i = 0; i < floor; i++) {
    const along = (r() * 2 - 1) * 1.15;
    const line = Math.floor(r() * 7) - 3;
    if (r() < 0.5) c.push(along, base, line * 0.18, 0);
    else c.push(line * 0.36, base, along * 0.62, 0);
  }
  while (!c.full) {
    let pick = r() * total;
    let bar = list[0];
    for (const b of list) {
      pick -= b.h + 0.3;
      if (pick <= 0) {
        bar = b;
        break;
      }
    }
    const top = base + bar.h;
    const sx = r() < 0.5 ? -1 : 1;
    const sz = r() < 0.5 ? -1 : 1;
    const hot = bar.h === tallest;
    const mode = r();
    if (mode < 0.45) {
      // vertical edge
      c.push(bar.x + sx * half, base + r() * bar.h, bar.z + sz * half, 0, hot && r() < 0.3);
    } else if (mode < 0.75) {
      // top outline
      const along = (r() * 2 - 1) * half;
      if (r() < 0.5) c.push(bar.x + along, top, bar.z + sz * half, 0, hot);
      else c.push(bar.x + sx * half, top, bar.z + along, 0, hot);
    } else {
      // faint faces
      c.push(bar.x + (r() * 2 - 1) * half, base + r() * bar.h, bar.z + sz * half, 0);
    }
  }
  return c;
}

/** Distinctions: a sun, three orbits and their planets. */
function orbit(n: number, r: Rand) {
  const c = new Cloud(n);
  const radii = [0.5, 0.82, 1.15];
  const planets = radii.map((rad, k) => ({ rad, angle: k * 2.2 + 0.6 }));
  for (let i = 0; i < n; i++) {
    const u = i / n;
    if (u < 0.17) {
      const rad = Math.abs(gauss(r)) * 0.085;
      const th = r() * TAU;
      const phi = Math.acos(r() * 2 - 1);
      c.push(Math.sin(phi) * Math.cos(th) * rad, Math.cos(phi) * rad, Math.sin(phi) * Math.sin(th) * rad, 0.3, r() < 0.55);
    } else if (u < 0.8) {
      const pick = r() * (radii[0] + radii[1] + radii[2]);
      const rad = (pick < radii[0] ? radii[0] : pick < radii[0] + radii[1] ? radii[1] : radii[2]) + gauss(r) * 0.006;
      const th = r() * TAU;
      c.push(Math.cos(th) * rad, gauss(r) * 0.007, Math.sin(th) * rad, 0.34 / (rad + 0.2));
    } else if (u < 0.92) {
      const p = planets[i % 3];
      c.push(
        Math.cos(p.angle) * p.rad + gauss(r) * 0.028,
        gauss(r) * 0.028,
        Math.sin(p.angle) * p.rad + gauss(r) * 0.028,
        0.34 / (p.rad + 0.2),
        i % 3 === 1,
      );
    } else {
      const [x, y, z] = fibonacci(Math.floor(r() * 997), 997, 1.7 + r() * 0.5);
      c.push(x, y, z, 0.01);
    }
  }
  return c;
}

/** Skills: a layered network — nodes and the links between them. */
function network(n: number, r: Rand) {
  const c = new Cloud(n);
  const layers = [4, 6, 7, 6, 4];
  const nodes: { x: number; y: number; z: number; layer: number }[] = [];
  layers.forEach((count, l) => {
    for (let j = 0; j < count; j++) {
      nodes.push({ x: -1.15 + (l * 2.3) / (layers.length - 1), y: (j - (count - 1) / 2) * 0.3, z: (r() - 0.5) * 0.5, layer: l });
    }
  });
  const edges: [number, number][] = [];
  nodes.forEach((a, ia) => {
    const next = nodes.map((b, ib) => ({ b, ib })).filter(({ b }) => b.layer === a.layer + 1);
    for (let k = 0; k < Math.min(3, next.length); k++) {
      edges.push([ia, next[Math.floor(r() * next.length)].ib]);
    }
  });
  for (let i = 0; i < n; i++) {
    if (i / n < 0.4) {
      const node = nodes[Math.floor(r() * nodes.length)];
      c.push(node.x + gauss(r) * 0.03, node.y + gauss(r) * 0.03, node.z + gauss(r) * 0.03, 0, node.layer === 2 && r() < 0.4);
    } else {
      const [ia, ib] = edges[Math.floor(r() * edges.length)];
      const a = nodes[ia];
      const b = nodes[ib];
      const s = r();
      c.push(a.x + (b.x - a.x) * s, a.y + (b.y - a.y) * s + gauss(r) * 0.004, a.z + (b.z - a.z) * s, 0);
    }
  }
  return c;
}

/** GitHub: a regular data landscape. */
function terrain(n: number) {
  const c = new Cloud(n);
  const cols = Math.ceil(Math.sqrt(n * 1.9));
  const rows = Math.ceil(n / cols);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = (i / (cols - 1)) * 3.2 - 1.6;
      const z = (j / Math.max(1, rows - 1)) * 1.7 - 0.85;
      const y = 0.16 * Math.sin(x * 2.6 + z * 1.4) * Math.cos(z * 2.2 - x * 0.6) + 0.05 * Math.sin(x * 6);
      c.push(x, y, z, 0, y > 0.15);
    }
  }
  return c;
}

function latLon(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = (lat * Math.PI) / 180;
  const lambda = ((lon - 56) * Math.PI) / 180; // centred between Casablanca and Yiwu
  return [Math.cos(phi) * Math.sin(lambda) * radius, Math.sin(phi) * radius, Math.cos(phi) * Math.cos(lambda) * radius];
}

/** Education: a dotted globe with the Casablanca ↔ Yiwu arc (Morocco / China double degree). */
function globe(n: number, r: Rand) {
  const c = new Cloud(n);
  const radius = 0.78;
  const sphere = Math.floor(n * 0.76);
  for (let i = 0; i < sphere; i++) {
    const [x, y, z] = fibonacci(i, sphere, radius);
    c.push(x, y, z, 0);
  }
  const casablanca = latLon(33.57, -7.59, radius);
  const yiwu = latLon(29.31, 120.08, radius);
  const cities = Math.floor(n * 0.04);
  for (const city of [casablanca, yiwu]) {
    for (let i = 0; i < cities; i++) c.push(city[0] + gauss(r) * 0.022, city[1] + gauss(r) * 0.022, city[2] + gauss(r) * 0.022, 0, true);
  }
  const a = casablanca.map((v) => v / radius);
  const b = yiwu.map((v) => v / radius);
  const omega = Math.acos(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
  while (!c.full) {
    const t = r();
    const s1 = Math.sin((1 - t) * omega) / Math.sin(omega);
    const s2 = Math.sin(t * omega) / Math.sin(omega);
    const lift = radius + 0.3 * Math.sin(Math.PI * t);
    c.push((a[0] * s1 + b[0] * s2) * lift, (a[1] * s1 + b[1] * s2) * lift, (a[2] * s1 + b[2] * s2) * lift, 0, r() < 0.5);
  }
  return c;
}

/** Calm background dust (contact, secondary pages). */
function dust(n: number, r: Rand) {
  const c = new Cloud(n);
  for (let i = 0; i < n; i++) {
    c.push((r() * 2 - 1) * 2.5, (r() * 2 - 1) * 1.45, (r() * 2 - 1) * 1.2, 0.02 + r() * 0.05, r() < 0.01);
  }
  return c;
}

/** Entrance: particles start far outside the screen and fly in. */
export function introCloud(n: number) {
  const r = mulberry32(99);
  const c = new Cloud(n);
  for (let i = 0; i < n; i++) {
    const th = r() * TAU;
    const rad = 3.2 + r() * 2.2;
    c.push(Math.cos(th) * rad, Math.sin(th) * rad * 0.7, (r() * 2 - 1) * 0.8, 0);
  }
  return c.shuffled(r);
}

/** Finale: the name, sampled from the display font. Falls back to dust if the canvas can't draw. */
function nameCloud(n: number, r: Rand, text: string, fontFamily: string) {
  const width = 1000;
  const height = 300;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return dust(n, r);
  // Condensed poster capitals, like the name on a concert bill.
  const label = text.toUpperCase();
  let size = 300;
  ctx.font = `800 ${size}px ${fontFamily}`;
  const measured = ctx.measureText(label).width;
  if (measured > width * 0.94) size = Math.floor((size * width * 0.94) / measured);
  ctx.font = `800 ${size}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(label, width / 2, height / 2 + size * 0.04);
  const pixels = ctx.getImageData(0, 0, width, height).data;
  const filled: number[] = [];
  const stride = 3;
  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      if (pixels[(y * width + x) * 4 + 3] > 140) filled.push(x, y);
    }
  }
  if (!filled.length) return dust(n, r);
  const c = new Cloud(n);
  const count = filled.length / 2;
  const worldWidth = 2.7;
  while (!c.full) {
    const k = Math.floor(r() * count) * 2;
    const px = filled[k] + (r() - 0.5) * stride;
    const py = filled[k + 1] + (r() - 0.5) * stride;
    c.push((px / width - 0.5) * worldWidth, -(py / height - 0.5) * worldWidth * (height / width), gauss(r) * 0.03, 0, r() < 0.07);
  }
  return c;
}

const SEEDS: Record<FormationName, number> = {
  galaxy: 1,
  planet: 2,
  vortex: 3,
  helix: 4,
  bars: 5,
  orbit: 6,
  network: 7,
  terrain: 8,
  globe: 9,
  dust: 10,
  name: 11,
};

export function buildFormation(name: FormationName, n: number, options: { text: string; fontFamily: string }): Float32Array {
  const r = mulberry32(SEEDS[name] * 7919);
  const cloud = (() => {
    switch (name) {
      case "galaxy":
        return galaxy(n, r);
      case "planet":
        return planet(n, r);
      case "vortex":
        return vortex(n, r);
      case "helix":
        return helix(n, r);
      case "bars":
        return bars(n, r);
      case "orbit":
        return orbit(n, r);
      case "network":
        return network(n, r);
      case "terrain":
        return terrain(n);
      case "globe":
        return globe(n, r);
      case "name":
        return nameCloud(n, r, options.text, options.fontFamily);
      default:
        return dust(n, r);
    }
  })();
  return cloud.shuffled(mulberry32(SEEDS[name] * 104729));
}
