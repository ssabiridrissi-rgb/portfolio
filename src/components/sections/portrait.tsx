"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import portrait from "../../../public/images/saad-portrait.jpg";

/** Portrait in an animated gradient frame with a subtle 3D tilt (desktop, motion allowed only). */
export function Portrait({ alt, children }: { alt: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [canTilt, setCanTilt] = useState(false);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 160, damping: 18 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), { stiffness: 160, damping: 18 });
  const glare = useTransform(
    [px, py],
    ([x, y]) => `radial-gradient(circle at ${Number(x) * 100}% ${Number(y) * 100}%, rgb(255 255 255 / 0.35), transparent 55%)`,
  );

  useEffect(() => {
    setCanTilt(window.matchMedia("(pointer: fine) and (hover: hover)").matches);
  }, []);

  const tilt = canTilt && !reduced;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className="relative [perspective:1200px]">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={tilt ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className="relative mx-auto w-full max-w-[400px]"
      >
        <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(closest-side,var(--glow-1),transparent)]" />
        <div className="gradient-frame rounded-[2rem] p-[1.5px] shadow-[0_30px_80px_-30px_var(--glow-1)]">
          <div className="relative overflow-hidden rounded-[calc(2rem-1.5px)] bg-surface">
            <Image
              src={portrait}
              alt={alt}
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 60vw, 85vw"
              className="aspect-[4/5] h-auto w-full object-cover"
              style={{ objectPosition: "50% 20%" }}
            />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(7_9_15/0.55))]" />
            {tilt ? (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60 mix-blend-soft-light"
                style={{ background: glare }}
              />
            ) : null}
          </div>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
