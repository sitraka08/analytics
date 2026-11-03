# Database and API

## Database (Postgres, Drizzle)

- Schema in `src/db/schema/` (Drizzle); changes only through versioned migrations in `drizzle/` (`pnpm db:generate`, `pnpm db:migrate`); never edit an already applied migration. SQL functions go in custom migrations (`drizzle-kit generate --custom`).
- Single client: `src/db/index.ts` (`server-only`, `pg` pool). Local Postgres runs in Docker (`pnpm db:start`); production is Neon (pooled `DATABASE_URL`).
- There is no RLS: **the ownership check is the only guard**. Services call `getOwnedSite(userId, siteId)` first, and every `analytics_*` SQL function takes `p_user_id` and joins `site` on it.
- Index frequently filtered columns: `(site_id, created_at)` at minimum.
- Aggregation queries as SQL functions called with `db.execute(sql\`select * from analytics_x(...)\`)` (`count`, `date_trunc`, `group by`), bounded by period and `limit`. Never read all events.
- If volume grows: daily rollup tables rather than aggregating raw events on every request.
- Respect the Neon free plan limits: light writes, no needlessly heavy queries, bounded retention.

## Auth

- Better Auth (`features/auth/services/auth.ts`); its tables live in `src/db/schema/auth.ts`. Sessions are validated in `getSession()`; the proxy only checks the cookie exists.
- Emails go through `features/auth/services/send-email.ts` (Resend when `RESEND_API_KEY` is set, console otherwise).

## Services

- All data access goes through a feature's `services/`.
- Every function that reads or writes a site's data receives the user and checks ownership before the query.
- Services return typed data and throw typed errors.

## Validation and errors

- Zod at every boundary: forms, Server Actions, `/api/p`, dashboard API Routes, URL params (period, filters).
- Types derived with `z.infer`.
- Server Actions: return `{ ok: true, data }` or `{ ok: false, error, fieldErrors? }`, without throwing.

## Security

- Secrets only in environment variables, never in code nor on the client side.
- No SQL built by concatenation; use Drizzle query builders and `sql` template parameters.
- Never expose another user's internal identifier nor data from a site that is not owned.

## Dashboard API Routes

- `app/api/sites/[siteId]/...` are thin read adapters: Zod-parse params, `getSession()` (401), call the existing feature service with the user id (404 for a foreign site), return JSON, `no-store`. No business logic in the route.
- The shared shell is `handleSiteRequest` in the analytics feature; the page prefetch and the client hooks share `analyticsKeys`.
