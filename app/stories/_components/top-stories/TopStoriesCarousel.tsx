"use client";

import {
  useEffect,
  useRef,
  type RefObject,
  type MutableRefObject,
} from "react";
import type { Story as StoryItem } from "@/hooks/stories/useStories";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TopStoryCard } from "./TopStoryCard";
import { getRankConfig } from "./rankConfig";
import type { CarouselEdges } from "./useTopStoriesCarousel";

interface TopStoriesCarouselProps {
  topStories: StoryItem[];
  readStoryIds: Set<string>;
  stripRef: RefObject<HTMLDivElement | null>;
  edges: CarouselEdges;
  scrollProgress: number;
  activeIndex: number;
  scrollStripByCards: (direction: -1 | 1) => void;
  suppressCardClickRef: MutableRefObject<boolean>;
  onStripPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onStripPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  endStripDrag: (e?: React.PointerEvent<HTMLDivElement>) => void;
  labelledById: string;
}

const navBtnClass = cn(
  "hidden md:inline-flex absolute top-1/2 -translate-y-1/2 z-[5] h-12 w-12 rounded-full shrink-0",
  "border-[#abd1c6]/30 bg-[#001e1d]/92 text-[#f9bc60]",
  "shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]",
  "hover:border-[#f9bc60]/50 hover:bg-[#001e1d] hover:shadow-[0_12px_28px_rgba(249,188,96,0.2)] hover:scale-105",
  "active:scale-95",
);

export function TopStoriesCarousel({
  topStories,
  readStoryIds,
  stripRef,
  edges,
  scrollProgress,
  activeIndex,
  scrollStripByCards,
  suppressCardClickRef,
  onStripPointerDown,
  onStripPointerMove,
  endStripDrag,
  labelledById,
}: TopStoriesCarouselProps) {
  const n = topStories.length;
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = regionRef.current;
    if (!root) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const t = e.target as Node | null;
      if (!t || !root.contains(t)) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      e.preventDefault();
      scrollStripByCards(e.key === "ArrowLeft" ? -1 : 1);
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [scrollStripByCards]);

  return (
    <div ref={regionRef} className="flex flex-col gap-6">
      <div
        className="relative rounded-2xl border border-white/[0.06] bg-[#001e1d]/35 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:px-8 md:py-1 lg:px-10"
        role="region"
        aria-roledescription="carousel"
        aria-labelledby={labelledById}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => scrollStripByCards(-1)}
              className={cn(navBtnClass, "left-1 top-1/2 md:left-0")}
              style={{ opacity: edges.left ? 1 : 0.4 }}
              aria-label="Предыдущие истории в топе"
            >
              <LucideIcons.ChevronLeft size="md" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[220px] text-xs">
            Назад по топу · или клавиша ←
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => scrollStripByCards(1)}
              className={cn(navBtnClass, "right-1 top-1/2 md:right-0")}
              style={{ opacity: edges.right ? 1 : 0.4 }}
              aria-label="Следующие истории в топе"
            >
              <LucideIcons.ChevronRight size="md" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-[220px] text-xs">
            Вперёд по топу · или клавиша →
          </TooltipContent>
        </Tooltip>

        <div
          ref={stripRef}
          role="list"
          aria-label="Список топовых историй"
          onPointerDown={onStripPointerDown}
          onPointerMove={onStripPointerMove}
          onPointerUp={(e) => endStripDrag(e)}
          onPointerCancel={(e) => endStripDrag(e)}
          className="relative z-[1] flex gap-5 overflow-x-auto overflow-y-hidden rounded-xl px-1 pb-2 [touch-action:pan-x_pan-y] overscroll-x-contain max-md:scrollbar-hide max-md:[scrollbar-width:none] md:cursor-grab md:active:cursor-grabbing md:select-none md:[scrollbar-width:thin] md:[scrollbar-color:rgba(171,209,198,0.45)_rgba(0,30,29,0.4)] md:[&::-webkit-scrollbar]:h-2 md:[&::-webkit-scrollbar-track]:bg-transparent md:[&::-webkit-scrollbar-thumb]:rounded-full md:[&::-webkit-scrollbar-thumb]:bg-[#abd1c6]/40 md:[&::-webkit-scrollbar-thumb]:hover:bg-[#abd1c6]/55 snap-x snap-mandatory"
        >
          {[0, 1].map((dup) => (
            <div key={dup} data-top-copy className="flex gap-5 shrink-0">
              {topStories.map((story, index) => (
                <TopStoryCard
                  key={`${story.id}-${dup}`}
                  story={story}
                  rank={getRankConfig(index)}
                  isRead={readStoryIds.has(story.id)}
                  suppressCardClickRef={suppressCardClickRef}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-3" aria-hidden={n <= 1}>
        {n > 1 && (
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
            <div
              className="flex flex-wrap items-center justify-center gap-2"
              role="group"
              aria-label={`Слайд ${activeIndex + 1} из ${n}`}
            >
              {topStories.map((s, i) => (
                <span
                  key={s.id}
                  role="presentation"
                  className={cn(
                    "h-1.5 rounded-full transition-[width,opacity,box-shadow] duration-150 ease-out will-change-[width,opacity]",
                    i === activeIndex
                      ? "w-8 bg-[#f9bc60] opacity-100 shadow-[0_0_14px_rgba(249,188,96,0.5)]"
                      : "w-1.5 bg-[#abd1c6]/40 opacity-45",
                  )}
                />
              ))}
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#001e1d]/50 px-3 py-1 font-mono text-[11px] tabular-nums text-[#abd1c6]/90 shadow-inner">
              <LucideIcons.List className="h-3.5 w-3.5 text-[#f9bc60]/80" />
              {activeIndex + 1} / {n}
            </span>
          </div>
        )}

        <div
          className="relative h-1.5 rounded-full bg-[#abd1c6]/14 mx-1 overflow-hidden shadow-inner"
          aria-hidden
        >
          <div
            className="h-full rounded-full bg-[#f9bc60] transition-[width] duration-100 ease-out shadow-[0_0_12px_rgba(249,188,96,0.35)]"
            style={{
              width: `${Math.min(100, Math.max(5, scrollProgress * 100))}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
