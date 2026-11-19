import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-12 sm:px-6" role="status" aria-label="Loading">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-48" />
      <div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-40" /><Skeleton className="h-40" /><Skeleton className="h-40" /></div>
    </div>
  );
}
