import { z } from "zod";

export const rankingDimensionSchema = z.enum(["pages", "referrers", "countries", "cities", "devices"]);

/** Optional `limit` of the ranking endpoint; the SQL function clamps it again. */
export const rankingLimitSchema = z.coerce.number().int().min(1).max(100).catch(30);
