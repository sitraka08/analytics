"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ROUTES } from "@/lib/routes";
import { signInSchema, type SignInField } from "../schemas/sign-in";
import type { FormState } from "@/lib/form-state";
import { getAuthErrorMessage, getSafeRedirectPath } from "../utils/auth-error";
import { auth } from "./auth";

export async function signInAction(
  _previous: FormState<SignInField>,
  formData: FormData,
): Promise<FormState<SignInField>> {
  const values = { email: String(formData.get("email") ?? "") };
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on",
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }

  const redirectTo = getSafeRedirectPath(formData.get("next"), ROUTES.dashboard);

  try {
    await auth.api.signInEmail({
      body: { ...parsed.data, callbackURL: redirectTo },
      headers: await headers(),
    });
  } catch (error) {
    return { ok: false, message: getAuthErrorMessage(error), values };
  }

  redirect(redirectTo);
}

export async function signInWithGoogleAction(formData: FormData) {
  const redirectTo = getSafeRedirectPath(formData.get("next"), ROUTES.dashboard);
  let url: string | undefined;

  try {
    const result = await auth.api.signInSocial({
      body: { provider: "google", callbackURL: redirectTo, errorCallbackURL: `${ROUTES.login}?error=google` },
      headers: await headers(),
    });
    url = result.url;
  } catch {
    url = undefined;
  }

  redirect(url ?? `${ROUTES.login}?error=google`);
}
