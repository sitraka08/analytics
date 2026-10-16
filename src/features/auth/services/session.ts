import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { auth } from "./auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Required session: redirects to the login page otherwise. Call it in a component under <Suspense>. */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect(ROUTES.login);
  return session;
}
