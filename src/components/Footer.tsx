import { SITE } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-encre text-neige">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-serif text-2xl leading-tight tracking-tight md:text-3xl">
              Les Maths au Sommet
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-wider2 text-glacier">
              Promotion {SITE.schoolYear}
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-neige/70">
              Projet pédagogique du {SITE.schoolName} de {SITE.city}, encadré
              par Mme Raclot et son équipe. Ascension de {SITE.summitName},{" "}
              {SITE.summitAltitude.toLocaleString("fr-FR")} m, en{" "}
              {SITE.expeditionDates}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 md:col-span-7 md:grid-cols-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider2 text-neige/40">
                Aller à
              </p>
              <ul className="mt-4 space-y-2 text-sm text-neige/80">
                <li>
                  <a
                    href="#projet"
                    className="transition-colors hover:text-glacier"
                  >
                    Le projet
                  </a>
                </li>
                <li>
                  <a
                    href="#tete-blanche"
                    className="transition-colors hover:text-glacier"
                  >
                    Tête Blanche
                  </a>
                </li>
                <li>
                  <a
                    href="#annee"
                    className="transition-colors hover:text-glacier"
                  >
                    L&apos;année
                  </a>
                </li>
                <li>
                  <a
                    href="#galerie"
                    className="transition-colors hover:text-glacier"
                  >
                    Galerie
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider2 text-neige/40">
                Contact
              </p>
              <ul className="mt-4 space-y-2 text-sm text-neige/80">
                <li>
                  <a
                    href={`mailto:${SITE.contactEmail}`}
                    className="transition-colors hover:text-glacier"
                  >
                    Écrire à l&apos;équipe
                  </a>
                </li>
                <li>{SITE.schoolName}</li>
                <li>{SITE.city}, France</li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider2 text-neige/40">
                Soutenir
              </p>
              <ul className="mt-4 space-y-2 text-sm text-neige/80">
                <li>
                  <a
                    href={SITE.hellloAssoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-glacier"
                  >
                    Cagnotte HelloAsso →
                  </a>
                </li>
                <li>Mécénat d&apos;entreprise</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-neige/10 pt-8 text-xs text-neige/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Les Maths au Sommet — {SITE.schoolName},{" "}
            {SITE.city} · Tous droits réservés
          </p>
          <p className="font-mono uppercase tracking-wider2">
            Crédits photos : équipe enseignante & élèves · Mentions légales
          </p>
        </div>
      </div>
    </footer>
  );
}
