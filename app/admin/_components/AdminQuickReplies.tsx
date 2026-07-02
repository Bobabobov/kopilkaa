"use client";

import {
  APPLICATION_QUICK_APPROVE_REPLIES,
  APPLICATION_QUICK_REJECT_REPLIES,
  REJECT_MULTI_ACCOUNT_REPLY_ID,
  type ApplicationQuickReply,
} from "@/lib/admin/applicationQuickReplies";
import { buildMultiAccountRejectComment } from "@/lib/admin/buildMultiAccountRejectComment";
import type { ApplicationIntegrityAccount } from "@/types/admin";

interface AdminQuickRepliesProps {
  mode: "apply" | "insert";
  linkedAccounts?: ApplicationIntegrityAccount[];
  onApprove?: (comment: string) => void;
  onReject?: (comment: string) => void;
  onInsert?: (comment: string) => void;
  className?: string;
}

function resolveReplyText(
  reply: ApplicationQuickReply,
  linkedAccounts: ApplicationIntegrityAccount[],
): string {
  if (reply.id === REJECT_MULTI_ACCOUNT_REPLY_ID) {
    return buildMultiAccountRejectComment(linkedAccounts);
  }
  return reply.text;
}

function ReplyGroup({
  title,
  tone,
  replies,
  linkedAccounts,
  onPick,
}: {
  title: string;
  tone: "approve" | "reject";
  replies: ApplicationQuickReply[];
  linkedAccounts: ApplicationIntegrityAccount[];
  onPick: (text: string) => void;
}) {
  if (replies.length === 0) return null;

  const toneClass =
    tone === "approve"
      ? "border-[#10B981]/25 bg-[#10B981]/8 hover:border-[#10B981]/45 hover:bg-[#10B981]/14 text-[#a6f4d5]"
      : "border-[#e16162]/25 bg-[#e16162]/8 hover:border-[#e16162]/45 hover:bg-[#e16162]/14 text-[#ffc9c9]";

  return (
    <div>
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[#abd1c6]/75">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {replies.map((reply) => {
          const fullText = resolveReplyText(reply, linkedAccounts);
          return (
            <button
              key={reply.id}
              type="button"
              title={fullText}
              onClick={() => onPick(fullText)}
              className={`rounded-lg border px-2.5 py-1.5 text-left text-xs font-semibold transition-colors touch-manipulation ${toneClass}`}
            >
              {reply.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AdminQuickReplies({
  mode,
  linkedAccounts = [],
  onApprove,
  onReject,
  onInsert,
  className = "",
}: AdminQuickRepliesProps) {
  const handlePick = (text: string, action: "approve" | "reject") => {
    if (mode === "insert") {
      onInsert?.(text);
      return;
    }

    if (action === "approve") onApprove?.(text);
    else onReject?.(text);
  };

  return (
    <div
      className={`rounded-xl border border-white/10 bg-[#001e1d]/40 p-3 space-y-3 ${className}`}
    >
      <p className="text-xs font-bold text-[#f9bc60]">Быстрые ответы</p>

      <ReplyGroup
        title="Шаблоны одобрения"
        tone="approve"
        replies={APPLICATION_QUICK_APPROVE_REPLIES}
        linkedAccounts={linkedAccounts}
        onPick={(text) => handlePick(text, "approve")}
      />

      <ReplyGroup
        title="Шаблоны отказа"
        tone="reject"
        replies={APPLICATION_QUICK_REJECT_REPLIES}
        linkedAccounts={linkedAccounts}
        onPick={(text) => handlePick(text, "reject")}
      />
    </div>
  );
}
