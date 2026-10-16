"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/db/server";
import { ROUTES } from "@/lib/routes";
import { resendVerificationSchema, type ResendVerificationField } from "../schemas/verification";
import type { FormState } from "@/lib/form-state";
import { AUTH_ENABLED, AUTH_UNAVAILABLE_MESSAGE, getAuthErrorMessage } from "@/features/auth";

export async function resendVerificationAction(
  _previous: FormState<ResendVerificationField>,
  formData: FormData,
): Promise<FormState<ResendVerificationField>> {
  const parsed = resendVerificationSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  if (!AUTH_ENABLED) return { ok: false, message: AUTH_UNAVAILABLE_MESSAGE };

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
