"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { HeroBadge } from "@/components/ui/HeroBadge";
import type { HeroBadge as HeroBadgeType } from "@/lib/heroBadges";
import { VALID_BADGES } from "./types";

interface AdminBadgeModalProps {
  open: boolean;
  currentBadge: HeroBadgeType | null | undefined;
  loading: boolean;
  onSetBadge: (badge: HeroBadgeType | null) => void;
  onClose: () => void;
}

export function AdminBadgeModal({
  open,
  currentBadge,
  loading,
  onSetBadge,
  onClose,
}: AdminBadgeModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-[#001e1d] to-[#003d3a] rounded-2xl border border-[#abd1c6]/30 p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#fffffe]">
            Управление бейджем
          </h3>
          <button
            onClick={onClose}
            className="text-[#abd1c6] hover:text-[#fffffe] transition-colors"
          >
            <LucideIcons.X className="w-5 h-5" />
          </button>
        </div>

        {loading && currentBadge === undefined ? (
          <div className="text-center py-8">
            <LucideIcons.Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#f9bc60]" />
            <p className="text-[#abd1c6] text-sm">Загрузка...</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-[#abd1c6] mb-3">Текущий бейдж:</p>
              <div className="flex items-center gap-2">
                {currentBadge ? (
                  <HeroBadge badge={currentBadge} size="sm" />
                ) : (
                  <span className="text-sm text-[#abd1c6]/70">
                    Автоматический (по сумме донаций)
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-[#abd1c6] mb-3">Выберите бейдж:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSetBadge(null)}
                  disabled={loading}
                  className={`p-3 rounded-lg border-2 text-sm text-center transition-all ${
                    currentBadge === null
                      ? "border-[#f9bc60] bg-[#f9bc60]/10 text-[#f9bc60]"
                      : "border-[#abd1c6]/20 bg-[#001e1d]/40 text-[#abd1c6] hover:border-[#abd1c6]/40"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Автоматический
                </button>
                {VALID_BADGES.map((badge) => (
                  <button
                    key={badge}
                    onClick={() => onSetBadge(badge)}
                    disabled={loading}
                    className={`p-3 rounded-lg border-2 text-sm text-center transition-all flex items-center justify-center gap-2 ${
                      currentBadge === badge
                        ? "border-[#f9bc60] bg-[#f9bc60]/10"
                        : "border-[#abd1c6]/20 bg-[#001e1d]/40 hover:border-[#abd1c6]/40"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <HeroBadge badge={badge} size="xs" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#001e1d]/60 text-[#abd1c6] hover:bg-[#001e1d]/80 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
