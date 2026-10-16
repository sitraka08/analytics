import { z } from "zod";

export const MAX_BODY_BYTES = 2048;
const MAX_DURATION_MS = 60 * 60 * 1000;

const baseFields = {
  key: z.string().regex(/^[A-Za-z0-9_-]{8,64}$/),
  // Random per-pageview identifier generated in memory by the script; it links the duration to its pageview.
  id: z.string().regex(/^[A-Za-z0-9_-]{8,32}$/),
};

export const collectSchema = z.discriminatedUnion("type", [
  z.object({
    ...baseFields,
    type: z.literal("pageview"),
    url: z.url({ protocol: /^https?$/ }).max(2048),
    referrer: z.string().max(2048).optional(),
  }),
  z.object({
    ...baseFields,
    type: z.literal("duration"),
    duration: z
      .number()
      .finite()
      .nonnegative()
      .transform((value) => Math.min(Math.round(value), MAX_DURATION_MS)),
  }),
]);

export type CollectPayload = z.infer<typeof collectSchema>;
