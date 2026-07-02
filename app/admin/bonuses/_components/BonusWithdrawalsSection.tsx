"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AdminActionButtons,
  AdminPanel,
  AdminSectionLabel,
  AdminStatGrid,
  AdminStatusPill,
  adminCtaButtonClass,
  adminFieldClass,
  adminListRowClass,
  adminListRowPendingClass,
} from "@/app/admin/_components/admin-ui";
import { calculateWithdrawalPayout } from "@/lib/bonusWithdrawals/commission";
import { WithdrawalPayoutBreakdown } from "@/components/profile/WithdrawalPayoutBreakdown";
import type { WithdrawItem } from "./types";

const PROCESSED_VISIBLE = 10;

interface BonusWithdrawalsSectionProps {
  pending: WithdrawItem[];
  processed: WithdrawItem[];
  busyId: string | null;
  commentById: Record<string, string>;
  onCommentChange: (id: string, value: string) => void;
  onPatch: (id: string, action: "approve" | "reject") => void;
  userAvatarSrc: (avatar?: string | null) => string;
}

export function BonusWithdrawalsSection({
  pending,
  processed,
  busyId,
  commentById,
  onCommentChange,
  onPatch,
  userAvatarSrc,
}: BonusWithdrawalsSectionProps) {
  const [showAllProcessed, setShowAllProcessed] = useState(false);
  const visibleProcessed = showAllProcessed
    ? processed
    : processed.slice(0, PROCESSED_VISIBLE);

  return (
    <div className="space-y-6">
      <AdminStatGrid
        columns={3}
        items={[
          {
            label: "На проверке",
            value: pending.length,
            tone: "pending",
            highlight: pending.length > 0,
          },
          {
            label: "Обработано",
            value: processed.length,
          },
          {
            label: "Всего заявок",
            value: pending.length + processed.length,
          },
        ]}
      />

      <AdminSectionLabel accent="gold">
        Очередь ({pending.length})
      </AdminSectionLabel>

      {pending.length === 0 ? (
        <AdminPanel title="Очередь пуста" accent="neutral">
          <p className="text-[#abd1c6]">Нет активных заявок на вывод.</p>
        </AdminPanel>
      ) : (
        <div className="space-y-3">
          {pending.map((item) => {
            const payout = calculateWithdrawalPayout(
              item.amountBonuses,
              item.profileLevel,
            );
            return (
              <article
                key={item.id}
                className={`overflow-hidden ${adminListRowPendingClass}`}
              >
                <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-black text-[#f9bc60]">
                        {item.amountBonuses} бон.
                      </p>
                      <AdminStatusPill tone="pending">На проверке</AdminStatusPill>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-emerald-300">
                      К переводу: {payout.payoutRubles} ₽
                      <span className="ml-2 font-normal text-[#94a1b2]">
                        (комиссия {payout.commissionRubles} ₽)
                      </span>
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-[#abd1c6]/20">
                        <AvatarImage
                          src={userAvatarSrc(item.user.avatar)}
                          alt={item.user.name}
                        />
                        <AvatarFallback className="bg-[#004643] text-xs">
                          {(item.user.name || "?").slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <Link
                        href={`/admin/users/${item.user.id}`}
                        className="text-sm font-medium text-[#fffffe] hover:text-[#f9bc60]"
                      >
                        {item.user.name}
                      </Link>
                    </div>
                    <p className="mt-1 text-xs text-[#94a1b2]">
                      {item.bankName} ·{" "}
                      {new Date(item.createdAt).toLocaleString("ru-RU")}
                    </p>
                  </div>
                  <Link
                    href={`/admin/users/${item.user.id}`}
                    className={adminCtaButtonClass}
                  >
                    Досье
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <details className="border-t-2 border-[#f9bc60]/20 bg-[#001e1d]/40">
                  <summary className="cursor-pointer list-none px-4 py-2.5 text-xs font-bold text-[#f9bc60] hover:bg-[#f9bc60]/8 [&::-webkit-details-marker]:hidden">
                    Решение по заявке
                  </summary>
                  <div className="space-y-4 border-t border-[#abd1c6]/10 px-4 py-4">
                    <div className="rounded-xl border-2 border-[#f9bc60]/30 bg-[#f9bc60]/10 p-3">
                      <p className="text-xs font-bold uppercase text-[#f9bc60]">
                        Телефон СБП
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-[#fffffe]">
                        {item.details}
                      </p>
                    </div>

                    <WithdrawalPayoutBreakdown
                      amountBonuses={item.amountBonuses}
                      profileLevel={item.profileLevel}
                      variant="admin"
                    />

                    <textarea
                      value={commentById[item.id] || ""}
                      onChange={(e) => onCommentChange(item.id, e.target.value)}
                      placeholder="Комментарий при отклонении"
                      rows={2}
                      className={`${adminFieldClass} resize-y`}
                    />

                    <AdminActionButtons
                      className="grid-cols-1 sm:grid-cols-2"
                      disabled={busyId === item.id}
                      approveLabel={`Одобрить — ${payout.payoutRubles} ₽`}
                      rejectLabel="Отклонить"
                      onApprove={() => onPatch(item.id, "approve")}
                      onReject={() => onPatch(item.id, "reject")}
                    />
                  </div>
                </details>
              </article>
            );
          })}
        </div>
      )}

      <AdminSectionLabel accent="emerald">
        Обработанные ({processed.length})
      </AdminSectionLabel>

      {processed.length === 0 ? (
        <AdminPanel title="История пуста" accent="neutral">
          <p className="text-[#abd1c6]">Пока нет обработанных заявок.</p>
        </AdminPanel>
      ) : (
        <>
          <div className="space-y-2">
            {visibleProcessed.map((item) => {
              const payout = calculateWithdrawalPayout(
                item.amountBonuses,
                item.profileLevel,
              );
              return (
                <article key={item.id} className={`p-3 ${adminListRowClass}`}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#fffffe]">
                        {item.amountBonuses} бон. → {payout.payoutRubles} ₽ ·{" "}
                        <Link
                          href={`/admin/users/${item.user.id}`}
                          className="text-[#f9bc60] hover:underline"
                        >
                          {item.user.name}
                        </Link>
                      </p>
                      <p className="text-xs text-[#94a1b2]">
                        {item.bankName} ·{" "}
                        {new Date(item.createdAt).toLocaleString("ru-RU")}
                      </p>
                      {item.adminComment ? (
                        <p className="mt-1 text-xs text-[#abd1c6]">
                          {item.adminComment}
                        </p>
                      ) : null}
                    </div>
                    <AdminStatusPill
                      tone={item.status === "APPROVED" ? "success" : "danger"}
                      className="!normal-case !tracking-normal"
                    >
                      {item.status === "APPROVED" ? "Одобрено" : "Отклонено"}
                    </AdminStatusPill>
                  </div>
                </article>
              );
            })}
          </div>
          {processed.length > PROCESSED_VISIBLE && !showAllProcessed ? (
            <button
              type="button"
              onClick={() => setShowAllProcessed(true)}
              className="w-full rounded-xl border-2 border-[#abd1c6]/20 py-2 text-sm font-medium text-[#abd1c6] hover:border-[#f9bc60]/40 hover:text-[#f9bc60]"
            >
              Показать ещё {processed.length - PROCESSED_VISIBLE}
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}
