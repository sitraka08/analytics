import { z } from "zod";
import { emailField } from "@/features/auth";

export const resendVerificationSchema = z.object({
  email: emailField,
});

export type ResendVerificationField = keyof z.infer<
  typeof resendVerificationSchema
>;
