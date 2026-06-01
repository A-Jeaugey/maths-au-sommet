"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type LenisType from "lenis";

/**
 * Inertial smooth-scroll wiring (Lenis). Mounted once at the top of the page.
 * Lenis updates window.scrollY natively, so everything that relies on it
 * (the hero camera, framer-motion's useScroll, getBoundingClientRect) keeps
 * working without changes.
 *
 * Honoured: prefers-reduced-motion → instant scroll instead of eased.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname && pathname.startsWith("/admin-preview")) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    let raf = 0;
    let lenis: LenisType | null = null;
    let cancelled = false;

    (async () => {
      const Lenis = (await import("lenis")).default;
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Touch keeps native scroll — better on mobile
        syncTouch: false,
      });
      // Expose for ad-hoc programmatic scrolls (e.g. the "Commencer le récit"
      // anchor needs a long duration to let the hero camera animation play).
      (window as unknown as { __lenis?: typeof lenis }).__lenis = lenis;
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    })();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      lenis?.destroy();
      delete (window as unknown as { __lenis?: unknown }).__lenis;
    };
  }, [pathname]);

  return null;
}
