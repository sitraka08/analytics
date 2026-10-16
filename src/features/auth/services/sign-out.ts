"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/db/server";
import { ROUTES } from "@/lib/routes";

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(ROUTES.home);
}
