"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MountainFallback } from "./MountainFallback";

const Mountain3D = dynamic(
  () =>
    import("./Mountain3DTeteBlanche").then((m) => m.Mountain3DTeteBlanche),
  { ssr: false, loading: () => null }
);

/**
 * Renders the static SVG fallback first (for SSR / no-WebGL / low-end),
 * then mounts the three.js scene on top once the browser is ready.
 */
export function MountainScene() {
  const [enable3D, setEnable3D] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!gl) return;
    } catch {
      return;
    }

    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setEnable3D(true), { timeout: 1500 })
      : (window.setTimeout(() => setEnable3D(true), 200) as unknown as number);
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
      else window.clearTimeout(id as number);
    };
  }, []);

  return (
    <>
      <MountainFallback />
      {enable3D && (
        <div className="pointer-events-none absolute inset-0">
          <Mountain3D />
        </div>
      )}
    </>
  );
}
