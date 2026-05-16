/**
 * Static SVG fallback for the hero — shown during SSR, while three.js loads,
 * for users with prefers-reduced-motion, or when WebGL is unavailable.
 *
 * Layered ridges with a dawn sky and a sun glow. No animated SVG (CSS only)
 * so it stays cheap on low-end devices.
 */
export function MountainFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="hero-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#050d1a" />
            <stop offset="55%" stopColor="#15314e" />
            <stop offset="100%" stopColor="#3a6da0" />
          </linearGradient>
          <radialGradient
            id="hero-sun"
            cx="22%"
            cy="58%"
            r="35%"
            fx="22%"
            fy="58%"
          >
            <stop offset="0%" stopColor="#f4b942" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#f4b942" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#f4b942" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hero-ridge-far" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2c4f76" />
            <stop offset="100%" stopColor="#1a2f4a" />
          </linearGradient>
          <linearGradient id="hero-ridge-mid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1a3354" />
            <stop offset="100%" stopColor="#0d1d34" />
          </linearGradient>
          <linearGradient id="hero-ridge-near" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0a1424" />
            <stop offset="100%" stopColor="#050b16" />
          </linearGradient>
          <linearGradient id="hero-bottom-fade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#050d1a" stopOpacity="0" />
            <stop offset="100%" stopColor="#050d1a" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        <rect width="1600" height="900" fill="url(#hero-sky)" />
        <rect width="1600" height="900" fill="url(#hero-sun)" />

        {/* Far ridge — softest, lit by the sun */}
        <path
          d="M0,560 C160,520 280,580 420,540 C560,500 680,560 820,520 C960,480 1100,560 1240,520 C1380,480 1480,540 1600,510 L1600,900 L0,900 Z"
          fill="url(#hero-ridge-far)"
          opacity="0.85"
        />

        {/* Mid ridge with proper rocky peaks */}
        <path
          d="M0,720 L120,650 L210,680 L320,560 L410,610 L520,470 L620,540 L740,420 L830,520 L950,470 L1080,580 L1200,500 L1320,580 L1440,510 L1600,600 L1600,900 L0,900 Z"
          fill="url(#hero-ridge-mid)"
        />

        {/* Subtle snow streaks — thin slivers, no goofy Z shapes */}
        <g opacity="0.85" fill="#eef3f8">
          <path d="M520,470 L545,500 L560,485 L570,505 L555,510 L535,500 Z" />
          <path d="M740,420 L770,460 L790,440 L800,465 L780,475 L755,460 Z" />
          <path d="M320,560 L345,585 L360,575 L368,595 L350,600 L330,585 Z" opacity="0.75" />
        </g>

        {/* Near ridge — dark silhouette */}
        <path
          d="M0,900 L0,800 L100,770 L240,820 L360,740 L500,810 L640,720 L820,820 L940,750 L1100,820 L1260,740 L1420,820 L1600,760 L1600,900 Z"
          fill="url(#hero-ridge-near)"
        />

        {/* Bottom fade for text legibility */}
        <rect
          x="0"
          y="540"
          width="1600"
          height="360"
          fill="url(#hero-bottom-fade)"
        />
      </svg>
    </div>
  );
}
