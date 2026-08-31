"use client";

import { useEffect, useRef } from "react";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const mercY = (latDeg: number) =>
  (1 -
    Math.log(
      Math.tan((latDeg * Math.PI) / 180) +
        1 / Math.cos((latDeg * Math.PI) / 180)
    ) /
      Math.PI) /
  2;

/**
 * Real-terrain hero for Tête Blanche (3 429 m), Massif du Mont-Blanc.
 *
 * Data: AWS Open Data terrain tiles (Mapzen terrarium format), z=14,
 * tiles x∈[8509..8513], y∈[5827..5831] → 5×5 grid = 1280×1280 px ≈ 8.5 km.
 *
 * Centered on summit 45.9835 N, 7.0188 E. Includes Le Tour valley (W),
 * Refuge Albert 1ᵉʳ (NW), Aiguille du Tour (NE), Aiguille du Chardonnet (S).
 *
 * Camera follows the actual climbing route — Le Tour → Refuge → Summit —
 * driven by page scroll.
 */
export function Mountain3DTeteBlanche() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let disposed = false;
    let cleanup: (() => void) | null = null;
    let scrollProgress = 0;

    (async () => {
      const THREE = await import("three");
      if (disposed || !container) return;

      // ---- Tile grids ----
      // Heightmap (terrarium) at z=15: ~30m underlying SRTM data, oversampled.
      // Satellite (Bing) at z=16: 1.6 m/px — sharp enough for close-ups.
      // Both grids cover the same 5.6 km × 5.6 km centered on Tête Blanche.
      const TILE = 256;
      const HM_ZOOM = 14;
      const HM_X0 = 8509;
      const HM_Y0 = 5827;
      const HM_COLS = 5;
      const HM_ROWS = 5;
      const HM_W = HM_COLS * TILE;
      const HM_H = HM_ROWS * TILE;

      // Satellite zoom is chosen at runtime from GPU MAX_TEXTURE_SIZE.
      // GPU >= 8192 px (most devices since ~2018) → z=16 (5120 texture, 1.6 m/px)
      // GPU >= 4096 px (everything older but WebGL-capable) → z=15 (2560, 3.3 m/px)
      // Both grids cover the exact same 8.5 km area.
      // Also force the low-res path when the user has Data Saver enabled, so
      // we don't burn 6 MB on a metered connection regardless of GPU.
      let satMaxSize = 4096;
      try {
        const probeCanvas = document.createElement("canvas");
        const probeGl = (probeCanvas.getContext("webgl2") ||
          probeCanvas.getContext("webgl")) as WebGLRenderingContext | null;
        if (probeGl) {
          satMaxSize = probeGl.getParameter(probeGl.MAX_TEXTURE_SIZE) as number;
        }
      } catch {
        /* fall through to safe defaults */
      }
      const saveData =
        (navigator as Navigator & { connection?: { saveData?: boolean } })
          .connection?.saveData === true;
      const useHiRes = satMaxSize >= 8192 && !saveData;

      const SAT_ZOOM = useHiRes ? 16 : 15;
      const SAT_X0 = useHiRes ? 34036 : 17018;
      const SAT_Y0 = useHiRes ? 23308 : 11654;
      const SAT_COLS = useHiRes ? 20 : 10;
      const SAT_ROWS = useHiRes ? 20 : 10;
      const SAT_W = SAT_COLS * TILE; // 2560 or 5120
      const SAT_H = SAT_ROWS * TILE;

      // Geographic bounds of the heightmap grid (also defines world extent)
      const tileLon = (x: number, z: number) => (x / 2 ** z) * 360 - 180;
      const tileLatFromY = (y: number, z: number) => {
        const n = Math.PI * (1 - (2 * y) / 2 ** z);
        return (Math.atan(Math.sinh(n)) * 180) / Math.PI;
      };
      const LON_W = tileLon(HM_X0, HM_ZOOM);
      const LON_E = tileLon(HM_X0 + HM_COLS, HM_ZOOM);
      const LAT_N = tileLatFromY(HM_Y0, HM_ZOOM);
      const LAT_S = tileLatFromY(HM_Y0 + HM_ROWS, HM_ZOOM);

      // Load and stitch all tiles into one canvas, then decode heights.
      const canvas = document.createElement("canvas");
      canvas.width = HM_W;
      canvas.height = HM_H;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("2d context unavailable");

      const loadImg = (url: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`fail ${url}`));
          img.src = url;
        });

      const jobs: Promise<void>[] = [];
      for (let r = 0; r < HM_ROWS; r++) {
        for (let c = 0; c < HM_COLS; c++) {
          const x = HM_X0 + c;
          const y = HM_Y0 + r;
          const url = `/textures/terrarium/${HM_ZOOM}/${x}_${y}.png`;
          jobs.push(
            loadImg(url).then((img) => {
              ctx.drawImage(img, c * TILE, r * TILE);
            })
          );
        }
      }
      await Promise.all(jobs);
      if (disposed) return;

      const imgData = ctx.getImageData(0, 0, HM_W, HM_H);
      const pixels = imgData.data;
      const heights = new Float32Array(HM_W * HM_H);
      let minH = Infinity;
      let maxH = -Infinity;
      for (let i = 0; i < HM_W * HM_H; i++) {
        const r = pixels[i * 4];
        const g = pixels[i * 4 + 1];
        const b = pixels[i * 4 + 2];
        // Terrarium decoding: meters
        const h = r * 256 + g + b / 256 - 32768;
        heights[i] = h;
        if (h < minH) minH = h;
        if (h > maxH) maxH = h;
      }

      // Now stitch satellite imagery (ESRI World Imagery) at higher zoom so
      // close-up camera positions read as real aerial photography.
      const satCanvas = document.createElement("canvas");
      satCanvas.width = SAT_W;
      satCanvas.height = SAT_H;
      const satCtx = satCanvas.getContext("2d");
      if (!satCtx) throw new Error("sat 2d context unavailable");

      const satJobs: Promise<void>[] = [];
      for (let r = 0; r < SAT_ROWS; r++) {
        for (let c = 0; c < SAT_COLS; c++) {
          const x = SAT_X0 + c;
          const y = SAT_Y0 + r;
          const url = `/textures/sat-bing/${SAT_ZOOM}/${x}_${y}.jpg`;
          satJobs.push(
            loadImg(url).then((img) => {
              satCtx.drawImage(img, c * TILE, r * TILE);
            })
          );
        }
      }
      await Promise.all(satJobs);
      if (disposed) return;

      const satTexture = new THREE.CanvasTexture(satCanvas);
      satTexture.colorSpace = THREE.SRGBColorSpace;
      satTexture.anisotropy = 16;
      satTexture.minFilter = THREE.LinearMipmapLinearFilter;
      satTexture.magFilter = THREE.LinearFilter;
      satTexture.generateMipmaps = true;

      // Bilinear sample of the heightmap by pixel coords
      const sampleH = (px: number, py: number) => {
        px = clamp(px, 0, HM_W - 1.001);
        py = clamp(py, 0, HM_H - 1.001);
        const x0 = Math.floor(px);
        const y0 = Math.floor(py);
        const fx = px - x0;
        const fy = py - y0;
        const i00 = y0 * HM_W + x0;
        const i10 = i00 + 1;
        const i01 = i00 + HM_W;
        const i11 = i01 + 1;
        return (
          heights[i00] * (1 - fx) * (1 - fy) +
          heights[i10] * fx * (1 - fy) +
          heights[i01] * (1 - fx) * fy +
          heights[i11] * fx * fy
        );
      };

      // ---- World scale ----
      // 8.5km maps to 90 world units → 1 unit ≈ 94m.
      // Heights: divide meters by 94 so y-axis is in world units.
      // Anchor valley floor (≈1400m) at y=0 for nicer camera math.
      const WORLD_SIZE = 90;
      const VALLEY_ALT = 1400;
      const M_TO_WORLD = 1 / 94; // ~10.6 world units per km

      const geoToWorld = (latDeg: number, lonDeg: number, altM?: number) => {
        // x from lon (linear is fine over 8km)
        const u = (lonDeg - LON_W) / (LON_E - LON_W);
        // z from lat through Mercator y (matches the heightmap)
        const yMercTop = mercY(LAT_N);
        const yMercBot = mercY(LAT_S);
        const v = (mercY(latDeg) - yMercTop) / (yMercBot - yMercTop);
        const x = (u - 0.5) * WORLD_SIZE;
        const z = (v - 0.5) * WORLD_SIZE;
        // Sample terrain to get ground altitude at that point if alt not given
        const px = u * HM_W;
        const py = v * HM_H;
        const groundM = altM ?? sampleH(px, py);
        const y = (groundM - VALLEY_ALT) * M_TO_WORLD;
        return new THREE.Vector3(x, y, z);
      };

      // ---- Scene ----
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x4a6f95, 0.012);

      const camera = new THREE.PerspectiveCamera(
        56,
        container.clientWidth / container.clientHeight,
        0.1,
        300
      );

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      container.appendChild(renderer.domElement);
      renderer.domElement.style.display = "block";

      // ---- Terrain mesh ----
      const SEG = 256;
      const geometry = new THREE.PlaneGeometry(
        WORLD_SIZE,
        WORLD_SIZE,
        SEG,
        SEG
      );
      geometry.rotateX(-Math.PI / 2);

      const positions = geometry.attributes.position;
      const vertHeightsM = new Float32Array(positions.count); // altitude m

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        const u = (x + WORLD_SIZE / 2) / WORLD_SIZE;
        const v = (z + WORLD_SIZE / 2) / WORLD_SIZE;
        const px = u * HM_W;
        const py = v * HM_H;
        const hM = sampleH(px, py);
        vertHeightsM[i] = hM;
        positions.setY(i, (hM - VALLEY_ALT) * M_TO_WORLD);
      }

      geometry.computeVertexNormals();

      // ---- Vertex colors: just an atmospheric haze tint so distant terrain
      // looks hazier. Albedo comes from the satellite texture. ----
      const colors = new Float32Array(positions.count * 3);
      const cHaze = new THREE.Color("#9bb3cb");

      for (let i = 0; i < positions.count; i++) {
        const z = positions.getZ(i);
        // Haze increases for distant (north / +backward) terrain
        const haze = clamp(-z / 50 + 0.15, 0, 1) * 0.22;
        const c = new THREE.Color(1, 1, 1).lerp(cHaze, haze);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const sunDir = new THREE.Vector3(-0.6, 0.62, -0.5).normalize();

      const material = new THREE.MeshStandardMaterial({
        map: satTexture,
        vertexColors: true, // used only for haze multiplication
        roughness: 0.88,
        metalness: 0,
        flatShading: false, // smooth shading — looks like real aerial footage
      });
      const terrain = new THREE.Mesh(geometry, material);
      scene.add(terrain);

      // ---- Sky dome ----
      const skyGeo = new THREE.SphereGeometry(140, 24, 16);
      const skyMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          topColor: { value: new THREE.Color("#06122a") },
          midColor: { value: new THREE.Color("#1a3b5e") },
          bottomColor: { value: new THREE.Color("#5687b3") },
          sunColor: { value: new THREE.Color("#fcc870") },
          sunPos: { value: sunDir.clone() },
        },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 topColor;
          uniform vec3 midColor;
          uniform vec3 bottomColor;
          uniform vec3 sunColor;
          uniform vec3 sunPos;
          varying vec3 vDir;
          void main() {
            float h = clamp(vDir.y * 0.5 + 0.5, 0.0, 1.0);
            vec3 col = mix(bottomColor, midColor, smoothstep(0.30, 0.62, h));
            col = mix(col, topColor, smoothstep(0.62, 1.0, h));
            float sd = max(dot(normalize(vDir), sunPos), 0.0);
            col += sunColor * pow(sd, 40.0) * 0.6;
            col += sunColor * pow(sd, 4.0) * 0.10;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      });
      const sky = new THREE.Mesh(skyGeo, skyMat);
      scene.add(sky);

      // ---- Lights (gentle — most shading is baked in vertex colors) ----
      scene.add(new THREE.AmbientLight(0x6b89ad, 0.3));
      const sun = new THREE.DirectionalLight(0xffe2b0, 1.3);
      sun.position.copy(sunDir).multiplyScalar(40);
      scene.add(sun);
      scene.add(new THREE.HemisphereLight(0x8cb6dc, 0x0c1a28, 0.55));

      // ---- Waypoints along the actual climbing route ----
      const W_LE_TOUR = geoToWorld(45.9827, 6.9695, 1462);
      const W_REFUGE = geoToWorld(45.996, 6.986, 2702);
      const W_PLATEAU = geoToWorld(45.987, 7.005, 3050);
      const W_SUMMIT = geoToWorld(45.9835, 7.0188, 3429);
      const W_CHARDONNET = geoToWorld(45.96889, 7.00139, 3824);

      // Expose key world positions for tuning (visible in browser console)
      if (typeof window !== "undefined") {
        (window as unknown as { __TB?: unknown }).__TB = {
          LeTour: W_LE_TOUR.toArray(),
          Refuge: W_REFUGE.toArray(),
          Plateau: W_PLATEAU.toArray(),
          Summit: W_SUMMIT.toArray(),
          Chardonnet: W_CHARDONNET.toArray(),
          minH,
          maxH,
        };
      }

      // Camera path: 4 keyframes for scroll progress 0 → 1.
      // World coords for the 8.5 km grid (logged to window.__TB):
      //   Refuge     ≈ (-28.1, 13.9, -7.9)
      //   Summit     ≈ ( -1.2, 21.6,  6.9)
      //   Chardonnet ≈ (-15.5, 25.8, 24.1)
      // Camera always faces SE — no 180° flips.
      const camPath = [
        // 0: far NW aerial, looking SE — full massif visible
        {
          pos: new THREE.Vector3(-32, 36, -22),
          look: new THREE.Vector3(-2, 18, 12),
          fov: 60,
        },
        // 1: closer NW above the moraine, still looking SE up the glacier
        {
          pos: new THREE.Vector3(-22, 24, -16),
          look: new THREE.Vector3(-3, 21, 9),
          fov: 62,
        },
        // 2: just NW of the summit, summit centred and looming
        {
          pos: new THREE.Vector3(-9, 21, 0),
          look: W_SUMMIT.clone().add(new THREE.Vector3(2, 0.6, 4)),
          fov: 66,
        },
        // 3: hovering past the summit, looking SE toward Chardonnet and
        //    the Swiss-side skyline
        {
          pos: W_SUMMIT.clone().add(new THREE.Vector3(-1.5, 1.6, -1)),
          look: W_CHARDONNET.clone().add(new THREE.Vector3(4, -1, -2)),
          fov: 68,
        },
      ];

      // ---- Scroll wiring ----
      const updateProgress = () => {
        const sec = container.closest("section");
        if (!sec) return;
        const r = sec.getBoundingClientRect();
        const scrollable = Math.max(1, r.height - window.innerHeight);
        const p = clamp(-r.top / scrollable, 0, 1);
        scrollProgress = smoothstep(p);
      };
      updateProgress();
      window.addEventListener("scroll", updateProgress, { passive: true });

      // ---- Animation loop ----
      let raf = 0;
      let running = false;
      const start0 = performance.now();
      const _pos = new THREE.Vector3();
      const _look = new THREE.Vector3();

      const renderFrame = () => {
        const t = (performance.now() - start0) / 1000;
        const p = scrollProgress;

        // Map p ∈ [0,1] to keyframe index (3 segments between 4 keyframes)
        const seg = clamp(p * (camPath.length - 1), 0, camPath.length - 1.001);
        const i0 = Math.floor(seg);
        const i1 = i0 + 1;
        const tt = smoothstep(seg - i0);
        const a = camPath[i0];
        const b = camPath[i1];

        _pos.lerpVectors(a.pos, b.pos, tt);
        _look.lerpVectors(a.look, b.look, tt);
        const fov = lerp(a.fov, b.fov, tt);

        if (!reduceMotion) {
          const drift = 1 - p * 0.7;
          _pos.x += Math.sin(t * 0.13) * 0.25 * drift;
          _pos.y += Math.sin(t * 0.18) * 0.08 * drift;
          _look.x += Math.sin(t * 0.09) * 0.12 * drift;
        }

        camera.position.copy(_pos);
        camera.lookAt(_look);
        if (Math.abs(camera.fov - fov) > 0.01) {
          camera.fov = fov;
          camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);
        // Signale à l'écran d'intro que la première image 3D est rendue.
        const _w = window as unknown as { __heroReady?: boolean };
        if (!_w.__heroReady) {
          _w.__heroReady = true;
          window.dispatchEvent(new Event("hero:ready"));
        }
      };

      const loop = () => {
        renderFrame();
        if (running) raf = requestAnimationFrame(loop);
      };
      const start = () => {
        if (running) return;
        running = true;
        raf = requestAnimationFrame(loop);
      };
      const stop = () => {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      };

      renderFrame();
      start();

      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) start();
            else stop();
          }
        },
        { threshold: 0.02 }
      );
      io.observe(container);

      const onVis = () => {
        if (document.hidden) stop();
        else if (container.getBoundingClientRect().bottom > 0) start();
      };
      document.addEventListener("visibilitychange", onVis);

      const onResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderFrame();
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(container);

      cleanup = () => {
        stop();
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("scroll", updateProgress);
        document.removeEventListener("visibilitychange", onVis);
        geometry.dispose();
        material.dispose();
        skyGeo.dispose();
        skyMat.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    })().catch((err) => {
      console.error("[Mountain3DTeteBlanche] init failed", err);
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" aria-hidden />;
}
