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
                    const url = "url" in link && link.url ? normalizeUrl(link.url) : null;
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

        <div className="mt-16 flex flex-col gap-4 border-t border-neige/10 pt-8 text-xs text-neige/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Les Maths au Sommet — {SITE.schoolName},{" "}
            {SITE.city} · Tous droits réservés
          </p>
          {FOOTER.bottomNote && (
            <p className="font-mono uppercase tracking-wider2">{FOOTER.bottomNote}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
