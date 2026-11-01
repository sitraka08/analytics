"use client";

import { ErrorPanel } from "@/components/shared/error-panel";

export default function SiteError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <ErrorPanel title="Impossible de charger les statistiques" error={error} onRetry={retry} />
    </main>
  );
}
