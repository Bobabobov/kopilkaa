"use client";

import { HeartHandshake, Sparkles } from "lucide-react";
import type { GoodDeedsResponse } from "../types";
import { GoodDeedFeedCard } from "./GoodDeedFeedCard";
import { cn } from "@/lib/utils";
import { goodDeedsGlassPanel, goodDeedsGlassShine } from "./good-deeds-ui/glassStyles";

type FeedItem = GoodDeedsResponse["feed"][number];

type Props = {
  items: FeedItem[];
  onBeFirst?: () => void;
};

function GoodDeedsFeedEmpty({ onBeFirst }: { onBeFirst?: () => void }) {
  return (
    <div
      className={cn(
        goodDeedsGlassPanel,
        "border-dashed border-white/15 px-6 py-14 text-center sm:py-16",
      )}
    >
      <div className={goodDeedsGlassShine} />
      <div className="relative mx-auto max-w-md">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#f9bc60]/25 bg-[#f9bc60]/10 text-[#f9bc60]">
          <HeartHandshake className="h-7 w-7" />
        </span>
        <p className="mt-5 text-lg font-bold text-[#fffffe]">
          Лента пока пуста
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#abd1c6]/80">
          Станьте первым: выполните задание, подайте отчёт с фото и видео —
          после модерации он появится здесь.
        </p>
        <button
          type="button"
          onClick={onBeFirst}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#f9bc60] px-6 py-3.5 text-sm font-bold text-[#001e1d] shadow-[0_8px_28px_rgba(249,188,96,0.35)] transition hover:bg-[#fcdca3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60] focus-visible:ring-offset-2 focus-visible:ring-offset-[#001e1d]"
        >
          <Sparkles className="h-4 w-4" />
          Подать первый отчёт
        </button>
      </div>
    </div>
  );
}

export function GoodDeedsFeed({ items, onBeFirst }: Props) {
  if (items.length === 0) {
    return <GoodDeedsFeedEmpty onBeFirst={onBeFirst} />;
  }

  return (
    <ul
      className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 xl:grid-cols-3"
      aria-label="Лента добрых дел"
    >
      {items.map((item, index) => (
        <GoodDeedFeedCard key={item.id} item={item} index={index} />
      ))}
    </ul>
  );
}
