import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireSession } from "@/features/auth";
import { SiteNotFoundError, getOwnedSite } from "@/features/sites";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Site" };

// Placeholder until the analytics widgets exist: confirms the ownership check end to end.
async function SiteContent({ params }: Pick<PageProps<"/dashboard/sites/[siteId]">, "params">) {
  const { user } = await requireSession();
  const { siteId } = await params;

  const site = await getOwnedSite(user.id, siteId).catch((error: unknown) => {
    if (error instanceof SiteNotFoundError) notFound();
    throw error;
  });

  return (
    <>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">{site.name}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{site.domain}</p>
    </>
  );
}

export default function SitePage({ params }: PageProps<"/dashboard/sites/[siteId]">) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16">
      <Link href={ROUTES.dashboard} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
        ← Retour aux sites
      </Link>
      <Suspense fallback={<div className="mt-6 h-16 animate-pulse rounded-2xl bg-muted" />}>
        <SiteContent params={params} />
      </Suspense>
    </main>
  );
}
