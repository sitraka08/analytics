---
name: new-page
description: Ajouter une route App Router qui compose des composants de feature. À utiliser pour une page, un layout, un loading ou un error sous src/app.
---

# Nouvelle page

1. Lire `.claude/rules/nextjs-app-router.md` et vérifier la doc locale (`node_modules/next/dist/docs`) si l'API de cache ou de PPR est concernée.
2. Choisir le groupe : `(marketing)`, `(auth)` ou `(dashboard)`. Ne créer le groupe que s'il manque.
3. `page.tsx` est un Server Component qui compose des composants de feature et lit les données via leurs `services/`. Aucune logique métier dans la page.
4. Dashboard : vérifier la session côté serveur et passer l'utilisateur aux services.
5. Ajouter `loading.tsx` (Skeleton de même forme) et `error.tsx` quand la page charge des données ; `not-found.tsx` pour un site inexistant ou non possédé.
6. Exporter la metadata (titre, description) ; soigner le SEO pour les pages marketing.
7. Client Components en feuilles uniquement.
8. Vérifier au navigateur sur mobile et desktop, puis `pnpm lint` et `pnpm build`.
