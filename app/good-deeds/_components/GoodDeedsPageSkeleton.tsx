import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  goodDeedsGlassPanel,
  goodDeedsGlassShine,
} from "./good-deeds-ui/glassStyles";

function GlassSkeleton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(goodDeedsGlassPanel, className)}>
      <div className={goodDeedsGlassShine} />
      <div className="relative">{children}</div>
    </div>
  );
}

export function GoodDeedsPageSkeleton() {
  return (
    <div
      className="space-y-5 sm:space-y-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Загрузка раздела «Добрые дела»…</span>

      <GlassSkeleton className="px-4 py-5 sm:px-6">
        <div className="flex gap-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-7 w-40 rounded-lg" />
            <Skeleton className="h-4 w-full max-w-md rounded-md" />
          </div>
        </div>
      </GlassSkeleton>

      <GlassSkeleton className="px-4 py-4 sm:px-5">
        <Skeleton className="h-5 w-56 rounded-md" />
        <Skeleton className="mt-2 h-4 w-full max-w-lg rounded-md" />
        <Skeleton className="mt-4 h-10 w-48 rounded-xl" />
      </GlassSkeleton>

      <GlassSkeleton className="px-4 py-4">
        <Skeleton className="h-6 w-36 rounded-lg" />
      </GlassSkeleton>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
