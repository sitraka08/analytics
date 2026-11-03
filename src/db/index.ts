import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as authTables from "./schema/auth";
import * as event from "./schema/event";
import * as site from "./schema/site";

const schema = { ...authTables, ...site, ...event };

// One pool per server instance (reused across hot reloads in dev). The same `pg` driver talks to the
// local Docker Postgres and to Neon: use Neon's pooled connection string in production.
const globalForDb = globalThis as unknown as { pool?: Pool };
const pool = (globalForDb.pool ??= new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
}));

export const db = drizzle(pool, { schema, casing: "snake_case" });
export { schema };
