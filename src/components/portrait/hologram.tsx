"use client";

import { useEffect, useRef } from "react";
import { UI_EVENTS } from "@/lib/events";
import { cn } from "@/lib/utils";

/*
 * The portrait rebuilt in 3D (WebGL1, no library). Every point is a pixel of the photograph pushed into
 * depth with a map computed offline (public/images/saad-depth.png: R = depth, G = person matte):
 *  - it starts as the flat photograph, exactly over the <img>;
 *  - a red laser sweeps down: the background burns away into embers, the person extrudes in relief;
 *  - then the bust floats, turns towards the pointer (drag on touch screens), bulges under the cursor,
 *    and a click blows it apart before it reassembles.
 * The <img> underneath stays the LCP element and the fallback (no WebGL, context lost).
 */

const DEPTH_SRC = "/images/saad-depth.png";
/** Photo aspect (height / width) — the plane spans x ∈ [-0.5, 0.5], y ∈ [-0.625, 0.625]. */
const RATIO = 1.25;
/** Canvas overscan around the photo, as a fraction of its width / height — must match `.holo-canvas` in globals.css. */
const OVERSCAN_X = 0.26;
const CAM = 2.6;
const RELIEF = 0.3;
const BUILD_SECONDS = 2.9;

const VERT = `
attribute vec4 aPos;
attribute vec4 aColor;
attribute vec4 aMeta;

uniform float uTime;
uniform float uBuild;
uniform float uBurst;
uniform vec2 uRot;
uniform float uLift;
uniform vec2 uK;
uniform float uAspect;
uniform vec3 uPointer;
uniform vec2 uScan;
uniform float uSize;
uniform vec3 uRed;
uniform vec3 uEmber;
uniform vec3 uHot;

varying vec4 vColor;
varying float vSoft;

const float CAM = ${CAM.toFixed(2)};

float hash(float n) { return fract(sin(n) * 43758.5453123); }
vec3 rotY(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
vec3 rotX(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }

void main() {
  float seed = aMeta.z;
  float kind = aMeta.w;
  float person = 1.0 - step(0.5, kind);
  float v = 0.5 - aPos.y / ${RATIO.toFixed(2)};

  // The laser front sweeps top to bottom; each point turns as it passes.
  float front = uBuild * 1.45 - 0.15;
  float passed = clamp((front - v) * 5.0 + (seed - 0.5) * 0.5, 0.0, 1.0);
  float e = passed * passed * (3.0 - 2.0 * passed);

  vec3 p = vec3(aPos.xy, 0.0);
  vec3 col = aColor.rgb;
  float alpha = 1.0;
  float glow = 0.0;
  float soft = 0.0;

  if (kind < 0.5) {
    // Person: extruded in relief; a click throws every point out before they fly back.
    p.z = aPos.z * e;
    vec3 rnd = vec3(hash(seed * 17.0), hash(seed * 29.0), hash(seed * 43.0)) - 0.5;
    p += normalize(rnd * 2.0 + vec3(aPos.xy * 1.2, 0.4)) * uBurst * (0.18 + 0.55 * hash(seed * 7.0));
    alpha = aPos.w * smoothstep(-0.64, -0.34, aPos.y);
  } else {
    // Background: ignites under the laser and drifts away as embers.
    vec3 dir = vec3((hash(seed * 11.0) - 0.5) * 0.8 + aPos.x * 0.9, 0.25 + hash(seed * 5.0) * 0.8, (hash(seed * 23.0) - 0.5) * 1.4);
    float travel = e * e;
    p += dir * travel * (0.35 + 0.75 * hash(seed * 3.0));
    p.x += sin(uTime * 1.7 + seed * 50.0) * 0.025 * travel;
    col = mix(col, uEmber, smoothstep(0.0, 0.5, e));
    glow = e * (1.0 - e) * 3.0;
    alpha = 1.0 - smoothstep(0.3, 1.0, e);
    soft = step(0.001, e);
    if (kind < 1.5) {
      // A few embers stay and orbit the bust.
      float ang = seed * 6.2831 + uTime * (0.12 + 0.12 * hash(seed * 61.0));
      float rad = 0.44 + 0.2 * hash(seed * 71.0);
      vec3 orbit = vec3(cos(ang) * rad, aPos.y * 0.85 + sin(uTime * 0.6 + seed * 9.0) * 0.04, sin(ang) * rad * 0.7);
      float settle = smoothstep(0.5, 1.0, e);
      p = mix(p, orbit, settle);
      alpha = mix(alpha, 0.3 + 0.5 * hash(seed * 83.0), settle);
      col = mix(col, mix(uRed, uEmber, hash(seed * 97.0)), settle);
    }
  }

  // Camera: the bust turns on its axis and floats a little.
  p.y += uLift;
  vec3 q = rotX(rotY(p, uRot.x), uRot.y);
  float persp = CAM / max(CAM - q.z, 0.35);
  vec2 ndc = q.xy * uK * persp;

  // Under the pointer the hologram bulges and warms up.
  vec2 dp = (ndc - uPointer.xy) * vec2(uAspect, 1.0);
  float dl = length(dp);
  float near = uPointer.z * (1.0 - smoothstep(0.0, 0.36, dl)) * person;
  ndc += dp / max(dl, 0.0001) * near * 0.045 * vec2(1.0 / uAspect, 1.0);
  glow += near * 0.75;

  // Laser lines: the build front, then a sweep every few seconds.
  glow += (1.0 - smoothstep(0.0, 0.018, abs(v - front))) * (1.0 - step(0.999, uBuild)) * 1.7 * (person + 0.4);
  glow += uScan.y * (1.0 - smoothstep(0.0, 0.022, abs(aPos.y - uScan.x))) * person;

  // Light: a soft key from the upper left and a red rim on the silhouette.
  vec3 n = rotX(rotY(normalize(vec3(aMeta.xy * e, 1.0)), uRot.x), uRot.y);
  float key = 0.8 + 0.32 * max(dot(n, normalize(vec3(-0.45, 0.55, 0.7))), 0.0);
  float rim = clamp(pow(1.0 - max(n.z, 0.0), 1.5) * 1.5 + aColor.a * 0.8, 0.0, 1.0);
  col = mix(col, col * key, person);
  col = mix(col, uRed, rim * 0.65 * person * e);
  col += (uRed * 0.9 + uHot * glow * 0.3) * glow;

  gl_Position = vec4(ndc, clamp(-q.z * 0.5, -1.0, 1.0), 1.0);
  gl_PointSize = uSize * persp * mix(0.8 + 0.9 * hash(seed * 5.0), 1.0 - near * 0.4, person);
  vColor = vec4(col * alpha, alpha);
  vSoft = soft;
}
`;

const FRAG = `
precision mediump float;
varying vec4 vColor;
varying float vSoft;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vColor * mix(1.0, 1.0 - smoothstep(0.1, 0.5, d), vSoft);
}
`;

type Cloud = { data: Float32Array; total: number; kept: number; persons: number };

function loadImage(src: string) {
  const image = new Image();
  image.decoding = "async";
  image.src = src;
  return image.decode().then(() => image);
}

function pixels(source: CanvasImageSource, width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2d context unavailable");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height).data;
}

/** One point per sampled pixel — interleaved (pos, color, meta), person first, then the orbiting embers. */
function buildCloud(photo: CanvasImageSource, depthMap: CanvasImageSource, columns: number): Cloud {
  const rows = Math.round(columns * RATIO);
  const rgb = pixels(photo, columns, rows);
  const maps = pixels(depthMap, columns, rows);
  const n = columns * rows;
  const depth = new Float32Array(n);
  const matte = new Float32Array(n);
  let sum = 0;
  let people = 0;
  for (let i = 0; i < n; i++) {
    depth[i] = maps[i * 4] / 255;
    matte[i] = maps[i * 4 + 1] / 255;
    if (matte[i] > 0.5) {
      sum += depth[i];
      people++;
    }
  }
  const reference = people ? sum / people : 0.5;
  let lo = 1;
  let hi = 0;
  for (let i = 0; i < n; i++) {
    if (matte[i] > 0.5) {
      lo = Math.min(lo, depth[i]);
      hi = Math.max(hi, depth[i]);
    }
  }
  const scale = RELIEF / Math.max(0.05, hi - lo);
  const z = (i: number) => (depth[i] - reference) * scale;
  const at = (x: number, y: number) => Math.min(rows - 1, Math.max(0, y)) * columns + Math.min(columns - 1, Math.max(0, x));

  let random = 7;
  const rand = () => {
    random = (random * 16807) % 2147483647;
    return random / 2147483647;
  };

  const person: number[] = [];
  const aura: number[] = [];
  const dust: number[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const i = y * columns + x;
      const px = (x + 0.5) / columns - 0.5;
      const py = (0.5 - (y + 0.5) / rows) * RATIO;
      const r = rgb[i * 4] / 255;
      const g = rgb[i * 4 + 1] / 255;
      const b = rgb[i * 4 + 2] / 255;
      const m = matte[i];
      const seed = rand();
      if (m > 0.45) {
        const dzdx = (z(at(x + 1, y)) - z(at(x - 1, y))) * columns * 0.5;
        const dzdy = (z(at(x, y - 1)) - z(at(x, y + 1))) * (rows / RATIO) * 0.5;
        const edge = Math.min(1, (Math.abs(matte[at(x + 1, y)] - matte[at(x - 1, y)]) + Math.abs(matte[at(x, y + 1)] - matte[at(x, y - 1)])) * 1.2);
        person.push(px, py, z(i), Math.min(1, (m - 0.45) / 0.35), r, g, b, edge, -dzdx * 0.35, -dzdy * 0.35, seed, 0);
      } else if (seed < 0.07) {
        aura.push(px, py, 0, 1, r, g, b, 0, 0, 0, rand(), 1);
      } else {
        dust.push(px, py, 0, 1, r, g, b, 0, 0, 0, rand(), 2);
      }
    }
  }
  const data = new Float32Array(person.length + aura.length + dust.length);
  data.set(person, 0);
  data.set(aura, person.length);
  data.set(dust, person.length + aura.length);
  return { data, total: n, kept: (person.length + aura.length) / 12, persons: person.length / 12 };
}

function parseHex(value: string, fallback: [number, number, number]): [number, number, number] {
  const m = /^#([0-9a-f]{6})$/i.exec(value.trim());
  if (!m) return fallback;
  return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255) as [number, number, number];
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== "production") console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Mounted next to the portrait <img> inside its photo box (4:5): the canvas overflows the box so the bust
 * can turn and the embers fly. `onState` receives the number of points of the bust once it runs, null if lost.
 */
export function Hologram({ className, onState }: { className?: string; onState?: (points: number | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onStateRef = useRef(onState);
  useEffect(() => {
    onStateRef.current = onState;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const photo = host?.querySelector("img");
    if (!canvas || !host || !photo) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: true,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });
    if (!gl) return;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const u = Object.fromEntries(
      ["uTime", "uBuild", "uBurst", "uRot", "uLift", "uK", "uAspect", "uPointer", "uScan", "uSize", "uRed", "uEmber", "uHot"].map((name) => [
        name,
        gl.getUniformLocation(program, name),
      ]),
    ) as Record<string, WebGLUniformLocation | null>;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const columns = window.innerWidth < 640 ? 150 : 200;

    const readColors = () => {
      const styles = getComputedStyle(document.documentElement);
      gl.uniform3fv(u.uRed, parseHex(styles.getPropertyValue("--accent"), [1, 0.24, 0.18]));
      gl.uniform3fv(u.uEmber, parseHex(styles.getPropertyValue("--accent-2"), [1, 0.54, 0.24]));
      gl.uniform3fv(u.uHot, document.documentElement.classList.contains("light") ? [1, 0.55, 0.45] : [1, 0.95, 0.9]);
    };
    readColors();

    // ——— Size: the plane (width 1) covers exactly the photo box at z = 0 ———
    let dpr = 1;
    let aspect = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      aspect = width / Math.max(1, height);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const photoWidth = width / (1 + 2 * OVERSCAN_X);
      gl.uniform2f(u.uK, (2 * photoWidth) / width, (2 * photoWidth) / height);
      gl.uniform1f(u.uAspect, aspect);
      gl.uniform1f(u.uSize, ((photoWidth * dpr) / columns) * 1.18);
    };
    resize();

    // ——— State ———
    let cloud: Cloud | null = null;
    let buffer: WebGLBuffer | null = null;
    let started = false;
    let visible = true;
    let time = 0;
    let build = reduced ? 1 : 0;
    let builtFor = reduced ? 2 : 0;
    let burstClock = -1;
    let scanClock = 0;
    const rot = { x: 0, y: 0, tx: 0, ty: 0 };
    const pointer = { x: 9, y: 9, strength: 0, target: 0 };
    let drag: { id: number; x: number; yaw: number; moved: boolean } | null = null;
    let dragYaw: number | null = null;

    const draw = () => {
      if (!cloud) return;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(u.uTime, time);
      gl.uniform1f(u.uBuild, build);
      let burst = 0;
      if (burstClock >= 0) {
        const t = burstClock;
        burst = t < 0.32 ? easeOut(t / 0.32) : t < 0.42 ? 1 : Math.max(0, 1 - easeInOut((t - 0.42) / 1.3));
      }
      gl.uniform1f(u.uBurst, burst);
      gl.uniform2f(u.uRot, rot.x, rot.y);
      gl.uniform1f(u.uLift, reduced ? 0 : Math.sin(time * 0.8) * 0.012);
      gl.uniform3f(u.uPointer, pointer.x, pointer.y, pointer.strength);
      // A laser sweep every 7 s once the bust is built (and while it reassembles after a click).
      const sweep = burstClock >= 0.42 ? (burstClock - 0.42) / 1.3 : scanClock / 1.8;
      const scanning = !reduced && build >= 1 && sweep >= 0 && sweep <= 1;
      gl.uniform2f(u.uScan, (0.5 - sweep) * RATIO * 1.05, scanning ? 0.9 * Math.sin(Math.PI * sweep) : 0);
      // Once the background has burnt away, only the bust and its embers are drawn.
      const count = build >= 1 && builtFor > 1.5 ? cloud.kept : cloud.total;
      gl.drawArrays(gl.POINTS, 0, count);
    };

    let frame = 0;
    let last = 0;
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || !started) {
        last = 0;
        return;
      }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      time += dt;
      if (build < 1) build = Math.min(1, build + dt / BUILD_SECONDS);
      else builtFor += dt;
      if (burstClock >= 0) {
        burstClock += dt;
        if (burstClock > 1.8) burstClock = -1;
      }
      scanClock = (scanClock + dt) % 7;
      // Idle: a slow sway. Pointer: the bust turns towards it. Touch: dragged by the finger.
      if (dragYaw !== null) {
        rot.tx = dragYaw;
        rot.ty = 0;
      } else if (pointer.target === 0) {
        rot.tx = Math.sin(time * 0.35) * 0.22;
        rot.ty = Math.sin(time * 0.27) * 0.04;
      }
      const follow = 1 - Math.exp(-dt * (dragYaw !== null ? 14 : 4));
      rot.x += (rot.tx - rot.x) * follow;
      rot.y += (rot.ty - rot.y) * follow;
      pointer.strength += (pointer.target - pointer.strength) * (1 - Math.exp(-dt * 5));
      draw();
    };

    // ——— Pointer ———
    const toNdc = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return { x: ((clientX - rect.left) / rect.width) * 2 - 1, y: 1 - ((clientY - rect.top) / rect.height) * 2 };
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const p = toNdc(e.clientX, e.clientY);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.target = 1;
      rot.tx = Math.max(-1, Math.min(1, p.x / 2.2)) * 0.5;
      rot.ty = -Math.max(-1, Math.min(1, p.y / 2)) * 0.22;
    };
    const onLeave = () => {
      pointer.target = 0;
    };
    const section = host.closest("section") ?? host;

    const burst = () => {
      if (reduced || build < 1) return;
      burstClock = 0;
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest("a, button")) return;
      if (e.pointerType === "mouse" || e.pointerType === "pen") {
        if (e.button === 0) burst();
        return;
      }
      drag = { id: e.pointerId, x: e.clientX, yaw: rot.x, moved: false };
    };
    const onDrag = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 6) drag.moved = true;
      if (drag.moved) dragYaw = Math.max(-0.9, Math.min(0.9, drag.yaw + (dx / canvas.clientWidth) * 2.4));
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.moved && e.type === "pointerup") burst();
      drag = null;
      dragYaw = null;
    };

    // ——— Start: once the data is ready, the page is idle and the opening (if any) has revealed the hero ———
    let poll = 0;
    const start = () => {
      if (started || !cloud) return;
      started = true;
      window.clearInterval(poll);
      canvas.style.opacity = "1";
      onStateRef.current?.(cloud.persons);
      if (reduced) draw();
    };
    const waitingForOpening = () => document.documentElement.dataset.intro === "play";
    let revealTimer = 0;
    const onReveal = () => {
      revealTimer = window.setTimeout(start, 250);
    };

    let cancelled = false;
    Promise.all([
      photo.complete && photo.naturalWidth ? Promise.resolve(photo) : photo.decode().then(() => photo),
      loadImage(DEPTH_SRC),
    ])
      .then(([image, depthMap]) => {
        if (cancelled) return;
        cloud = buildCloud(image, depthMap, columns);
        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, cloud.data, gl.STATIC_DRAW);
        const stride = 12 * 4;
        [
          ["aPos", 0],
          ["aColor", 16],
          ["aMeta", 32],
        ].forEach(([name, offset]) => {
          const location = gl.getAttribLocation(program, name as string);
          gl.enableVertexAttribArray(location);
          gl.vertexAttribPointer(location, 4, gl.FLOAT, false, stride, offset as number);
        });
        if (!waitingForOpening()) start();
        // Safety net if the opening never announces its reveal.
        else poll = window.setInterval(() => !waitingForOpening() && start(), 400);
      })
      .catch(() => undefined);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduced) draw();
    });
    resizeObserver.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersection.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      readColors();
      if (reduced) draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frame);
      canvas.style.opacity = "0";
      onStateRef.current?.(null);
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    window.addEventListener(UI_EVENTS.openingReveal, onReveal);

    if (!reduced) {
      if (finePointer) {
        section.addEventListener("pointermove", onMove as EventListener, { passive: true });
        section.addEventListener("pointerleave", onLeave);
      }
      host.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onDrag, { passive: true });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearInterval(poll);
      window.clearTimeout(revealTimer);
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener(UI_EVENTS.openingReveal, onReveal);
      section.removeEventListener("pointermove", onMove as EventListener);
      section.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onDrag);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none opacity-0 transition-opacity duration-500 ease-out-expo", className)}
    />
  );
}
