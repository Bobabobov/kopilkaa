import { shouldResolveLinkedAccounts } from "@/lib/admin/resolveApplicationLinkedAccounts";

/** Комментарий явно описывает отказ (шаблоны быстрых ответов). */
export function isRejectAdminComment(
  comment: string | null | undefined,
): boolean {
  if (!comment?.trim()) return false;
  const text = comment.trim();
  if (shouldResolveLinkedAccounts(text)) return true;
  return /заявка\s+отклонена/i.test(text);
}

/** Комментарий явно описывает одобрение. */
export function isApproveAdminComment(
  comment: string | null | undefined,
): boolean {
  if (!comment?.trim()) return false;
  return /заявка\s+одобрена/i.test(comment.trim());
}

/**
 * Согласованный статус для уведомления.
 * БД — источник истины для REJECTED; подмена только при явном рассинхроне APPROVED + текст отказа.
 */
export function resolveApplicationNotificationStatus(
  dbStatus: string,
  adminComment: string | null | undefined,
): "APPROVED" | "REJECTED" {
  if (dbStatus === "REJECTED") {
    return "REJECTED";
  }

  if (
    dbStatus === "APPROVED" &&
    isRejectAdminComment(adminComment) &&
    !isApproveAdminComment(adminComment)
  ) {
    return "REJECTED";
  }

  return "APPROVED";
}
