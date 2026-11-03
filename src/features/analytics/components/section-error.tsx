import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SectionErrorProps = { onRetry: () => void; className?: string };

export function SectionError({ onRetry, className }: SectionErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start justify-center gap-3 rounded-3xl border border-border/70 bg-surface p-5",
        className,
      )}
    >
      <p className="flex items-center gap-2 text-sm">
        <CircleAlert aria-hidden className="size-4 shrink-0 text-destructive" />
        Impossible de charger ces données pour le moment.
      </p>
      <Button
        type="button"
        variant="outline"
        className="h-9 rounded-full px-4"
        onClick={onRetry}
      >
        Réessayer
      </Button>
    </div>
  );
}
