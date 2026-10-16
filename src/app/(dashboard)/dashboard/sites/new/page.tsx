import type { Metadata } from "next";
import { BackLink } from "@/components/shared/back-link";
import { CreateSiteForm } from "@/features/sites";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Ajouter un site" };

export default function NewSitePage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <BackLink href={ROUTES.dashboard}>Retour aux sites</BackLink>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Ajouter un site</h1>
      <p className="mt-2 mb-8 max-w-md text-sm text-muted-foreground">
        Indiquez le site à suivre. Vous recevrez ensuite le code à coller dans ses pages.
      </p>
      <CreateSiteForm />
    </main>
  );
}
