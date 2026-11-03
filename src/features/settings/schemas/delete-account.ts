import { z } from "zod";

export const deleteAccountSchema = z.object({
  confirmation: z.string().trim().min(1).max(320),
});
