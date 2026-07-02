import type { ApplicationCategory } from "@prisma/client";

/** Категории, показываемые в форме заявки (без архивных значений из БД). */
export const APPLICATION_CATEGORY_ORDER = [
  "FOOD_DRINKS",
  "HOUSEHOLD_ESSENTIALS",
  "TRANSPORT_COMMS",
  "SMALL_GIFT",
  "EVERYDAY_SUPPORT",
] as const satisfies readonly ApplicationCategory[];

export type ApplicationPickerCategory =
  (typeof APPLICATION_CATEGORY_ORDER)[number];

export type ApplicationCategoryConfig = {
  id: ApplicationCategory;
  title: string;
  description: string;
  /** Что приложить к заявке (до рассмотрения) */
  proofBeforeTitle: string;
  proofBeforeLines: string[];
};

const CONFIG: Record<ApplicationCategory, ApplicationCategoryConfig> = {
  FOOD_DRINKS: {
    id: "FOOD_DRINKS",
    title: "Еда и напитки",
    description: "Покупка продуктов, перекус, вода, чай, кофе.",
    proofBeforeTitle: "Что должно быть видно на фото или скринах",
    proofBeforeLines: [
      "Фото корзины в приложении магазина или списка покупок с суммой.",
      "Или фото того, что дома не хватает (холодильник/стол) — чтобы было понятно, что запрос про еду сейчас.",
    ],
  },
  HOUSEHOLD_ESSENTIALS: {
    id: "HOUSEHOLD_ESSENTIALS",
    title: "Небольшие бытовые расходы",
    description: "Базовые вещи первой необходимости.",
    proofBeforeTitle: "Что должно быть видно на фото или скринах",
    proofBeforeLines: [
      "Фото того, что нужно купить или заменить (мелочь для дома), или скрин карточки товара с ценой.",
    ],
  },
  TRANSPORT_COMMS: {
    id: "TRANSPORT_COMMS",
    title: "Проезд, связь и мелкие расходы",
    description: "Транспорт, связь, интернет и мелкие траты.",
    proofBeforeTitle: "Что должно быть видно на фото или скринах",
    proofBeforeLines: [
      "Скрин баланса транспортной карты / приложения оператора / личного кабинета связи: видно, что средств недостаточно или нужно пополнение.",
    ],
  },
  SMALL_GIFT: {
    id: "SMALL_GIFT",
    title: "Небольшой подарок",
    description: "Небольшой подарок без крупных затрат.",
    proofBeforeTitle: "Что должно быть видно на фото или скринах",
    proofBeforeLines: [
      "Фото или скрин выбранного недорогого подарка (витрина/карточка товара с ценой), без лишних персональных данных других людей.",
    ],
  },
  EVERYDAY_SUPPORT: {
    id: "EVERYDAY_SUPPORT",
    title: "Поддержка в обычной жизненной ситуации",
    description: "Живой рассказ о вашей мелкой бытовой хотелке",
    proofBeforeTitle: "Что должно быть видно на фото или скринах",
    proofBeforeLines: [
      "Одно наглядное фото или скрин ситуации «здесь и сейчас» (без лишних персональных данных третьих лиц).",
    ],
  },
  /** Только чтение старых заявок; в форме не предлагается */
  GAME_OR_SERVICE: {
    id: "GAME_OR_SERVICE",
    title: "Игра или сервис (архив)",
    description: "Устаревшая категория в базе данных.",
    proofBeforeTitle: "Доказательства до рассмотрения",
    proofBeforeLines: ["Категория не используется для новых заявок."],
  },
};

/** Категория по умолчанию для новых заявок (выбор категории в форме отключён). */
export const DEFAULT_APPLICATION_CATEGORY =
  "EVERYDAY_SUPPORT" as const satisfies ApplicationCategory;

export function getApplicationCategoryConfig(
  id: ApplicationCategory,
): ApplicationCategoryConfig {
  return CONFIG[id];
}

export function getApplicationCategoryLabel(id: ApplicationCategory): string {
  return CONFIG[id].title;
}

export function isApplicationCategory(value: unknown): value is ApplicationCategory {
  return typeof value === "string" && value in CONFIG;
}

/** Категории, разрешённые при создании новой заявки (без архивных). */
export function isSubmittableApplicationCategory(
  value: ApplicationCategory,
): value is ApplicationPickerCategory {
  return (APPLICATION_CATEGORY_ORDER as readonly ApplicationCategory[]).includes(
    value,
  );
}
