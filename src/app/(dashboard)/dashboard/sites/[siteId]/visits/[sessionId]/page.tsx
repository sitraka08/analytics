import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BackLink } from "@/components/shared/back-link";
import { SessionDetail, SessionNotFoundError, getSession, sessionIdSchema } from "@/features/analytics";
import { requireSession } from "@/features/auth";
import { SiteNotFoundError } from "@/features/sites";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Détail d'une visite" };

async function VisitContent({ params }: Pick<PageProps<"/dashboard/sites/[siteId]/visits/[sessionId]">, "params">) {
  const { user } = await requireSession();
  const { siteId, sessionId } = await params;
  const parsedId = sessionIdSchema.safeParse(sessionId);
  if (!parsedId.success) notFound();

  const session = await getSession(user.id, siteId, parsedId.data).catch((error: unknown) => {
    if (error instanceof SiteNotFoundError || error instanceof SessionNotFoundError) notFound();
    throw error;
  });

  return (
    <>
      <BackLink href={ROUTES.siteVisits(siteId)}>Retour aux visites</BackLink>
      <h1 className="mt-6 mb-6 text-3xl font-bold tracking-tight">Détail d&apos;une visite</h1>
      {/* Hours are shown in UTC: the visit has no browser time zone to refer to on the server. */}
      <SessionDetail session={session} timeZone="UTC" />
    </>
  );
}

export default function VisitPage({ params }: PageProps<"/dashboard/sites/[siteId]/visits/[sessionId]">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <Suspense fallback={<div className="h-40 animate-pulse rounded-3xl bg-muted" />}>
        <VisitContent params={params} />
      </Suspense>
    </main>
  );
}
