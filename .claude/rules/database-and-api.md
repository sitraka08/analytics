# Database and API

## Supabase
- Schema and SQL functions only through versioned migrations in `supabase/migrations/` (`pnpm db:start`, `pnpm db:reset`, `pnpm db:push`); never edit an already applied migration. Regenerate `src/db/types.ts` with `pnpm db:types`.
- Clients in `src/db/`: `server.ts` (session cookies, RLS applies as the user) for everything signed-in; `admin.ts` (service role, `server-only`) only for `/api/collect`. The service-role key never reaches client code.
- RLS is enabled on every table; the owner policy is the safety net, the services' explicit ownership check stays.
- Index frequently filtered columns: `(site_id, created_at)` at minimum.
- Aggregation queries as `security invoker` SQL functions called with `rpc()` (`count`, `date_trunc`, `group by`), bounded by period and `limit`. Never read all events.
- If volume grows: daily rollup tables rather than aggregating raw events on every request.
- Respect the Supabase free plan limits: light writes, no needlessly heavy queries, bounded retention.

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
- No SQL built by concatenation; use supabase-js query builders and `rpc()` parameters.
- Never expose another user's internal identifier nor data from a site that is not owned.
