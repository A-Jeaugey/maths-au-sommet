import clsx from "clsx";

// Decorative layered mountain silhouette, used as an optional section
// background. Uses currentColor so it adapts to the band's text colour
// (light lines on dark, dark lines on light).
export function MountainRelief({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMax slice"
      className={clsx("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden
    >
      <g fill="currentColor">
        <path
          d="M0 320 L120 230 L230 300 L340 200 L470 300 L600 210 L720 290 L800 250 L800 400 L0 400 Z"
          opacity="0.06"
        />
        <path
          d="M0 360 L150 285 L280 350 L400 255 L520 350 L660 270 L800 335 L800 400 L0 400 Z"
          opacity="0.09"
        />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.12" strokeLinecap="round">
        <path d="M340 200 L322 240 M340 200 L372 252" />
        <path d="M600 210 L584 246 M600 210 L628 256" />
      </g>
    </svg>
  );
}
