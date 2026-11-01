import { Skeleton } from "@/components/ui/skeleton";

export function SectionSkeleton({ className }: { className?: string }) {
  return <Skeleton className={className ?? "h-64 rounded-3xl"} />;
}
