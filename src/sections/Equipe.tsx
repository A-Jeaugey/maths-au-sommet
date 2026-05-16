import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { ContourLines } from "@/components/ContourLines";
import { TEAM, SITE } from "@/lib/content";

function initials(name: string) {
  return name
    .replace(/^M(?:me|\.|gr)\s+/i, "")
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Equipe() {
  return (
    <section
      id="equipe"
      className="relative isolate overflow-hidden bg-neige py-28 text-encre md:py-40"
    >
      <ContourLines variant="valley" className="inset-0 -z-0" />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <SectionLabel number="05" label="L'équipe" />
        </Reveal>

        <div className="mt-12 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <Reveal delay={0.05}>
              <h2 className="font-serif font-light text-display-lg">
                Quatre adultes,
                <br />
                <span className="italic text-glacier">
                  trente-huit élèves
                </span>
                .
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-prose2 text-[17px] leading-[1.8] text-encre/85">
                L&apos;équipe encadrante a porté ce projet depuis la première
                réunion. Sécurité, logistique, financement, cohésion de
                groupe&nbsp;: chaque rôle compte. Les élèves restent les
                premiers acteurs.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="mt-10 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider2 text-encre/50">
                <span className="block h-px w-6 bg-encre/30" aria-hidden />
                Les {SITE.studentsCount} élèves ne sont pas listés
                nominativement (RGPD, mineurs).
              </p>
            </Reveal>
          </div>

          <ul className="md:col-span-7">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.07}>
                <li className="group flex items-center gap-6 border-t border-encre/15 py-6 last:border-b md:gap-8 md:py-8">
                  <span
                    aria-hidden
                    className="flex h-14 w-14 flex-none items-center justify-center rounded-full border border-encre/20 font-mono text-[11px] tracking-wider2 text-encre/60 transition-colors group-hover:border-glacier group-hover:text-glacier md:h-16 md:w-16"
                  >
                    {initials(member.name)}
                  </span>
                  <div className="flex-1">
                    <p className="font-serif text-xl leading-tight md:text-2xl">
                      {member.name}
                    </p>
                    <p className="mt-1 text-sm text-encre/65 md:text-base">
                      {member.role}
                    </p>
                  </div>
                  <p className="hidden max-w-[14rem] text-right font-mono text-[11px] uppercase tracking-wider2 text-encre/50 md:block">
                    {member.note}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
