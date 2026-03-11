"use client";

import { ReactNode } from "react";

export type FriendsTabId = "friends" | "sent" | "received" | "online" | "search";

export type FriendsTabItem = {
  id: FriendsTabId;
  label: string;
  icon: ReactNode;
  count?: number;
};

export function FriendsTabsBar({
  tabs,
  activeTab,
  onSelect,
}: {
  tabs: FriendsTabItem[];
  activeTab: FriendsTabId;
  onSelect: (tab: FriendsTabId) => void;
}) {
  return (
    <div className="flex-shrink-0 border-b border-white/10 bg-white/[0.02] px-3 sm:px-5 py-2 sm:py-3 overflow-x-auto">
      <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 w-full min-w-0">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelect(tab.id)}
              className={`px-3 sm:px-4 py-2.5 text-sm font-semibold rounded-full whitespace-nowrap transition-all shadow-sm ${
                active
                  ? "bg-[#f9bc60] text-[#0f2d2a] shadow-[0_8px_24px_-8px_rgba(249,188,96,0.5)] ring-2 ring-[#f9bc60]/50"
                  : "bg-white/5 text-[#abd1c6] border border-white/10 hover:border-[#f9bc60]/40 hover:text-[#fffffe] hover:bg-white/[0.08]"
              }`}
            >
              <span className="inline-flex items-center gap-2 text-inherit">
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                      active
                        ? "bg-white/90 text-[#0f2d2a]"
                        : "bg-[#abd1c6]/20 text-[#fffffe] border border-[#abd1c6]/30"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
