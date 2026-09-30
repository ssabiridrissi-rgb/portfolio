"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { UI_EVENTS } from "@/lib/events";
import { buildFormation, introCloud, mulberry32 } from "./formations";
import { DEFAULT_SCENE, isSceneName, SCENES, type FormationName, type SceneName, type ScenePreset } from "./scenes";

/*
 * The particle universe: one fixed WebGL canvas behind the whole site. Thousands of points
 * morph between formations (galaxy, planet, helix, bar chart…) as sections declared with
 * `data-scene` cross the middle of the viewport, react to the pointer and to scroll speed,
 * and end up spelling the name in the finale.
 * No library: two attribute buffers (from / to) are mixed in the vertex shader.
 */

const CAM = 3.4;
const FOCAL = 2.3;
const INTRO_SECONDS = 2;
const JUMP_SECONDS = 1.1;

const VERT = `
attribute vec4 aFrom;
attribute vec4 aTo;
attribute vec4 aSeed;

uniform float uTime;
uniform float uMix;
uniform float uAngle;
uniform float uAspect;
uniform float uSize;
uniform float uDpr;
uniform float uTurb;
uniform float uIntensity;
uniform vec2 uMouse;
uniform float uMouseForce;
uniform vec2 uTilt;
uniform vec4 uA;
uniform vec2 uAOff;
uniform vec4 uB;
uniform vec2 uBOff;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform vec3 uHot;
uniform vec3 uPulse;

varying vec3 vColor;
varying float vAlpha;

const float CAM = ${CAM.toFixed(2)};
const float FOCAL = ${FOCAL.toFixed(2)};

vec3 rotX(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }
vec3 rotY(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
vec3 rotZ(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z); }

// xf = (tilt x, roll z, spin on/off, scale) — returns clip-space xy and the depth.
vec3 place(vec4 a, vec4 xf, vec2 off, out float hot) {
  hot = step(1.5, a.w);
  float swirl = a.w - hot * 2.0;
  vec3 p = rotY(a.xyz, uTime * swirl + uAngle * xf.z);
  p = rotZ(rotX(p, xf.x), xf.y);
  p = rotX(rotY(p, uTilt.x), uTilt.y);
  p *= xf.w;
  float depth = max(CAM - p.z, 0.4);
  vec2 ndc = p.xy * (FOCAL / depth);
  ndc.x /= uAspect;
  return vec3(ndc + off, depth);
}

void main() {
  float hotA;
  float hotB;
  vec3 A = place(aFrom, uA, uAOff, hotA);
  vec3 B = place(aTo, uB, uBOff, hotB);

  // Each particle leaves with its own delay, then eases in.
  float m = clamp((uMix - aSeed.x * 0.45) / 0.55, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);
  vec3 P = mix(A, B, m);

  // Breathe outwards mid-flight, shiver with scroll speed.
  vec2 dir = normalize(aSeed.yz - 0.5 + 0.0001);
  P.xy += dir * sin(3.14159 * m) * (0.05 + 0.1 * aSeed.w);
  P.xy += (aSeed.zy - 0.5) * uTurb * 0.07;

  // Pointer pushes particles away.
  vec2 d = P.xy - uMouse;
  d.x *= uAspect;
  float dist = length(d);
  float push = uMouseForce * (1.0 - smoothstep(0.0, 0.3, dist));
  P.xy += (d / max(dist, 0.0001)) * push * 0.08 * vec2(1.0 / uAspect, 1.0);

  // Click shockwave: a ring that pushes particles outwards and lights them up as it passes.
  float wave = 0.0;
  if (uPulse.z < 1.8) {
    vec2 q = P.xy - uPulse.xy;
    q.x *= uAspect;
    float qr = length(q);
    float k = (qr - uPulse.z * 1.35) * 5.0;
    wave = exp(-k * k) * (1.0 - uPulse.z / 1.8);
    P.xy += (q / max(qr, 0.0001)) * wave * 0.1 * vec2(1.0 / uAspect, 1.0);
  }

  gl_Position = vec4(P.xy, 0.0, 1.0);

  float hot = max(mix(hotA, hotB, m), wave);
  float size = uSize * (0.55 + aSeed.w * 1.05) * (CAM / P.z) * (1.0 + hot * 1.1);
  gl_PointSize = max(1.0, size * uDpr);

  float twinkle = 0.72 + 0.28 * sin(uTime * (0.7 + aSeed.x * 2.0) + aSeed.y * 40.0);
  float depthFade = clamp(1.3 - (P.z - CAM) * 0.4, 0.3, 1.0);
  vAlpha = uIntensity * twinkle * depthFade * (0.75 + 0.25 * hot);
  vec3 base = mix(uC1, uC2, smoothstep(0.1, 0.9, aSeed.y));
  base = mix(base, uC3, smoothstep(0.65, 1.0, aSeed.z));
  vColor = mix(base, uHot, hot * 0.8);
}
`;

const FRAG = `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = 1.0 - smoothstep(0.0, 0.5, d);
  a = pow(a, 1.6) * vAlpha;
  if (a < 0.004) discard;
  gl_FragColor = vec4(vColor * a, a);
}
`;

type Key = SceneName | "intro";

const INTRO: ScenePreset = { formation: "dust", tilt: [0, 0], spin: 0, scale: 1, x: 0, y: 0, intensity: 0 };

type Anchor = { key: SceneName; top: number; bottom: number };

function particleCount() {
  const width = window.innerWidth;
  if (width < 768) return 3200;
  if ((navigator.hardwareConcurrency || 4) <= 4) return 6000;
  return width > 1600 ? 11000 : 9000;
}

function parseColor(value: string, fallback: [number, number, number]): [number, number, number] {
  const v = value.trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v);
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join("") : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
  }
  const rgb = /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(v);
  if (rgb) return [Number(rgb[1]) / 255, Number(rgb[2]) / 255, Number(rgb[3]) / 255];
  return fallback;
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

export function DataUniverse({ name }: { name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const refreshRef = useRef<() => void>(() => undefined);
  const [generation, setGeneration] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
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

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const count = particleCount();

    // ——— Buffers ———
    const seedRandom = mulberry32(4242);
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < seeds.length; i++) seeds[i] = seedRandom();
    const attribute = (attr: string, data: Float32Array | null, usage: number) => {
      const buffer = gl.createBuffer();
      const location = gl.getAttribLocation(program, attr);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      if (data) gl.bufferData(gl.ARRAY_BUFFER, data, usage);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 4, gl.FLOAT, false, 0, 0);
      return buffer;
    };
    const seedBuffer = attribute("aSeed", seeds, gl.STATIC_DRAW);
    const fromBuffer = attribute("aFrom", null, gl.DYNAMIC_DRAW);
    const toBuffer = attribute("aTo", null, gl.DYNAMIC_DRAW);

    const u = Object.fromEntries(
      [
        "uTime",
        "uMix",
        "uAngle",
        "uAspect",
        "uSize",
        "uDpr",
        "uTurb",
        "uIntensity",
        "uMouse",
        "uMouseForce",
        "uTilt",
        "uA",
        "uAOff",
        "uB",
        "uBOff",
        "uC1",
        "uC2",
        "uC3",
        "uHot",
        "uPulse",
      ].map((n) => [n, gl.getUniformLocation(program, n)]),
    ) as Record<string, WebGLUniformLocation | null>;

    // ——— Formations (built lazily, cached) ———
    const fontFamily = getComputedStyle(document.documentElement).getPropertyValue("--font-poster").trim() || "Impact, sans-serif";
    const formations = new Map<FormationName | "intro", Float32Array>();
    const formationData = (key: Key) => {
      const formation = key === "intro" ? "intro" : SCENES[key].formation;
      let data = formations.get(formation);
      if (!data) {
        data = formation === "intro" ? introCloud(count) : buildFormation(formation, count, { text: name, fontFamily });
        formations.set(formation, data);
      }
      return data;
    };
    const uploaded = { from: null as Float32Array | null, to: null as Float32Array | null };
    const upload = (slot: "from" | "to", data: Float32Array) => {
      if (uploaded[slot] === data) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, slot === "from" ? fromBuffer : toBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      uploaded[slot] = data;
    };

    // ——— Theme ———
    let light = false;
    const readTheme = () => {
      const styles = getComputedStyle(document.documentElement);
      light = document.documentElement.classList.contains("light");
      gl.uniform3fv(u.uC1, parseColor(styles.getPropertyValue("--accent"), [0.23, 0.51, 0.96]));
      gl.uniform3fv(u.uC2, parseColor(styles.getPropertyValue("--accent-2"), [0.13, 0.83, 0.93]));
      gl.uniform3fv(u.uC3, parseColor(styles.getPropertyValue("--accent-3"), [0.55, 0.36, 0.96]));
      gl.uniform3fv(u.uHot, parseColor(styles.getPropertyValue("--particle-hot"), [0.93, 0.96, 1]));
      gl.enable(gl.BLEND);
      // Premultiplied colours: additive glow on dark, regular "over" blending on light.
      gl.blendFunc(gl.ONE, light ? gl.ONE_MINUS_SRC_ALPHA : gl.ONE);
    };
    readTheme();

    // ——— Layout: canvas size and scene anchors ———
    let aspect = 1;
    let dpr = 1;
    let narrow = false;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      aspect = width / Math.max(1, height);
      narrow = window.innerWidth < 768;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    let anchors: Anchor[] = [];
    const measureAnchors = () => {
      const scrollY = window.scrollY;
      anchors = [...document.querySelectorAll<HTMLElement>("[data-scene]")]
        .map((el) => {
          const key = el.dataset.scene;
          const rect = el.getBoundingClientRect();
          return isSceneName(key) ? { key, top: rect.top + scrollY, bottom: rect.bottom + scrollY } : null;
        })
        .filter((a): a is Anchor => a !== null)
        .sort((a, b) => a.top - b.top);
    };
    resize();
    measureAnchors();

    const target = () => {
      if (!anchors.length) return { lo: DEFAULT_SCENE, hi: DEFAULT_SCENE, frac: 0 };
      const vh = window.innerHeight;
      const c = window.scrollY + vh * 0.5;
      let i = 0;
      while (i + 1 < anchors.length && anchors[i + 1].top <= c) i++;
      const span = (k: number) => anchors[k].bottom - anchors[k].top;
      const zone = (a: number, b: number) => Math.max(1, Math.min(vh * 0.35, span(a) / 2, span(b) / 2));
      const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
      if (i + 1 < anchors.length) {
        const t = zone(i, i + 1);
        const b = anchors[i + 1].top;
        if (c > b - t) return { lo: anchors[i].key, hi: anchors[i + 1].key, frac: clamp01((c - (b - t)) / (2 * t)) };
      }
      if (i > 0) {
        const t = zone(i - 1, i);
        const b = anchors[i].top;
        if (c < b + t) return { lo: anchors[i - 1].key, hi: anchors[i].key, frac: clamp01((c - (b - t)) / (2 * t)) };
      }
      return { lo: anchors[i].key, hi: anchors[i].key, frac: 0 };
    };

    // ——— Morph state: a pair of scenes and how far we are between them ———
    const first = target();
    const state = { a: "intro" as Key, b: (first.frac < 0.5 ? first.lo : first.hi) as Key, mix: 0, jump: INTRO_SECONDS };
    const setPair = (a: Key, b: Key) => {
      state.a = a;
      state.b = b;
      upload("from", formationData(a));
      upload("to", formationData(b));
    };
    if (reduced) {
      state.a = state.b;
      state.jump = 0;
    }
    setPair(state.a, state.b);
    // While the opening title sequence plays, the particles wait as dust; they gather when its curtains part.
    let holding = document.documentElement.dataset.intro === "play";
    const onReveal = () => {
      holding = false;
    };
    window.addEventListener(UI_EVENTS.openingReveal, onReveal);

    const step = (dt: number) => {
      const goal = target();
      if (reduced) {
        const dominant = goal.frac < 0.5 ? goal.lo : goal.hi;
        if (state.a !== dominant || state.b !== dominant) setPair(dominant, dominant);
        state.mix = 0;
        return;
      }
      if (holding) {
        if (document.documentElement.dataset.intro !== "play" && document.documentElement.dataset.intro !== "open") holding = false;
        return;
      }
      const ease = (rate: number) => 1 - Math.exp(-dt * rate);
      if (state.jump > 0) {
        state.mix = Math.min(1, state.mix + dt / state.jump);
        if (state.mix >= 1) state.jump = 0;
        return;
      }
      if (state.a === goal.lo && state.b === goal.hi) {
        state.mix += (goal.frac - state.mix) * ease(11);
        return;
      }
      const rest = state.mix <= 0.002 ? state.a : state.mix >= 0.998 ? state.b : null;
      if (rest === goal.lo || rest === goal.hi) {
        const start = rest === goal.lo ? 0 : 1;
        setPair(goal.lo, goal.hi);
        state.mix = start + (goal.frac - start) * ease(11);
      } else if (rest !== null) {
        // Far jump (nav link, reload mid-page, route change): morph straight to the destination.
        setPair(rest, goal.frac < 0.5 ? goal.lo : goal.hi);
        state.mix = 0;
        state.jump = JUMP_SECONDS;
      } else {
        // Mid-morph on a stale pair: settle on the nearest end first.
        const end = state.mix >= 0.5 ? 1 : 0;
        state.mix += (end - state.mix) * ease(12);
        if (Math.abs(end - state.mix) < 0.002) state.mix = end;
      }
    };

    // ——— Pointer, scroll speed ———
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, force: 0, targetForce: 0 };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.targetForce = 1;
    };
    const onPointerLeave = () => {
      pointer.targetForce = 0;
    };
    let lastScroll = window.scrollY;
    let turbulence = 0;
    const pulse = { x: 0, y: 0, age: 99 };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest("a, button, input, textarea, select, label, [role='button'], [data-cursor], canvas, svg")) return;
      pulse.x = (e.clientX / window.innerWidth) * 2 - 1;
      pulse.y = -((e.clientY / window.innerHeight) * 2 - 1);
      pulse.age = 0;
    };

    const endpoint = (key: Key) => {
      const preset: ScenePreset = key === "intro" ? INTRO : SCENES[key];
      const layout = narrow ? (preset.mobile ?? { x: 0, y: preset.y, scale: preset.scale * 0.85 }) : preset;
      let scale = layout.scale;
      if (preset.fit) scale = Math.min(scale, (0.9 * aspect * CAM) / (FOCAL * preset.fit));
      return { preset, x: layout.x, y: layout.y, scale };
    };

    let time = 0;
    let angle = 0;
    const draw = () => {
      const a = endpoint(state.a);
      const b = endpoint(state.b);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(u.uTime, time);
      gl.uniform1f(u.uMix, state.mix);
      gl.uniform1f(u.uAngle, angle);
      gl.uniform1f(u.uAspect, aspect);
      gl.uniform1f(u.uSize, narrow ? 2.3 : window.innerWidth > 1600 ? 3 : 2.7);
      gl.uniform1f(u.uDpr, dpr);
      gl.uniform1f(u.uTurb, turbulence);
      const intensity = a.preset.intensity + (b.preset.intensity - a.preset.intensity) * state.mix;
      gl.uniform1f(u.uIntensity, intensity * (light ? 0.75 : 1));
      gl.uniform2f(u.uMouse, pointer.x, pointer.y);
      gl.uniform1f(u.uMouseForce, pointer.force);
      gl.uniform2f(u.uTilt, pointer.x * 0.16 * pointer.force, -pointer.y * 0.1 * pointer.force);
      gl.uniform4f(u.uA, a.preset.tilt[0], a.preset.tilt[1], a.preset.spin, a.scale);
      gl.uniform2f(u.uAOff, a.x, a.y);
      gl.uniform4f(u.uB, b.preset.tilt[0], b.preset.tilt[1], b.preset.spin, b.scale);
      gl.uniform2f(u.uBOff, b.x, b.y);
      gl.uniform3f(u.uPulse, pulse.x, pulse.y, pulse.age);
      gl.drawArrays(gl.POINTS, 0, count);
    };

    let frame = 0;
    let last = performance.now();
    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      canvas.classList.add("is-ready");
      document.documentElement.classList.add("universe-on");
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      angle += dt * 0.05;
      pulse.age += dt;
      const scrollY = window.scrollY;
      const speed = Math.abs(scrollY - lastScroll) / Math.max(dt, 0.001);
      lastScroll = scrollY;
      turbulence += (Math.min(1, speed / 2600) - turbulence) * (1 - Math.exp(-dt * 5));
      const follow = 1 - Math.exp(-dt * 6);
      pointer.x += (pointer.tx - pointer.x) * follow;
      pointer.y += (pointer.ty - pointer.y) * follow;
      pointer.force += (pointer.targetForce - pointer.force) * (1 - Math.exp(-dt * 3));
      step(dt);
      draw();
      reveal();
    };

    // Reduced motion: no loop — one static frame, redrawn only when the page scrolls or resizes.
    let pending = 0;
    const requestStatic = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => {
        step(0);
        draw();
        reveal();
      });
    };

    // Build every formation this page uses during idle time, so none is computed mid-scroll.
    let idleHandle = 0;
    const warmFormations = () => {
      const pending = [...new Set(anchors.map((a) => a.key))].filter((key) => !formations.has(SCENES[key].formation));
      const next = pending[0];
      if (!next) return;
      const schedule = (cb: () => void) =>
        typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(cb, { timeout: 2000 }) : window.setTimeout(cb, 200);
      idleHandle = schedule(() => {
        formationData(next);
        warmFormations();
      });
    };
    warmFormations();

    const onResize = () => {
      resize();
      measureAnchors();
      if (reduced) requestStatic();
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvas);
    // Sections change height as they render (content-visibility) — keep the anchors fresh.
    const bodyObserver = new ResizeObserver(() => measureAnchors());
    bodyObserver.observe(document.body);
    refreshRef.current = () => {
      measureAnchors();
      warmFormations();
      if (reduced) requestStatic();
    };

    const themeObserver = new MutationObserver(() => {
      readTheme();
      if (reduced) requestStatic();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const onVisibility = () => {
      if (document.hidden || reduced) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const onContextRestored = () => setGeneration((g) => g + 1);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    if (reduced) {
      requestStatic();
      window.addEventListener("scroll", requestStatic, { passive: true });
    } else {
      if (finePointer) {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onPointerLeave);
      }
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleHandle);
      window.clearTimeout(idleHandle);
      resizeObserver.disconnect();
      bodyObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("scroll", requestStatic);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener(UI_EVENTS.openingReveal, onReveal);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      document.documentElement.classList.remove("universe-on");
      refreshRef.current = () => undefined;
      for (const buffer of [seedBuffer, fromBuffer, toBuffer]) gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [generation, name]);

  // New page, new scenes.
  useEffect(() => {
    const id = requestAnimationFrame(() => refreshRef.current());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="universe-canvas no-print pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh w-full"
    />
  );
}
