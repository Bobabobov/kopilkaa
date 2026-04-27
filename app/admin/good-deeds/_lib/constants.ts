import type { ModerationItem } from "./types";

export const STATUS_LABELS: Record<ModerationItem["status"], string> = {
  PENDING: "На проверке",
  APPROVED: "Подтверждено",
  REJECTED: "Отклонено",
};

export const REJECT_TEMPLATES = [
  "Недостаточно доказательств выполнения. Добавьте более подробные фото/видео.",
  "Нужен более подробный рассказ о выполнении задания.",
  "Материалы не соответствуют выбранному заданию текущей недели.",
];
