import { AdCard, StoriesEmptyState } from "@/components/stories";

interface StoriesEmptyWithAdProps {
  hasQuery: boolean;
}

export function StoriesEmptyWithAd({ hasQuery }: StoriesEmptyWithAdProps) {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AdCard index={0} />
        </div>
      </div>
      <StoriesEmptyState hasQuery={hasQuery} />
    </>
  );
}
