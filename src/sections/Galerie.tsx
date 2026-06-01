"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { PhotoTile } from "@/components/PhotoTile";
import { ContourLines } from "@/components/ContourLines";
import { Lightbox, type LightboxItem } from "@/components/Lightbox";
import { GALLERY } from "@/lib/content";

type Photo = { src: string; caption?: string; meta?: string };

// The layout (tile sizes + frame tone) is applied automatically by position,
// so an editor only ever provides a photo + caption + place/date in the admin.
// This editorial rhythm reproduces the original mosaic and degrades gracefully
// to any number of photos.
const SPAN_PATTERN = [
  "md:col-span-4 md:row-span-2",
  "md:col-span-8",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4 md:row-span-2",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
] as const;

const TONES = ["summit", "glacier", "ridge", "valley", "refuge", "snow"] as const;

function Grid({
  photos,
  onOpen,
}: {
  photos: Photo[];
  onOpen: (item: LightboxItem) => void;
}) {
  return (
    <div className="mt-10 grid auto-rows-[clamp(180px,22vw,320px)] grid-cols-1 gap-3 md:mt-12 md:grid-cols-12 md:gap-4">
      {photos.map((p, i) => (
        <Reveal
          key={p.src}
          delay={(i % 6) * 0.04}
          className={SPAN_PATTERN[i % SPAN_PATTERN.length]}
        >
          <PhotoTile
            src={p.src}
            tone={TONES[i % TONES.length]}
            caption={p.caption ?? ""}
            meta={p.meta}
            className="h-full w-full"
            onOpen={() =>
              onOpen({ src: p.src, caption: p.caption ?? "", meta: p.meta })
            }
          />
        </Reveal>
      ))}
    </div>
  );
}

export function Galerie() {
  const [active, setActive] = useState<LightboxItem | null>(null);
  const chapters = GALLERY?.chapters ?? [];

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

        {chapters.map((chapter, ci) => (
          <div key={chapter.number || ci} className={ci === 0 ? "mt-24 md:mt-32" : "mt-24 md:mt-40"}>
            <Reveal>
              <div className="flex items-baseline gap-4 border-t border-encre/15 pt-8">
                <p className="font-mono text-[11px] uppercase tracking-wider2 text-glacier">
                  {chapter.number}
                </p>
                <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8">
                  <h3 className="font-serif text-2xl font-light md:text-3xl">
                    {chapter.title}{" "}
                    {chapter.highlight && (
                      <span className="italic text-glacier">{chapter.highlight}</span>
                    )}
                  </h3>
                  {chapter.meta && (
                    <p className="font-mono text-[11px] uppercase tracking-wider2 text-encre/55">
                      {chapter.meta}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
            <Grid photos={chapter.photos ?? []} onOpen={setActive} />
          </div>
        ))}

        <p className="mt-12 font-mono text-[10px] uppercase tracking-wider2 text-encre/40 md:mt-16">
          Visages floutés à la prise de vue — les élèves mineurs ne sont jamais
          identifiables nominativement (RGPD).
        </p>
      </div>

      <Lightbox item={active} onClose={() => setActive(null)} />
    </section>
  );
}
