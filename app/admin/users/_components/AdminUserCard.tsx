"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { getTrustLabel } from "@/lib/trustLevel";
import { formatDateShort, formatDateTime } from "@/lib/time";
import { TrustDeltaControl } from "./TrustDeltaControl";
import { ResetPasswordModal } from "./ResetPasswordModal";
import type { AdminUser } from "./types";

interface AdminUserCardProps {
  user: AdminUser;
  index: number;
  deletingUserId: string | null;
  trustDeltaSaving: string | null;
  setTrustDeltaSaving: (id: string | null) => void;
  onTrustUpdated: (userId: string, nextDelta: number) => void;
  onDelete: (userId: string, userName: string) => void;
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
  showToast,
}: AdminUserCardProps) {
  const [showResetPassword, setShowResetPassword] = useState(false);
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

          {user.links &&
            (user.links.samePayment.length > 0 ||
              user.links.sameIp.length > 0) && (
              <div
                className="mt-3 p-3 rounded-lg border text-xs"
                style={{
                  backgroundColor: "rgba(232, 165, 69, 0.08)",
                  borderColor: "rgba(232, 165, 69, 0.3)",
                }}
              >
                <p
                  className="font-semibold mb-2"
                  style={{ color: "#e8a545" }}
                >
                  Возможные дубли (мультиаккаунты)
                </p>
                {user.links.samePayment.length > 0 && (
                  <div className="mb-2">
                    <span className="text-[#abd1c6]/90">
                      По реквизитам:{" "}
                      <span className="font-medium text-[#f9bc60]">
                        {user.links.samePayment.length} акк.
                      </span>{" "}
                      (
                    </span>
                    {user.links.samePayment.slice(0, 5).map((u, i) => (
                      <span key={u.id}>
                        {i > 0 && ", "}
                        <Link
                          href={`/profile/${u.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#abd1c6] hover:text-[#f9bc60] underline underline-offset-1"
                        >
                          {u.email ?? u.name ?? u.id.slice(0, 8)}
                        </Link>
                      </span>
                    ))}
                    {user.links.samePayment.length > 5 && (
                      <span className="text-[#94a1b2]">
                        {" "}
                        +{user.links.samePayment.length - 5}
                      </span>
                    )}
                    <span className="text-[#abd1c6]/90">)</span>
                  </div>
                )}
                {user.links.sameIp.length > 0 && (
                  <div>
                    <span className="text-[#abd1c6]/90">
                      По IP:{" "}
                      <span className="font-medium text-[#f9bc60]">
                        {user.links.sameIp.length} акк.
                      </span>{" "}
                      (
                    </span>
                    {user.links.sameIp.slice(0, 5).map((u, i) => (
                      <span key={u.id}>
                        {i > 0 && ", "}
                        <Link
                          href={`/profile/${u.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#abd1c6] hover:text-[#f9bc60] underline underline-offset-1"
                        >
                          {u.email ?? u.name ?? u.id.slice(0, 8)}
                        </Link>
                      </span>
                    ))}
                    {user.links.sameIp.length > 5 && (
                      <span className="text-[#94a1b2]">
                        {" "}
                        +{user.links.sameIp.length - 5}
                      </span>
                    )}
                    <span className="text-[#abd1c6]/90">)</span>
                  </div>
                )}
              </div>
            )}

          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-[#abd1c6]/80">
                Доверие:{" "}
                <span className="text-[#f9bc60] font-semibold">
                  {user.trustLevel
                    ? getTrustLabel(user.trustLevel)
                    : "Не задано"}
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

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowResetPassword(true)}
              className="inline-flex items-center gap-1 text-xs text-[#abd1c6] hover:text-[#f9bc60] transition-colors"
              title="Сбросить пароль пользователю"
            >
              <LucideIcons.Lock className="w-3 h-3" />
              <span>Сбросить пароль</span>
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

          {showResetPassword && (
            <ResetPasswordModal
              userId={user.id}
              userName={user.name || user.email || "Пользователь"}
              onClose={() => setShowResetPassword(false)}
              onSuccess={() => {}}
              showToast={showToast}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
