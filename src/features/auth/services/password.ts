"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/db/server";
import { ROUTES } from "@/lib/routes";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordField,
  type ResetPasswordField,
} from "../schemas/password";
import type { FormState } from "@/lib/form-state";
import { AUTH_ENABLED, AUTH_UNAVAILABLE_MESSAGE } from "../constants/availability";
import { getAuthErrorMessage } from "../utils/auth-error";

export async function requestPasswordResetAction(
  _previous: FormState<ForgotPasswordField>,
  formData: FormData,
): Promise<FormState<ForgotPasswordField>> {
  const values = { email: String(formData.get("email") ?? "") };
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }

  if (!AUTH_ENABLED) return { ok: false, message: AUTH_UNAVAILABLE_MESSAGE };

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}${ROUTES.authCallback}?next=${encodeURIComponent(ROUTES.resetPassword)}`,
  });

  if (error) return { ok: false, message: getAuthErrorMessage(error), values };

  // Same response whether the account exists or not, so registered addresses are not revealed.
  return { ok: true, message: "Si un compte existe pour cette adresse, un e-mail vient d'être envoyé. Pensez à vérifier vos spams.", values };
}

export async function resetPasswordAction(
  _previous: FormState<ResetPasswordField>,
  formData: FormData,
): Promise<FormState<ResetPasswordField>> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  if (!AUTH_ENABLED) return { ok: false, message: AUTH_UNAVAILABLE_MESSAGE };

  // The recovery link signed the user in (see /auth/callback): updating the password is enough.
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) return { ok: false, message: getAuthErrorMessage(error) };

  await supabase.auth.signOut();
  redirect(`${ROUTES.login}?reset=success`);
}
