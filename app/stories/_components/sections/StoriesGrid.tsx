import { memo, type RefObject } from "react";
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
  autoLoadEnabled: boolean;
  onLoadMore: () => void;
}

function StoriesGridInner({
  stories,
  shouldAnimate,
  isAuthenticated,
  query,
  readStoryIds,
  loadingMore,
  hasMore,
  observerTargetRef,
  autoLoadEnabled,
  onLoadMore,
}: StoriesGridProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 list-none p-0 m-0"
        aria-label="Список историй"
      >
        <li className="contents">
          <AdCard index={0} />
        </li>
        {stories.map((story, index) => (
          <li key={story.id} className="contents">
            <StoryCard
              story={story}
              index={index + 1}
              animate={shouldAnimate}
              isAuthenticated={isAuthenticated}
              query={query}
              isRead={readStoryIds.has(story.id)}
            />
          </li>
        ))}
      </ul>

      {loadingMore && (
        <div
          className="flex justify-center items-center py-12"
          role="status"
          aria-live="polite"
          aria-label="Загрузка историй"
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-12 h-12 rounded-full border-[3px] border-[#abd1c6]/40 border-t-[#f9bc60] animate-spin"
              aria-hidden
            />
            <p className="text-[#abd1c6] font-medium text-sm sm:text-base">
              Загружаем ещё истории...
            </p>
          </div>
        </div>
      )}

      {hasMore && !loadingMore && autoLoadEnabled && (
        <div ref={observerTargetRef} className="h-20" aria-hidden />
      )}

      {hasMore && !loadingMore && !autoLoadEnabled && (
        <div className="flex justify-center py-10">
          <button
            type="button"
            onClick={onLoadMore}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#abd1c6]/40 bg-[#001e1d]/60 px-6 py-3 text-sm font-semibold text-[#abd1c6] transition-all hover:border-[#f9bc60]/60 hover:text-[#f9bc60] hover:bg-[#001e1d]/80"
          >
            Показать ещё
          </button>
        </div>
      )}

      {!hasMore && stories.length > 0 && (
        <section
          className="text-center py-12"
          aria-label="Конец списка историй"
        >
          <div className="group inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-white/5 via-[#abd1c6]/10 to-white/5 backdrop-blur-sm rounded-3xl border border-[#abd1c6]/30 transition-all duration-300 hover:border-[#f9bc60]/50 hover:shadow-[0_8px_24px_-8px_rgba(249,188,96,0.25)] cursor-default">
            <span className="text-[#abd1c6] font-semibold transition-colors duration-300 group-hover:text-[#f9bc60]" aria-hidden>
              А всё!
            </span>
          </div>
        </section>
      )}
    </div>
  );
}

export const StoriesGrid = memo(StoriesGridInner);
