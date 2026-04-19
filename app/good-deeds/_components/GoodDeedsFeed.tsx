"use client";

import { useCallback, useRef } from "react";
import type { GoodDeedsResponse } from "../types";
import { GoodDeedFeedCard } from "./GoodDeedFeedCard";

type FeedItem = GoodDeedsResponse["feed"][number];

/** Отдельные классы для classList — одна строка с пробелами в remove() недопустима */
const TASK_HIGHLIGHT_CLASSES = [
  "ring-2",
  "ring-[#f9bc60]",
  "ring-offset-2",
  "ring-offset-[#001e1d]",
  "shadow-[0_0_36px_rgba(249,188,96,0.42)]",
] as const;

type Props = {
  items: FeedItem[];
  /** Вызывается из кнопки «Быть первым» (напр. тост про +300 бонусов) */
  onBeFirst?: () => void;
};

function GoodDeedsFeedEmpty({ onBeFirst }: { onBeFirst?: () => void }) {
  const clearTimersRef = useRef<number[]>([]);

  const handleBeFirst = useCallback(() => {
    onBeFirst?.();

    const section = document.getElementById("good-deeds-week-tasks");
    section?.scrollIntoView({ behavior: "smooth", block: "center" });

    clearTimersRef.current.forEach((id) => window.clearTimeout(id));
    clearTimersRef.current = [];

    const applyHighlight = (el: HTMLElement, add: boolean) => {
      if (add) {
        el.classList.add(...TASK_HIGHLIGHT_CLASSES);
      } else {
        el.classList.remove(...TASK_HIGHLIGHT_CLASSES);
      }
    };

    window.setTimeout(() => {
      [0, 1, 2].forEach((slot, i) => {
        const el = document.querySelector(
          `[data-good-deed-task-slot="${slot}"]`,
        );
        if (!el || !(el instanceof HTMLElement)) return;

        const run = () => {
          applyHighlight(el, false);
          void el.offsetWidth;
          applyHighlight(el, true);
          const off = window.setTimeout(() => applyHighlight(el, false), 2600);
          clearTimersRef.current.push(off);
        };

        const delay = window.setTimeout(run, 120 + i * 140);
        clearTimersRef.current.push(delay);
      });
    }, 280);
  }, [onBeFirst]);

  return (
    <div className="rounded-3xl border border-dashed border-[#abd1c6]/25 bg-[#001e1d]/40 px-6 py-14 text-center sm:py-16">
      <p className="text-5xl leading-none sm:text-6xl" aria-hidden>
        😢
      </p>
      <p className="mt-5 text-lg font-semibold text-[#abd1c6]">
        Добрых дел пока нет...
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#94a1b2]">
        Лента пустая — выполните задания недели выше: после проверки отчёт
        появится здесь.
      </p>
      <button
        type="button"
        onClick={handleBeFirst}
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#f9bc60] px-6 py-3.5 text-sm font-bold text-[#001e1d] shadow-[0_8px_28px_rgba(249,188,96,0.35)] transition hover:bg-[#fcdca3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60] focus-visible:ring-offset-2 focus-visible:ring-offset-[#001e1d]"
      >
        Быть первым · до +300 бонусов
      </button>
    </div>
  );
}

export function GoodDeedsFeed({ items, onBeFirst }: Props) {
  if (items.length === 0) {
    return <GoodDeedsFeedEmpty onBeFirst={onBeFirst} />;
  }

  return (
    <ul
      className="m-0 grid grid-cols-1 list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="Лента добрых дел"
    >
      {items.map((item, index) => (
        <GoodDeedFeedCard key={item.id} item={item} index={index} />
      ))}
    </ul>
  );
}
