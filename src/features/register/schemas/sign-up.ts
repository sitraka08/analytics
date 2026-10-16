import { z } from "zod";
import { emailField, newPasswordField } from "@/features/auth";

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Saisissez votre nom (2 caractères minimum)." })
    .max(80, { error: "Le nom ne peut pas dépasser 80 caractères." }),
  email: emailField,
  password: newPasswordField,
});

export type SignUpField = keyof z.infer<typeof signUpSchema>;
