import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeaderSkeleton } from "@/features/sites";

export default function VisitsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <SiteHeaderSkeleton />
      <Skeleton className="mt-6 h-9 w-28 rounded-full" />
      <Skeleton className="mt-4 h-96 rounded-3xl" />
    </div>
  );
}
