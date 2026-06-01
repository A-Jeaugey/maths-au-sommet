# Les Maths au Sommet

Site vitrine éditorial du projet pédagogique « Les Maths au Sommet ! »
porté par Mme Raclot et son équipe au lycée Notre-Dame de Dijon — une
cordée de 38 élèves de Terminale qui prépare l'ascension de Tête Blanche
(3 429 m) en juillet 2026.

One-pager scroll narratif découpé en 7 chapitres + hero + footer.

---

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (design tokens dans `tailwind.config.ts`)
- **Framer Motion** pour les animations d'entrée et la progression du scroll
- Polices : **Fraunces** (serif), **Inter** (sans), **JetBrains Mono** (chiffres)

## Démarrage

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # build de production
npm run start        # lancement du build
npm run typecheck    # vérification TypeScript
npm run lint         # linter Next.js
```

## Structure

```
src/
  app/
    layout.tsx            # polices, métadonnées, fond global
    page.tsx              # composition du one-pager
    globals.css           # variables CSS, reset, accessibilité
  components/
    Navigation.tsx        # header + sommaire fullscreen + side rail
    ScrollProgress.tsx    # barre de progression au scroll
    Footer.tsx            # pied de page
    Reveal.tsx            # wrapper d'animation au scroll
    SectionLabel.tsx      # libellé « Chapitre 0X · ... »
    AnimatedNumber.tsx    # compteur animé pour les chiffres-clés
    MountainBackdrop.tsx  # fond SVG montagne avec parallaxe
    PhotoTile.tsx         # vignette illustrée pour la galerie
  sections/
    Hero.tsx              # chapitre 0 — ouverture
    Projet.tsx            # chapitre 1 — le projet + chiffres-clés
    TeteBlanche.tsx       # chapitre 2 — l'objectif + itinéraire
    Annee.tsx             # chapitre 3 — frise chronologique
    Galerie.tsx           # chapitre 4 — galerie immersive
    Equipe.tsx            # chapitre 5 — l'équipe encadrante
    Partenaires.tsx       # chapitre 6 — partenaires
    Soutenir.tsx          # chapitre 7 — appel à soutien
  lib/
    content.ts            # source unique du contenu éditorial
```

## Modifier le contenu (sans coder)

Le site s'édite **en ligne**, depuis une interface d'administration, à
l'adresse **`/admin`** — sans toucher au code. Guide pas-à-pas pour la
personne qui gère le site : [`docs/GUIDE-ADMIN.md`](docs/GUIDE-ADMIN.md).

Sous le capot, le contenu éditable vit dans des fichiers de données que
l'admin écrit toute seule (commit + push automatiques) :

- [`content/site.json`](content/site.json) — réglages globaux (lien
  HelloAsso, e-mail, dates, coût…), exposé via `SITE`.
- [`content/home.json`](content/home.json) — listes de l'accueil :
  chiffres, frise, équipe, partenaires, itinéraire, **galerie**.
- [`content/pages/*.json`](content/pages) — une page = un fichier ; pages
  faites de blocs, rendues par la route `src/app/[slug]/page.tsx`.

`CHAPTERS` reste dans [`src/lib/content.ts`](src/lib/content.ts) (structure
de navigation, non éditable). Le design, la 3D et les animations restent
volontairement dans le code.

## Données à fournir avant mise en ligne

- [ ] Lien exact de la cagnotte HelloAsso → `SITE.hellloAssoUrl`
- [ ] Email officiel du projet → `SITE.contactEmail`
- [ ] Logo SVG « Les Maths au Sommet » HD
- [ ] Logo SVG du lycée Notre-Dame HD
- [ ] Banque photo complète + autorisations parentales vérifiées
- [ ] Confirmation finale des dates et du coût par élève

## Photos

Les photographies réelles sont dans [`public/photos/`](public/photos)
(préparées via [`scripts/process_photos.py`](scripts/process_photos.py)).
La galerie d'accueil — deux chapitres + agrandissement au clic (lightbox) —
se gère **depuis l'admin** (« Page d'accueil » → « Galerie ») : la taille
des tuiles et les animations sont appliquées automatiquement par position,
l'éditrice ne renseigne que photo + légende + lieu/date.

⚠️ Vérifier au cas par cas que les autorisations parentales couvrent une
diffusion sur ce site public ; les visages des mineurs restent floutés.

## Accessibilité & performance

- Hiérarchie sémantique stricte (un seul `h1`, sections nommées)
- Préférence `prefers-reduced-motion` respectée (animations désactivées)
- Contraste vérifié sur les fonds bleu nuit
- Polices chargées via `next/font` (pas de FOIT, swap propre)
- Cible Lighthouse ≥ 90 sur toutes les catégories

## Déploiement & mise en ligne

Conçu pour **Vercel** (ou Netlify). L'interface `/admin` (Sveltia CMS)
publie en committant sur GitHub via deux routes intégrées au site
(`/api/auth` et `/api/callback`), qui nécessitent une OAuth App GitHub et
deux variables d'environnement : `OAUTH_GITHUB_CLIENT_ID` et
`OAUTH_GITHUB_CLIENT_SECRET`.

Procédure complète (compte projet dédié, hébergement, domaine, pérennité de
l'accès dans le temps) : [`docs/MISE-EN-LIGNE.md`](docs/MISE-EN-LIGNE.md).
