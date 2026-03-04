"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Medal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export interface LeaderboardPlaceholderCardProps {
  title: string;
  index: number;
}

export function LeaderboardPlaceholderCard({ title, index }: LeaderboardPlaceholderCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20px" }} transition={{ delay: index * 0.08 }}>
      <Card variant="darkGlass" padding="none" className="overflow-hidden border-dashed">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-[#abd1c6]">
            {title} — топ недели
          </h3>
          <span className="px-3 py-1 rounded-lg text-xs font-medium text-[#94a1b2]" style={{ background: "rgba(255,255,255,0.08)" }}>
            В разработке
          </span>
        </div>
        <CardContent className="p-6 sm:p-8">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            {[2, 1, 3].map((place) => (
              <div
                key={place}
                className={cn(
                  "rounded-xl p-4 flex flex-col items-center justify-center border border-white/10",
                  place === 1 && "border-[#f9bc60]/20"
                )}
                style={place === 1 ? { background: "rgba(249,188,96,0.06)" } : { background: "rgba(255,255,255,0.04)" }}
              >
                <Medal
                  className={cn(
                    "text-xl sm:text-2xl mb-2 opacity-50",
                    place === 2 ? "text-slate-400" : place === 3 ? "text-amber-700" : ""
                  )}
                  style={place === 1 ? { color: "#f9bc60" } : undefined}
                  aria-hidden
                />
              <div
                className={cn(
                  "rounded-full bg-white/10 flex items-center justify-center text-white/30 font-medium",
                  place === 1 ? "h-14 w-14 text-lg" : "h-12 w-12 text-sm"
                )}
              >
                ?
              </div>
              <span className="text-xs text-white/30 mt-2">—</span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[#94a1b2]">
            Рейтинг появится после запуска игры
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
