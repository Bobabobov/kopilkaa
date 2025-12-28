"use client";

import { ReactNode } from "react";

export type FriendsTabId = "friends" | "sent" | "received" | "search";

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
    <div className="flex-shrink-0 bg-[#021e1c]/95 border-b border-[#abd1c6]/15 px-3 sm:px-5 py-2 sm:py-3 overflow-x-auto">
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
                  ? "bg-[#f9bc60] text-[#001e1d] shadow-[0_10px_30px_-12px_rgba(249,188,96,0.7)] ring-2 ring-[#f9bc60]/70"
                  : "bg-[#0a2d29] text-[#abd1c6] border border-[#abd1c6]/30 hover:border-[#f9bc60]/60 hover:text-[#fffffe]"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <span className="text-[#fffffe]">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-[#001e1d]/80 text-[#f9bc60] font-semibold">
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


