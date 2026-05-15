"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";
import { getTrustLabel } from "@/lib/trustLevel";
import { formatDateShort, formatDateTime } from "@/lib/time";
import { TrustDeltaControl } from "./TrustDeltaControl";
import { DeceiverMarkControl } from "./DeceiverMarkControl";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { UserPublicBadges } from "@/components/users/UserPublicBadges";
import type { AdminUser } from "./types";

interface AdminUserCardProps {
  user: AdminUser;
  index: number;
  deletingUserId: string | null;
  trustDeltaSaving: string | null;
  setTrustDeltaSaving: (id: string | null) => void;
  deceiverMarkSaving: string | null;
  setDeceiverMarkSaving: (id: string | null) => void;
  onTrustUpdated: (userId: string, nextDelta: number) => void;
  onDeceiverMarkUpdated: (userId: string, marked: boolean) => void;
  onDelete: (userId: string, userName: string) => void;
  showToast: (type: "success" | "error", title: string, desc?: string) => void;
}

export function AdminUserCard({
  user,
  index,
  deletingUserId,
  trustDeltaSaving,
  setTrustDeltaSaving,
  deceiverMarkSaving,
  setDeceiverMarkSaving,
  onTrustUpdated,
  onDeceiverMarkUpdated,
  onDelete,
  showToast,
}: AdminUserCardProps) {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const reduceMotion = useReducedMotion();
  const effectiveApproved = user.effectiveApprovedApplications ?? 0;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.24),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Card
        variant="glass"
        padding="none"
        hoverable
        className="flex h-full flex-col border-[#abd1c6]/20 p-4 sm:p-5"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Avatar className="mx-auto h-16 w-16 shrink-0 border-2 border-[#abd1c6]/35 ring-2 ring-[#001e1d] sm:mx-0">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name || "Аватар"} />
            ) : null}
            <AvatarFallback className="bg-[#abd1c6]/12 text-[#abd1c6]">
              <LucideIcons.User className="h-7 w-7" />
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-3 text-left">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
              <div className="min-w-0 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h2 className="text-base font-semibold text-[#fffffe] sm:text-lg">
                    {user.name || "Без имени"}
                  </h2>
                  <UserPublicBadges markedAsDeceiver={user.markedAsDeceiver} />
                  {user.role === "ADMIN" ? (
                    <Badge className="shrink-0 text-[0.65rem] uppercase tracking-wide">
                      Админ
                    </Badge>
                  ) : null}
                  {user.email &&
                  user.emailVerified === false &&
                  user.role !== "ADMIN" ? (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-amber-500/50 text-[0.65rem] font-medium uppercase tracking-wide text-amber-200/95"
                      title="Регистрация по почте: ссылка из письма ещё не открыта"
                    >
                      Почта не подтверждена
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 break-all text-xs text-[#abd1c6]/85 sm:text-sm">
                  {user.email || "Email не указан"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full shrink-0 border-[#abd1c6]/30 text-[#abd1c6] hover:border-[#f9bc60]/45 hover:bg-[#f9bc60]/10 hover:text-[#f9bc60] sm:w-auto"
              >
                <Link
                  href={`/profile/${user.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-1.5"
                >
                  Профиль
                  <LucideIcons.ExternalLink className="h-3.5 w-3.5 opacity-80" />
                </Link>
              </Button>
            </div>

            <dl className="grid grid-cols-1 gap-2 text-xs text-[#abd1c6]/80 sm:grid-cols-2 sm:gap-x-4 sm:text-sm">
              <div className="flex flex-col rounded-lg bg-[#001e1d]/40 px-3 py-2 ring-1 ring-[#abd1c6]/10">
                <dt className="text-[0.65rem] uppercase tracking-wider text-[#abd1c6]/55">
                  Регистрация
                </dt>
                <dd className="font-medium text-[#fffffe]">
                  {formatDateShort(user.createdAt)}
                </dd>
              </div>
              <div className="flex flex-col rounded-lg bg-[#001e1d]/40 px-3 py-2 ring-1 ring-[#abd1c6]/10">
                <dt className="text-[0.65rem] uppercase tracking-wider text-[#abd1c6]/55">
                  Последний визит
                </dt>
                <dd className="font-medium text-[#fffffe]">
                  {user.lastSeen ? formatDateTime(user.lastSeen) : "—"}
                </dd>
              </div>
            </dl>

            {user.links &&
            (user.links.samePayment.length > 0 ||
              user.links.sameIp.length > 0) ? (
              <div
                className="rounded-xl border border-[#e8a545]/35 bg-[#e8a545]/[0.07] p-3 text-xs sm:text-sm"
                role="status"
              >
                <p className="mb-2 font-semibold text-[#f9bc60]">
                  Возможные связанные аккаунты
                </p>
                <p className="mb-2 text-[0.65rem] leading-snug text-[#abd1c6]/70">
                  Учитываются заявки (текст реквизитов и IP при отправке) и
                  заявки на вывод бонусов добрых дел. Поиск по базе целиком, не
                  только среди пользователей на этой странице.
                </p>
                {user.links.samePayment.length > 0 ? (
                  <p className="mb-2 text-[#abd1c6]/90">
                    <span className="text-[#fffffe]/90">По реквизитам:</span>{" "}
                    {user.links.samePayment.length} акк.{" "}
                    {renderUserLinks(user.links.samePayment)}
                  </p>
                ) : null}
                {user.links.sameIp.length > 0 ? (
                  <p className="text-[#abd1c6]/90">
                    <span className="text-[#fffffe]/90">По IP:</span>{" "}
                    {user.links.sameIp.length} акк.{" "}
                    {renderUserLinks(user.links.sameIp)}
                  </p>
                ) : null}
              </div>
            ) : null}

            <Separator className="bg-[#abd1c6]/15" />

            <div className="space-y-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-3">
                <p className="text-xs text-[#abd1c6]/85 sm:text-sm">
                  <span className="text-[#abd1c6]/65">Доверие:</span>{" "}
                  <span className="font-semibold text-[#f9bc60]">
                    {user.trustLevel
                      ? getTrustLabel(user.trustLevel)
                      : "Не задано"}
                  </span>
                </p>
                <p className="text-xs text-[#abd1c6]/85 sm:text-sm">
                  <span className="text-[#abd1c6]/65">Одобрено (эффект.):</span>{" "}
                  <span className="font-semibold tabular-nums text-[#f9bc60]">
                    {effectiveApproved}
                  </span>
                </p>
              </div>

              {user.levelStats ? (
                <div className="rounded-xl border border-[#abd1c6]/15 bg-[#001e1d]/45 p-3">
                  <p className="mb-2 text-[0.65rem] font-medium uppercase tracking-wider text-[#abd1c6]/65">
                    Уровень профиля — статистика
                  </p>
                  <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5 text-xs">
                    <span className="text-[#abd1c6]/80">
                      Одобрено (в уровень)
                    </span>
                    <span className="text-right font-medium tabular-nums text-[#f9bc60]">
                      {user.levelStats.approvedCounting}
                    </span>
                    <span className="text-[#abd1c6]/80">
                      Одобрено (без уровня)
                    </span>
                    <span className="text-right font-medium tabular-nums text-[#94a1b2]">
                      {user.levelStats.approvedWithoutLevel}
                    </span>
                    <span className="text-[#abd1c6]/80">Отклонено</span>
                    <span className="text-right font-medium tabular-nums text-[#94a1b2]">
                      {user.levelStats.rejectedTotal}
                    </span>
                    <span className="text-[#abd1c6]/80">
                      Отклонено с понижением
                    </span>
                    <span className="text-right font-medium tabular-nums text-[#e16162]">
                      {user.levelStats.rejectedWithLevelDecrease}
                    </span>
                  </div>
                  <Separator className="my-2 bg-[#abd1c6]/10" />
                  <div className="flex items-center justify-between text-[0.65rem] text-[#abd1c6]/70">
                    <span>Рейтинг доверия</span>
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        user.levelStats.trustScore >= 0
                          ? "text-[#f9bc60]"
                          : "text-[#e16162]"
                      }`}
                      title="Одобрено в уровень − отклонено с понижением"
                    >
                      {user.levelStats.trustScore >= 0 ? "+" : ""}
                      {user.levelStats.trustScore}
                    </span>
                  </div>
                </div>
              ) : null}

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

              <DeceiverMarkControl
                userId={user.id}
                initialMarked={user.markedAsDeceiver ?? false}
                isAdmin={user.role === "ADMIN"}
                savingId={deceiverMarkSaving}
                setSavingId={setDeceiverMarkSaving}
                onSaved={(marked) => onDeceiverMarkUpdated(user.id, marked)}
                showToast={showToast}
              />
            </div>

            <Separator className="bg-[#abd1c6]/15" />

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="justify-center text-[#abd1c6] hover:bg-[#f9bc60]/10 hover:text-[#f9bc60] sm:justify-start"
                onClick={() => setShowResetPassword(true)}
              >
                <LucideIcons.Lock className="h-4 w-4" />
                Сбросить пароль
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="justify-center text-red-400 hover:bg-red-500/10 hover:text-red-300 sm:ml-auto sm:justify-start"
                disabled={deletingUserId === user.id || user.role === "ADMIN"}
                title={
                  user.role === "ADMIN"
                    ? "Нельзя удалить администратора"
                    : "Удалить пользователя"
                }
                onClick={() =>
                  onDelete(user.id, user.name || user.email || "Пользователь")
                }
              >
                {deletingUserId === user.id ? (
                  <>
                    <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
                    Удаление…
                  </>
                ) : (
                  <>
                    <LucideIcons.Trash2 className="h-4 w-4" />
                    Удалить
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {showResetPassword ? (
          <ResetPasswordModal
            userId={user.id}
            userName={user.name || user.email || "Пользователь"}
            onClose={() => setShowResetPassword(false)}
            onSuccess={() => {}}
            showToast={showToast}
          />
        ) : null}
      </Card>
    </motion.div>
  );
}

function renderUserLinks(
  list: { id: string; email: string | null; name: string | null }[],
) {
  const shown = list.slice(0, 5);
  const rest = list.length - shown.length;
  return (
    <>
      {" "}
      (
      {shown.map((u, i) => (
        <span key={u.id}>
          {i > 0 ? ", " : null}
          <Link
            href={`/profile/${u.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#abd1c6] underline decoration-[#abd1c6]/40 underline-offset-2 hover:text-[#f9bc60]"
          >
            {u.email ?? u.name ?? u.id.slice(0, 8)}
          </Link>
        </span>
      ))}
      {rest > 0 ? <span className="text-[#94a1b2]"> +{rest}</span> : null})
    </>
  );
}
