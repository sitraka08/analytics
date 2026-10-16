---
name: new-feature
description: Créer une nouvelle feature sous src/features selon l'architecture par feature. À utiliser pour ajouter une capacité comme sites, analytics, tracking, auth ou settings.
---

# Nouvelle feature

1. Lire `.claude/rules/architecture.md` et lister `src/features/` : la capacité existe-t-elle déjà ? Si oui, l'étendre.
2. Choisir le nom de la feature (kebab-case, une capacité métier).
3. Créer uniquement les sous-dossiers nécessaires parmi `components/ hooks/ schemas/ services/ types/ utils/ constants/`. Pas de dossier vide.
4. Nommer sans suffixe de rôle : `schemas/site.ts`, `services/site.ts`, `types/site.ts`. Hooks : `use-*.ts`.
5. Données : accès DB uniquement dans `services/`, avec contrôle d'accès au site. Validation Zod dans `schemas/`.
6. Ajouter `index.ts` seulement si d'autres features ou pages doivent importer ; n'y exposer que l'API voulue.
7. Brancher la feature depuis `src/app/` (voir skill `new-page`).
8. Vérifier : pas de dépendance circulaire, pas d'import des internes d'une autre feature, `pnpm lint` et `pnpm build`.
