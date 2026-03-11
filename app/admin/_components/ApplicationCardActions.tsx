// app/admin/components/ApplicationCardActions.tsx
"use client";
import { useState } from "react";
import type { ApplicationStatus } from "../types";
import type { ApplicationItem } from "../types";

interface ApplicationCardActionsProps {
  application: ApplicationItem;
  onEdit: (
    id: string,
    status: ApplicationStatus,
    comment: string,
    publishInStories: boolean,
    decreaseTrustOnDecision?: boolean,
  ) => void;
  onQuickApprove: (
    id: string,
    status: ApplicationStatus,
    comment: string,
    decreaseTrustOnDecision?: boolean,
  ) => void;
  onQuickReject: (
    id: string,
    status: ApplicationStatus,
    comment: string,
    decreaseTrustOnDecision?: boolean,
  ) => void;
  onDelete: (id: string, title: string) => void;
  onToggleTrust?: (id: string, next: boolean) => void;
}

export default function ApplicationCardActions({
  application: it,
  onEdit,
  onQuickApprove,
  onQuickReject,
  onDelete,
  onToggleTrust,
}: ApplicationCardActionsProps) {
  const [decreaseOnDecision, setDecreaseOnDecision] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full min-w-0">
      {/* Кнопки действий */}
      <div className="flex flex-wrap gap-2 w-full min-w-0">
        <button
          className="group min-h-[42px] px-3 py-2 sm:py-2 rounded-xl transition-all duration-200 font-bold shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm border border-white/10 bg-white/5 text-[#abd1c6] hover:text-[#fffffe] hover:bg-white/10 hover:border-[#f9bc60]/30 touch-manipulation"
          onClick={() =>
            onEdit(
              it.id,
              it.status,
              it.adminComment || "",
              it.publishInStories,
              it.trustDecreasedAtDecision,
            )
          }
        >
          <svg
            className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
          <span className="hidden sm:inline">Изменить</span>
        </button>

        <button
          className="group min-h-[42px] px-3 py-2 sm:py-2 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-xl transition-all duration-200 font-bold shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm touch-manipulation"
          onClick={() => {
            onQuickApprove(
              it.id,
              "APPROVED",
              it.adminComment || "",
              decreaseOnDecision,
            );
            setDecreaseOnDecision(false);
          }}
        >
          <svg
            className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="hidden sm:inline">Одобрить</span>
        </button>

        <button
          className="group min-h-[42px] px-3 py-2 sm:py-2 bg-gradient-to-r from-[#e16162] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white rounded-xl transition-all duration-200 font-bold shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm touch-manipulation"
          onClick={() => {
            onQuickReject(
              it.id,
              "REJECTED",
              it.adminComment || "",
              decreaseOnDecision,
            );
            setDecreaseOnDecision(false);
          }}
        >
          <svg
            className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="hidden sm:inline">Отказать</span>
        </button>

        {typeof onToggleTrust === "function" && (
          <button
            type="button"
            onClick={() => onToggleTrust(it.id, !it.countTowardsTrust)}
            className={[
              "min-h-[42px] px-3 py-2 sm:py-2 rounded-xl border text-xs font-semibold transition-all duration-200 touch-manipulation",
              "flex items-center justify-center gap-2",
              it.countTowardsTrust
                ? "bg-[#10B981]/12 text-[#fffffe] border-[#10B981]/35 hover:border-[#10B981]/55"
                : "bg-white/5 text-[#abd1c6] border-white/10 hover:border-[#f9bc60]/30 hover:bg-white/10",
            ].join(" ")}
            title="Учитывать ли эту заявку при подсчёте доверия"
          >
            <span className="relative inline-flex h-5 w-9 items-center rounded-full border border-white/10 bg-white/10">
              <span
                className={[
                  "absolute h-4 w-4 rounded-full transition-transform",
                  it.countTowardsTrust
                    ? "translate-x-[18px] bg-[#10B981]"
                    : "translate-x-[2px] bg-[#abd1c6]/60",
                ].join(" ")}
              />
            </span>
            <span className="whitespace-nowrap">Засчитывать для доверия</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setDecreaseOnDecision((v) => !v)}
          className={[
            "min-h-[42px] px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 touch-manipulation",
            "flex items-center justify-center gap-2",
            decreaseOnDecision
              ? "bg-[#e16162]/12 text-[#fffffe] border-[#e16162]/35 hover:border-[#e16162]/55"
              : "bg-white/5 text-[#abd1c6] border-white/10 hover:border-[#e16162]/30 hover:bg-white/10",
          ].join(" ")}
          title="При решении по заявке понизить уровень доверия на 1"
        >
          <span className="relative inline-flex h-5 w-9 items-center rounded-full border border-white/10 bg-white/10">
            <span
              className={[
                "absolute h-4 w-4 rounded-full transition-transform",
                decreaseOnDecision
                  ? "translate-x-[18px] bg-[#e16162]"
                  : "translate-x-[2px] bg-[#abd1c6]/60",
              ].join(" ")}
            />
          </span>
          <span className="whitespace-nowrap">Понизить уровень на 1</span>
        </button>

        <button
          className="group min-h-[42px] px-3 py-2 sm:py-2 rounded-xl transition-all duration-200 font-bold shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm border border-[#e16162]/35 bg-[#e16162]/10 text-[#e16162] hover:bg-[#e16162]/15 hover:border-[#e16162]/55 touch-manipulation"
          onClick={() => onDelete(it.id, it.title)}
          title="Удалить заявку"
        >
          <svg
            className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span className="hidden sm:inline">Удалить</span>
        </button>
      </div>
    </div>
  );
}
