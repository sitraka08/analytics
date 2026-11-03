"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { ROUTES } from "@/lib/routes";
import { signUpSchema, type SignUpField } from "../schemas/sign-up";
import type { FormState } from "@/lib/form-state";
import {
  AUTH_ENABLED,
  AUTH_UNAVAILABLE_MESSAGE,
  auth,
  getAuthErrorMessage,
} from "@/features/auth";

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
    return {
      ok: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  if (!AUTH_ENABLED) return { ok: false, message: AUTH_UNAVAILABLE_MESSAGE };

  try {
    await auth.api.signUpEmail({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        callbackURL: ROUTES.dashboard,
      },
    });
  } catch (error) {
    return { ok: false, message: getAuthErrorMessage(error), values };
  }

  // Email verification is required: no session is created until the link is opened.
  redirect(
    `${ROUTES.verifyEmail}?email=${encodeURIComponent(parsed.data.email)}`,
  );
}
