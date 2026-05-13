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

## Modifier le contenu

Tous les textes éditoriaux centralisés se trouvent dans
[`src/lib/content.ts`](src/lib/content.ts) :

- `SITE` — métadonnées globales (lien HelloAsso, email, dates, chiffres)
- `CHAPTERS` — table des matières (utilisée par la nav)
- `KEY_FIGURES` — chiffres animés du chapitre 1
- `TIMELINE` — étapes de la frise chronologique
- `TEAM` — quatre adultes encadrants
- `PARTNERS` — liste des partenaires
- `ROUTE_STAGES` — itinéraire en deux jours

Les textes plus longs (introduction, paragraphes éditoriaux) restent au
plus près des composants concernés (`src/sections/*.tsx`) pour que la
mise en page reste lisible.

## Données à fournir avant mise en ligne

- [ ] Lien exact de la cagnotte HelloAsso → `SITE.hellloAssoUrl`
- [ ] Email officiel du projet → `SITE.contactEmail`
- [ ] Logo SVG « Les Maths au Sommet » HD
- [ ] Logo SVG du lycée Notre-Dame HD
- [ ] Banque photo complète + autorisations parentales vérifiées
- [ ] Confirmation finale des dates et du coût par élève

## Photos

Les visuels du site sont actuellement des **illustrations SVG en
placeholder** (composants `MountainBackdrop` et `PhotoTile`). Pour
intégrer les photographies réelles :

1. Déposer les originaux dans `public/photos/` (formats source).
2. Optimiser au build avec `next/image` (formats AVIF + WebP automatiques).
3. Remplacer les `<PhotoTile />` du chapitre Galerie par
   `<Image src="/photos/..." />` en gardant le même cadre / ratio.
4. Vérifier au cas par cas que les autorisations parentales couvrent un
   usage sur ce site externe (et pas seulement les supports internes
   Saint-Augustin).

## Accessibilité & performance

- Hiérarchie sémantique stricte (un seul `h1`, sections nommées)
- Préférence `prefers-reduced-motion` respectée (animations désactivées)
- Contraste vérifié sur les fonds bleu nuit
- Polices chargées via `next/font` (pas de FOIT, swap propre)
- Cible Lighthouse ≥ 90 sur toutes les catégories

## Déploiement

Conçu pour **Vercel** (zero-config) ou **Netlify**. Aucune variable
d'environnement requise pour la V1.
