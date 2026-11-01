"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

type ErrorPanelProps = {
  title: string;
  /** Value received by an `error.tsx` boundary; only its digest is logged, never its message. */
  error?: unknown;
  onRetry: () => void;
  className?: string;
};

/** Body of the `error.tsx` boundaries: a clear message and a retry. The digest matches the server-side log. */
export function ErrorPanel({ title, error, onRetry, className }: ErrorPanelProps) {
  const digest = error instanceof Error ? (error as Error & { digest?: string }).digest : undefined;

  useEffect(() => {
    if (error) console.error("error boundary", digest ?? "no digest");
  }, [error, digest]);

  return (
    <div role="alert" className={cn("rounded-3xl bg-cream-deep p-6", className)}>
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Un problème est survenu de notre côté. Réessayez dans un instant.</p>
      {digest ? <p className="mt-2 font-mono text-xs text-muted-foreground">Référence : {digest}</p> : null}
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex h-10 items-center rounded-full border-[1.5px] border-input bg-surface px-5 text-sm font-medium hover:bg-cream-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        Réessayer
      </button>
    </div>
  );
}
