"use client";

import { ClipboardList, Rss } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "tasks" | "feed";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  showTasks: boolean;
  feedCount: number;
};

const TABS: { id: Tab; label: string; icon: typeof ClipboardList; showCount?: boolean }[] = [
  { id: "tasks", label: "Текущие задания", icon: ClipboardList },
  { id: "feed", label: "Лента отчётов", icon: Rss, showCount: true },
];

export function GoodDeedsSubNav({
  activeTab,
  onTabChange,
  showTasks,
  feedCount,
}: Props) {
  const visibleTabs = showTasks ? TABS : TABS.filter((t) => t.id === "feed");

  const scrollTo = (tab: Tab) => {
    onTabChange(tab);
    const id = tab === "tasks" ? "good-deeds-week-tasks" : "good-deeds-feed";
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className="sticky top-[calc(var(--header-height,64px)+8px)] z-20 -mx-1 px-1 py-2"
      aria-label="Навигация по разделу"
    >
      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-white/[0.1] bg-[#001e1d]/70 p-1.5 backdrop-blur-xl scrollbar-none">
        {visibleTabs.map(({ id, label, icon: Icon, showCount }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
              activeTab === id
                ? "bg-[#f9bc60] text-[#001e1d] shadow-md shadow-[#f9bc60]/20"
                : "text-[#abd1c6] hover:bg-white/[0.06] hover:text-[#fffffe]",
            )}
            aria-current={activeTab === id ? "true" : undefined}
          >
            <Icon className="h-4 w-4" />
            {label}
            {showCount && feedCount > 0 ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums",
                  activeTab === id
                    ? "bg-[#001e1d]/15 text-[#001e1d]"
                    : "bg-white/10 text-[#abd1c6]",
                )}
              >
                {feedCount}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </nav>
  );
}
