import { Skeleton } from "@/components/ui/skeleton";

export function SectionSkeleton({ className }: { className?: string }) {
  return <Skeleton className={className ?? "h-64 rounded-3xl"} />;
}

/** Same shape as the stats: 4 KPIs, the chart, then the map and recent visits. */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-32 rounded-3xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-3xl sm:h-96" />
      <div className="grid gap-3 lg:grid-cols-5">
        <Skeleton className="h-80 rounded-3xl lg:col-span-3" />
        <Skeleton className="h-80 rounded-3xl lg:col-span-2" />
      </div>
    </div>
  );
}
