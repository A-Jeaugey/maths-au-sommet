"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Variant = "hero" | "summit";

type Props = {
  variant?: Variant;
  className?: string;
};

/**
 * SVG fallback artwork — used while real photos are not yet supplied.
 * Layered ridges with parallax scroll. Replace with <Image src="..." /> later.
 */
export function MountainBackdrop({ variant = "hero", className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const ySky = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const yFar = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);
  const yMid = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const yNear = useTransform(scrollYProgress, [0, 1], ["0%", "-24%"]);

  const isSummit = variant === "summit";

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden
    >
      {/* Sky gradient */}
      <motion.div
        style={{ y: ySky }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background: isSummit
              ? "linear-gradient(180deg, #050d1a 0%, #0a1628 35%, #15314e 100%)"
              : "linear-gradient(180deg, #0a1628 0%, #15314e 50%, #2c5d80 100%)",
          }}
        />
        {/* Subtle stars / grain only on summit variant */}
        {isSummit && (
          <svg
            className="absolute inset-0 h-full w-full opacity-50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="moonglow" cx="80%" cy="22%" r="35%">
                <stop offset="0%" stopColor="#F4B942" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#F4B942" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#moonglow)" />
          </svg>
        )}
      </motion.div>

      {/* Far ridge */}
      <motion.svg
        style={{ y: yFar }}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M0,720 L120,640 L240,680 L360,560 L500,620 L640,520 L780,600 L920,500 L1060,580 L1200,540 L1340,620 L1480,560 L1600,640 L1600,900 L0,900 Z"
          fill="#1d3a5c"
          opacity="0.85"
        />
      </motion.svg>

      {/* Mid ridge */}
      <motion.svg
        style={{ y: yMid }}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M0,820 L80,720 L200,780 L340,580 L420,620 L540,420 L640,520 L760,360 L880,500 L1000,440 L1140,580 L1280,460 L1400,560 L1520,500 L1600,580 L1600,900 L0,900 Z"
          fill="#0f2a47"
        />
        {/* Snow caps on the highest peaks */}
        <path
          d="M540,420 L580,460 L600,440 L620,470 L640,520 L600,500 L580,520 L560,500 Z"
          fill="#F8F9FB"
          opacity="0.9"
        />
        <path
          d="M760,360 L800,420 L820,400 L840,440 L860,440 L820,420 L800,440 L780,420 Z"
          fill="#F8F9FB"
          opacity="0.95"
        />
      </motion.svg>

      {/* Near ridge — silhouette */}
      <motion.svg
        style={{ y: yNear }}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M0,900 L0,800 L100,760 L240,820 L360,720 L500,800 L640,700 L820,820 L940,740 L1100,820 L1260,720 L1420,820 L1600,740 L1600,900 Z"
          fill="#050d1a"
        />
      </motion.svg>

      {/* Bottom fade — for legibility of overlaying text */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,13,26,0) 0%, rgba(5,13,26,0.85) 100%)",
        }}
      />
    </div>
  );
}
