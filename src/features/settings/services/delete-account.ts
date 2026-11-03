"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { user as userTable } from "@/db/schema/auth";
import { auth, requireSession } from "@/features/auth";
import { ROUTES } from "@/lib/routes";
import { deleteAccountSchema } from "../schemas/delete-account";

export async function deleteAccountAction(
  confirmation: string,
): Promise<{ ok: false; message: string }> {
  const { user } = await requireSession();
  const parsed = deleteAccountSchema.safeParse({ confirmation });
  if (!parsed.success)
    return {
      ok: false,
      message: "Saisissez votre adresse e-mail pour confirmer.",
    };

  // The e-mail is checked here too: the dialog alone is not a guard.
  if (parsed.data.confirmation.toLowerCase() !== user.email.toLowerCase()) {
    return {
      ok: false,
      message: "L'adresse saisie ne correspond pas à celle de votre compte.",
    };
  }

  try {
    // Only ever the signed-in user's row: sessions, accounts, sites and events follow through `on delete cascade`.
    await db.delete(userTable).where(eq(userTable.id, user.id));
  } catch (error) {
    console.error(
      "deleteAccount failed",
      error instanceof Error ? error.message : "unknown error",
    );
    return {
      ok: false,
      message: "Le compte n'a pas pu être supprimé. Réessayez dans un instant.",
    };
  }

  // The session row is gone with the user; this clears the browser cookie. Ignore a "no session" answer.
  await auth.api.signOut({ headers: await headers() }).catch(() => undefined);
  revalidatePath(ROUTES.home, "layout");
  redirect(ROUTES.home);
}
