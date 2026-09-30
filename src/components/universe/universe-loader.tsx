"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DataUniverse = dynamic(() => import("./data-universe").then((m) => m.DataUniverse), { ssr: false });

/**
 * Keeps the WebGL universe out of the critical path: its code is downloaded and started
 * once the browser is idle after the first render (LCP stays the hero text).
 */
export function UniverseLoader({ name }: { name: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start = () => setReady(true);
    // Safari has no requestIdleCallback.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 500);
    return () => window.clearTimeout(id);
  }, []);

  return ready ? <DataUniverse name={name} /> : null;
}
