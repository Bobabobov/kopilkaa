import type { ApplicationCategory } from "@prisma/client";

export const APPLICATION_CATEGORY_ORDER: ApplicationCategory[] = [
  "FOOD_DRINKS",
  "HOUSEHOLD_ESSENTIALS",
  "TRANSPORT_COMMS",
  "SMALL_GIFT",
  "EVERYDAY_SUPPORT",
];

export type ApplicationCategoryConfig = {
  id: ApplicationCategory;
  title: string;
  description: string;
  /** Что приложить к заявке (до рассмотрения) */
  proofBeforeTitle: string;
  proofBeforeLines: string[];
  /** Отчёт после одобрения предыдущей заявки */
  reportSlot1: string;
  reportSlot2: string;
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
    reportSlot1: "Фото купленных продуктов / перекуса или упаковки после покупки.",
    reportSlot2:
      "Чек из магазина или скрин оплаты из банка с суммой и временем.",
  },
  HOUSEHOLD_ESSENTIALS: {
    id: "HOUSEHOLD_ESSENTIALS",
    title: "Небольшие бытовые расходы",
    description: "Базовые вещи первой необходимости.",
    proofBeforeTitle: "Что должно быть видно на фото или скринах",
    proofBeforeLines: [
      "Фото того, что нужно купить или заменить (мелочь для дома), или скрин карточки товара с ценой.",
    ],
    reportSlot1: "Фото купленной вещи / упаковки после покупки.",
    reportSlot2: "Чек или скрин перевода/оплаты.",
  },
  TRANSPORT_COMMS: {
    id: "TRANSPORT_COMMS",
    title: "Проезд, связь и мелкие расходы",
    description: "Транспорт, связь, интернет и мелкие траты.",
    proofBeforeTitle: "Что должно быть видно на фото или скринах",
    proofBeforeLines: [
      "Скрин баланса транспортной карты / приложения оператора / личного кабинета связи: видно, что средств недостаточно или нужно пополнение.",
    ],
    reportSlot1:
      "Скрин после пополнения: баланс проездного, мобильного или интернета.",
    reportSlot2: "Скрин из банка или сервиса, подтверждающий оплату.",
  },
  SMALL_GIFT: {
    id: "SMALL_GIFT",
    title: "Небольшой подарок",
    description: "Небольшой подарок без крупных затрат.",
    proofBeforeTitle: "Что должно быть видно на фото или скринах",
    proofBeforeLines: [
      "Фото или скрин выбранного недорогого подарка (витрина/карточка товара с ценой), без лишних персональных данных других людей.",
    ],
    reportSlot1: "Фото подарка (упаковка/товар) после покупки.",
    reportSlot2: "Чек или скрин оплаты.",
  },
  EVERYDAY_SUPPORT: {
    id: "EVERYDAY_SUPPORT",
    title: "Поддержка в обычной жизненной ситуации",
    description: "Небольшая помощь без обязательств",
    proofBeforeTitle: "Что должно быть видно на фото или скринах",
    proofBeforeLines: [
      "Одно наглядное фото или скрин ситуации «здесь и сейчас» (без лишних персональных данных третьих лиц).",
    ],
    reportSlot1:
      "Фото или скрин, показывающий, на что пошла помощь (результат/чек оплаты по сути ситуации).",
    reportSlot2: "Подтверждение траты: чек, скрин перевода или из банка.",
  },
};

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

/** Минимум фото в отчёте по прошлой одобренной заявке */
export const REPORT_PHOTOS_MIN = 2;
