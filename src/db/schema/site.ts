import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const site = pgTable(
  "site",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    domain: text("domain").notNull(),
    // Public collection key embedded in the tracking snippet; it identifies the site, it is not a secret.
    publicKey: text("public_key").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("site_user_id_idx").on(table.userId)],
);

// One row per pageview. No IP, no user-agent: only the derived, anonymous fields below.
export const event = pgTable(
  "event",
  {
    id: text("id").primaryKey(),
    siteId: text("site_id")
      .notNull()
      .references(() => site.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    path: text("path").notNull(),
    referrerDomain: text("referrer_domain"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    country: text("country"),
    device: text("device"),
    browser: text("browser"),
    os: text("os"),
    // Salted daily hash: cannot be linked from one day to the next.
    visitorHash: text("visitor_hash").notNull(),
    sessionId: text("session_id").notNull(),
    durationMs: integer("duration_ms"),
  },
  (table) => [index("event_site_id_created_at_idx").on(table.siteId, table.createdAt)],
);
