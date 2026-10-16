import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/db/server";
import { ROUTES } from "@/lib/routes";

export type SessionUser = { id: string; name: string; email: string };

// Validates the token with the Supabase Auth server (unlike getSession, which only trusts the cookie).
export const getSession = cache(async (): Promise<{ user: SessionUser } | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { id, email, user_metadata } = data.user;
  const name = typeof user_metadata.name === "string" ? user_metadata.name : typeof user_metadata.full_name === "string" ? user_metadata.full_name : "";

  return { user: { id, email: email ?? "", name: name || (email ?? "").split("@")[0] } };
});

/** Required session: redirects to the login page otherwise. Call it in a component under <Suspense>. */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect(ROUTES.login);
  return session;
}
