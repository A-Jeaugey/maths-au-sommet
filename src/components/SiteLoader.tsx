"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const SUMMIT = 3429; // altitude de Tête Blanche (m)
const W = 1600;
const H = 900;

const MIN_MS = 1600; // temps mini d'affichage (on laisse admirer)
const MAX_MS = 5000; // filet de sécurité si rien ne signale la fin
const REVEAL_MS = 1400; // durée de l'ouverture en montagne

// Le massif découpé grandit selon `MAX_SCALE * rt^GROWTH`. L'exposant garde la
// silhouette petite (donc lisible) pendant la majeure partie de l'ouverture,
// puis l'écarte d'un coup. À l'échelle 4,4 l'écran est entièrement dégagé ; on
// va jusqu'à 6 pour qu'aucun coin sombre ne subsiste.
const MAX_SCALE = 6;
const GROWTH = 4.2;

type Pt = [number, number];

/**
 * Crêtes « tuilables » : la première et la dernière altitude sont identiques,
 * donc le motif peut se répéter à l'infini.
 *
 * Le défilement est recalculé dans le tracé à chaque image plutôt que posé en
 * `transform` sur un tracé deux fois plus large que la vue. C'est un peu plus
 * de travail par image, mais la géométrie ne sort jamais du cadre : quand la
 * boîte englobante du groupe masqué déborde, Chromium trame le masque de
 * travers et une seconde découpe fantôme apparaît sous la vraie.
 */
function ridgeAt(points: Pt[], dx: number, dy: number): string {
  const shifted: Pt[] = points.map(([x, y]) => [x - dx, y + dy]);
  for (let i = 1; i < points.length; i++) {
    shifted.push([points[i][0] + W - dx, points[i][1] + dy]);
  }

  const yAt = (x: number) => {
    for (let i = 1; i < shifted.length; i++) {
      const [x0, y0] = shifted[i - 1];
      const [x1, y1] = shifted[i];
      if (x >= x0 && x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0 || 1);
    }
    return shifted[shifted.length - 1][1];
  };

  const parts = [`M0,${yAt(0).toFixed(1)}`];
  for (const [x, y] of shifted) {
    if (x > 0 && x < W) parts.push(`L${x.toFixed(1)},${y.toFixed(1)}`);
  }
  parts.push(`L${W},${yAt(W).toFixed(1)}`, `L${W},${H}`, `L0,${H}`, "Z");
  return parts.join("");
}

/** Petites calottes neigeuses sur les sommets qui dépassent. */
function snowAt(points: Pt[], maxY: number, dx: number, dy: number): string {
  const caps: string[] = [];
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y0] = points[i];
    if (y0 > maxY) continue;
    if (y0 >= points[i - 1][1] || y0 >= points[i + 1][1]) continue; // pas un sommet
    for (const period of [0, W]) {
      const a = +(x + period - dx).toFixed(1);
      if (a < 0 || a > W) continue;
      const y = +(y0 + dy).toFixed(1);
      caps.push(
        `M${a},${y}L${a + 14},${y + 23}L${a + 7},${y + 18}L${a + 1},${y + 26}` +
          `L${a - 6},${y + 19}L${a - 12},${y + 22}Z`
      );
    }
  }
  return caps.join("");
}

const RANGES: { pts: Pt[]; fill: string; opacity: number; speed: number; depth: number; snow?: number }[] = [
  {
    // crête lointaine : haute, claire, presque immobile
    pts: [
      [0, 520], [95, 455], [170, 495], [255, 372], [330, 442], [415, 408], [500, 496],
      [585, 418], [645, 452], [735, 350], [810, 428], [890, 396], [975, 486], [1060, 380],
      [1140, 444], [1215, 410], [1300, 492], [1385, 424], [1465, 468], [1535, 438], [1600, 520],
    ],
    fill: "#2b4d6e",
    opacity: 0.42,
    speed: 8,
    depth: 6,
    snow: 400,
  },
  {
    pts: [
      [0, 648], [80, 598], [155, 630], [245, 512], [310, 566], [400, 528], [480, 620],
      [560, 540], [620, 582], [710, 462], [790, 546], [870, 506], [960, 606], [1040, 498],
      [1115, 558], [1200, 518], [1280, 614], [1360, 542], [1445, 588], [1525, 606], [1600, 648],
    ],
    fill: "#183756",
    opacity: 0.78,
    speed: 16,
    depth: 12,
  },
  {
    pts: [
      [0, 782], [95, 712], [165, 750], [265, 624], [335, 686], [425, 648], [515, 748],
      [605, 656], [665, 700], [765, 572], [845, 664], [935, 622], [1025, 730], [1115, 606],
      [1190, 672], [1280, 634], [1370, 736], [1450, 662], [1530, 712], [1600, 782],
    ],
    fill: "#0a1a2e",
    opacity: 1,
    speed: 27,
    depth: 21,
  },
];

/** Étoiles déterministes (aucun Math.random : pas de décalage d'hydratation). */
const STARS = (() => {
  let s = 987654321;
  const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
  return Array.from({ length: 54 }, () => ({
    x: Math.round(rnd() * W),
    y: Math.round(60 + rnd() * 380),
    r: +(0.7 + rnd() * 1.2).toFixed(2),
    o: +(0.18 + rnd() * 0.45).toFixed(2),
    d: +(rnd() * 4).toFixed(2),
  }));
})();

/**
 * Silhouette alpine qui perce le rideau : un sommet principal, une épaule et
 * quelques ressauts. En grandissant, elle « ouvre » la page à l'intérieur.
 */
const REVEAL_PEAK =
  "M800,120 L855,255 L893,228 L962,402 L1012,376 L1092,541 L1143,519 L1212,660 " +
  "L390,660 L468,529 L521,547 L601,391 L646,406 L722,251 L761,264 Z";

/**
 * Trois traits superposés font un halo, sans le coût d'un filtre SVG.
 * L'opacité est portée par chaque trait (et non par le groupe) : une opacité de
 * groupe forcerait une couche de composition en plus, pour rien.
 */
const EDGE_STROKES = [
  { w: 12, c: "#4aafd4", o: 0.16 },
  { w: 5, c: "#7ecbe8", o: 0.4 },
  { w: 1.6, c: "#eaf7ff", o: 0.95 },
];

export function SiteLoader() {
  const [phase, setPhase] = useState<"loading" | "revealing" | "done">("loading");

  const rootRef = useRef<HTMLDivElement | null>(null);
  const ridgeRefs = useRef<(SVGPathElement | null)[]>([]);
  const snowRefs = useRef<(SVGPathElement | null)[]>([]);
  const maskRef = useRef<SVGGElement | null>(null);
  const edgeRef = useRef<SVGGElement | null>(null);
  const glowRef = useRef<SVGRadialGradientElement | null>(null);
  const numRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = !!sessionStorage.getItem("intro-done");
    } catch {
      /* sessionStorage indisponible : on joue l'intro */
    }
    if (reduce || seen) {
      setPhase("done");
      return;
    }

    const started = performance.now();
    let ready = document.readyState === "complete";
    let revealStart = 0;
    let pct = 0;
    // cible / valeur lissée de la souris, en coordonnées du viewBox
    let tx = W / 2;
    let ty = H * 0.42;
    let cx = tx;
    let cy = ty;

    const onReady = () => {
      ready = true;
    };
    window.addEventListener("hero:ready", onReady);
    window.addEventListener("load", onReady);

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * W;
      ty = (e.clientY / window.innerHeight) * H;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - started;
      const t = elapsed / 1000;

      // Progression : on plafonne à 92 % tant que la page n'est pas prête.
      const cap = ready || elapsed >= MAX_MS ? 100 : 92;
      pct += (cap - pct) * 0.05;

      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      const px = (cx / W - 0.5) * 2; // −1 … 1
      const py = (cy / H - 0.5) * 2;

      // Défilement continu + parallaxe : les crêtes proches bougent davantage.
      // Tout passe par le tracé, jamais par un transform : la géométrie reste
      // ainsi strictement dans le cadre.
      RANGES.forEach((r, i) => {
        const dx = (((t * r.speed - px * r.depth) % W) + W) % W;
        const dy = py * r.depth * 0.35;
        ridgeRefs.current[i]?.setAttribute("d", ridgeAt(r.pts, dx, dy));
        if (r.snow) snowRefs.current[i]?.setAttribute("d", snowAt(r.pts, r.snow, dx, dy));
      });
      if (glowRef.current) {
        glowRef.current.setAttribute("cx", `${((cx / W) * 100).toFixed(1)}%`);
        glowRef.current.setAttribute("cy", `${((cy / H) * 100).toFixed(1)}%`);
      }

      if (numRef.current) {
        numRef.current.textContent = Math.round((SUMMIT * pct) / 100).toLocaleString("fr-FR");
      }
      if (barRef.current) barRef.current.style.width = `${pct.toFixed(1)}%`;

      if (!revealStart && elapsed >= MIN_MS && (ready || elapsed >= MAX_MS)) {
        revealStart = now;
        pct = 100;
        setPhase("revealing");
      }

      if (revealStart) {
        const rt = Math.min(1, (now - revealStart) / REVEAL_MS);
        const scale = MAX_SCALE * Math.pow(rt, GROWTH);
        const tf = `translate(800 470) scale(${scale.toFixed(3)}) translate(-800 -470)`;
        if (maskRef.current) maskRef.current.setAttribute("transform", tf);
        if (edgeRef.current) {
          // Le liseré suit exactement la découpe : la crête reste lisible.
          edgeRef.current.setAttribute("transform", tf);
          const inOut = Math.min(1, rt / 0.1) * Math.max(0, 1 - Math.max(0, rt - 0.78) / 0.22);
          const paths = edgeRef.current.children;
          for (let i = 0; i < paths.length; i++) {
            paths[i].setAttribute("stroke-opacity", (EDGE_STROKES[i].o * inOut).toFixed(3));
          }
        }
        if (panelRef.current) panelRef.current.style.opacity = String(Math.max(0, 1 - rt * 2.4));
        // Sur la fin, le rideau s'efface : aucun résidu de découpe ne traîne.
        if (rootRef.current) {
          rootRef.current.style.opacity = String(Math.max(0, Math.min(1, (1 - rt) / 0.12)));
        }
        if (rt >= 1) {
          setPhase("done");
          try {
            sessionStorage.setItem("intro-done", "1");
          } catch {
            /* ignore */
          }
          return; // on arrête la boucle
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hero:ready", onReady);
      window.removeEventListener("load", onReady);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Chargement du site"
      className={clsx(
        // pas de fond sur ce conteneur : c'est le SVG (masqué) qui fait le
        // rideau, sinon l'ouverture en montagne ne laisserait rien passer.
        "fixed inset-0 z-[200] overflow-hidden",
        phase === "revealing" && "pointer-events-none"
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="ldr-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#040914" />
            <stop offset="55%" stopColor="#0c1e35" />
            <stop offset="100%" stopColor="#17324f" />
          </linearGradient>
          <radialGradient ref={glowRef} id="ldr-cursor" cx="50%" cy="42%" r="30%">
            <stop offset="0%" stopColor="#4aafd4" stopOpacity="0.22" />
            <stop offset="55%" stopColor="#4aafd4" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#4aafd4" stopOpacity="0" />
          </radialGradient>

          {/* Le rideau est percé par un massif qui grandit → la page apparaît
              dedans. La zone du masque est fixée explicitement plutôt que
              déduite de la boîte englobante du groupe (crêtes de 3200 de large). */}
          <mask id="ldr-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
            <rect width={W} height={H} fill="white" />
            <g ref={maskRef} transform="translate(800 470) scale(0) translate(-800 -470)">
              <path d={REVEAL_PEAK} fill="black" />
            </g>
          </mask>
        </defs>

        <g mask="url(#ldr-reveal)">
          <rect width={W} height={H} fill="url(#ldr-sky)" />

          <g fill="#dceaf6">
            {STARS.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={s.o}>
                <animate
                  attributeName="opacity"
                  values={`${s.o};${(s.o * 0.25).toFixed(2)};${s.o}`}
                  dur="4s"
                  begin={`-${s.d}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>

          {/* Halo qui suit le curseur : les crêtes s'éclairent au passage. On
              déplace le centre du dégradé plutôt qu'un cercle, qui déborderait
              du cadre dès que la souris approche d'un bord. */}
          <rect width={W} height={H} fill="url(#ldr-cursor)" />

          {RANGES.map((r, i) => (
            <g key={i}>
              <path
                ref={(el) => {
                  ridgeRefs.current[i] = el;
                }}
                d={ridgeAt(r.pts, 0, 0)}
                fill={r.fill}
                opacity={r.opacity}
              />
              {r.snow ? (
                <path
                  ref={(el) => {
                    snowRefs.current[i] = el;
                  }}
                  d={snowAt(r.pts, r.snow, 0, 0)}
                  fill="#e8f2fb"
                  opacity="0.5"
                />
              ) : null}
            </g>
          ))}
        </g>

      </svg>

      {/* Liseré lumineux sur la découpe : sans lui, le rideau sombre et le hero
          sombre se confondent et l'ouverture passe inaperçue. Il vit dans son
          propre SVG : voisin du groupe masqué, sa boîte englobante démesurée
          (il finit à 6× la vue) faisait dérailler la trame du masque et une
          seconde découpe fantôme apparaissait sous la vraie. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
      >
        <g ref={edgeRef} transform="translate(800 470) scale(0) translate(-800 -470)">
          {EDGE_STROKES.map((s) => (
            <path
              key={s.w}
              d={REVEAL_PEAK}
              fill="none"
              stroke={s.c}
              strokeWidth={s.w}
              strokeOpacity="0"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      </svg>

      <div
        ref={panelRef}
        className="relative flex h-full flex-col items-center justify-center pb-64 text-neige"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-glacier">
          Les Maths au Sommet
        </p>
        <p className="mt-6 flex items-baseline font-mono text-6xl font-medium tabular-nums md:text-7xl">
          <span ref={numRef}>0</span>
          <span className="ml-1.5 text-2xl text-neige/40">m</span>
        </p>
        <div className="mt-8 h-px w-48 overflow-hidden bg-neige/15">
          <div ref={barRef} className="h-full bg-glacier" style={{ width: "0%" }} />
        </div>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-neige/40">
          Ascension en cours…
        </p>
      </div>
    </div>
  );
}
