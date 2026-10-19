import { Skeleton } from "@/components/ui/skeleton";

export default function VisitsLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <Skeleton className="h-9 w-48 rounded-full" />
      <Skeleton className="mt-6 h-10 w-64 rounded-2xl" />
      <Skeleton className="mt-8 h-96 rounded-3xl" />
    </main>
  );
}
