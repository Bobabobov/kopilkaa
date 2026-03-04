import { memo, type RefObject } from "react";
import { AdCard, StoryCard } from "@/components/stories";
import { Card, CardContent } from "@/components/ui/Card";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type {
  Story as StoryItem,
  StoriesSort,
} from "@/hooks/stories/useStories";
import { cn } from "@/lib/utils";

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
  const showCount = stories.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="absolute left-0 top-8 bottom-8 w-px hidden xl:block bg-gradient-to-b from-transparent via-[#abd1c6]/20 to-transparent rounded-full" aria-hidden />
      <header className="flex flex-wrap items-center gap-3 mb-6">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(249, 188, 96, 0.15)", color: "#f9bc60" }}
        >
          <LucideIcons.BookOpen className="w-3.5 h-3.5" />
          {sectionTitle}
        </span>
        {showCount && (
          <span className="text-xs text-[#94a1b2] font-mono tabular-nums">
            {stories.length}
          </span>
        )}
        <span className="flex-1 min-w-[80px] h-px bg-white/10" aria-hidden />
        <div className="flex items-center gap-2">
          <LucideIcons.SortAsc className="w-4 h-4 text-[#abd1c6]/70 shrink-0" aria-hidden />
          <label htmlFor="stories-sort" className="sr-only">
            Сортировка
          </label>
          <select
            id="stories-sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as StoriesSort)}
            aria-label="Сортировка историй"
            className={cn(
              "rounded-xl border bg-[#001e1d]/60 text-[#fffffe] text-sm font-medium py-2 pl-3 pr-8 appearance-none cursor-pointer transition-colors",
              "border-[#abd1c6]/25 focus:border-[#f9bc60]/50 focus:ring-2 focus:ring-[#f9bc60]/20 outline-none",
            )}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23abd1c6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.6rem center",
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
              className="w-12 h-12 rounded-full border-2 border-[#abd1c6]/30 border-t-[#f9bc60] animate-spin"
              aria-hidden
            />
            <p className="text-[#abd1c6]/90 font-medium text-sm sm:text-base animate-pulse">
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
              color: "#001e1d",
              boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
            }}
          >
            Показать ещё
          </button>
        </div>
      )}

      {!hasMore && stories.length > 0 && (
        <section className="text-center py-12" aria-label="Конец списка историй">
          <Card variant="darkGlass" padding="sm" className="inline-flex">
            <CardContent className="flex items-center justify-center gap-2 py-3 px-6">
              <LucideIcons.CheckCircle2 className="w-5 h-5 text-[#f9bc60]" aria-hidden />
              <span className="text-sm font-semibold text-[#abd1c6]">Все загружены</span>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

export const StoriesGrid = memo(StoriesGridInner);
