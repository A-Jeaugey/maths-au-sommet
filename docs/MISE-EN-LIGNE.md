# Mettre le site en ligne (et activer l'édition + publication automatique)

Ce guide explique, étape par étape, comment :

1. mettre le site **en ligne** sur un compte qui **survivra au départ** de la personne qui l'a codé ;
2. activer l'**interface d'administration en ligne** (`votre-site.fr/admin`) ;
3. faire en sorte que le bouton **« Publier »** envoie les modifications tout seul (commit + push) → le site se met à jour automatiquement.

> ⏱️ Compter ~30 minutes la première fois. À faire **une seule fois**.
> Ensuite, plus jamais besoin de toucher à tout ça.

---

## Vue d'ensemble (comment ça marche)

```
La prof écrit dans  ──►  /admin  ──►  bouton « Publier »
                                   │
                                   ▼  (commit + push automatique)
                              GitHub (le dépôt du projet)
                                   │
                                   ▼  (déploiement automatique)
                              Vercel  ──►  votre-site.fr  ✅ à jour
```

Tout repose sur **3 comptes**, tous créés avec **la même adresse e-mail dédiée au projet** :
GitHub (le code), Vercel (l'hébergement), et le registrar du nom de domaine.

---

## Étape 0 — Créer l'adresse e-mail du projet ⭐ (le point clé de la pérennité)

Créez une **nouvelle adresse Gmail dédiée**, par exemple `mathsausommet.dijon@gmail.com`,
dont **la prof (ou le lycée) garde le mot de passe**.

> ❗ **Ne créez aucun des comptes suivants avec une adresse personnelle d'élève.**
> C'est CE point qui garantit que le site reste accessible quand l'élève qui l'a codé sera parti.

---

## Étape 1 — GitHub (le code)

1. Sur [github.com](https://github.com), créez un compte avec l'e-mail du projet.
2. Mettez le code du site dans un dépôt de ce compte :
   - soit en transférant le dépôt existant (Settings → *Transfer ownership*),
   - soit en créant un dépôt vide `maths-au-sommet` puis en y poussant le code.
3. Notez le chemin du dépôt : `compte-du-projet/maths-au-sommet`.

---

## Étape 2 — Vercel (l'hébergement gratuit)

1. Sur [vercel.com](https://vercel.com), cliquez **Sign up** → **Continue with GitHub**
   (avec le compte GitHub du projet).
2. **Add New → Project** → importez le dépôt `maths-au-sommet`.
3. Laissez les réglages par défaut (Vercel détecte Next.js tout seul) → **Deploy**.
4. En ~1 minute, le site est en ligne sur une adresse `…vercel.app`. 🎉

> 💡 Netlify (netlify.com) fonctionne tout aussi bien si vous préférez ; les étapes
> sont équivalentes. Vercel est conseillé ici car c'est l'éditeur de Next.js.

> ### 🌐 Pas encore de nom de domaine ? Aucun souci.
> Vercel fournit tout de suite une adresse **gratuite et permanente** du type
> `maths-au-sommet.vercel.app`. **Faites toute la suite avec cette adresse** :
> le site **et** l'admin (avec le bouton « Publier ») fonctionnent à 100 %.
> Le vrai nom de domaine se branchera **plus tard, en 2 minutes** (Étape 5),
> **sans rien reconstruire**.
>
> 👉 Astuce pour ne **rien** avoir à refaire le jour du domaine : utilisez
> l'adresse `.vercel.app` **partout** (URL de callback OAuth à l'Étape 3 et
> `base_url` à l'Étape 4). Même après avoir ajouté le vrai domaine, l'admin
> continuera de passer par cette adresse `.vercel.app` (ça marche très bien),
> et le domaine ne servira qu'à l'affichage pour les visiteurs.

---

## Étape 3 — Activer la connexion GitHub de l'admin (l'« app OAuth »)

C'est ce qui permet au bouton **« Publier »** de pousser tout seul.

1. Sur GitHub (compte du projet) : **Settings → Developer settings →
   OAuth Apps → New OAuth App**.
2. Remplissez :
   - **Application name** : `Admin Maths au Sommet`
   - **Homepage URL** : l'adresse du site (ex. `https://maths-au-sommet.fr`)
   - **Authorization callback URL** : l'adresse de votre site suivie de
     `/api/callback`. **Si vous n'avez pas encore le domaine**, mettez
     **`https://votre-projet.vercel.app/api/callback`** (⚠️ l'adresse exacte).
3. **Register application**. GitHub affiche un **Client ID**.
4. Cliquez **Generate a new client secret** → copiez le **Client secret**.

5. Dans Vercel : **Project → Settings → Environment Variables**, ajoutez :

   | Nom | Valeur |
   |-----|--------|
   | `OAUTH_GITHUB_CLIENT_ID` | le Client ID copié |
   | `OAUTH_GITHUB_CLIENT_SECRET` | le Client secret copié |

6. **Redeploy** le projet (onglet Deployments → ⋯ → Redeploy) pour que les
   variables soient prises en compte.

---

## Étape 4 — Pointer l'admin vers le bon dépôt et la bonne adresse

Dans le fichier `public/admin/config.yml`, ajustez 2 lignes :

```yaml
backend:
  name: github
  repo: compte-du-projet/maths-au-sommet   # ← votre dépôt
  branch: main
  base_url: https://maths-au-sommet.fr     # ← l'adresse finale du site
  auth_endpoint: api/auth
```

(On peut le faire… directement depuis l'admin une fois connecté, ou en éditant le
fichier sur GitHub. La toute première connexion peut utiliser l'adresse `…vercel.app`.)

---

## Étape 5 — Le nom de domaine (optionnel mais recommandé)

1. Achetez `maths-au-sommet.fr` chez un registrar (OVH, Gandi, Infomaniak…),
   **avec l'e-mail du projet** et le **renouvellement automatique activé** (~12 €/an).
2. Dans Vercel : **Project → Settings → Domains → Add** → suivez les instructions
   (ajout d'un enregistrement DNS chez le registrar).

> ⚠️ C'est le **seul coût récurrent** et le **seul vrai risque** : si le domaine
> n'est pas renouvelé, l'adresse cesse de fonctionner. D'où le renouvellement
> automatique + une carte rattachée au lycée.

---

## Étape 6 — Tester

1. Allez sur `votre-site.fr/admin`.
2. Cliquez **« Se connecter avec GitHub »** → autorisez.
3. Modifiez quelque chose, cliquez **« Publier »**.
4. Attendez ~1 minute : le site public est à jour. ✅

> 🧪 **Tester l'admin sans rien déployer (pour les bricoleurs)** : en local,
> lancez `npm run dev` dans un terminal et `npx @sveltia/cms-server` dans un autre,
> puis ouvrez `localhost:3000/admin`. La ligne `local_backend: true` du fichier
> de config active ce mode hors-ligne.

---

## Récapitulatif pérennité (à conserver précieusement)

| Élément | Compte / Où | Coût |
|---|---|---|
| Adresse e-mail du projet | Gmail dédié | gratuit |
| Code | GitHub (compte projet) | gratuit |
| Hébergement | Vercel (compte projet) | gratuit |
| Connexion admin | OAuth App GitHub + 2 variables Vercel | gratuit |
| Nom de domaine | Registrar (compte projet) | ~12 €/an |

**Tout est sous l'adresse e-mail du projet.** Le jour où la personne qui a codé le
site s'en va, il suffit de transmettre **l'accès à cette boîte mail** pour garder la
main sur l'intégralité du site.
