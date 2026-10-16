# Qualité du code

- TypeScript strict ; pas de `any` sans commentaire justifié. Types dérivés de Zod (`z.infer`).
- Réutiliser l'existant avant de créer ; pas de duplication entre features.
- Pas de dépendance sans besoin clair ; inspecter le code et `package.json` d'abord.
- Perf : requêtes bornées, pas de gros payloads vers le client, `next/image` pour les images, bundles clients minimaux (importer les graphes seulement là où ils servent).
- Dates : stocker en UTC, afficher dans le fuseau du navigateur ou du site ; regrouper par jour côté SQL avec fuseau explicite.
- Nombres : formater avec `Intl` en `fr`.
- Sécurité : validation à toutes les frontières, secrets en env, contrôle d'accès à chaque lecture/écriture de données d'un site.
- Erreurs : ne pas avaler silencieusement ; messages utilisateur clairs, détails en logs serveur sans données personnelles.
- Commentaires : seulement pour une intention non évidente, dans le style du code voisin.
- Avant de terminer : `pnpm lint` et `pnpm build` passent.
