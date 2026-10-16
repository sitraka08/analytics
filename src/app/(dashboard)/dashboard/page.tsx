import type { Metadata } from "next";
import { Suspense } from "react";
import { SignOutButton, requireSession } from "@/features/auth";

export const metadata: Metadata = { title: "Tableau de bord" };

// Minimal page until the dashboard exists: it validates the session and allows signing out.
async function Greeting() {
  const { user } = await requireSession();

  return (
    <div className="flex flex-col items-start gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bonjour {user.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Connecté avec {user.email}</p>
      </div>
      <SignOutButton />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16">
      <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-muted" />}>
        <Greeting />
      </Suspense>
    </main>
  );
}
