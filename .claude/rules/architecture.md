# Architecture par feature

Organiser par capacité métier, puis par responsabilité technique.

```text
src/
├── app/          # routing, layouts, composition de pages, metadata
├── features/     # auth, sites, analytics, tracking, landing, settings
├── components/   # ui/ (shadcn), shared/, layout/
├── db/           # schéma Drizzle, client, migrations
└── lib/          # utilitaires réellement partagés
```

## Intérieur d'une feature (créer seulement le nécessaire)
```text
features/<name>/
├── components/  hooks/  schemas/  services/  types/  utils/  constants/
└── index.ts     # point d'entrée public optionnel
```

## Nommage
Le dossier porte déjà le rôle : pas de suffixe.
- `schemas/site.ts`, `types/site.ts`, `services/site.ts`, `utils/period.ts`, `constants/periods.ts`.
- Composants : fichier kebab-case, déclaration PascalCase (`StatCard` dans `components/stat-card.tsx`).
- Hooks : préfixe `use-` conservé (`hooks/use-sites-query.ts`, `useSitesQuery`).
- Server Actions : dans `services/`, repérées par `"use server"`, sans suffixe.
- Éviter les noms génériques (`helpers.ts`, `data.ts`). Variables et fonctions en camelCase.

## Responsabilités
- Pages composent ; composants de présentation reçoivent des props.
- `services/` : accès données (Drizzle) et logique serveur, pas d'UI.
- `schemas/` : validation Zod uniquement. `utils/` : fonctions pures.
- Hooks : état et requêtes client de la feature, rien d'autre.

## Dépendances
- Une feature n'importe une autre que via son `index.ts`, jamais ses internes.
- Pas de dépendance circulaire : extraire la partie neutre vers un dossier partagé.
- Ne partager qu'à partir de deux features réellement consommatrices.
- Pas de barrel `index.ts` généralisé.
