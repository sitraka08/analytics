"use client";

import { ErrorPanel } from "@/components/shared/error-panel";

export default function SiteError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <ErrorPanel title="Impossible de charger les statistiques" error={error} onRetry={retry} />
    </div>
  );
}
