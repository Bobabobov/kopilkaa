import { AdCard, StoriesEmptyState } from "@/components/stories";
import { cn } from "@/lib/utils";
import {
  storiesGlassPanel,
  storiesGlassShine,
} from "../stories-ui/glassStyles";

interface StoriesEmptyWithAdProps {
  hasQuery: boolean;
}

export function StoriesEmptyWithAd({ hasQuery }: StoriesEmptyWithAdProps) {
  return (
    <>
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className={cn(storiesGlassPanel, "px-4 py-5 sm:px-6")}>
          <div className={storiesGlassShine} />
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-sm sm:max-w-none mx-auto sm:mx-0">
            <AdCard index={0} />
          </div>
        </div>
      </div>
      <StoriesEmptyState hasQuery={hasQuery} />
    </>
  );
}
