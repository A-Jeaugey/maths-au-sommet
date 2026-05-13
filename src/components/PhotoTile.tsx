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

export function PhotoTile({
  tone,
  caption,
  meta,
  className,
  ratio = "landscape",
}: Props) {
  const [c1, c2, c3] = PALETTES[tone];
  const aspect =
    ratio === "portrait"
      ? "aspect-[3/4]"
      : ratio === "square"
        ? "aspect-square"
        : ratio === "wide"
          ? "aspect-[16/9]"
          : "aspect-[4/3]";

  return (
    <figure className={clsx("group relative overflow-hidden", aspect, className)}>
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
        aria-hidden
      >
        <defs>
          <linearGradient id={`sky-${tone}-${caption.length}`} x1="0" x2="0" y1="0" y2="1">
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
          d="M340 360 L360 380 L380 360 L400 390 L420 380 L440 420 L380 400 L360 410 Z"
          fill={c3}
          opacity="0.9"
        />
        <path
          d="M560 340 L580 370 L600 350 L630 380 L660 410 L600 390 L580 400 L560 390 Z"
          fill={c3}
          opacity="0.85"
        />
        {/* near silhouette */}
        <path
          d="M0 540 L100 510 L220 540 L320 490 L460 530 L580 480 L720 530 L800 500 L800 600 L0 600 Z"
          fill="#050d1a"
          opacity="0.75"
        />
      </svg>

      {/* Vignette + caption */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"
        aria-hidden
      />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-neige md:p-6">
        <div className="min-w-0">
          <p className="font-serif text-sm leading-snug md:text-base">
            {caption}
          </p>
          {meta && (
            <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-wider2 text-neige/65">
              {meta}
            </p>
          )}
        </div>
        <span
          className="font-mono text-[10px] uppercase tracking-wider2 text-neige/50"
          aria-hidden
        >
          ◊
        </span>
      </figcaption>
    </figure>
  );
}
