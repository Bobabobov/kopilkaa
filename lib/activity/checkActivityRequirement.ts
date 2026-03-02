// lib/activity/checkActivityRequirement.ts
import { prisma } from "@/lib/db";

export type ActivityRequirement =
  | { type: "LIKE_STORY"; message: string }
  | null; // null = все требования выполнены или не требуется

/**
 * Получает список всех возможных требований активности (только лайк истории)
 */
export async function getAllPossibleRequirements(
  _userId: string,
): Promise<ActivityRequirement[]> {
  return [
    {
      type: "LIKE_STORY",
      message:
        "Для каждой 3-й и последующей заявки поставьте лайк любой истории.",
    },
  ];
}

/**
 * Получает список всех доступных требований активности (только невыполненные)
 */
export async function getAllAvailableRequirements(
  userId: string,
  lastApplicationAt: Date | null,
): Promise<ActivityRequirement[]> {
  const allPossible = await getAllPossibleRequirements(userId);

  // Фильтруем только невыполненные требования
  const availableRequirements: ActivityRequirement[] = [];

  for (const req of allPossible) {
    const isMet = await isActivityRequirementMet(
      userId,
      req,
      lastApplicationAt,
    );
    if (!isMet) {
      availableRequirements.push(req);
    }
  }

  return availableRequirements;
}

/**
 * Проверяет требование активности для создания заявки (для 3+ одобренных заявок)
 * @param userId ID пользователя
 * @param effectiveApprovedApplications Количество эффективных одобренных заявок
 * @returns Требование активности или null (если не требуется/выполнено)
 */
export async function checkActivityRequirement(
  userId: string,
  effectiveApprovedApplications: number,
  lastApplicationAt: Date | null,
): Promise<ActivityRequirement> {
  // Требование только для 3+ одобренных заявок
  if (effectiveApprovedApplications < 3) {
    return null;
  }

  const availableRequirements = await getAllAvailableRequirements(
    userId,
    lastApplicationAt,
  );

  // Если все варианты исчерпаны - разрешаем заявку
  if (availableRequirements.length === 0) {
    return null;
  }

  // Рандомно выбираем одно требование из доступных
  const randomIndex = Math.floor(Math.random() * availableRequirements.length);
  return availableRequirements[randomIndex];
}

/**
 * Проверяет, выполнено ли конкретное требование активности
 */
export async function isActivityRequirementMet(
  userId: string,
  requirement: ActivityRequirement,
  lastApplicationAt: Date | null,
): Promise<boolean> {
  if (!requirement) return true;
  const since = lastApplicationAt ?? new Date(0);

  if (requirement.type === "LIKE_STORY") {
    const userLikesCount = await prisma.storyLike.count({
      where: { userId, createdAt: { gt: since } },
    });
    return userLikesCount > 0;
  }

  return true;
}
