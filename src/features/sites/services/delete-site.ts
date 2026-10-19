"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireSession } from "@/features/auth";
import { ROUTES } from "@/lib/routes";
import { SiteNotFoundError, deleteSite, getOwnedSite } from "./site";

const deleteSiteSchema = z.object({ siteId: z.uuid(), confirmation: z.string().trim().min(1).max(200) });

export async function deleteSiteAction(siteId: string, confirmation: string): Promise<{ ok: false; message: string }> {
  const { user } = await requireSession();
  const parsed = deleteSiteSchema.safeParse({ siteId, confirmation });
  if (!parsed.success) return { ok: false, message: "Demande invalide. Rechargez la page et réessayez." };

  try {
    const site = await getOwnedSite(user.id, parsed.data.siteId);
    // The name is checked here too: the dialog alone is not a guard.
    if (site.name.trim().toLowerCase() !== parsed.data.confirmation.toLowerCase()) {
      return { ok: false, message: "Le nom saisi ne correspond pas à celui du site." };
    }

    await deleteSite(user.id, parsed.data.siteId);
  } catch (error) {
    if (error instanceof SiteNotFoundError) return { ok: false, message: "Ce site n'existe plus." };
    console.error("deleteSite failed", error instanceof Error ? error.message : "unknown error");
    return { ok: false, message: "Le site n'a pas pu être supprimé. Réessayez dans un instant." };
  }

  revalidatePath(ROUTES.dashboard, "layout");
  redirect(ROUTES.dashboard);
}
