"use client";

import { Rss } from "lucide-react";
import { GoodDeedsFeed } from "./GoodDeedsFeed";
import type { GoodDeedsResponse } from "../types";

type Props = {
  items: GoodDeedsResponse["feed"];
  onBeFirst?: () => void;
};

export function GoodDeedsFeedSection({ items, onBeFirst }: Props) {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-5 md:space-y-6">
      <header className="space-y-3 border-b border-[#abd1c6]/15 pb-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f9bc60]/15 text-[#f9bc60] ring-1 ring-[#f9bc60]/25">
            <Rss className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-[#fffffe] sm:text-2xl">
              Лента
            </h2>
            <p className="mt-1 text-sm text-[#abd1c6]">
              Принятые отчёты с фото и текстом.
            </p>
          </div>
        </div>
      </header>
      <GoodDeedsFeed items={items} onBeFirst={onBeFirst} />
    </section>
  );
}
