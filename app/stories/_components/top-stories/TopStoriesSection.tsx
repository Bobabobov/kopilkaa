"use client";

import { motion } from "framer-motion";
import type { Story as StoryItem } from "@/hooks/stories/useStories";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TopStoriesCarousel } from "./TopStoriesCarousel";
import { useTopStoriesCarousel } from "./useTopStoriesCarousel";

interface TopStoriesSectionProps {
  topStories: StoryItem[];
  readStoryIds: Set<string>;
}

const shellClass = cn(
  "relative overflow-hidden rounded-[1.75rem]",
  "border border-white/[0.1] bg-[#001e1d]/88 backdrop-blur-md",
  "shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)]",
  "ring-1 ring-inset ring-white/[0.06]",
);

export function TopStoriesSection({
  topStories,
  readStoryIds,
}: TopStoriesSectionProps) {
  const n = topStories.length;
  const {
    stripRef,
    edges,
    scrollProgress,
    activeIndex,
    scrollStripByCards,
    suppressCardClickRef,
    onStripPointerDown,
    onStripPointerMove,
    endStripDrag,
  } = useTopStoriesCarousel(n);

  return (
    <TooltipProvider delayDuration={300}>
      <section
        className="container mx-auto px-4 pt-2 pb-10 sm:pb-12"
        aria-labelledby="top-stories-heading"
      >
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-48px" }}
            transition={{
              duration: 0.55,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={shellClass}
          >
            <div
              className="absolute inset-x-0 top-0 h-[3px] rounded-t-[1.75rem] bg-[#f9bc60]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#f9bc60]/[0.06] blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#004643]/[0.35] blur-3xl"
              aria-hidden
            />

            <div
              className="hidden sm:block pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #abd1c6 1px, transparent 0)`,
                backgroundSize: "22px 22px",
              }}
            />

            <div className="relative px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12">
              <header className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="flex justify-center">
                    <div
                      className={cn(
                        "inline-flex max-w-full flex-wrap items-stretch justify-center overflow-hidden rounded-2xl",
                        "border border-white/[0.12] bg-[#001e1d]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]",
                      )}
                      role="group"
                      aria-label={
                        n > 0
                          ? `Топ: ${n} ${n === 1 ? "история" : n < 5 ? "истории" : "историй"}, по числу лайков`
                          : "Топ историй по числу лайков"
                      }
                    >
                      <div className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-[#f9bc60]/[0.14] border-r border-white/10">
                        <LucideIcons.Trophy
                          className="h-3.5 w-3.5 shrink-0 text-[#f9bc60]"
                          aria-hidden
                        />
                        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#f9bc60]">
                          Топ
                        </span>
                      </div>
                      {n > 0 && (
                        <div className="flex min-w-[2.75rem] items-center justify-center border-r border-white/10 px-3 py-2 font-mono text-xs tabular-nums text-[#abd1c6] sm:px-4">
                          {n}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-medium text-[#abd1c6]">
                        <LucideIcons.Heart
                          size="sm"
                          className="shrink-0 text-[#e16162] fill-[#e16162]/45"
                          aria-hidden
                        />
                        по лайкам
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className="gap-1.5 border-[#f9bc60]/30 bg-[#f9bc60]/[0.08] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#f9bc60] shadow-sm"
                  >
                    <LucideIcons.Sparkles className="h-3 w-3" />
                    Лучшие по отклику
                  </Badge>
                </div>

                <h2
                  id="top-stories-heading"
                  className="text-3xl sm:text-4xl md:text-5xl font-black text-[#fffffe] tracking-tight text-balance drop-shadow-sm"
                >
                  Топ историй
                </h2>
                <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#abd1c6]/90 leading-relaxed text-pretty max-w-2xl mx-auto">
                  Популярные истории по отклику сообщества
                </p>
              </header>

              <p className="sr-only">
                Карусель из {n} историй, бесконечная прокрутка. На компьютере —
                стрелки, перетаскивание и колёсико мыши (включая Shift). На
                телефоне — свайп. Фокус внутри блока: клавиши «влево» и «вправо»
                листают ленту.
              </p>

              <div className="mx-auto w-full max-w-6xl lg:max-w-7xl">
                <TopStoriesCarousel
                  topStories={topStories}
                  readStoryIds={readStoryIds}
                  stripRef={stripRef}
                  edges={edges}
                  scrollProgress={scrollProgress}
                  activeIndex={activeIndex}
                  scrollStripByCards={scrollStripByCards}
                  suppressCardClickRef={suppressCardClickRef}
                  onStripPointerDown={onStripPointerDown}
                  onStripPointerMove={onStripPointerMove}
                  endStripDrag={endStripDrag}
                  labelledById="top-stories-heading"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </TooltipProvider>
  );
}
