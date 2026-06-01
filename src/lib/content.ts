// Editorial content for the home page.
//
// The values below are loaded from plain data files that the admin interface
// (CMS) edits — so a non-technical editor changes texts, figures, the team,
// partners, the timeline and the gallery without ever touching code:
//
//   content/site.json   → global settings (SITE)
//   content/home.json   → home-page lists (figures, timeline, team, …)
//
// CHAPTERS stays in code on purpose: it is the navigation/anchor structure of
// the one-pager, not editable copy. Changing it would break in-page links.

import site from "../../content/site.json";
import home from "../../content/home.json";
import footer from "../../content/footer.json";

export const SITE = site;
export const FOOTER = footer;

// Each chapter carries an altitude that ascends from Le Tour (1 462 m) to
// the Tête Blanche summit (3 429 m), giving the page its climbing-narrative
// spine.
export const CHAPTERS = [
  { id: "hero", label: "Ouverture", number: "00", altitude: 1462 },
  { id: "projet", label: "Le projet", number: "01", altitude: 1700 },
  { id: "tete-blanche", label: "Tête Blanche", number: "02", altitude: 2000 },
  { id: "annee", label: "L'année", number: "03", altitude: 2300 },
  { id: "galerie", label: "Galerie", number: "04", altitude: 2600 },
  { id: "equipe", label: "L'équipe", number: "05", altitude: 2900 },
  { id: "partenaires", label: "Partenaires", number: "06", altitude: 3150 },
  { id: "soutenir", label: "Soutenir", number: "07", altitude: 3429 },
] as const;

export const KEY_FIGURES = home.keyFigures;
export const TIMELINE = home.timeline;
export const TEAM = home.team;
export const PARTNERS = home.partners;
export const ROUTE_STAGES = home.routeStages;
export const GALLERY = home.gallery;
