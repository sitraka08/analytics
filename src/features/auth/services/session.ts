import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { auth } from "./auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Session obligatoire : redirige vers la connexion sinon. À appeler dans un composant sous <Suspense>. */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect(ROUTES.login);
  return session;
}
