# Base de données et API

## Neon + Drizzle
- Schéma dans `src/db/schema/`, client dans `src/db/index.ts`. Développement : Postgres local dans Docker ; production : Neon (URL poolée). Un seul driver Postgres standard (`pg` ou `postgres`) pour les deux, `DATABASE_URL` en variable d'environnement. Pas de driver spécifique Neon, qui ne fonctionne pas avec le Postgres local.
- Migrations versionnées avec `pnpm db:generate` puis `pnpm db:migrate` ; ne jamais modifier une migration déjà appliquée.
- Index sur les colonnes de filtre fréquentes : `(site_id, created_at)` au minimum.
- Requêtes d'agrégation en SQL (`count`, `date_trunc`, `group by`), bornées par période et `limit`. Jamais de lecture de tous les événements.
- Si le volume grandit : tables de rollup quotidiennes plutôt que d'agréger les événements bruts à chaque requête.
- Respecter les limites du plan gratuit Neon : écritures légères, pas de requêtes lourdes inutiles, rétention bornée.

## Services
- Tout accès aux données passe par `services/` d'une feature.
- Chaque fonction qui lit ou écrit des données d'un site reçoit l'utilisateur et vérifie qu'il en est propriétaire avant la requête.
- Les services retournent des données typées et lèvent des erreurs typées.

## Validation et erreurs
- Zod à chaque frontière : formulaires, Server Actions, `/api/collect`, paramètres d'URL (période, filtres).
- Types dérivés avec `z.infer`.
- Server Actions : retourner `{ ok: true, data }` ou `{ ok: false, error, fieldErrors? }`, sans lever d'exception.

## Sécurité
- Secrets uniquement en variables d'environnement, jamais dans le code ni côté client.
- Aucune requête SQL brute avec concaténation ; utiliser les paramètres Drizzle.
- Ne jamais exposer l'identifiant interne d'un autre utilisateur ni de données d'un site non possédé.
