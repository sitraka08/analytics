import { z } from "zod";

export const sessionIdSchema = z.uuid();

/** Page number from the URL; anything invalid falls back to the first page. */
export const pageNumberSchema = z.coerce.number().int().min(1).max(10_000).catch(1);
