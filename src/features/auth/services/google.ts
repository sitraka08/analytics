"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { AUTH_ENABLED } from "../constants/availability";
import { getSafeRedirectPath } from "../utils/auth-error";
import { auth } from "./auth";

export async function signInWithGoogleAction(formData: FormData) {
  if (!AUTH_ENABLED) redirect(`${ROUTES.login}?error=unavailable`);

  const redirectTo = getSafeRedirectPath(formData.get("next"), ROUTES.dashboard);
  let url: string | undefined;

  try {
    const result = await auth.api.signInSocial({
      body: { provider: "google", callbackURL: redirectTo, errorCallbackURL: `${ROUTES.login}?error=google` },
      headers: await headers(),
    });
    url = result.url;
  } catch (error) {
    console.error("signInWithGoogle failed", error instanceof Error ? error.message : "unknown error");
  }

  redirect(url ?? `${ROUTES.login}?error=google`);
}
