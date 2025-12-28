"use client";

import { ReactNode } from "react";

export type FriendsSummaryItem = {
  label: string;
  value: number;
  icon: ReactNode;
  color: string;
  hint?: string;
};

export function FriendsSummaryCards({ items }: { items: FriendsSummaryItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 min-w-0">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-2xl border ${item.color} p-3 sm:p-4 flex items-center gap-3 shadow-md min-w-0`}
        >
          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
            {item.icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-[#abd1c6]">{item.label}</p>
            <p className="text-xl font-bold text-[#fffffe]">
              {item.value}
              {item.hint && <span className="ml-2 text-xs text-[#f9bc60]">{item.hint}</span>}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}


