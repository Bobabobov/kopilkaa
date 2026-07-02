"use client";

import type { ApplicationStatus } from "../types";
import ApplicationPaymentDetails from "./ApplicationPaymentDetails";
import ApplicationAdminComment from "./ApplicationAdminComment";
import ApplicationFooter from "./ApplicationFooter";
import { AdminQuickReplies } from "@/app/admin/_components/AdminQuickReplies";
import type { ApplicationIntegrityAccount } from "@/types/admin";

interface AdminDecisionPanelProps {
  payment: string;
  bankName?: string;
  status: ApplicationStatus;
  editStatus: ApplicationStatus;
  editComment: string;
  adminComment: string | null;
  createdAt: string;
  clientTimezone?: string | null;
  applicationId: string;
  linkedAccounts: ApplicationIntegrityAccount[];
  onCopyError: (message: string) => void;
  onEditStatus: (status: ApplicationStatus) => void;
  onEditComment: (comment: string) => void;
  onQuickApprove: () => void;
  onQuickReject: () => void;
  onSave: () => void;
  onDelete: () => void;
}

/** Панель решения — можно закрепить справа на широком экране. */
export function AdminDecisionPanel({
  payment,
  bankName,
  status,
  editStatus,
  editComment,
  adminComment,
  createdAt,
  clientTimezone,
  applicationId,
  linkedAccounts,
  onCopyError,
  onEditStatus,
  onEditComment,
  onQuickApprove,
  onQuickReject,
  onSave,
  onDelete,
}: AdminDecisionPanelProps) {
  const isPending = status === "PENDING";

  return (
    <div className="rounded-2xl border border-[#f9bc60]/25 bg-gradient-to-br from-[#004643]/95 to-[#001e1d]/95 p-3 sm:p-4 lg:p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)] min-w-0">
      <h2 className="text-base sm:text-lg font-bold text-[#fffffe] mb-4">
        Решение
      </h2>

      <div className="mb-4">
        <ApplicationPaymentDetails
          payment={payment}
          bankName={bankName}
          onCopyError={onCopyError}
          mode="details"
        />
      </div>

      {isPending && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={onQuickApprove}
            className="flex-1 min-w-[120px] min-h-[42px] px-3 py-2 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-xl font-bold text-sm transition-all"
          >
            Одобрить
          </button>
          <button
            type="button"
            onClick={onQuickReject}
            className="flex-1 min-w-[120px] min-h-[42px] px-3 py-2 bg-gradient-to-r from-[#e16162] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white rounded-xl font-bold text-sm transition-all"
          >
            Отказать
          </button>
        </div>
      )}

      {adminComment ? (
        <div className="mb-4">
          <ApplicationAdminComment comment={adminComment} />
        </div>
      ) : null}

      <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
        <div>
          <label className="block text-xs font-bold text-[#abd1c6] mb-1.5">
            Статус
          </label>
          <select
            className="w-full px-3 py-2 bg-transparent border border-white/10 rounded-xl text-[#fffffe] text-sm outline-none focus:ring-2 focus:ring-[#f9bc60]/40"
            value={editStatus}
            onChange={(e) => onEditStatus(e.target.value as ApplicationStatus)}
          >
            <option value="PENDING">В обработке</option>
            <option value="APPROVED">Одобрено</option>
            <option value="REJECTED">Отказано</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#abd1c6] mb-1.5">
            Комментарий для автора
          </label>
          <textarea
            className="w-full px-3 py-2 bg-transparent border border-white/10 rounded-xl text-[#fffffe] placeholder:text-[#abd1c6]/50 min-h-[80px] resize-none text-sm outline-none focus:ring-2 focus:ring-[#f9bc60]/40"
            value={editComment}
            onChange={(e) => onEditComment(e.target.value)}
            placeholder="Причина решения…"
          />
          <AdminQuickReplies
            mode="insert"
            linkedAccounts={linkedAccounts}
            onInsert={onEditComment}
            className="mt-2"
          />
        </div>

        <button
          type="button"
          onClick={onSave}
          className="w-full px-4 py-2.5 bg-[#f9bc60] hover:bg-[#e8a545] text-[#0f2d2a] rounded-xl font-bold text-sm transition-colors"
        >
          Сохранить
        </button>
      </div>

      <ApplicationFooter
        createdAt={createdAt}
        clientTimezone={clientTimezone}
        status={status}
        applicationId={applicationId}
        onDelete={onDelete}
      />
    </div>
  );
}
