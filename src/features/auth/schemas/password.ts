import { z } from "zod";
import { emailField, newPasswordField } from "./fields";

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type ForgotPasswordField = keyof z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: newPasswordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Les deux mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export type ResetPasswordField = keyof z.infer<typeof resetPasswordSchema>;
