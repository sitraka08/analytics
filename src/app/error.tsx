"use client";

import { ErrorPanel } from "@/components/shared/error-panel";

// Last line of defense below the root layout: also catches the dashboard layout (session lookup, sidebar data),
// the auth pages and the marketing pages when the database or another dependency is down.
export default function RootError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col justify-center px-4 py-8">
      <ErrorPanel
        title="Cette page n'a pas pu s'afficher"
        error={error}
        onRetry={retry}
      />
    </main>
  );
}
