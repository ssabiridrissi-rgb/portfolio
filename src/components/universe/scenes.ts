/**
 * Scenes of the particle universe. A page declares them with `data-scene="<name>"` on its
 * sections (see <Section scene>); the universe morphs from one to the next while scrolling.
 */
export type FormationName =
  | "galaxy"
  | "planet"
  | "vortex"
  | "helix"
  | "bars"
  | "orbit"
  | "network"
  | "terrain"
  | "globe"
  | "dust"
  | "name";

export type ScenePreset = {
  formation: FormationName;
  /** Rotation towards the viewer (x) and roll (z), radians. */
  tilt: [number, number];
  /** Whether the slow global spin applies (0 keeps text and terrains facing the camera). */
  spin: 0 | 1;
  scale: number;
  /** Screen offset in clip space (−1…1), desktop. */
  x: number;
  y: number;
  /** Narrow screens (< 768 px). */
  mobile?: { x: number; y: number; scale: number };
  /** Brightness: 1 in the hero and the finale, lower behind reading content. */
  intensity: number;
  /** Half-width of the formation (world units) that must stay on screen — used for the name. */
  fit?: number;
};

export const SCENES = {
  hero: { formation: "galaxy", tilt: [0.62, -0.35], spin: 1, scale: 1.2, x: 0.42, y: 0.02, mobile: { x: 0, y: -0.25, scale: 0.95 }, intensity: 1 },
  about: { formation: "planet", tilt: [0.34, 0.4], spin: 1, scale: 0.8, x: 0.55, y: 0.3, mobile: { x: 0.25, y: 0.25, scale: 0.7 }, intensity: 0.55 },
  method: { formation: "vortex", tilt: [0.2, 0], spin: 1, scale: 0.95, x: 0.58, y: 0, mobile: { x: 0, y: 0.05, scale: 0.85 }, intensity: 0.42 },
  experience: { formation: "helix", tilt: [0.12, 0.42], spin: 1, scale: 0.95, x: 0.6, y: 0, mobile: { x: 0.3, y: 0, scale: 0.8 }, intensity: 0.5 },
  projects: { formation: "bars", tilt: [0.46, 0], spin: 1, scale: 0.8, x: 0.52, y: 0.32, mobile: { x: 0, y: 0.25, scale: 0.7 }, intensity: 0.45 },
  distinctions: { formation: "orbit", tilt: [1.12, 0.24], spin: 1, scale: 1, x: 0.55, y: 0, mobile: { x: 0, y: 0, scale: 0.85 }, intensity: 0.62 },
  skills: { formation: "network", tilt: [0.14, 0], spin: 1, scale: 0.75, x: 0.5, y: 0.34, mobile: { x: 0, y: 0.2, scale: 0.7 }, intensity: 0.42 },
  github: { formation: "terrain", tilt: [0.95, 0], spin: 0, scale: 1.05, x: 0, y: -0.28, mobile: { x: 0, y: -0.2, scale: 0.9 }, intensity: 0.4 },
  education: { formation: "globe", tilt: [0.38, 0.12], spin: 1, scale: 0.8, x: 0.52, y: 0.3, mobile: { x: 0, y: 0.25, scale: 0.7 }, intensity: 0.56 },
  certifications: { formation: "dust", tilt: [0, 0], spin: 1, scale: 1, x: 0, y: 0, intensity: 0.34 },
  contact: { formation: "dust", tilt: [0, 0], spin: 1, scale: 1.1, x: 0, y: 0, intensity: 0.26 },
  finale: { formation: "name", tilt: [0, 0], spin: 0, scale: 1, x: 0, y: 0.14, mobile: { x: 0, y: 0.18, scale: 1 }, intensity: 1, fit: 1.36 },
  "case-ai": { formation: "network", tilt: [0.14, 0], spin: 1, scale: 0.9, x: 0.5, y: 0.2, mobile: { x: 0, y: 0.2, scale: 0.75 }, intensity: 0.32 },
  "case-data": { formation: "bars", tilt: [0.46, 0], spin: 1, scale: 0.85, x: 0.5, y: 0.2, mobile: { x: 0, y: 0.2, scale: 0.7 }, intensity: 0.32 },
  "case-space": { formation: "orbit", tilt: [1.12, 0.24], spin: 1, scale: 0.9, x: 0.5, y: 0.2, mobile: { x: 0, y: 0.2, scale: 0.75 }, intensity: 0.36 },
  "case-cloud": { formation: "globe", tilt: [0.38, 0.12], spin: 1, scale: 0.85, x: 0.5, y: 0.2, mobile: { x: 0, y: 0.2, scale: 0.7 }, intensity: 0.32 },
  quiet: { formation: "dust", tilt: [0, 0], spin: 1, scale: 1, x: 0, y: 0, intensity: 0.22 },
} satisfies Record<string, ScenePreset>;

export type SceneName = keyof typeof SCENES;

/** Used when a page declares no scene at all. */
export const DEFAULT_SCENE: SceneName = "quiet";

export function isSceneName(value: string | undefined): value is SceneName {
  return value !== undefined && value in SCENES;
}
