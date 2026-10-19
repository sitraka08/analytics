"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/db/server";
import { requireSession } from "@/features/auth";
import { ROUTES } from "@/lib/routes";
import { deleteAccountSchema } from "../schemas/delete-account";

export async function deleteAccountAction(confirmation: string): Promise<{ ok: false; message: string }> {
  const { user } = await requireSession();
  const parsed = deleteAccountSchema.safeParse({ confirmation });
  if (!parsed.success) return { ok: false, message: "Saisissez votre adresse e-mail pour confirmer." };

  // The e-mail is checked here too: the dialog alone is not a guard.
  if (parsed.data.confirmation.toLowerCase() !== user.email.toLowerCase()) {
    return { ok: false, message: "L'adresse saisie ne correspond pas à celle de votre compte." };
  }

  const supabase = await createClient();
  // SQL function limited to the caller's own user: sites and events follow through `on delete cascade`.
  const { error } = await supabase.rpc("delete_my_account");

  if (error) {
    console.error("deleteAccount failed", error.code ?? "unknown error");
    return { ok: false, message: "Le compte n'a pas pu être supprimé. Réessayez dans un instant." };
  }

  await supabase.auth.signOut();
  revalidatePath(ROUTES.home, "layout");
  redirect(ROUTES.home);
}
