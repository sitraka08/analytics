import { z } from "zod";

export const PERIODS = ["24h", "7d", "30d", "90d"] as const;

export const DEFAULT_PERIOD = "7d";

/** Invalid or missing values fall back to the default instead of failing the page. */
export const periodSchema = z.enum(PERIODS).catch(DEFAULT_PERIOD);

export type Period = z.infer<typeof periodSchema>;
