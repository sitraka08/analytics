import { z } from "zod";
import { emailField } from "./fields";

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, { error: "Saisissez votre mot de passe." }),
});

export type SignInField = keyof z.infer<typeof signInSchema>;
