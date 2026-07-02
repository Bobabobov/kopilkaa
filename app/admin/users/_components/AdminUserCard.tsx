"use client";

import { useState } from "react";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateShort, formatDateTime } from "@/lib/time";
import { ResetPasswordModal } from "./ResetPasswordModal";
import type { AdminUser } from "./types";
import {
  adminCtaButtonClass,
  adminListRowClass,
} from "@/app/admin/_components/admin-ui";

interface AdminUserCardProps {
  user: AdminUser;
  deletingUserId: string | null;
  onDelete: (userId: string, userName: string) => void;
  showToast: (type: "success" | "error", title: string, desc?: string) => void;
}

export function AdminUserCard({
  user,
  deletingUserId,
  onDelete,
  showToast,
}: AdminUserCardProps) {
  const [showResetPassword, setShowResetPassword] = useState(false);

  const approved = user.applicationStats?.approvedTotal ?? 0;
  const rejected = user.applicationStats?.rejectedTotal ?? 0;
  const paymentLinks = user.links?.samePayment.length ?? 0;
  const ipLinks = user.links?.sameIp.length ?? 0;
  const linkCount = paymentLinks + ipLinks;

  return (
    <article className={`p-3 sm:p-4 ${adminListRowClass}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Avatar className="mx-auto h-12 w-12 shrink-0 border border-[#abd1c6]/30 sm:mx-0">
          {user.avatar ? (
            <AvatarImage src={user.avatar} alt={user.name || "Аватар"} />
          ) : null}
          <AvatarFallback className="bg-[#abd1c6]/12 text-[#abd1c6]">
            <LucideIcons.User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
                <h2 className="text-sm font-semibold text-[#fffffe] sm:text-base">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="hover:text-[#f9bc60]"
                  >
                    {user.name || "Без имени"}
                  </Link>
                </h2>
                {user.role === "ADMIN" ? (
                  <Badge className="text-[0.6rem] uppercase">Админ</Badge>
                ) : null}
                {user.email &&
                user.emailVerified === false &&
                user.role !== "ADMIN" ? (
                  <Badge
                    variant="outline"
                    className="border-amber-500/50 text-[0.6rem] text-amber-200/95"
                  >
                    Почта не подтверждена
                  </Badge>
                ) : null}
                {linkCount > 0 ? (
                  <Badge
                    variant="outline"
                    className="border-[#f9bc60]/45 text-[0.6rem] text-[#f9bc60]"
                  >
                    Связи: {linkCount}
                  </Badge>
                ) : null}
              </div>
              <p className="mt-0.5 break-all text-xs text-[#abd1c6]/85">
                {user.email || "Email не указан"}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:items-end">
              <Link
                href={`/admin/users/${user.id}`}
                className={adminCtaButtonClass}
              >
                Открыть
              </Link>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full shrink-0 text-xs text-[#abd1c6]/80 hover:text-[#f9bc60] sm:w-auto"
              >
                <Link
                  href={`/profile/${user.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-1"
                >
                  Профиль
                  <LucideIcons.ExternalLink className="h-3 w-3 opacity-80" />
                </Link>
              </Button>
            </div>
          </div>

          <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#abd1c6]/85">
            <div>
              <dt className="inline text-[#abd1c6]/55">Регистрация: </dt>
              <dd className="inline font-medium text-[#fffffe]">
                {formatDateShort(user.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="inline text-[#abd1c6]/55">Последний визит: </dt>
              <dd className="inline font-medium text-[#fffffe]">
                {user.lastSeen ? formatDateTime(user.lastSeen) : "—"}
              </dd>
            </div>
            <div>
              <dt className="inline text-[#abd1c6]/55">Заявки: </dt>
              <dd className="inline font-medium tabular-nums">
                <span className="text-[#f9bc60]">{approved}</span>
                <span className="text-[#abd1c6]/50"> одобр. / </span>
                <span className="text-[#94a1b2]">{rejected}</span>
                <span className="text-[#abd1c6]/50"> откл.</span>
              </dd>
            </div>
          </dl>

          {linkCount > 0 && user.links ? (
            <details className="mt-2 rounded-lg border border-[#f9bc60]/25 bg-[#f9bc60]/5 px-3 py-2 text-xs">
              <summary className="cursor-pointer font-medium text-[#f9bc60]">
                Связанные аккаунты ({linkCount})
              </summary>
              <div className="mt-2 space-y-1.5 text-[#abd1c6]/90">
                {paymentLinks > 0 ? (
                  <p>
                    <span className="text-[#fffffe]/80">По реквизитам:</span>{" "}
                    {renderUserLinks(user.links.samePayment)}
                  </p>
                ) : null}
                {ipLinks > 0 ? (
                  <p>
                    <span className="text-[#fffffe]/80">По IP:</span>{" "}
                    {renderUserLinks(user.links.sameIp)}
                  </p>
                ) : null}
              </div>
            </details>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 border-t border-[#abd1c6]/10 pt-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="justify-center text-[#abd1c6] hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
          onClick={() => setShowResetPassword(true)}
        >
          <LucideIcons.Lock className="h-3.5 w-3.5" />
          Сбросить пароль
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="justify-center text-red-400 hover:bg-red-500/10 hover:text-red-300"
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
              <LucideIcons.Loader2 className="h-3.5 w-3.5 animate-spin" />
              Удаление…
            </>
          ) : (
            <>
              <LucideIcons.Trash2 className="h-3.5 w-3.5" />
              Удалить
            </>
          )}
        </Button>
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
    </article>
  );
}

function renderUserLinks(
  list: { id: string; email: string | null; name: string | null }[],
) {
  const shown = list.slice(0, 5);
  const rest = list.length - shown.length;
  return (
    <>
      {shown.map((u, i) => (
        <span key={u.id}>
          {i > 0 ? ", " : null}
          <Link
            href={`/admin/users/${u.id}`}
            className="font-medium text-[#abd1c6] underline decoration-[#abd1c6]/40 underline-offset-2 hover:text-[#f9bc60]"
          >
            {u.email ?? u.name ?? u.id.slice(0, 8)}
          </Link>
        </span>
      ))}
      {rest > 0 ? <span className="text-[#94a1b2]"> +{rest}</span> : null}
    </>
  );
}
