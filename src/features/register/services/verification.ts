"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/db/server";
import { ROUTES } from "@/lib/routes";
import { forgotPasswordSchema, type ForgotPasswordField } from "../schemas/password";
import type { FormState } from "@/lib/form-state";
import { getAuthErrorMessage } from "../utils/auth-error";

export async function resendVerificationAction(
  _previous: FormState<ForgotPasswordField>,
  formData: FormData,
): Promise<FormState<ForgotPasswordField>> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: { emailRedirectTo: `${origin}${ROUTES.authCallback}` },
  });

  if (error) return { ok: false, message: getAuthErrorMessage(error) };

  return { ok: true, message: "E-mail renvoyé. Vérifiez aussi vos spams." };
}
