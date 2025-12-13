"use client";

import { motion } from "framer-motion";

type TimelineItem = {
  id: string;
  title: string;
  date: string;
  rarity?: string;
};

interface AchievementsTimelineProps {
  achievements: TimelineItem[];
}

export function AchievementsTimeline({ achievements }: AchievementsTimelineProps) {
  if (!achievements || achievements.length === 0) return null;

  return (
    <div className="mt-4 space-y-3">
      {achievements.slice(0, 6).map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="relative pl-6"
        >
          <div className="absolute left-1 top-0 bottom-0 w-px bg-white/10" />
          <div className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full bg-[#f9bc60] shadow-[0_0_0_4px_rgba(249,188,96,0.12)]" />
          <div className="rounded-xl border border-[#abd1c6]/20 bg-[#001e1d]/40 px-3 py-2.5 shadow-sm">
            <div className="text-sm text-[#fffffe] font-semibold truncate">
              {item.title}
            </div>
            <div className="text-[11px] text-[#abd1c6] flex items-center gap-2">
              <span>{item.date}</span>
              {item.rarity && (
                <span className="px-2 py-0.5 rounded-full bg-[#f9bc60]/15 text-[#f9bc60] font-semibold">
                  {item.rarity}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}




