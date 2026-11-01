"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { auth } from "./auth";

export async function signOutAction() {
  await auth.api.signOut({ headers: await headers() });
  redirect(ROUTES.home);
}
