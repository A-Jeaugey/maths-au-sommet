"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type Mode = "default" | "link" | "media";

/**
 * Point-topographique cursor. A small survey-marker ring follows the mouse
 * with eased inertia, expands over links and media. Native cursor is hidden
 * while this is active. Disabled on touch and under prefers-reduced-motion.
 */
export function Cursor() {
  const pathname = usePathname();
  const disabled = !!pathname && pathname.startsWith("/admin-preview");
  const dotRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("default");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (disabled) return;
    if (typeof window === "undefined") return;

    // Touch devices keep their native behaviour
    if (window.matchMedia("(hover: none)").matches) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let mouseX = -100;
    let mouseY = -100;
    let curX = mouseX;
    let curY = mouseY;
    let raf = 0;

    const detect = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return setMode("default");
      if (t.closest('a, button, [role="button"], summary, label')) {
        setMode("link");
      } else if (t.closest("figure, img, video, canvas")) {
        setMode("media");
      } else {
        setMode("default");
      }
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      detect(e);
      setHidden(false);
    };
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    const tick = () => {
      if (reduce) {
        curX = mouseX;
        curY = mouseY;
      } else {
        curX += (mouseX - curX) * 0.22;
        curY += (mouseY - curY) * 0.22;
      }
      const el = dotRef.current;
      if (el) {
        el.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Hide native cursor — also hide on every element via CSS class hook
    document.documentElement.classList.add("custom-cursor-on");

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      if (raf) cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-on");
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className={clsx(
        "pointer-events-none fixed left-0 top-0 z-[100] hidden -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 lg:block",
        hidden ? "opacity-0" : "opacity-100"
      )}
      style={{ mixBlendMode: "difference", color: "#fff" }}
    >
      <div
        className={clsx(
          "relative transition-[width,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          mode === "default" && "h-5 w-5",
          mode === "link" && "h-12 w-12",
          mode === "media" && "h-16 w-16"
        )}
      >
        {/* Outer survey-marker ring */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth={mode === "default" ? "3" : "1.2"}
            opacity={mode === "default" ? 1 : 0.85}
          />
          {/* Cross ticks */}
          <g stroke="currentColor" strokeWidth="3">
            <line x1="0" y1="50" x2="20" y2="50" />
            <line x1="80" y1="50" x2="100" y2="50" />
            <line x1="50" y1="0" x2="50" y2="20" />
            <line x1="50" y1="80" x2="50" y2="100" />
          </g>
          {/* Center dot */}
          <circle cx="50" cy="50" r="6" fill="currentColor" />
        </svg>

        {/* Hint label that fades in for media */}
        {mode === "media" && (
          <span className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider2">
            Voir
          </span>
        )}
      </div>
    </div>
  );
}
