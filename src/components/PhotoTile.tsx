import clsx from "clsx";

type Tone = "glacier" | "valley" | "summit" | "ridge" | "refuge" | "snow";

const PALETTES: Record<Tone, [string, string, string]> = {
  glacier: ["#0a1628", "#2c5d80", "#9bcadf"],
  valley: ["#1a2f1f", "#3d6b48", "#a3c298"],
  summit: ["#0a1628", "#1d3a5c", "#f8f9fb"],
  ridge: ["#1f1a2e", "#4a3d6b", "#c9b9d6"],
  refuge: ["#2a1810", "#6b4a30", "#d6b994"],
  snow: ["#15314e", "#6097b8", "#f8f9fb"],
};

type Props = {
  tone: Tone;
  caption: string;
  meta?: string;
  className?: string;
  ratio?: "portrait" | "landscape" | "square" | "wide";
};

// Tiny deterministic jitter so each tile leans a slightly different way —
// feels like prints pinned to a corkboard rather than a rigid grid.
function tilt(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  // Range roughly -1.6° .. +1.6°
  return ((h % 13) - 6) * 0.27;
}

export function PhotoTile({
  tone,
  caption,
  meta,
  className,
}: Props) {
  const [c1, c2, c3] = PALETTES[tone];
  const rot = tilt(caption);

  return (
    <figure
      className={clsx(
        "group relative flex flex-col overflow-visible bg-neige p-2.5 pb-3 shadow-[0_10px_30px_-12px_rgba(10,22,40,0.45)] transition-transform duration-500 ease-editorial hover:!rotate-0 hover:scale-[1.02]",
        className
      )}
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <div className="relative flex-1 overflow-hidden">
        <svg
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <linearGradient
              id={`sky-${tone}-${caption.length}`}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0" stopColor={c1} />
              <stop offset="0.6" stopColor={c2} />
              <stop offset="1" stopColor={c3} stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <rect width="800" height="600" fill={`url(#sky-${tone}-${caption.length})`} />
          {/* far ridge */}
          <path
            d="M0 380 L80 340 L180 360 L280 300 L380 340 L500 280 L620 320 L740 290 L800 320 L800 600 L0 600 Z"
            fill={c2}
            opacity="0.7"
          />
          {/* mid ridge with snow caps */}
          <path
            d="M0 460 L120 410 L240 440 L340 360 L440 420 L560 340 L660 410 L780 370 L800 400 L800 600 L0 600 Z"
            fill={c1}
            opacity="0.85"
          />
          <path
            d="M340 360 L358 388 L375 380 L388 400 L372 405 L355 395 Z"
            fill={c3}
            opacity="0.85"
          />
          <path
            d="M560 340 L582 372 L600 360 L615 384 L598 390 L578 380 Z"
            fill={c3}
            opacity="0.8"
          />
          {/* near silhouette */}
          <path
            d="M0 540 L100 510 L220 540 L320 490 L460 530 L580 480 L720 530 L800 500 L800 600 L0 600 Z"
            fill="#050d1a"
            opacity="0.75"
          />
        </svg>
      </div>

      {/* Polaroid white footer — caption sits on the print, not on the image */}
      <figcaption className="mt-2 flex items-end justify-between gap-3 px-1 text-encre">
        <div className="min-w-0">
          <p className="font-serif text-[13px] leading-snug text-encre/85">
            {caption}
          </p>
          {meta && (
            <p className="mt-0.5 truncate font-hand text-lg leading-tight text-encre/60">
              {meta}
            </p>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
