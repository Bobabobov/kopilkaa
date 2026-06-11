"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { parseAdminComment } from "@/components/notifications/parseAdminComment";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import type { ApplicationIntegrityAccount } from "@/types/admin";

export interface ApplicationStatusModalProps {
  title: string;
  message: string;
  timeAgo: string;
  adminComment: string;
  statusLine: string;
  status?: "APPROVED" | "REJECTED";
  isApproved: boolean;
  isRejected: boolean;
  actionButtonLabel: string;
  showActionButton: boolean;
  linkedAccounts?: ApplicationIntegrityAccount[];
  onClose: () => void;
  onAction: () => void;
}

function LinkedAccountChip({
  account,
}: {
  account: ApplicationIntegrityAccount;
}) {
  const avatarUrl = resolveAvatarUrl(account.userAvatar);

  return (
    <Link
      href={`/profile/${account.userId}`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#001e1d]/60 px-2.5 py-1.5 text-xs font-medium text-[#fffffe] transition-colors hover:border-[#f9bc60]/40 hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
    >
      <img
        src={avatarUrl}
        alt=""
        className="h-5 w-5 rounded-full object-cover ring-1 ring-white/15"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = DEFAULT_AVATAR;
        }}
      />
      <span className="max-w-[160px] truncate">{account.userLabel}</span>
    </Link>
  );
}

function StatusVisual({
  isApproved,
  isRejected,
}: {
  isApproved: boolean;
  isRejected: boolean;
}) {
  if (isApproved) {
    return (
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-[#10B981]/25 blur-md" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#10B981]/40 bg-gradient-to-br from-[#10B981]/25 to-[#004643]/80 shadow-[0_0_24px_rgba(16,185,129,0.25)]">
          <LucideIcons.CheckCircle className="h-7 w-7 text-[#6ee7b7]" />
        </div>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-[#e16162]/20 blur-md" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e16162]/40 bg-gradient-to-br from-[#e16162]/20 to-[#3a1718]/60 shadow-[0_0_24px_rgba(225,97,98,0.2)]">
          <LucideIcons.XCircle className="h-7 w-7 text-[#fca5a5]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#f9bc60]/30 bg-[#f9bc60]/10">
      <LucideIcons.Bell className="h-7 w-7 text-[#f9bc60]" />
    </div>
  );
}

export function ApplicationStatusModal({
  title,
  message,
  timeAgo,
  adminComment,
  statusLine,
  status,
  isApproved,
  isRejected,
  actionButtonLabel,
  showActionButton,
  linkedAccounts: linkedAccountsFromApi,
  onClose,
  onAction,
}: ApplicationStatusModalProps) {
  const { body: commentBody, linkedAccounts: linkedAccountNames } =
    parseAdminComment(adminComment);

  const resolvedLinkedAccounts =
    linkedAccountsFromApi && linkedAccountsFromApi.length > 0
      ? linkedAccountsFromApi
      : null;
  const hasLinkedAccountNames =
    !resolvedLinkedAccounts && linkedAccountNames.length > 0;

  const accentBar = isApproved
    ? "from-[#10B981] via-[#6ee7b7] to-[#f9bc60]"
    : isRejected
      ? "from-[#e16162] via-[#f87171] to-[#7f1d1d]"
      : "from-[#f9bc60] via-[#abd1c6] to-[#004643]";

  const statusBadgeClass = isApproved
    ? "border-[#10B981]/35 bg-[#10B981]/12 text-[#a7f3d0]"
    : isRejected
      ? "border-[#e16162]/35 bg-[#e16162]/12 text-[#fecaca]"
      : "border-white/10 bg-white/5 text-[#abd1c6]";

  const messageCardClass = isApproved
    ? "border-[#10B981]/20 bg-[#10B981]/[0.07]"
    : isRejected
      ? "border-[#e16162]/20 bg-[#e16162]/[0.07]"
      : "border-white/10 bg-white/[0.04]";

  return (
    <div className="relative overflow-hidden">
      <div
        className={`h-1 w-full bg-gradient-to-r ${accentBar}`}
        aria-hidden
      />

      {isApproved && (
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#10B981]/10 blur-3xl"
          aria-hidden
        />
      )}
      {isRejected && (
        <div
          className="pointer-events-none absolute -left-12 -top-10 h-40 w-40 rounded-full bg-[#e16162]/10 blur-3xl"
          aria-hidden
        />
      )}

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <StatusVisual isApproved={isApproved} isRejected={isRejected} />

          <div className="min-w-0 flex-1 pt-0.5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#abd1c6]/70">
                {statusLine}
              </span>
              {status && (
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusBadgeClass}`}
                >
                  {status === "APPROVED" ? "Одобрено" : "Отклонено"}
                </span>
              )}
            </div>

            <h2
              id="application-status-modal-title"
              className="text-xl font-black leading-tight text-[#fffffe] sm:text-2xl"
            >
              {title}
            </h2>

            {timeAgo ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#abd1c6]/80">
                <LucideIcons.Clock className="h-3.5 w-3.5 shrink-0" />
                {timeAgo}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#abd1c6] transition-colors hover:border-white/20 hover:bg-white/10 hover:text-[#fffffe]"
            aria-label="Закрыть"
          >
            <LucideIcons.X className="h-4 w-4" />
          </button>
        </div>

        {message ? (
          <div
            className={`mt-5 rounded-2xl border px-4 py-3.5 ${messageCardClass}`}
          >
            <p className="text-sm leading-relaxed text-[#e9f4ef]">{message}</p>
          </div>
        ) : null}

        {adminComment ? (
          <div
            className={`mt-3 rounded-2xl border p-4 ${
              isRejected
                ? "border-[#e16162]/25 bg-[#2a1214]/40"
                : isApproved
                  ? "border-[#10B981]/20 bg-[#0a2e28]/50"
                  : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <p
              className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                isRejected
                  ? "text-[#fca5a5]"
                  : isApproved
                    ? "text-[#6ee7b7]"
                    : "text-[#abd1c6]"
              }`}
            >
              Комментарий администратора
            </p>

            {commentBody ? (
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-[#e9f4ef]">
                {commentBody}
              </p>
            ) : null}

            {resolvedLinkedAccounts || hasLinkedAccountNames ? (
              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="text-xs font-semibold text-[#abd1c6]/90">
                  Связанные аккаунты
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {resolvedLinkedAccounts
                    ? resolvedLinkedAccounts.map((account) => (
                        <li key={account.userId}>
                          <LinkedAccountChip account={account} />
                        </li>
                      ))
                    : linkedAccountNames.map((name) => (
                        <li
                          key={name}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#001e1d]/60 px-2.5 py-1.5 text-xs font-medium text-[#fffffe]"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e16162]/15 text-[10px] text-[#fca5a5]">
                            <LucideIcons.User className="h-3 w-3" />
                          </span>
                          {name}
                        </li>
                      ))}
                </ul>
              </div>
            ) : !commentBody ? (
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-[#e9f4ef]">
                {adminComment}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-[#abd1c6] transition-colors hover:border-white/20 hover:bg-white/10 hover:text-[#fffffe]"
          >
            Понятно
          </button>
          {showActionButton ? (
            <button
              type="button"
              onClick={onAction}
              className={`min-h-[44px] rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${
                isApproved
                  ? "bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] shadow-[#f9bc60]/25 hover:shadow-[#f9bc60]/35"
                  : isRejected
                    ? "bg-gradient-to-r from-[#e16162] to-[#dc2626] text-white shadow-[#e16162]/20 hover:shadow-[#e16162]/30"
                    : "bg-[#abd1c6] text-[#001e1d]"
              }`}
            >
              {actionButtonLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
