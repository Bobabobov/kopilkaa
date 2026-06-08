import { memo, type RefObject } from "react";
import { AdCard, StoryCard } from "@/components/stories";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type {
  Story as StoryItem,
  StoriesSort,
} from "@/hooks/stories/useStories";
import { cn } from "@/lib/utils";
import {
  storiesGlassPanel,
  storiesGlassSelect,
  storiesGlassShine,
} from "../stories-ui/glassStyles";

const SORT_OPTIONS: { value: StoriesSort; label: string }[] = [
  { value: "newest", label: "Сначала новые" },
  { value: "oldest", label: "Сначала старые" },
  { value: "popular", label: "По популярности" },
];

interface StoriesGridProps {
  stories: StoryItem[];
  shouldAnimate: boolean;
  isAuthenticated: boolean;
  query: string;
  sort: StoriesSort;
  onSortChange: (sort: StoriesSort) => void;
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
  sort,
  onSortChange,
  readStoryIds,
  loadingMore,
  hasMore,
  observerTargetRef,
  autoLoadEnabled,
  onLoadMore,
}: StoriesGridProps) {
  const sectionTitle = query.trim() ? "Результаты поиска" : "Все истории";

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <div className={cn(storiesGlassPanel, "px-4 py-5 sm:px-6 sm:py-6 md:px-8")}>
        <div className={storiesGlassShine} />

        <header className="relative flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#f9bc60]/25 bg-[#f9bc60]/10 text-[#f9bc60]"
              aria-hidden
            >
              <LucideIcons.BookOpen className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-bold text-[#fffffe]">{sectionTitle}</h2>
            {stories.length > 0 && (
              <span className="text-xs font-mono tabular-nums text-[#abd1c6]/50 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08]">
                {stories.length}
              </span>
            )}
          </div>

          <span className="flex-1 min-w-[40px]" aria-hidden />

          <div className="flex items-center gap-2">
            <LucideIcons.SortAsc
              className="w-4 h-4 text-[#abd1c6]/60 shrink-0"
              aria-hidden
            />
            <label htmlFor="stories-sort" className="sr-only">
              Сортировка
            </label>
            <select
              id="stories-sort"
              value={sort}
              onChange={(e) => onSortChange(e.target.value as StoriesSort)}
              aria-label="Сортировка историй"
              className={storiesGlassSelect}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23abd1c6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.65rem center",
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        <ul
          className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0"
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
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-10 h-10 rounded-full border-2 border-white/15 border-t-[#f9bc60] animate-spin"
                aria-hidden
              />
              <p className="text-[#abd1c6]/80 font-medium text-sm animate-pulse">
                Загружаем ещё истории…
              </p>
            </div>
          </div>
        )}

        {hasMore && !loadingMore && autoLoadEnabled && (
          <div ref={observerTargetRef} className="h-16" aria-hidden />
        )}

        {hasMore && !loadingMore && !autoLoadEnabled && (
          <div className="flex justify-center py-8">
            <button
              type="button"
              onClick={onLoadMore}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-[#001e1d] transition-all hover:brightness-110 border border-[#f9bc60]/40 bg-[linear-gradient(135deg,#e8a545_0%,#f9bc60_50%,#e8a545_100%)] shadow-[0_8px_28px_rgba(249,188,96,0.25)]"
            >
              Показать ещё
            </button>
          </div>
        )}

        {!hasMore && stories.length > 0 && (
          <p
            className="relative mt-6 flex items-center justify-center gap-2 text-sm font-medium text-[#abd1c6]/70 py-4 border-t border-white/[0.06]"
            aria-label="Конец списка историй"
          >
            <LucideIcons.CheckCircle2
              className="w-4 h-4 text-[#f9bc60]/80"
              aria-hidden
            />
            Все истории загружены
          </p>
        )}
      </div>
    </div>
  );
}

export const StoriesGrid = memo(StoriesGridInner);
