# CLAUDE.md

SaaS d'analytics web (pays, pages, durées, appareils, sources…) avec des graphes **lisibles** : l'alternative claire à Vercel Analytics. Fullstack Next.js, sans backend séparé.

## Stack
Next.js (dernière version, App Router) · React · TypeScript strict · Tailwind CSS 4 · shadcn/ui · Neon Postgres + Drizzle ORM · Better Auth · Zod · TanStack Query (interactivité client seulement) · pnpm · Vercel. Alias `@/*` → `src/*`.

Next.js évolue vite : vérifier `node_modules/next/dist/docs` avant d'utiliser une API peu familière.

## Commandes
- `pnpm dev` · `pnpm build` · `pnpm lint`
- `pnpm db:generate` · `pnpm db:migrate` · `pnpm db:studio` (Drizzle)

## Contexte (lire avant de modifier)
- `.claude/context/product-and-domain.md` — vision, modèle, métriques
- `.claude/context/tracking-and-privacy.md` — collecte, hash visiteur, RGPD

## Rules (`.claude/rules/`)
`architecture.md` · `nextjs-app-router.md` · `database-and-api.md` · `tracking-privacy.md` · `design-and-dataviz.md` · `code-quality.md`

## Skills (`.claude/skills/`)
`new-feature` · `new-page` · `new-form` · `new-analytics-widget` · `review-architecture`

## Non-négociables
1. Privacy-first : pas de cookie, pas d'IP stockée, pas de fingerprinting.
2. Lisibilité avant densité : une idée par graphe, titres explicites, états vides soignés.
3. Agrégation côté serveur (SQL), jamais de gros jeux d'événements envoyés au client.
4. Chaque requête de données vérifie que l'utilisateur a accès au site demandé.
5. Organisation par feature d'abord (`src/features/<name>/...`), partage seulement si réellement multi-features.
6. Fichiers et dossiers en `kebab-case`, sans suffixe de rôle (le dossier le porte) ; composants en PascalCase.
7. Server Components par défaut ; `"use client"` uniquement en feuille, pour l'interactivité.
8. Pas de dépendance nouvelle sans besoin clair ; réutiliser l'existant.
9. Pas de dossier vide ni de fichier placeholder.
10. UI en français uniquement, textes faciles à extraire ; code, routes et identifiants en anglais. Polices : Manrope (titres, grands chiffres), Google Sans (texte/UI), Google Sans Code (code, nombres alignés).
11. Règle ambiguë : poser l'hypothèse et demander avant d'inventer.
12. Avant de finir : `pnpm lint` et `pnpm build` passent.
