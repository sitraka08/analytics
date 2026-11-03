import type { Metadata } from "next";
import { CreateSiteForm } from "@/features/sites";

export const metadata: Metadata = { title: "Ajouter un site" };

export default function NewSitePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6 md:py-8">
      <h1 className="text-3xl font-bold tracking-tight">Ajouter un site</h1>
      <p className="mt-2 mb-8 max-w-md text-sm text-muted-foreground">
        Indiquez le site à suivre. Vous recevrez ensuite le code à coller dans ses pages.
      </p>
      <CreateSiteForm />
    </div>
  );
}
