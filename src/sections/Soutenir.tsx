import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { MountainBackdrop } from "@/components/MountainBackdrop";
import { SITE } from "@/lib/content";

export function Soutenir() {
  return (
    <section
      id="soutenir"
      className="relative grain isolate overflow-hidden bg-nuit py-28 text-neige md:py-40"
    >
      <MountainBackdrop variant="summit" className="opacity-80" />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <SectionLabel number="07" label="Soutenir" light />
        </Reveal>

        <div className="mt-12 grid gap-16 md:mt-20 md:grid-cols-12 md:gap-20">
          <div className="md:col-span-7">
            <Reveal delay={0.05}>
              <h2 className="font-serif font-light text-display-xl">
                Soutenez
                <br />
                <span className="italic text-glacier">l&apos;expédition</span>.
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-10 max-w-prose2 text-[17px] leading-[1.8] text-neige/80 md:text-lg">
                Le séjour à Chamonix représente un coût d&apos;environ{" "}
                <span className="text-neige">
                  {SITE.costPerStudent} euros par élève
                </span>
                . Les actions menées toute l&apos;année — ventes de sapins, de
                fromages, de galettes, tombola — couvrent une partie. Chaque don
                à la cagnotte allège la participation financière demandée aux
                familles et garantit qu&apos;aucun élève ne renonce au projet
                pour des raisons économiques.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href={SITE.hellloAssoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-between gap-6 rounded-full bg-soleil px-7 py-4 font-mono text-xs uppercase tracking-wider2 text-nuit transition-transform hover:-translate-y-0.5 hover:bg-neige"
                >
                  <span>Participer à la cagnotte</span>
                  <span
                    aria-hidden
                    className="inline-block transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
                <a
                  href={`mailto:${SITE.contactEmail}`}
                  className="inline-flex items-center gap-3 px-3 py-4 font-mono text-xs uppercase tracking-wider2 text-neige/70 transition-colors hover:text-neige"
                >
                  <span aria-hidden>✉</span>
                  Contacter l&apos;équipe
                </a>
              </div>
            </Reveal>
          </div>

          <aside className="md:col-span-5 md:pt-32">
            <Reveal delay={0.2}>
              <div className="space-y-8 border-l border-neige/15 pl-6 md:pl-10">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider2 text-glacier">
                    Transparence
                  </p>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-neige/75">
                    Les sommes collectées via HelloAsso sont reversées
                    directement au projet et utilisées exclusivement pour le
                    séjour à Chamonix&nbsp;: hébergement en refuge, encadrement
                    par les guides, location du matériel d&apos;alpinisme,
                    transport.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider2 text-glacier">
                    Mécénat d&apos;entreprise
                  </p>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-neige/75">
                    Votre entreprise souhaite s&apos;associer au projet&nbsp;?
                    Contactez Mme Raclot pour étudier les possibilités de
                    contrepartie (visibilité, présentation aux élèves,
                    intervention).
                  </p>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </section>
  );
}
