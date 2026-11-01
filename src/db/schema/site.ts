import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

// Sites owned by an authenticated user.
export const site = pgTable(
  "site",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text().notNull(),
    domain: text().notNull(),
    // Public collection key embedded in the tracking snippet; it identifies the site, it is not a secret.
    publicKey: text().notNull().unique(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("site_user_id_idx").on(table.userId)],
);
