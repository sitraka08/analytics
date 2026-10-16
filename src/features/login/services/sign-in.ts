"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/db/server";
import { ROUTES } from "@/lib/routes";
import { signInSchema, type SignInField } from "../schemas/sign-in";
import type { FormState } from "@/lib/form-state";
import { getAuthErrorMessage, getSafeRedirectPath } from "@/features/auth";

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

  const redirectTo = getSafeRedirectPath(formData.get("next"), ROUTES.dashboard);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) return { ok: false, message: getAuthErrorMessage(error), values };

  redirect(redirectTo);
}
