import type { Prisma } from "@prisma/client";

/**
 * Заявка видна как «история» публично (как в GET /api/stories/:id и списке).
 * Одобренные и конкурсные с флагом публикации в историях.
 */
export function publicStoryWhereById(id: string): Prisma.ApplicationWhereInput {
  return {
    id,
    OR: [{ status: "APPROVED" }, { status: "CONTEST", publishInStories: true }],
  };
}
