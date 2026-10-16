---
name: new-analytics-widget
description: Ajouter un widget de métrique au dashboard (requête d'agrégation, service, graphe ou tableau, états). À utiliser pour top pages, pays, appareils, courbe de visiteurs, KPI.
---

# Nouveau widget analytics

1. Lire `.claude/context/product-and-domain.md` (définitions) et `.claude/rules/design-and-dataviz.md`.
2. Définir la métrique en une phrase et sa forme de donnée (série temporelle, classement, valeur + variation).
3. `services/<metrique>.ts` dans la feature `analytics` : requête SQL agrégée Drizzle, filtrée par `site_id` et période, bornée (`limit`), après vérification d'accès. Retourner aussi la période précédente si le widget affiche une variation.
4. `schemas/` : valider période et filtres reçus de l'URL.
5. Choisir le rendu : aire/ligne pour le temps, barres horizontales pour un classement, KPI avec variation pour une valeur. Un titre qui dit ce qu'on voit.
6. Le composant de données est un Server Component ; seul le graphe interactif est un Client Component en feuille. Libellés et formats via `Intl` en `fr`.
7. Gérer chargement (Skeleton), vide (expliquer comment installer le script), erreur et peu de données. Fournir un équivalent textuel accessible.
8. Vérifier la requête sur un jeu de données réaliste (index `(site_id, created_at)` utilisé), puis `pnpm lint` et `pnpm build`.
