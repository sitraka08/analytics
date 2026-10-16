import type { site } from "@/db/schema";

export type Site = typeof site.$inferSelect;

/** Fields safe to hand to the client: the owner's internal id stays on the server. */
export type SiteSummary = Pick<Site, "id" | "name" | "domain" | "publicKey" | "createdAt">;
