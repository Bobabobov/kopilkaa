import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";

export function GoodDeedsPageSkeleton() {
  return (
    <div className="space-y-8">
      <Card variant="darkGlass" padding="lg" className="overflow-hidden">
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="mt-4 h-10 w-3/4 max-w-2xl rounded-lg" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl rounded-md" />
        <Skeleton className="mt-2 h-4 w-4/5 max-w-lg rounded-md" />
      </Card>
      <Skeleton className="h-28 w-full max-w-3xl rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} variant="darkGlass" padding="sm">
            <div className="flex gap-3">
              <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
              </div>
            </div>
            <Skeleton className="mt-3 h-16 w-full rounded-xl" />
          </Card>
        ))}
      </div>
      <div className="space-y-4 pt-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
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
        <Card variant="darkGlass" padding="lg">
          <Skeleton className="h-40 w-full rounded-2xl" />
        </Card>
      </div>
    </div>
  );
}
