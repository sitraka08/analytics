"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ROUTES } from "@/lib/routes";
import { signInSchema, type SignInField } from "../schemas/sign-in";
import type { FormState } from "@/lib/form-state";
import { AUTH_ENABLED, AUTH_UNAVAILABLE_MESSAGE, auth, getAuthErrorMessage, getSafeRedirectPath } from "@/features/auth";

export async function signInAction(
  _previous: FormState<SignInField>,
  formData: FormData,
): Promise<FormState<SignInField>> {
  const values = { email: String(formData.get("email") ?? "") };
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }

  if (!AUTH_ENABLED) return { ok: false, message: AUTH_UNAVAILABLE_MESSAGE };

  const redirectTo = getSafeRedirectPath(formData.get("next"), ROUTES.dashboard);

  try {
    await auth.api.signInEmail({ body: parsed.data, headers: await headers() });
  } catch (error) {
    return { ok: false, message: getAuthErrorMessage(error), values };
  }

  redirect(redirectTo);
}
