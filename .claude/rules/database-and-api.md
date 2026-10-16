# Database and API

## Neon + Drizzle
- Schema in `src/db/schema/`, client in `src/db/index.ts`. Development: local Postgres in Docker; production: Neon (pooled URL). A single standard Postgres driver (`pg` or `postgres`) for both, `DATABASE_URL` as an environment variable. No Neon-specific driver, which does not work with local Postgres.
- Versioned migrations with `pnpm db:generate` then `pnpm db:migrate`; never edit an already applied migration.
- Index frequently filtered columns: `(site_id, created_at)` at minimum.
- Aggregation queries in SQL (`count`, `date_trunc`, `group by`), bounded by period and `limit`. Never read all events.
- If volume grows: daily rollup tables rather than aggregating raw events on every request.
- Respect the Neon free plan limits: light writes, no needlessly heavy queries, bounded retention.

## Services
- All data access goes through a feature's `services/`.
- Every function that reads or writes a site's data receives the user and checks ownership before the query.
- Services return typed data and throw typed errors.

## Validation and errors
- Zod at every boundary: forms, Server Actions, `/api/collect`, URL params (period, filters).
- Types derived with `z.infer`.
- Server Actions: return `{ ok: true, data }` or `{ ok: false, error, fieldErrors? }`, without throwing.

## Security
- Secrets only in environment variables, never in code nor on the client side.
- No raw SQL with concatenation; use Drizzle parameters.
- Never expose another user's internal identifier nor data from a site that is not owned.
