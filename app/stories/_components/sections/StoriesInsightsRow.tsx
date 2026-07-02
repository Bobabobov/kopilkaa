"use client";

import { useState } from "react";
import Link from "next/link";
import type { Story as StoryItem } from "@/hooks/stories/useStories";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { formatAmount } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ApplicationRulesModal } from "@/components/applications/ApplicationRulesModal";
import { RandomStoryCard } from "../random-story/RandomStoryCard";
import {
  storiesGlassPanel,
  storiesGlassShine,
} from "../stories-ui/glassStyles";

interface StoriesInsightsRowProps {
  randomStory: StoryItem | null;
  randomLoading: boolean;
  totalPaid: number | null;
  readStoryIds: Set<string>;
}

export function StoriesInsightsRow({
  randomStory,
  randomLoading,
  totalPaid,
  readStoryIds,
}: StoriesInsightsRowProps) {
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <>
      <section
        className="container mx-auto max-w-6xl px-4 pb-6"
        aria-label="Случайная история и сводка"
      >
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
          <div
            className={cn(storiesGlassPanel, "lg:col-span-5 px-4 py-4 sm:px-5 sm:py-5")}
          >
            <div className={storiesGlassShine} />
            <h2 className="relative text-sm font-bold uppercase tracking-wider text-[#abd1c6]/90 mb-3">
              Случайная история
            </h2>
            {randomLoading ? (
              <div
                className="relative mx-auto max-w-xs aspect-[4/5] rounded-2xl border border-white/10 bg-white/[0.04] animate-pulse"
                role="status"
                aria-label="Загрузка случайной истории"
              />
            ) : randomStory ? (
              <RandomStoryCard
                story={randomStory}
                isRead={readStoryIds.has(randomStory.id)}
              />
            ) : null}
          </div>

          <div className="flex flex-col gap-4 lg:col-span-7">
            {totalPaid !== null && (
              <div className={cn(storiesGlassPanel, "px-5 py-4 sm:px-6 sm:py-5")}>
                <div className={storiesGlassShine} />
                <div className="relative flex items-center gap-4">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#f9bc60]/35 bg-[#f9bc60]/15 text-[#f9bc60]"
                    aria-hidden
                  >
                    <LucideIcons.Ruble size="md" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#abd1c6]/75">
                      Выплачено гонораров на сумму
                    </p>
                    <p className="mt-0.5 text-2xl sm:text-3xl font-black tabular-nums text-[#f9bc60]">
                      {formatAmount(totalPaid)}
                      <span className="ml-1 text-[#f9bc60]/85">₽</span>
                    </p>
                  </div>
                  <LucideIcons.Coin
                    className="h-8 w-8 shrink-0 text-[#f9bc60]/35"
                    aria-hidden
                  />
                </div>
              </div>
            )}

            <Link
              href="/applications"
              className={cn(
                storiesGlassPanel,
                "group flex items-center gap-4 px-5 py-4 transition-colors hover:border-[#f9bc60]/25 hover:bg-white/[0.08]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/40",
              )}
            >
              <div className={storiesGlassShine} />
              <span
                className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#f9bc60]/30 bg-[#f9bc60]/12 text-[#f9bc60] transition-transform group-hover:scale-105"
                aria-hidden
              >
                <LucideIcons.Edit3 className="h-5 w-5" />
              </span>
              <div className="relative min-w-0 flex-1">
                <p className="font-semibold text-[#fffffe] group-hover:text-[#f9bc60] transition-colors">
                  Написать свою историю
                </p>
                <p className="text-xs text-[#abd1c6]/75 mt-0.5">
                  Отправить материал на модерацию
                </p>
              </div>
              <LucideIcons.ArrowRight
                className="relative h-5 w-5 shrink-0 text-[#abd1c6]/50 group-hover:text-[#f9bc60] group-hover:translate-x-0.5 transition-all"
                aria-hidden
              />
            </Link>

            <button
              type="button"
              onClick={() => setRulesOpen(true)}
              className={cn(
                storiesGlassPanel,
                "group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:border-[#f9bc60]/25 hover:bg-white/[0.08]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/40",
              )}
            >
              <div className={storiesGlassShine} />
              <span
                className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#abd1c6]/35 bg-[#abd1c6]/12 text-[#abd1c6] transition-transform group-hover:scale-105"
                aria-hidden
              >
                <LucideIcons.FileText className="h-5 w-5" />
              </span>
              <div className="relative min-w-0 flex-1">
                <p className="font-semibold text-[#fffffe] group-hover:text-[#f9bc60] transition-colors">
                  Правила подачи
                </p>
                <p className="text-xs text-[#abd1c6]/75 mt-0.5">
                  Что можно, что нельзя и как получить грант за текст
                </p>
              </div>
              <LucideIcons.Info
                className="relative h-5 w-5 shrink-0 text-[#abd1c6]/50 group-hover:text-[#f9bc60] transition-colors"
                aria-hidden
              />
            </button>
          </div>
        </div>
      </section>

      <ApplicationRulesModal
        open={rulesOpen}
        onClose={() => setRulesOpen(false)}
      />
    </>
  );
}
