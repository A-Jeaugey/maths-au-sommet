// Source of truth for all editorial content.
// Edit this file to change copy without touching components.

export const SITE = {
  hellloAssoUrl: "https://www.helloasso.com/", // TODO: remplacer par le lien exact de la cagnotte
  contactEmail: "contact@notredame-dijon.fr", // TODO: confirmer l'email officiel
  schoolName: "Lycée Notre-Dame",
  city: "Dijon",
  schoolYear: "2025–2026",
  studentsCount: 38,
  summitName: "Tête Blanche",
  summitAltitude: 3429,
  expeditionDates: "2 — 5 juillet 2026",
  guideCompany: "Compagnie des Guides de Chamonix",
  guideCompanyFounded: 1821,
  costPerStudent: 870,
} as const;

// Each chapter carries an altitude that ascends from Le Tour (1 462 m) to
// the Tête Blanche summit (3 429 m). The altitudes give the page its
// climbing-narrative spine — every chapter label reads as one more step
// of the ascent.
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

export const KEY_FIGURES = [
  { value: 38, suffix: "", label: "élèves de Terminale" },
  { value: 3429, suffix: " m", label: "altitude au sommet" },
  { value: 4, suffix: " jours", label: "à Chamonix" },
  { value: 1, suffix: " année", label: "de préparation" },
] as const;

export const TIMELINE = [
  {
    date: "Septembre 2025",
    title: "Lancement du projet",
    body: "Première réunion avec les trente-huit élèves volontaires. Présentation de la finalité, de la philosophie et du calendrier.",
  },
  {
    date: "Novembre 2025",
    title: "Sapins de Noël bio",
    body: "Première action de financement. Vente sur commande auprès des familles, du quartier et des entreprises partenaires.",
  },
  {
    date: "Décembre 2025",
    title: "Fromages du Jura",
    body: "Vente de comté et de morbier de la Fruitière des Monts de Joux. Logistique entièrement gérée par les élèves.",
  },
  {
    date: "Janvier 2026",
    title: "Galettes des rois",
    body: "Partenariat avec la boulangerie Héliot. Trois cents galettes vendues en deux semaines.",
  },
  {
    date: "1ᵉʳ février 2026",
    title: "Colomby de Gex — 1 688 m",
    body: "Première sortie en altitude après une semaine de bac blanc. Mer de nuages sur le Léman, chaîne du Mont-Blanc visible plein sud. Douze kilomètres, six cent cinquante mètres de dénivelé, raquettes prêtées par le lycée.",
  },
  {
    date: "Mars 2026",
    title: "Préparation physique",
    body: "Début des séances hebdomadaires. Cardio, gainage, port du sac chargé. Un soir par semaine, après les cours.",
  },
  {
    date: "Avril 2026",
    title: "Combes dijonnaises",
    body: "Randonnées avec sacs lestés dans les combes de la Côte. Apprentissage du rythme régulier, de l'hydratation, de l'effort dans la durée.",
  },
  {
    date: "Juin 2026",
    title: "Baccalauréat",
    body: "Épreuves finales. Le projet se met en pause une dizaine de jours, le temps d'aller au bout des copies.",
  },
  {
    date: "2 — 5 juillet 2026",
    title: "Chamonix · Tête Blanche",
    body: "Quatre jours dans la vallée. Acclimatation, montée au refuge Albert 1ᵉʳ, ascension du sommet, descente. Le projet se vit enfin.",
  },
] as const;

export const TEAM = [
  {
    name: "Mme Raclot",
    role: "Professeur de Mathématiques",
    note: "Initiatrice du projet",
  },
  {
    name: "Mme Held",
    role: "Professeur de Sciences Physiques",
    note: "Préparation physique et logistique",
  },
  {
    name: "Mme Lavayssière",
    role: "Professeur de SVT",
    note: "Sécurité, secours, milieu montagnard",
  },
  {
    name: "M. Renaudot",
    role: "Responsable de la vie scolaire",
    note: "Cohésion du groupe et accompagnement",
  },
] as const;

export const PARTNERS = [
  {
    name: "Compagnie des Guides de Chamonix",
    note: "Encadrement, depuis 1821",
  },
  { name: "MILLET Chamonix", note: "Équipement haute montagne" },
  { name: "Lycée Notre-Dame de Dijon", note: "Établissement porteur" },
  { name: "Boulangerie Héliot", note: "Partenaire des actions de financement" },
  {
    name: "Fruitière des Monts de Joux",
    note: "Partenaire des actions de financement",
  },
] as const;

export const ROUTE_STAGES = [
  {
    day: "Jour 1",
    title: "Le Tour → Refuge Albert 1ᵉʳ",
    altitude: "2 702 m",
    deniveleUp: "+600 m",
    deniveleDown: "—",
    note: "Sentier de moraine, première nuit en refuge d'altitude.",
  },
  {
    day: "Jour 2",
    title: "Refuge → Tête Blanche → Le Tour",
    altitude: "3 429 m",
    deniveleUp: "+720 m",
    deniveleDown: "−1 320 m",
    note: "Départ à la frontale. Crampons sur le glacier du Tour. Pente qui s'adoucit jusqu'au sommet.",
  },
] as const;
