import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { site } from "./site";

// One row per pageview. No IP, no user-agent: only the derived, anonymous fields below.
export const event = pgTable(
  "event",
  {
    id: text().primaryKey(),
    siteId: uuid()
      .notNull()
      .references(() => site.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    path: text().notNull(),
    referrerDomain: text(),
    utmSource: text(),
    utmMedium: text(),
    utmCampaign: text(),
    country: text(),
    region: text(),
    city: text(),
    device: text(),
    browser: text(),
    os: text(),
    // Salted daily hash: cannot be linked from one day to the next.
    visitorHash: text().notNull(),
    sessionId: text().notNull(),
    durationMs: integer(),
  },
  (table) => [index("event_site_id_created_at_idx").on(table.siteId, table.createdAt), index("event_site_id_session_id_idx").on(table.siteId, table.sessionId)],
);
