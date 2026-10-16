---
name: review-architecture
description: Auditer les changements récents par rapport à l'architecture, au nommage, à la vie privée et à la qualité. À utiliser avant de terminer une tâche ou sur demande de revue de structure.
---

# Revue d'architecture

Passer en revue les fichiers modifiés et signaler chaque écart avec chemin et correction proposée.

- **Placement** : le code est dans la bonne feature ; rien de partagé sans deux consommateurs ; `src/app/` ne contient que du routing et de la composition.
- **Nommage** : kebab-case, aucun suffixe de rôle (sauf `use-` pour les hooks) ; pas de noms génériques.
- **Imports** : pas d'import des internes d'une autre feature, pas de cycle.
- **Responsabilités** : services sans UI, schémas sans effet de bord, composants de présentation sans appel de données.
- **Next.js** : Server Components par défaut, `"use client"` en feuille, Route Handlers limités à la collecte, auth et script.
- **Données** : agrégation en SQL, requêtes bornées, contrôle d'accès au site dans chaque service, Zod aux frontières.
- **Vie privée** : aucun cookie, stockage navigateur, IP ou user-agent bruts.
- **UX** : états chargement/vide/erreur, textes français centralisés, accessibilité.
- **Design** : pas de couleur codée en dur (tokens `globals.css`, `panel-*`, `toneClass`), texte blanc sur les cartes colorées, champs et boutons réutilisés (`TextField`, `SubmitButton`), rien qui fasse « UI générée » (voir `rules/design-and-dataviz.md`).
- **Hygiène** : pas de dossier vide ni de placeholder, pas de dépendance injustifiée, `pnpm lint` et `pnpm build` passent.
