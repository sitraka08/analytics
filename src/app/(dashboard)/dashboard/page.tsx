import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireSession } from "@/features/auth";
import { SiteList, listSites } from "@/features/sites";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Tableau de bord" };

// Minimal page until the dashboard layout exists: it validates the session and lists the user's sites.
async function Sites() {
  const { user } = await requireSession();
  const sites = await listSites(user.id);

  return (
    <div className="flex flex-col items-start gap-8">
      <div className="flex w-full flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bonjour {user.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Connecté avec {user.email}</p>
        </div>
        {sites.length > 0 ? (
          <Link
            href={ROUTES.newSite}
            className="inline-flex h-10 items-center rounded-full border-[1.5px] border-input bg-surface px-5 text-sm font-medium hover:bg-cream-deep"
          >
            Ajouter un site
          </Link>
        ) : null}
      </div>
      <div className="w-full">
        <SiteList sites={sites} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-muted" />}>
        <Sites />
      </Suspense>
    </main>
  );
}
