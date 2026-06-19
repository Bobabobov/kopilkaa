import { prisma } from "@/lib/db";
import { formatTimeAgo } from "@/lib/time";
import {
  resolveApplicationLinkedAccounts,
  shouldResolveLinkedAccounts,
} from "@/lib/admin/resolveApplicationLinkedAccounts";
import type { StatusNotificationPayload } from "@/lib/notifications/userNotificationTypes";
import type { StatusNotificationType } from "@/lib/notifications/userNotificationTypes";

type UpsertStatusNotificationInput = {
  userId: string;
  type: StatusNotificationType;
  entityId: string;
  status: "APPROVED" | "REJECTED";
  title: string;
  message: string;
  adminComment?: string | null;
  payload?: StatusNotificationPayload;
};

export async function upsertStatusUserNotification(
  input: UpsertStatusNotificationInput,
): Promise<void> {
  const payloadJson = input.payload ? JSON.stringify(input.payload) : null;

  await prisma.userNotification.upsert({
    where: {
      userId_type_entityId: {
        userId: input.userId,
        type: input.type,
        entityId: input.entityId,
      },
    },
    create: {
      userId: input.userId,
      type: input.type,
      entityId: input.entityId,
      status: input.status,
      title: input.title,
      message: input.message,
      adminComment: input.adminComment ?? null,
      payload: payloadJson,
      modalDismissedAt: null,
    },
    update: {
      status: input.status,
      title: input.title,
      message: input.message,
      adminComment: input.adminComment ?? null,
      payload: payloadJson,
      modalDismissedAt: null,
      updatedAt: new Date(),
    },
  });
}

export async function removeStatusUserNotification(
  userId: string,
  type: StatusNotificationType,
  entityId: string,
): Promise<void> {
  await prisma.userNotification.deleteMany({
    where: { userId, type, entityId },
  });
}

export async function dismissUserNotificationModal(
  userId: string,
  notificationId: string,
): Promise<boolean> {
  const result = await prisma.userNotification.updateMany({
    where: { id: notificationId, userId },
    data: { modalDismissedAt: new Date() },
  });
  return result.count > 0;
}

export async function syncApplicationStatusNotification(params: {
  userId: string;
  applicationId: string;
  title: string;
  status: "APPROVED" | "REJECTED" | "PENDING";
  adminComment?: string | null;
}): Promise<void> {
  if (params.status === "PENDING") {
    await removeStatusUserNotification(
      params.userId,
      "application_status",
      params.applicationId,
    );
    return;
  }

  const isApproved = params.status === "APPROVED";
  const displayTitle = isApproved ? "Заявка одобрена" : "Заявка отклонена";
  const displayMessage = isApproved
    ? `✅ Ваша заявка «${params.title || "Без названия"}» была одобрена.`
    : `❌ Ваша заявка «${params.title || "Без названия"}» была отклонена.`;

  let payload: StatusNotificationPayload | undefined;

  if (
    params.status === "REJECTED" &&
    shouldResolveLinkedAccounts(params.adminComment)
  ) {
    const linkedAccounts = await resolveApplicationLinkedAccounts(
      params.applicationId,
    );
    if (linkedAccounts.length > 0) {
      payload = { linkedAccounts, applicationId: params.applicationId };
    }
  }

  await upsertStatusUserNotification({
    userId: params.userId,
    type: "application_status",
    entityId: params.applicationId,
    status: params.status,
    title: displayTitle,
    message: displayMessage,
    adminComment: params.adminComment ?? null,
    payload,
  });
}

export async function syncWithdrawalStatusNotification(params: {
  userId: string;
  withdrawalId: string;
  amountBonuses: number;
  status: "APPROVED" | "REJECTED";
  adminComment?: string | null;
}): Promise<void> {
  const isApproved = params.status === "APPROVED";

  await upsertStatusUserNotification({
    userId: params.userId,
    type: "withdrawal_status",
    entityId: params.withdrawalId,
    status: params.status,
    title: isApproved ? "Выплата одобрена" : "Выплата отклонена",
    message: isApproved
      ? `✅ Ваша заявка на выплату ${params.amountBonuses} бонусов была одобрена.`
      : `❌ Ваша заявка на выплату ${params.amountBonuses} бонусов была отклонена.`,
    adminComment: params.adminComment ?? null,
    payload: { withdrawalId: params.withdrawalId },
  });
}

export async function syncGoodDeedStatusNotification(params: {
  userId: string;
  submissionId: string;
  taskTitle: string;
  status: "APPROVED" | "REJECTED";
  adminComment?: string | null;
}): Promise<void> {
  const isApproved = params.status === "APPROVED";

  await upsertStatusUserNotification({
    userId: params.userId,
    type: "good_deed_submission_status",
    entityId: params.submissionId,
    status: params.status,
    title: isApproved ? "Доброе дело подтверждено" : "Доброе дело отклонено",
    message: isApproved
      ? `✅ Ваш отчёт по заданию «${params.taskTitle}» подтвержден.`
      : `❌ Ваш отчёт по заданию «${params.taskTitle}» отклонен.`,
    adminComment: params.adminComment ?? null,
    payload: { goodDeedSubmissionId: params.submissionId },
  });
}

export async function fetchUserStatusNotifications(userId: string) {
  const rows = await prisma.userNotification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return rows.map((row) => ({
    ...row,
    timestamp: formatTimeAgo(row.updatedAt),
  }));
}

export async function fetchPendingStatusModalRow(userId: string) {
  return prisma.userNotification.findFirst({
    where: { userId, modalDismissedAt: null },
    orderBy: { createdAt: "desc" },
  });
}
