import clsx from "clsx";

type Props = {
  /** Visual position preset — different layouts feel like different pages of the carnet. */
  variant?: "ridge" | "summit" | "valley" | "flow";
  className?: string;
};

/**
 * Faint pencil-style topographic contour lines, used as background decoration
 * on the light editorial sections. Subtle enough not to compete with content
 * but evokes the IGN topo map / mountaineer's notebook aesthetic.
 */
export function ContourLines({ variant = "ridge", className }: Props) {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className={clsx(
        "pointer-events-none absolute h-full w-full text-encre",
        className
      )}
      aria-hidden
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.085"
      >
        {variant === "ridge" && (
          <>
            <path d="M-20 180 C140 160 280 220 440 180 S 720 120 820 170" />
            <path d="M-20 220 C140 200 280 260 440 220 S 720 160 820 210" />
            <path d="M-20 270 C140 250 280 310 440 270 S 720 210 820 260" />
            <path d="M-20 330 C160 310 320 370 480 330 S 720 270 820 320" />
            <path d="M-20 400 C160 380 320 440 480 400 S 720 340 820 390" />
            <path d="M-20 480 C160 460 320 520 480 480 S 720 420 820 470" />
          </>
        )}
        {variant === "summit" && (
          <>
            <ellipse cx="400" cy="280" rx="320" ry="120" />
            <ellipse cx="400" cy="280" rx="260" ry="95" />
            <ellipse cx="400" cy="280" rx="200" ry="72" />
            <ellipse cx="400" cy="280" rx="140" ry="50" />
            <ellipse cx="400" cy="280" rx="80" ry="28" />
            <ellipse cx="400" cy="280" rx="32" ry="11" />
          </>
        )}
        {variant === "valley" && (
          <>
            <path d="M-20 120 Q200 100 400 130 T 820 110" />
            <path d="M-20 180 Q200 160 400 190 T 820 170" />
            <path d="M-20 260 Q200 240 400 270 T 820 250" />
            <path d="M-20 360 Q200 340 400 370 T 820 350" />
            <path d="M-20 460 Q200 440 400 470 T 820 450" />
          </>
        )}
        {variant === "flow" && (
          <>
            <path d="M50 -10 C 80 80 30 180 100 260 S 60 420 140 520 S 110 610 180 620" />
            <path d="M250 -10 C 280 90 220 200 290 280 S 240 440 320 540 S 280 620 360 620" />
            <path d="M460 -10 C 490 100 430 210 500 300 S 450 460 530 560 S 490 620 580 620" />
            <path d="M670 -10 C 700 100 640 220 710 310 S 660 470 740 570 S 700 620 790 620" />
          </>
        )}
      </g>
      {/* A couple of altitude labels for the carnet feel */}
      <g
        fontFamily="var(--font-jetbrains), monospace"
        fontSize="9"
        fill="currentColor"
        opacity="0.13"
      >
        {variant === "summit" && (
          <>
            <text x="715" y="282">3 050</text>
            <text x="715" y="370">2 700</text>
          </>
        )}
        {variant === "ridge" && (
          <text x="715" y="184" textAnchor="end">
            2 400
          </text>
        )}
        {variant === "valley" && (
          <text x="40" y="184" textAnchor="start">
            1 700
          </text>
        )}
      </g>
    </svg>
  );
}
