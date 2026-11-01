import { sql } from "drizzle-orm";
import type { Filters } from "../schemas/filters";

/** Maps the validated URL filters to the optional named arguments of the `analytics_*` SQL functions. */
export function filterArgs(filters: Filters) {
  return sql`p_page => ${filters.page ?? null}::text, p_referrer => ${filters.referrer ?? null}::text, p_country => ${filters.country ?? null}::text, p_device => ${filters.device ?? null}::text, p_city => ${filters.city ?? null}::text`;
}
