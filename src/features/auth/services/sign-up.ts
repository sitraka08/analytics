"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ROUTES } from "@/lib/routes";
import { signUpSchema, type SignUpField } from "../schemas/sign-up";
import type { FormState } from "../types/form-state";
import { getAuthErrorMessage } from "../utils/auth-error";
import { auth } from "./auth";

export async function signUpAction(
  _previous: FormState<SignUpField>,
  formData: FormData,
): Promise<FormState<SignUpField>> {
  const values = { name: String(formData.get("name") ?? ""), email: String(formData.get("email") ?? "") };
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }

  try {
    await auth.api.signUpEmail({
      body: { ...parsed.data, callbackURL: ROUTES.dashboard },
      headers: await headers(),
    });
  } catch (error) {
    return { ok: false, message: getAuthErrorMessage(error), values };
  }

  redirect(`${ROUTES.verifyEmail}?email=${encodeURIComponent(parsed.data.email)}`);
}
