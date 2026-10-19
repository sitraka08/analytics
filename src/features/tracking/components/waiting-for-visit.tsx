"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const POLL_MS = 5000;
const POLL_DURATION_MS = 10 * 60 * 1000;

/** Re-renders the server page until the first visit arrives, then the dashboard replaces this state. */
export function WaitingForVisit() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => router.refresh(), POLL_MS);
    const stop = setTimeout(() => clearInterval(interval), POLL_DURATION_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(stop);
    };
  }, [router]);

  return (
    <div role="status" className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
      <span aria-hidden className="relative flex size-2.5">
        <span className="absolute inline-flex size-full rounded-full bg-brand-orange opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex size-2.5 rounded-full bg-brand-orange" />
      </span>
      <span className="font-medium">En attente de la première visite…</span>
      <Button type="button" variant="outline" size="sm" onClick={() => router.refresh()} className="rounded-full bg-surface">
        <RefreshCw aria-hidden />
        Vérifier maintenant
      </Button>
    </div>
  );
}
