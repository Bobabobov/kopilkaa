"use client";

import { ReactNode } from "react";

export type FriendsSummaryItem = {
  label: string;
  value: number;
  icon: ReactNode;
  color: string;
  hint?: string;
};

export function FriendsSummaryCards({
  items,
}: {
  items: FriendsSummaryItem[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 min-w-0">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-2xl border ${item.color} p-4 sm:p-5 flex items-center gap-4 min-w-0 bg-[#004643]/60 backdrop-blur-sm transition-all duration-200 hover:border-opacity-60`}
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
            {item.icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-[#abd1c6] uppercase tracking-wide">
              {item.label}
            </p>
            <p className="text-xl sm:text-2xl font-black text-[#fffffe] mt-0.5">
              {item.value}
              {item.hint && (
                <span className="ml-2 text-xs font-semibold text-[#f9bc60]">
                  {item.hint}
                </span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
