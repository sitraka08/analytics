import { z } from "zod";

export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Saisissez une adresse e-mail valide." }));

export const newPasswordField = z
  .string()
  .min(8, { error: "Le mot de passe doit contenir au moins 8 caractères." })
  .max(128, { error: "Le mot de passe ne peut pas dépasser 128 caractères." });
