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
      <header className="space-y-2 border-b border-[#abd1c6]/15 pb-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f9bc60]/15 text-[#f9bc60] ring-1 ring-[#f9bc60]/25">
            <Rss className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#fffffe] sm:text-3xl md:text-[1.65rem] lg:text-[1.75rem]">
              Лента добрых дел
            </h2>
            <p className="mt-1 text-sm text-[#abd1c6]/95 sm:text-base">
              Карточки как в разделе историй: превью и краткий текст — откройте отчёт,
              чтобы прочитать рассказ целиком и посмотреть материалы.
            </p>
          </div>
        </div>
      </header>
      <GoodDeedsFeed items={items} onBeFirst={onBeFirst} />
    </section>
  );
}
