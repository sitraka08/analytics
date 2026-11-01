"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
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
import { auth } from "./auth";

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

  try {
    await auth.api.requestPasswordReset({ body: { email: parsed.data.email, redirectTo: ROUTES.resetPassword }, headers: await headers() });
  } catch (error) {
    return { ok: false, message: getAuthErrorMessage(error), values };
  }

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
  const token = String(formData.get("token") ?? "");

  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  if (!AUTH_ENABLED) return { ok: false, message: AUTH_UNAVAILABLE_MESSAGE };

  // The token comes from the emailed link (forwarded by the reset page); Better Auth validates and consumes it.
  try {
    await auth.api.resetPassword({ body: { newPassword: parsed.data.password, token } });
  } catch (error) {
    return { ok: false, message: getAuthErrorMessage(error) };
  }

  redirect(`${ROUTES.login}?reset=success`);
}
