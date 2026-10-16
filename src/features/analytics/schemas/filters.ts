import { z } from "zod";

const value = z.string().trim().min(1).max(200).optional().catch(undefined);

export const filtersSchema = z.object({
  page: value,
  referrer: value,
  country: z.string().trim().length(2).toUpperCase().optional().catch(undefined),
  device: value,
});

export type Filters = z.infer<typeof filtersSchema>;

export const FILTER_KEYS = ["page", "referrer", "country", "device"] as const satisfies readonly (keyof Filters)[];
