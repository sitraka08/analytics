import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SectionErrorProps = { onRetry: () => void; className?: string };

export function SectionError({ onRetry, className }: SectionErrorProps) {
  return (
    <div role="alert" className={cn("flex flex-col items-start justify-center gap-3 rounded-3xl bg-surface p-4", className)}>
      <p className="text-sm">Impossible de charger ces données pour le moment.</p>
      <Button type="button" variant="outline" className="h-9 rounded-full px-4" onClick={onRetry}>
        Réessayer
      </Button>
    </div>
  );
}
