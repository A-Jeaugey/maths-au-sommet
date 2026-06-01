import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { ContourLines } from "@/components/ContourLines";
import { GALLERY } from "@/lib/content";

export function Galerie() {
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
              Mosaïque sélectionnée parmi les sorties préparatoires. Toutes les
              photographies sont prises par l&apos;équipe encadrante ou les
              élèves majeurs.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {GALLERY.map((photo, i) => (
            <Reveal key={photo.image} delay={(i % 3) * 0.05}>
              <figure className="flex h-full flex-col bg-neige p-2.5 pb-3 shadow-[0_10px_30px_-12px_rgba(10,22,40,0.45)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-encre/10">
                  <Image
                    src={photo.image}
                    alt={photo.caption || photo.meta || "Photo du projet"}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-editorial hover:scale-[1.03]"
                  />
                </div>
                {(photo.caption || photo.meta) && (
                  <figcaption className="mt-2 px-1">
                    {photo.caption && (
                      <p className="font-serif text-[13px] leading-snug text-encre/85">
                        {photo.caption}
                      </p>
                    )}
                    {photo.meta && (
                      <p className="mt-0.5 font-hand text-lg leading-tight text-encre/60">
                        {photo.meta}
                      </p>
                    )}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
