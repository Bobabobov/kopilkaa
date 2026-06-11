import type { Prisma } from "@prisma/client";

/** Заявка видна как «история» публично (как в GET /api/stories/:id и списке). */
export function publicStoryWhereById(id: string): Prisma.ApplicationWhereInput {
  return {
    id,
    status: "APPROVED",
  };
}
