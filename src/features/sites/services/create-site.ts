"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireSession } from "@/features/auth";
import type { FormState } from "@/lib/form-state";
import { ROUTES } from "@/lib/routes";
import { createSiteSchema, type CreateSiteField } from "../schemas/site";
import { createSite } from "./site";

export async function createSiteAction(
  _previous: FormState<CreateSiteField>,
  formData: FormData,
): Promise<FormState<CreateSiteField>> {
  const { user } = await requireSession();
  const values = {
    name: String(formData.get("name") ?? ""),
    domain: String(formData.get("domain") ?? ""),
  };
  const parsed = createSiteSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  let siteId: string;
  try {
    ({ id: siteId } = await createSite(user.id, parsed.data));
  } catch (error) {
    console.error(
      "createSite failed",
      error instanceof Error ? error.message : "unknown error",
    );
    return {
      ok: false,
      message: "Le site n'a pas pu être créé. Réessayez dans un instant.",
      values,
    };
  }

  redirect(ROUTES.site(siteId));
}
