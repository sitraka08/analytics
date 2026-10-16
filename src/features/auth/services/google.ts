"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/db/server";
import { ROUTES } from "@/lib/routes";
import { AUTH_ENABLED } from "../constants/availability";
import { getSafeRedirectPath } from "../utils/auth-error";

export async function signInWithGoogleAction(formData: FormData) {
  if (!AUTH_ENABLED) redirect(`${ROUTES.login}?error=unavailable`);

  const redirectTo = getSafeRedirectPath(formData.get("next"), ROUTES.dashboard);
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}${ROUTES.authCallback}?next=${encodeURIComponent(redirectTo)}` },
  });

  redirect(data.url ?? `${ROUTES.login}?error=google`);
}
