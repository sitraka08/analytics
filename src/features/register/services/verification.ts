"use server";

import { z } from "zod";
import { ROUTES } from "@/lib/routes";
import {
  resendVerificationSchema,
  type ResendVerificationField,
} from "../schemas/verification";
import type { FormState } from "@/lib/form-state";
import {
  AUTH_ENABLED,
  AUTH_UNAVAILABLE_MESSAGE,
  auth,
  getAuthErrorMessage,
} from "@/features/auth";

export async function resendVerificationAction(
  _previous: FormState<ResendVerificationField>,
  formData: FormData,
): Promise<FormState<ResendVerificationField>> {
  const parsed = resendVerificationSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  if (!AUTH_ENABLED) return { ok: false, message: AUTH_UNAVAILABLE_MESSAGE };

  try {
    await auth.api.sendVerificationEmail({
      body: { email: parsed.data.email, callbackURL: ROUTES.dashboard },
    });
  } catch (error) {
    return { ok: false, message: getAuthErrorMessage(error) };
  }

  return { ok: true, message: "E-mail renvoyé. Vérifiez aussi vos spams." };
}
