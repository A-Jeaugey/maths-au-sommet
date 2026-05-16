import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { ContourLines } from "@/components/ContourLines";
import { PARTNERS } from "@/lib/content";

export function Partenaires() {
  return (
    <section
      id="partenaires"
      className="relative isolate overflow-hidden bg-neige py-28 text-encre md:py-32"
    >
      <ContourLines variant="ridge" className="inset-0 -z-0 scale-x-[-1]" />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <SectionLabel number="06" label="Partenaires" />
        </Reveal>

        <div className="mt-12 grid items-end gap-10 md:mt-16 md:grid-cols-12">
          <Reveal delay={0.05} className="md:col-span-7">
            <h2 className="font-serif font-light text-display-lg">
              Ils <span className="italic text-glacier">accompagnent</span>{" "}
              la cordée.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-5">
            <p className="max-w-prose2 text-base leading-relaxed text-encre/85 md:text-[17px]">
              Sans encadrement professionnel et sans le soutien des partenaires
              locaux, le projet ne tiendrait pas. Nous les remercions pour leur
              confiance.
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-px overflow-hidden border-y border-encre/10 bg-encre/10 sm:grid-cols-2 md:mt-20 md:grid-cols-5">
          {PARTNERS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <li className="group flex h-full min-h-[180px] flex-col justify-between gap-6 bg-neige p-6 text-encre/80 transition-colors hover:bg-encre hover:text-neige md:p-8">
                <p className="font-mono text-[10px] uppercase tracking-wider2 opacity-50">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-serif text-lg leading-tight md:text-xl">
                  {p.name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider2 opacity-60 group-hover:text-glacier">
                  {p.note}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.3}>
          <p className="mt-10 max-w-prose2 font-mono text-[10px] uppercase tracking-wider2 text-encre/40">
            Vous souhaitez devenir partenaire&nbsp;?{" "}
            <a
              href="#soutenir"
              className="text-encre underline-offset-4 hover:underline"
            >
              Lire la rubrique soutenir
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
