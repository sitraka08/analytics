"use client";

import "./globals.css";

// Replaces the root layout when it fails: it brings its own document and cannot rely on the layout's fonts or providers.
export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const digest =
    error instanceof Error
      ? (error as Error & { digest?: string }).digest
      : undefined;

  return (
    <html lang="fr">
      <body className="flex min-h-svh items-center justify-center bg-background px-4 text-foreground">
        <div
          role="alert"
          className="w-full max-w-xl rounded-3xl bg-cream-deep p-6"
        >
          <h1 className="text-xl font-bold">
            Le site est momentanément indisponible
          </h1>
          <p className="mt-2 text-sm">
            Un problème est survenu de notre côté. Réessayez dans un instant.
          </p>
          {digest ? <p className="mt-2 text-xs">Référence : {digest}</p> : null}
          <button
            type="button"
            onClick={retry}
            className="mt-4 inline-flex h-10 items-center rounded-full border-[1.5px] border-input bg-surface px-5 text-sm font-medium hover:bg-cream-deep"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
