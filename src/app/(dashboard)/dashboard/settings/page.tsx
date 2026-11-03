import type { Metadata } from "next";
import { Suspense } from "react";
import { requireSession } from "@/features/auth";
import { DeleteAccountButton } from "@/features/settings";

export const metadata: Metadata = { title: "Paramètres" };

async function SettingsContent() {
  const { user } = await requireSession();

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">
        Paramètres du compte
      </h1>

      <section className="mt-6 rounded-3xl border border-border/70 bg-surface p-5">
        <h2 className="text-base font-bold">Votre compte</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[8rem_1fr]">
          <dt className="text-muted-foreground">Nom</dt>
          <dd>{user.name}</dd>
          <dt className="text-muted-foreground">Adresse e-mail</dt>
          <dd className="break-all">{user.email}</dd>
        </dl>
      </section>

      <section
        aria-labelledby="plan"
        className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border/70 bg-surface p-5"
      >
        <div>
          <h2 id="plan" className="text-base font-bold">
            Votre offre
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Toutes les fonctionnalités actuelles sont incluses, sans limite de
            sites.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-deep px-3 py-1 text-sm font-medium">
          <span aria-hidden className="size-2 rounded-full bg-accent-green" />
          Plan gratuit
        </span>
      </section>

      <section
        aria-labelledby="danger-zone"
        className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border-[1.5px] border-destructive/30 p-5"
      >
        <div className="max-w-md">
          <h2 id="danger-zone" className="text-base font-bold">
            Zone dangereuse
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Supprimer votre compte efface aussi tous vos sites et leurs
            statistiques. Il n&apos;est pas possible de revenir en arrière.
          </p>
        </div>
        <DeleteAccountButton email={user.email} />
      </section>
    </>
  );
}

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6 md:py-8">
      <Suspense
        fallback={<div className="h-32 animate-pulse rounded-2xl bg-muted" />}
      >
        <SettingsContent />
      </Suspense>
    </div>
  );
}
