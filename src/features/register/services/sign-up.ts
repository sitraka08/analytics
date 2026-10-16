"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/db/server";
import { ROUTES } from "@/lib/routes";
import { signUpSchema, type SignUpField } from "../schemas/sign-up";
import type { FormState } from "@/lib/form-state";
import { AUTH_ENABLED, AUTH_UNAVAILABLE_MESSAGE, getAuthErrorMessage } from "@/features/auth";

export async function signUpAction(
  _previous: FormState<SignUpField>,
  formData: FormData,
): Promise<FormState<SignUpField>> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    terms: String(formData.get("terms") ?? ""),
  };
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    terms: formData.get("terms"),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }

  if (!AUTH_ENABLED) return { ok: false, message: AUTH_UNAVAILABLE_MESSAGE };

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { name: parsed.data.name }, emailRedirectTo: `${origin}${ROUTES.authCallback}` },
  });

  if (error) return { ok: false, message: getAuthErrorMessage(error), values };

  // No session means the project requires a confirmed email (Supabase Auth setting).
  if (data.session) redirect(ROUTES.dashboard);

  redirect(`${ROUTES.verifyEmail}?email=${encodeURIComponent(parsed.data.email)}`);
}
