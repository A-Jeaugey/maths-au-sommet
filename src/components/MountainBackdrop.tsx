"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Variant = "summit" | "soutenir";

type Props = {
  variant?: Variant;
  className?: string;
};

/**
 * Multi-layer SVG ridges anchored to the TOP of dark sections, with a
 * gradient that fades into a solid dark color below — so the mountains
 * never collide with body content. Cheap on low-end devices.
 */
export function MountainBackdrop({ variant = "summit", className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yFar = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);
  const yMid = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const yNear = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);

  const isSoutenir = variant === "soutenir";

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden
    >
      {/* Sky gradient: from a luminous band at the top down to deep nuit */}
      <div
        className="absolute inset-x-0 top-0 h-[440px] md:h-[640px]"
        style={{
          background: isSoutenir
            ? "linear-gradient(180deg, #050d1a 0%, #0a1c33 35%, #15314e 70%, #0a1628 100%)"
            : "linear-gradient(180deg, #050d1a 0%, #0d2244 35%, #1f4368 70%, #0a1628 100%)",
        }}
      />

      {/* Sun / moon glow */}
      <div
        className="absolute"
        style={{
          top: isSoutenir ? "12%" : "16%",
          left: isSoutenir ? "78%" : "16%",
          width: "440px",
          height: "440px",
          transform: "translate(-50%, -50%)",
          background: isSoutenir
            ? "radial-gradient(circle, rgba(244,185,66,0.16) 0%, rgba(244,185,66,0) 65%)"
            : "radial-gradient(circle, rgba(74,175,212,0.18) 0%, rgba(74,175,212,0) 65%)",
        }}
      />

      {/* Mountains pinned to the top — ridges live in the top 600/720px only */}
      <div className="absolute inset-x-0 top-0 h-[440px] md:h-[640px] overflow-hidden">
        {/* Far ridge */}
        <motion.svg
          style={{ y: yFar }}
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-x-0 bottom-0 h-[420px] w-full md:h-[520px]"
        >
          <defs>
            <linearGradient id="bk-far" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2c4f76" />
              <stop offset="100%" stopColor="#16294a" />
            </linearGradient>
          </defs>
          <path
            d="M0,600 C160,560 280,620 420,580 C560,540 680,600 820,560 C960,520 1100,600 1240,560 C1380,520 1480,580 1600,560 L1600,900 L0,900 Z"
            fill="url(#bk-far)"
            opacity="0.75"
          />
        </motion.svg>

        {/* Mid ridge — jagged peaks */}
        <motion.svg
          style={{ y: yMid }}
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-x-0 bottom-0 h-[460px] w-full md:h-[560px]"
        >
          <defs>
            <linearGradient id="bk-mid" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#16315a" />
              <stop offset="100%" stopColor="#091b34" />
            </linearGradient>
          </defs>
          <path
            d="M0,720 L120,650 L210,680 L320,560 L410,610 L520,470 L620,540 L740,420 L830,520 L950,470 L1080,580 L1200,500 L1320,580 L1440,510 L1600,600 L1600,900 L0,900 Z"
            fill="url(#bk-mid)"
          />
        </motion.svg>

        {/* Near ridge — dark silhouette anchored to bottom of ridge area */}
        <motion.svg
          style={{ y: yNear }}
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-x-0 bottom-0 h-[300px] w-full md:h-[380px]"
        >
          <path
            d="M0,900 L0,800 L100,770 L240,820 L360,740 L500,810 L640,720 L820,820 L940,750 L1100,820 L1260,740 L1420,820 L1600,760 L1600,900 Z"
            fill="#050d1a"
          />
        </motion.svg>

        {/* Tall fade at the bottom of the ridge band into the section bg-nuit */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,22,40,0) 0%, rgba(10,22,40,0.55) 50%, #0a1628 100%)",
          }}
        />
      </div>
    </div>
  );
}
