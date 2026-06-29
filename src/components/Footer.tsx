import { SITE, FOOTER } from "@/lib/content";
import { normalizeUrl, isExternalUrl } from "@/lib/url";

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
            {FOOTER.columns.map((col, ci) => (
              <div key={ci}>
                <p className="font-mono text-[10px] uppercase tracking-wider2 text-neige/40">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-neige/80">
                  {col.links.map((link, li) => {
                    const raw = "url" in link ? link.url : undefined;
                    // Une ancre seule (#section) viserait la page courante ; on
                    // la pointe vers l'accueil pour qu'elle marche depuis une
                    // page secondaire (ex. /tombola).
                    const url = raw
                      ? raw.startsWith("#")
                        ? "/" + raw
                        : normalizeUrl(raw)
                      : null;
                    return (
                      <li key={li}>
                        {url ? (
                          <a
                            href={url}
                            {...(isExternalUrl(url)
                              ? { target: "_blank", rel: "noreferrer" }
                              : {})}
                            className="transition-colors hover:text-glacier"
                          >
                            {link.label}
                          </a>
                        ) : (
                          link.label
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-neige/10 pt-8 text-xs text-neige/50">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} Les Maths au Sommet — {SITE.schoolName},{" "}
              {SITE.city} · Tous droits réservés
            </p>
            {FOOTER.bottomNote && (
              <p className="font-mono uppercase tracking-wider2">{FOOTER.bottomNote}</p>
            )}
          </div>
          <p className="mt-8 text-center">
            Site intégralement conçu par{" "}
            <a
              href="https://arthurjeaugey.com"
              target="_blank"
              rel="noreferrer"
              className="credit-shine border-b border-glacier/40 pb-0.5 font-medium transition-colors hover:border-glacier"
            >
              Arthur Jeaugey
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
