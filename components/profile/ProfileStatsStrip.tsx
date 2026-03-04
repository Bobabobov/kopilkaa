"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { getTrustLabel } from "@/lib/trustLevel";
import type { TrustLevel } from "@/lib/trustLevel";

interface ProfileStatsStripProps {
  trustStatus: Lowercase<TrustLevel>;
  trustSupportText: string;
  /** Дата регистрации для отображения "Участник с ..." */
  joinedAt?: string;
}

export function ProfileStatsStrip({
  trustStatus,
  trustSupportText,
  joinedAt,
}: ProfileStatsStripProps) {
  const levelLabel = getTrustLabel(
    (trustStatus?.toUpperCase() || "LEVEL_1") as TrustLevel,
  );
  const joinedText =
    joinedAt &&
    (() => {
      try {
        const d = new Date(joinedAt);
        if (Number.isNaN(d.getTime())) return null;
        return d.toLocaleDateString("ru-RU", {
          month: "long",
          year: "numeric",
        });
      } catch {
        return null;
      }
    })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
      role="region"
      aria-label="Краткая статистика профиля"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex cursor-help items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-[#abd1c6]/90 uppercase tracking-wider">
              <LucideIcons.Shield className="w-3.5 h-3.5 text-[#f9bc60]/80" />
              Доверие
            </span>
            <Badge variant="default" className="font-semibold">
              {levelLabel}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[260px]">
          <p className="text-[#abd1c6]">
            Уровень доверия рассчитывается по одобренным заявкам. Чем выше уровень, тем больше доступный диапазон поддержки.
          </p>
        </TooltipContent>
      </Tooltip>
      <span className="hidden sm:inline w-px h-5 bg-[#abd1c6]/30" />
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex cursor-help items-center gap-2">
            <span className="text-sm text-[#abd1c6]/90">
              Поддержка:{" "}
              <span className="font-semibold text-[#f9bc60]">
                {trustSupportText}
              </span>
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[260px]">
          <p className="text-[#abd1c6]">
            Диапазон сумм, в котором участники могут оказывать вам поддержку по одобренным заявкам.
          </p>
        </TooltipContent>
      </Tooltip>
      {joinedText && (
        <>
          <span className="hidden sm:inline w-px h-5 bg-[#abd1c6]/30" />
          <span className="text-xs sm:text-sm text-[#94a1b2]">
            Участник с {joinedText}
          </span>
        </>
      )}
    </motion.div>
  );
}
