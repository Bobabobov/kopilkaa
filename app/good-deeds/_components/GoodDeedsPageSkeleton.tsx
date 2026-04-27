import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";

export function GoodDeedsPageSkeleton() {
  return (
    <div className="space-y-8">
      <Card variant="darkGlass" padding="lg" className="overflow-hidden">
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="mt-4 h-10 w-3/4 max-w-md rounded-lg" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl rounded-md" />
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-64 rounded-md" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} variant="darkGlass" padding="sm">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
              </div>
            </div>
            <Skeleton className="mt-4 h-16 w-full rounded-xl" />
          </Card>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        <Skeleton className="h-8 w-40 rounded-lg" />
        <Skeleton className="h-4 w-full max-w-md rounded-md" />
        <Card variant="darkGlass" padding="lg">
          <div className="flex gap-4">
            <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/2 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>
          </div>
          <Skeleton className="mt-4 aspect-video w-full rounded-2xl" />
        </Card>
      </div>
    </div>
  );
}
