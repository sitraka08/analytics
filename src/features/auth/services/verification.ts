"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { ROUTES } from "@/lib/routes";
import { AUTH_COPY } from "../constants/content";
import { forgotPasswordSchema, type ForgotPasswordField } from "../schemas/password";
import type { FormState } from "../types/form-state";
import { getAuthErrorMessage } from "../utils/auth-error";
import { auth } from "./auth";

export async function resendVerificationAction(
  _previous: FormState<ForgotPasswordField>,
  formData: FormData,
): Promise<FormState<ForgotPasswordField>> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await auth.api.sendVerificationEmail({
      body: { email: parsed.data.email, callbackURL: ROUTES.dashboard },
      headers: await headers(),
    });
  } catch (error) {
    return { ok: false, message: getAuthErrorMessage(error) };
  }

  return { ok: true, message: AUTH_COPY.verifyEmail.resent };
}
