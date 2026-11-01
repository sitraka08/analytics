import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { auth } from "./auth";

export type SessionUser = { id: string; name: string; email: string };

// Validates the session cookie against the database on every request (the proxy only checks it exists).
export const getSession = cache(async (): Promise<{ user: SessionUser } | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const { id, email, name } = session.user;
  return { user: { id, email, name: name || email.split("@")[0] } };
});

/** Required session: redirects to the login page otherwise. Call it in a component under <Suspense>. */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect(ROUTES.login);
  return session;
}
