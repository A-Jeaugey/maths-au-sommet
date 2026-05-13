import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { PhotoTile } from "@/components/PhotoTile";

const TILES = [
  {
    tone: "summit" as const,
    caption: "Sommet du Colomby de Gex, mer de nuages plein sud",
    meta: "1ᵉʳ février 2026 · Haut-Jura",
    ratio: "portrait" as const,
    span: "md:col-span-4 md:row-span-2",
  },
  {
    tone: "glacier" as const,
    caption: "Cordées sur le glacier du Tour, séjour d'exploration",
    meta: "Juillet 2025 · Chamonix",
    ratio: "wide" as const,
    span: "md:col-span-5",
  },
  {
    tone: "refuge" as const,
    caption: "Refuge Albert 1ᵉʳ, première nuit en altitude",
    meta: "2 702 m",
    ratio: "landscape" as const,
    span: "md:col-span-3",
  },
  {
    tone: "valley" as const,
    caption: "Combes dijonnaises, randonnée avec sacs lestés",
    meta: "Avril 2026 · Côte-d'Or",
    ratio: "landscape" as const,
    span: "md:col-span-5",
  },
  {
    tone: "snow" as const,
    caption: "Aiguille du Midi, traversée de l'arête",
    meta: "Reconnaissance · juillet 2025",
    ratio: "wide" as const,
    span: "md:col-span-3",
  },
  {
    tone: "ridge" as const,
    caption: "Préparation physique, carrières Bacquin au crépuscule",
    meta: "Mars 2026 · Dijon",
    ratio: "portrait" as const,
    span: "md:col-span-4 md:row-span-2",
  },
  {
    tone: "glacier" as const,
    caption: "Grotte de glace, lumière bleue de l'intérieur",
    meta: "Mer de Glace",
    ratio: "landscape" as const,
    span: "md:col-span-4",
  },
  {
    tone: "summit" as const,
    caption: "Tête Blanche, le matin de l'ascension",
    meta: "3 429 m",
    ratio: "wide" as const,
    span: "md:col-span-4",
  },
];

export function Galerie() {
  return (
    <section
      id="galerie"
      className="relative bg-neige py-28 text-encre md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
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
            <p className="max-w-md text-sm leading-relaxed text-encre/70">
              Mosaïque sélectionnée parmi les sorties préparatoires et les
              repérages à Chamonix. Toutes les photographies sont prises par
              l&apos;équipe encadrante ou les élèves majeurs.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid auto-rows-[clamp(180px,22vw,320px)] grid-cols-1 gap-3 md:mt-16 md:grid-cols-12 md:gap-4">
          {TILES.map((t, i) => (
            <Reveal key={t.caption} delay={i * 0.04} className={t.span}>
              <PhotoTile
                tone={t.tone}
                caption={t.caption}
                meta={t.meta}
                ratio={t.ratio}
                className="h-full w-full"
              />
            </Reveal>
          ))}
        </div>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-wider2 text-encre/40">
          Les visuels actuels sont des illustrations placeholder. Les
          photographies définitives seront intégrées avant la mise en ligne
          publique.
        </p>
      </div>
    </section>
  );
}
