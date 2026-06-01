"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { PhotoTile } from "@/components/PhotoTile";
import { ContourLines } from "@/components/ContourLines";
import { Lightbox, type LightboxItem } from "@/components/Lightbox";

type Tile = {
  src: string;
  tone: "glacier" | "valley" | "summit" | "ridge" | "refuge" | "snow";
  caption: string;
  meta: string;
  ratio: "portrait" | "landscape" | "square" | "wide";
  span: string;
};

// CHAPITRE 1 — Première ascension, Colomby de Gex (1ᵉʳ février 2026, 1 689 m).
// 12 tuiles : un mélange de paysages d'altitude et de cordée en mouvement.
const ASCENSION: Tile[] = [
  {
    src: "/photos/photo-20260201-wa0028.jpg",
    tone: "summit",
    caption: "Sortie de la sapinière, le plateau s'ouvre sous la mer de nuages",
    meta: "Crête du Colomby · 1 ᵉʳ février 2026",
    ratio: "portrait",
    span: "md:col-span-4 md:row-span-2",
  },
  {
    src: "/photos/photo-20260201-wa0067.jpg",
    tone: "glacier",
    caption: "Vue plein sud — les Alpes émergent de la couche nuageuse",
    meta: "Depuis le sommet · 1 689 m",
    ratio: "wide",
    span: "md:col-span-8",
  },
  {
    src: "/photos/photo-20260201-wa0069.jpg",
    tone: "snow",
    caption: "Le massif du Mont-Blanc, posé sur un océan de coton",
    meta: "Reconnaissance · février 2026",
    ratio: "landscape",
    span: "md:col-span-4",
  },
  {
    src: "/photos/photo-20260201-wa0054.jpg",
    tone: "refuge",
    caption: "Deux élèves au sommet, face au Mont-Blanc qui se dévoile",
    meta: "Sommet du Colomby de Gex",
    ratio: "landscape",
    span: "md:col-span-4",
  },
  {
    src: "/photos/photo-20260201-wa0034.jpg",
    tone: "summit",
    caption: "Les Alpes à l'horizon, premiers regards depuis la crête",
    meta: "Plateau d'altitude · Haut-Jura",
    ratio: "portrait",
    span: "md:col-span-4",
  },
  {
    src: "/photos/photo-20260201-wa0061.jpg",
    tone: "ridge",
    caption: "Sur la trace, file indienne dans la sapinière de retour",
    meta: "Descente · fin d'après-midi",
    ratio: "portrait",
    span: "md:col-span-4 md:row-span-2",
  },
  {
    src: "/photos/photo-20260201-wa0046.jpg",
    tone: "ridge",
    caption: "Premier kilomètre — la cordée se met en mouvement",
    meta: "Départ vers le sommet",
    ratio: "portrait",
    span: "md:col-span-4",
  },
  {
    src: "/photos/photo-20260201-wa0062.jpg",
    tone: "valley",
    caption: "Lumière dorée du retour, la trace s'allonge derrière nous",
    meta: "Crépuscule · plateau du Jura",
    ratio: "landscape",
    span: "md:col-span-4",
  },
  {
    src: "/photos/photo-20260201-wa0081.jpg",
    tone: "summit",
    caption: "Trois silhouettes au bord du plateau, contemplation",
    meta: "Sommet · fin de journée",
    ratio: "landscape",
    span: "md:col-span-4",
  },
  {
    src: "/photos/photo-20260201-wa0050.jpg",
    tone: "ridge",
    caption: "Cordée en file indienne, la trace s'ouvre dans la poudreuse",
    meta: "Montée régulière",
    ratio: "portrait",
    span: "md:col-span-4",
  },
  {
    src: "/photos/photo-20260201-wa0029.jpg",
    tone: "snow",
    caption: "Soleil bas et traces fraîches, un instant suspendu",
    meta: "Contre-jour · Colomby",
    ratio: "portrait",
    span: "md:col-span-4",
  },
  {
    src: "/photos/photo-20260201-wa0070.jpg",
    tone: "summit",
    caption: "Pause sur le replat sommital, vent et collation",
    meta: "1 689 m · regroupement",
    ratio: "landscape",
    span: "md:col-span-4",
  },
];

// CHAPITRE 2 — Préparation physique au lycée Notre-Dame (Dijon).
// Acrosport, volley, renforcement musculaire — toutes les têtes sont floutées.
const PREPARATION: Tile[] = [
  {
    src: "/photos/photo-20260324-wa0001.jpg",
    tone: "valley",
    caption: "Acrosport — gainage à deux, équilibre et confiance",
    meta: "Mars 2026 · gymnase",
    ratio: "landscape",
    span: "md:col-span-6",
  },
  {
    src: "/photos/photo-20260324-wa0002.jpg",
    tone: "valley",
    caption: "Service au volley — coordination et explosivité",
    meta: "Mars 2026 · salle Notre-Dame",
    ratio: "portrait",
    span: "md:col-span-3",
  },
  {
    src: "/photos/photo-20260324-wa0005.jpg",
    tone: "valley",
    caption: "Renforcement musculaire à l'élastique, en cercle",
    meta: "Mars 2026 · circuit training",
    ratio: "portrait",
    span: "md:col-span-3",
  },
  {
    src: "/photos/photo-20260402-wa0015.jpg",
    tone: "valley",
    caption: "Cercle de cohésion en extérieur, baskets dans l'herbe",
    meta: "Avril 2026 · sortie groupe",
    ratio: "portrait",
    span: "md:col-span-4",
  },
  {
    src: "/photos/photo-20260201-wa0096.jpg",
    tone: "ridge",
    caption: "Reconnaissance hivernale, sous-bois saupoudré",
    meta: "Sortie de cohésion · février",
    ratio: "landscape",
    span: "md:col-span-4",
  },
  {
    src: "/photos/photo-20260201-wa0041.jpg",
    tone: "refuge",
    caption: "Sapinière au matin, soleil filtré entre les troncs",
    meta: "Approche du sommet",
    ratio: "portrait",
    span: "md:col-span-4",
  },
];

function Grid({
  tiles,
  startIndex = 0,
  onOpen,
}: {
  tiles: Tile[];
  startIndex?: number;
  onOpen: (item: LightboxItem) => void;
}) {
  return (
    <div className="mt-10 grid auto-rows-[clamp(180px,22vw,320px)] grid-cols-1 gap-3 md:mt-12 md:grid-cols-12 md:gap-4">
      {tiles.map((t, i) => (
        <Reveal
          key={t.src}
          delay={(startIndex + i) * 0.03}
          className={t.span}
        >
          <PhotoTile
            src={t.src}
            tone={t.tone}
            caption={t.caption}
            meta={t.meta}
            ratio={t.ratio}
            className="h-full w-full"
            onOpen={() => onOpen({ src: t.src, caption: t.caption, meta: t.meta })}
          />
        </Reveal>
      ))}
    </div>
  );
}

export function Galerie() {
  const [active, setActive] = useState<LightboxItem | null>(null);
  return (
    <section
      id="galerie"
      className="relative isolate overflow-hidden bg-neige py-28 text-encre md:py-40"
    >
      <ContourLines variant="summit" className="inset-x-0 top-0 h-[600px] -z-0" />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <SectionLabel number="04" label="Galerie immersive" />
        </Reveal>

        <div className="mt-10 flex flex-col gap-10 md:mt-16 md:flex-row md:items-end md:justify-between">
          <Reveal delay={0.05}>
            <h2 className="max-w-2xl font-serif font-light text-display-lg">
              Carnet d&apos;<span className="italic text-glacier">images</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-sm leading-relaxed text-encre/80">
              Deux chapitres : la première ascension hivernale du Colomby de Gex
              (1 689 m) le 1ᵉʳ février 2026, et la préparation physique au
              lycée Notre-Dame, à Dijon. Les visages des élèves mineurs sont
              floutés à la prise de vue.
            </p>
          </Reveal>
        </div>

        {/* ───── Chapitre 1 — l'ascension ───── */}
        <div className="mt-24 md:mt-32">
          <Reveal>
            <div className="flex items-baseline gap-4 border-t border-encre/15 pt-8">
              <p className="font-mono text-[11px] uppercase tracking-wider2 text-glacier">
                I.
              </p>
              <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8">
                <h3 className="font-serif text-2xl font-light md:text-3xl">
                  Première ascension —{" "}
                  <span className="italic text-glacier">Colomby de Gex</span>
                </h3>
                <p className="font-mono text-[11px] uppercase tracking-wider2 text-encre/55">
                  1ᵉʳ février 2026 · 1 689 m · Haut-Jura
                </p>
              </div>
            </div>
          </Reveal>
          <Grid tiles={ASCENSION} onOpen={setActive} />
        </div>

        {/* ───── Chapitre 2 — la préparation ───── */}
        <div className="mt-24 md:mt-40">
          <Reveal>
            <div className="flex items-baseline gap-4 border-t border-encre/15 pt-8">
              <p className="font-mono text-[11px] uppercase tracking-wider2 text-glacier">
                II.
              </p>
              <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8">
                <h3 className="font-serif text-2xl font-light md:text-3xl">
                  Préparation —{" "}
                  <span className="italic text-glacier">au gymnase</span>
                </h3>
                <p className="font-mono text-[11px] uppercase tracking-wider2 text-encre/55">
                  Mars–avril 2026 · Lycée Notre-Dame · Dijon
                </p>
              </div>
            </div>
          </Reveal>
          <Grid
            tiles={PREPARATION}
            startIndex={ASCENSION.length}
            onOpen={setActive}
          />
        </div>

        <p className="mt-12 font-mono text-[10px] uppercase tracking-wider2 text-encre/40 md:mt-16">
          Visages floutés à la prise de vue — les élèves mineurs ne sont jamais
          identifiables nominativement (RGPD).
        </p>
      </div>

      <Lightbox item={active} onClose={() => setActive(null)} />
    </section>
  );
}
