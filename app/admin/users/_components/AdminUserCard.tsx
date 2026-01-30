"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { HeroBadge } from "@/components/ui/HeroBadge";
import { getTrustLabel } from "@/lib/trustLevel";
import { formatDateShort, formatDateTime } from "@/lib/time";
import { TrustDeltaControl } from "./TrustDeltaControl";
import type { AdminUser } from "./types";

interface AdminUserCardProps {
  user: AdminUser;
  index: number;
  deletingUserId: string | null;
  trustDeltaSaving: string | null;
  setTrustDeltaSaving: (id: string | null) => void;
  onTrustUpdated: (userId: string, nextDelta: number) => void;
  onDelete: (userId: string, userName: string) => void;
  onOpenBadge: (userId: string) => void;
  showToast: (type: "success" | "error", title: string, desc?: string) => void;
}

export function AdminUserCard({
  user,
  index,
  deletingUserId,
  trustDeltaSaving,
  setTrustDeltaSaving,
  onTrustUpdated,
  onDelete,
  onOpenBadge,
  showToast,
}: AdminUserCardProps) {
  const effectiveApproved = user.effectiveApprovedApplications ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-gradient-to-br from-[#001e1d] to-[#003d3a] rounded-xl p-4 sm:p-6 border border-[#abd1c6]/20 hover:border-[#f9bc60]/40 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || "User"}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#abd1c6]/40"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#abd1c6]/10 flex items-center justify-center border-2 border-[#abd1c6]/20">
              <LucideIcons.User className="w-6 h-6 text-[#abd1c6]" />
            </div>
          )}

          {user.badge && (
            <div className="absolute -bottom-1 -right-1">
              <HeroBadge badge={user.badge} size="xs" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[#fffffe] font-semibold text-sm sm:text-base break-words">
                  {user.name || "Без имени"}
                </h3>
                {user.role === "ADMIN" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#f9bc60]/20 text-[#f9bc60]">
                    ADMIN
                  </span>
                )}
              </div>
              <div className="text-xs text-[#abd1c6]/80 break-all">
                {user.email || "Email не указан"}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <Link
                href={`/profile/${user.id}`}
                target="_blank"
                className="text-xs text-[#abd1c6] hover:text-[#f9bc60] transition-colors"
              >
                Профиль ↗
              </Link>
            </div>
          </div>

          <div className="mt-3 text-xs text-[#abd1c6]/70">
            <div>Зарегистрирован: {formatDateShort(user.createdAt)}</div>
            <div>
              Последний визит:{" "}
              {user.lastSeen ? formatDateTime(user.lastSeen) : "Никогда"}
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-[#abd1c6]/80">
                Доверие:{" "}
                <span className="text-[#f9bc60] font-semibold">
                  {getTrustLabel(user.trustLevel)}
                </span>
              </div>
              <div className="text-xs text-[#abd1c6]/80">
                Эффективно одобрено:{" "}
                <span className="text-[#f9bc60] font-semibold">
                  {effectiveApproved}
                </span>
              </div>
            </div>
            <div className="mt-2">
              <TrustDeltaControl
                userId={user.id}
                initialDelta={user.trustDelta ?? 0}
                trustLevel={user.trustLevel}
                effectiveApprovedApplications={
                  user.effectiveApprovedApplications
                }
                savingId={trustDeltaSaving}
                setSavingId={setTrustDeltaSaving}
                onSaved={(next) => onTrustUpdated(user.id, next)}
                showToast={showToast}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => onOpenBadge(user.id)}
              className="inline-flex items-center gap-1 text-xs text-[#abd1c6] hover:text-[#f9bc60] transition-colors"
              title="Управление бейджем"
            >
              <LucideIcons.Award className="w-3 h-3" />
              <span>Бейдж</span>
            </button>

            <button
              onClick={() =>
                onDelete(user.id, user.name || user.email || "Пользователь")
              }
              disabled={deletingUserId === user.id || user.role === "ADMIN"}
              className="ml-auto inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                user.role === "ADMIN"
                  ? "Нельзя удалить администратора"
                  : "Удалить пользователя"
              }
            >
              {deletingUserId === user.id ? (
                <>
                  <LucideIcons.Loader2 className="w-3 h-3 animate-spin" />
                  <span>Удаление...</span>
                </>
              ) : (
                <>
                  <LucideIcons.Trash2 className="w-3 h-3" />
                  <span>Удалить</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
