"use client";

import dynamic from "next/dynamic";

/** Client-side split point: only pages that render the simulator download it. */
export const SolarOrbitLazy = dynamic(() => import("./solar-orbit").then((m) => m.SolarOrbit));
