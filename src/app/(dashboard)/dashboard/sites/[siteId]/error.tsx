"use client";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div role="alert" className="rounded-3xl bg-cream-deep p-6">
        <h1 className="text-xl font-bold">Impossible de charger les statistiques</h1>
        <p className="mt-2 text-sm text-muted-foreground">Un problème est survenu de notre côté. Réessayez dans un instant.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 inline-flex h-10 items-center rounded-full border-[1.5px] border-input bg-surface px-5 text-sm font-medium hover:bg-cream-deep"
        >
          Réessayer
        </button>
      </div>
    </main>
  );
}
