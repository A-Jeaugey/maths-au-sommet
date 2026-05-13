import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { KEY_FIGURES } from "@/lib/content";

export function Projet() {
  return (
    <section
      id="projet"
      className="relative bg-neige py-28 text-encre md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <SectionLabel number="01" label="Le projet" />
        </Reveal>

        <div className="mt-12 grid gap-16 md:mt-20 md:grid-cols-12 md:gap-20">
          <div className="md:col-span-7">
            <Reveal delay={0.05}>
              <h2 className="font-serif font-light text-display-lg text-encre">
                Pourquoi escalader{" "}
                <span className="italic text-glacier">une montagne</span> ?
              </h2>
            </Reveal>

            <div className="mt-10 max-w-prose2 space-y-6 text-[17px] leading-[1.7] text-encre/80 md:text-lg">
              <Reveal delay={0.1}>
                <p>
                  Le projet est né d&apos;un constat partagé entre enseignants.
                  L&apos;année de Terminale concentre une pression
                  considérable&nbsp;: contrôle continu, Bac, Parcoursup,
                  concours d&apos;entrée. Trop d&apos;élèves perdent confiance,
                  doutent, abandonnent leurs ambitions par peur de ne pas être à
                  la hauteur.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p>
                  «&nbsp;Les Maths au Sommet&nbsp;» est une réponse à cette
                  pression. Plutôt que d&apos;ajouter du soutien scolaire à un
                  emploi du temps déjà saturé, l&apos;équipe pédagogique a fait
                  le pari inverse&nbsp;: sortir les élèves de leur zone de
                  confort par une activité qu&apos;ils ne maîtrisent pas —
                  l&apos;alpinisme — pour qu&apos;ils retrouvent confiance en
                  eux et dans le collectif.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p>
                  L&apos;objectif n&apos;est pas sportif. C&apos;est une
                  expérience humaine, encadrée et progressive, qui aboutit à
                  l&apos;ascension de Tête Blanche dans la vallée de Chamonix
                  après une année de préparation.
                </p>
              </Reveal>
            </div>
          </div>

          <aside className="md:col-span-5">
            <Reveal delay={0.25}>
              <figure className="border-l-2 border-glacier pl-6 md:sticky md:top-32 md:pl-8">
                <blockquote className="font-serif text-2xl italic leading-[1.35] text-encre md:text-3xl">
                  «&nbsp;L&apos;alpiniste est un homme qui conduit son corps là
                  où, un jour, ses yeux ont regardé.&nbsp;»
                </blockquote>
                <figcaption className="mt-6 font-mono text-[11px] uppercase tracking-wider2 text-encre/60">
                  — Gaston Rébuffat, guide & écrivain
                </figcaption>
              </figure>
            </Reveal>
          </aside>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-px overflow-hidden border-y border-encre/10 bg-encre/10 md:mt-32 md:grid-cols-4">
          {KEY_FIGURES.map((kf, i) => (
            <Reveal key={kf.label} delay={i * 0.06}>
              <div className="flex h-full flex-col justify-between gap-6 bg-neige p-6 md:p-10">
                <p className="font-mono text-[10px] uppercase tracking-wider2 text-encre/50">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-mono text-4xl font-medium text-encre md:text-5xl">
                  <AnimatedNumber value={kf.value} />
                  <span className="text-encre/60">{kf.suffix}</span>
                </p>
                <p className="text-sm leading-snug text-encre/70">{kf.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
