# Next.js App Router

- Vérifier `node_modules/next/dist/docs` pour le caching, PPR et les conventions de la version installée ; ne pas se fier à d'anciens comportements.
- `src/app/` : routing, layouts, `loading.tsx`, `error.tsx`, `not-found.tsx`, metadata. Rien d'autre.
- Groupes de routes : `(marketing)` landing et pages publiques, `(auth)` connexion/inscription, `(dashboard)` espace connecté. Créer un groupe seulement quand une page en a besoin.
- Segments d'URL en anglais et kebab-case (`/login`, `/register`, `/forgot-password`, `/dashboard`), comme tout le code ; seuls les textes affichés sont en français. Les chemins sont centralisés dans `src/lib/routes.ts` : ne pas écrire de chemin en dur ailleurs.
- Server Components par défaut. `"use client"` uniquement pour état, effets, événements, APIs navigateur (graphes interactifs, sidebar, filtres), au niveau feuille.
- Données : lues dans les Server Components via les `services/` des features. TanStack Query seulement pour l'interactivité client (filtres, rafraîchissement).
- Mutations : Server Actions retournant `{ ok, ... }`.
- Route Handlers (`app/api`) uniquement pour : `/api/collect` (collecte publique), les endpoints Better Auth, et le script servi aux sites.
- La protection des routes du dashboard vérifie la session côté serveur ; ne jamais se reposer sur l'UI seule.
- Landing : SEO soigné (metadata, Open Graph), rendu statique autant que possible.
- Un seul routeur : ne pas mélanger avec Pages Router.
