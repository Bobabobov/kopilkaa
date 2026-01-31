import type { RefObject } from "react";
import { AdCard, StoryCard } from "@/components/stories";
import type { Story as StoryItem } from "@/hooks/stories/useStories";

interface StoriesGridProps {
  stories: StoryItem[];
  shouldAnimate: boolean;
  isAuthenticated: boolean;
  query: string;
  readStoryIds: Set<string>;
  loadingMore: boolean;
  hasMore: boolean;
  observerTargetRef: RefObject<HTMLDivElement | null>;
}

export function StoriesGrid({
  stories,
  shouldAnimate,
  isAuthenticated,
  query,
  readStoryIds,
  loadingMore,
  hasMore,
  observerTargetRef,
}: StoriesGridProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AdCard index={0} />

        {stories.map((story, index) => (
          <StoryCard
            key={story.id}
            story={story}
            index={index + 1}
            animate={shouldAnimate}
            isAuthenticated={isAuthenticated}
            query={query}
            isRead={readStoryIds.has(story.id)}
          />
        ))}
      </div>

      {loadingMore && (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-[#abd1c6] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#abd1c6] font-medium">
              Загружаем ещё истории...
            </p>
          </div>
        </div>
      )}

      {hasMore && !loadingMore && (
        <div ref={observerTargetRef} className="h-20" />
      )}

      {!hasMore && stories.length > 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/10 hover:border-[#abd1c6]/50 hover:shadow-lg hover:shadow-[#abd1c6]/20 cursor-default">
            <p className="text-[#abd1c6] font-medium transition-all duration-300 hover:text-[#f9bc60]">
              А всё!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
