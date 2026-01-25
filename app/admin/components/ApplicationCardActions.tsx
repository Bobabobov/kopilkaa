// app/admin/components/ApplicationCardActions.tsx
"use client";
import { useState } from "react";
import Badge from "./Badge";
import type { ApplicationStatus } from "../types";
import type { ApplicationItem } from "../types";

interface ApplicationCardActionsProps {
  application: ApplicationItem;
  onEdit: (id: string, status: ApplicationStatus, comment: string) => void;
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 w-full lg:w-auto">
      <Badge status={it.status} />

      {/* Кнопки действий */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <button
          className="group px-3 py-2 bg-[#001e1d]/60 hover:bg-[#001e1d]/80 text-[#abd1c6] hover:text-[#fffffe] rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm border border-[#abd1c6]/20 hover:border-[#f9bc60]/40"
          onClick={() => onEdit(it.id, it.status, it.adminComment || "")}
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
          className="group px-3 py-2 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm"
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
          className="group px-3 py-2 bg-gradient-to-r from-[#e16162] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm"
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
              "px-3 py-2 rounded-lg sm:rounded-xl border text-xs font-semibold transition-all duration-300",
              "flex items-center justify-center gap-2",
              it.countTowardsTrust
                ? "bg-[#10B981]/15 text-[#abd1c6] border-[#10B981]/30 hover:border-[#10B981]/60"
                : "bg-[#001e1d]/60 text-[#abd1c6] border-[#abd1c6]/20 hover:border-[#f9bc60]/40",
            ].join(" ")}
            title="Учитывать ли эту заявку при подсчёте доверия"
          >
            <span
              className={[
                "inline-flex h-3.5 w-3.5 items-center justify-center rounded border",
                it.countTowardsTrust
                  ? "border-[#10B981]/60 bg-[#10B981]/40"
                  : "border-[#abd1c6]/30 bg-transparent",
              ].join(" ")}
            >
              {it.countTowardsTrust ? (
                <span className="block h-2 w-2 rounded bg-[#10B981]" />
              ) : null}
            </span>
            <span>Засчитывать для доверия</span>
          </button>
        )}

        <label className="flex items-center gap-2 text-xs text-[#abd1c6]">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={decreaseOnDecision}
            onChange={(e) => setDecreaseOnDecision(e.target.checked)}
          />
          <span>Понизить уровень на 1</span>
        </label>

        <button
          className="group px-3 py-2 bg-[#001e1d]/60 hover:bg-[#001e1d]/80 text-[#abd1c6] hover:text-[#e16162] rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm border border-[#abd1c6]/20 hover:border-[#e16162]/40"
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
