import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { MountainBackdrop } from "@/components/MountainBackdrop";
import { ROUTE_STAGES, SITE } from "@/lib/content";

export function TeteBlanche() {
  return (
    <section
      id="tete-blanche"
      className="relative grain isolate overflow-hidden bg-nuit py-28 text-neige md:py-40"
    >
      <MountainBackdrop variant="summit" className="opacity-90" />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <SectionLabel number="02" label="L'objectif" light />
        </Reveal>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal delay={0.05}>
              <h2 className="font-serif font-light text-display-xl">
                Tête
                <br />
                Blanche
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 font-mono text-base uppercase tracking-wider2 text-glacier md:text-lg">
                3&nbsp;429 m · Massif du Mont-Blanc
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-5 md:pt-32">
            <Reveal delay={0.2}>
              <p className="max-w-prose2 text-[17px] leading-[1.8] text-neige/80 md:text-lg">
                Tête Blanche, 3&nbsp;429 mètres. Le sommet le mieux adapté à une
                première expérience en alpinisme dans le massif du Mont-Blanc.
                L&apos;ascension se déroule sur deux jours, encadrée par les
                guides de haute montagne de la {SITE.guideCompany} — la plus
                ancienne du monde, créée en {SITE.guideCompanyFounded}.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Itinerary — topographic-style table */}
        <div className="mt-24 md:mt-32">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-wider2 text-glacier">
              Itinéraire <span aria-hidden>·</span> Carnet topographique
            </p>
          </Reveal>

          <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-neige/15 bg-neige/15 md:grid-cols-2">
            {ROUTE_STAGES.map((stage, i) => (
              <Reveal key={stage.day} delay={i * 0.08}>
                <article className="flex h-full flex-col gap-6 bg-nuit p-8 md:p-10">
                  <header className="flex items-baseline justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider2 text-glacier">
                      {stage.day}
                    </span>
                    <span className="font-mono text-3xl font-medium tabular-nums text-neige md:text-4xl">
                      {stage.altitude}
                    </span>
                  </header>
                  <h3 className="font-serif text-2xl leading-tight text-neige md:text-3xl">
                    {stage.title}
                  </h3>
                  <dl className="grid grid-cols-2 gap-6 border-t border-neige/15 pt-6 font-mono text-xs uppercase tracking-wider2 text-neige/60">
                    <div>
                      <dt className="opacity-60">Dénivelé +</dt>
                      <dd className="mt-1 text-base normal-case tracking-normal text-neige">
                        {stage.deniveleUp}
                      </dd>
                    </div>
                    <div>
                      <dt className="opacity-60">Dénivelé −</dt>
                      <dd className="mt-1 text-base normal-case tracking-normal text-neige">
                        {stage.deniveleDown}
                      </dd>
                    </div>
                  </dl>
                  <p className="text-sm leading-relaxed text-neige/70">
                    {stage.note}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Decorative topographic line */}
          <Reveal delay={0.2}>
            <figure className="mt-16">
              <svg
                viewBox="0 0 1200 220"
                className="h-auto w-full text-glacier"
                aria-hidden
              >
                <defs>
                  <linearGradient id="topoFade" x1="0" x2="1">
                    <stop offset="0" stopColor="#4AAFD4" stopOpacity="0.15" />
                    <stop offset="0.5" stopColor="#4AAFD4" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#4AAFD4" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 180 L120 170 L220 130 L340 145 L420 100 L520 80 L620 35 L720 70 L820 110 L940 95 L1040 140 L1200 160"
                  fill="none"
                  stroke="url(#topoFade)"
                  strokeWidth="1.2"
                />
                <path
                  d="M0 195 L120 188 L220 160 L340 170 L420 140 L520 125 L620 95 L720 120 L820 145 L940 135 L1040 165 L1200 180"
                  fill="none"
                  stroke="#4AAFD4"
                  strokeOpacity="0.25"
                  strokeWidth="0.8"
                />
                <circle cx="620" cy="35" r="4" fill="#F4B942" />
                <text
                  x="630"
                  y="30"
                  fill="#F8F9FB"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  letterSpacing="2"
                >
                  3 429 m · TÊTE BLANCHE
                </text>
                <circle cx="120" cy="170" r="3" fill="#4AAFD4" />
                <text
                  x="130"
                  y="166"
                  fill="#F8F9FB"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                  letterSpacing="2"
                  opacity="0.7"
                >
                  LE TOUR
                </text>
                <circle cx="420" cy="100" r="3" fill="#4AAFD4" />
                <text
                  x="430"
                  y="96"
                  fill="#F8F9FB"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                  letterSpacing="2"
                  opacity="0.7"
                >
                  REFUGE ALBERT 1ᵉʳ
                </text>
              </svg>
              <figcaption className="mt-4 text-center font-mono text-[10px] uppercase tracking-wider2 text-neige/40">
                Profil indicatif · Le Tour → Refuge Albert 1ᵉʳ → Tête Blanche
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
