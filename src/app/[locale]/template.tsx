"use client";

import { motion } from "motion/react";
import { useEffect, type ReactNode } from "react";

// False during SSR and the first client render, so the initial HTML is never hidden (good LCP, works without JS).
let hasNavigated = false;

/** Soft fade between the home page and case studies (templates re-mount on navigation). */
export default function Template({ children }: { children: ReactNode }) {
  const animate = hasNavigated;
  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
