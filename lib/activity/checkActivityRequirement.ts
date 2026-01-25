// lib/activity/checkActivityRequirement.ts
import { prisma } from "@/lib/db";

export type ActivityRequirement =
  | { type: "LIKE_STORY"; message: string }
  | { type: "CHANGE_AVATAR"; message: string }
  | { type: "CHANGE_HEADER"; message: string }
  | null; // null = все требования выполнены или не требуется

/**
 * Получает список всех возможных требований активности (всегда проверяем все три)
 */
export async function getAllPossibleRequirements(
  userId: string,
): Promise<ActivityRequirement[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatar: true, headerTheme: true },
  });
  const hasAvatar = !!user?.avatar && user.avatar.trim() !== "";
  const hasHeader = !!user?.headerTheme && user.headerTheme !== "default";

  const allRequirements: ActivityRequirement[] = [
    {
      type: "LIKE_STORY",
      message:
        "Для создания заявки поставьте лайк любой истории, которая вам понравится.",
    },
    {
      type: "CHANGE_AVATAR",
      message:
        "Для создания заявки установите аватар в профиле.",
    },
    {
      type: "CHANGE_HEADER",
      message:
        "Для создания заявки установите обложку профиля.",
    },
  ];

  return allRequirements.filter((req) => {
    if (!req) return false;
    if (req.type === "LIKE_STORY") return true;
    if (req.type === "CHANGE_AVATAR") return !hasAvatar;
    if (req.type === "CHANGE_HEADER") return !hasHeader;
    return false;
  });
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

  switch (requirement.type) {
    case "LIKE_STORY": {
      const userLikesCount = await prisma.storyLike.count({
        where: { userId, createdAt: { gt: since } },
      });
      // Требование выполнено, если пользователь лайкнул хотя бы одну историю
      return userLikesCount > 0;
    }

    case "CHANGE_AVATAR": {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true },
      });
      return user?.avatar !== null && user.avatar.trim() !== "";
    }

    case "CHANGE_HEADER": {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { headerTheme: true },
      });
      return user?.headerTheme !== null && user.headerTheme !== "default";
    }

    default:
      return true;
  }
}
