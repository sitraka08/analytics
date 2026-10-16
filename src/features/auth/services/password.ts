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
import type { FormState } from "../types/form-state";
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

  try {
    await auth.api.requestPasswordReset({
      body: { email: parsed.data.email, redirectTo: ROUTES.resetPassword },
      headers: await headers(),
    });
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
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await auth.api.resetPassword({
      body: { token: parsed.data.token, newPassword: parsed.data.password },
      headers: await headers(),
    });
  } catch (error) {
    return { ok: false, message: getAuthErrorMessage(error) };
  }

  redirect(`${ROUTES.login}?reset=success`);
}
