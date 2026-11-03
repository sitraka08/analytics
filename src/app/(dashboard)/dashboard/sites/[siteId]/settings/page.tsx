import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { requireSession } from "@/features/auth";
import { DeleteSiteButton, SiteHeader, SiteHeaderSkeleton, SiteNotFoundError, getOwnedSite } from "@/features/sites";
import { InstallSnippet } from "@/features/tracking";

export const metadata: Metadata = { title: "Paramètres du site" };

async function SiteSettingsContent({ params }: Pick<PageProps<"/dashboard/sites/[siteId]/settings">, "params">) {
  const { user } = await requireSession();
  const { siteId } = await params;

  const site = await getOwnedSite(user.id, siteId).catch((error: unknown) => {
    if (error instanceof SiteNotFoundError) notFound();
    throw error;
  });

  return (
    <>
      <SiteHeader site={site} current="settings" />

      <div className="mt-6 flex flex-col gap-6">
        <section aria-labelledby="site-info" className="rounded-3xl border border-border/70 bg-surface p-5">
          <h2 id="site-info" className="text-base font-bold">
            Informations
          </h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[8rem_1fr]">
            <dt className="text-muted-foreground">Nom</dt>
            <dd>{site.name}</dd>
            <dt className="text-muted-foreground">Domaine</dt>
            <dd className="break-all">{site.domain}</dd>
          </dl>
        </section>

        <InstallSnippet publicKey={site.publicKey} domain={site.domain} waitForVisit={false} />

        <section
          aria-labelledby="danger-zone"
          className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-[1.5px] border-destructive/30 p-5"
        >
          <div className="max-w-md">
            <h2 id="danger-zone" className="text-base font-bold">
              Zone dangereuse
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Supprimer ce site efface définitivement toutes ses statistiques.</p>
          </div>
          <DeleteSiteButton siteId={site.id} name={site.name} domain={site.domain} />
        </section>
      </div>
    </>
  );
}

export default function SiteSettingsPage({ params }: PageProps<"/dashboard/sites/[siteId]/settings">) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <Suspense
        fallback={
          <>
            <SiteHeaderSkeleton />
            <Skeleton className="mt-6 h-40 rounded-3xl" />
          </>
        }
      >
        <SiteSettingsContent params={params} />
      </Suspense>
    </div>
  );
}
