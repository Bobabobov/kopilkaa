/** Тип данных формы заявки на рекламу */
export interface AdRequestFormData {
  name: string;
  contact: string;
  telegram: string;
  website: string;
  format: string;
  duration: string;
  message: string;
  imageUrls: string[];
  mobileBannerUrls: string[];
}

export const AD_FORMAT_OPTIONS = [
  { value: "", label: "Выберите формат" },
  { value: "banner", label: "Большой баннер наверху — Договорная цена" },
  { value: "side", label: "Блок сбоку — Договорная цена" },
  { value: "story", label: "Рекламная история — Договорная цена" },
  { value: "tg", label: "Telegram пост — Договорная цена" },
  { value: "other", label: "Не знаю, помогите выбрать" },
] as const;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Валидация формы заявки. Возвращает объект ошибок (пустой, если всё ок). */
export function validateAdRequestForm(
  data: AdRequestFormData,
): Record<string, string> {
  const errors: Record<string, string> = {};
  const email = data.contact.trim();

  if (!data.name.trim()) {
    errors.name = "Пожалуйста, укажите ваше имя";
  }

  if (!email) {
    errors.contact = "Пожалуйста, укажите email";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.contact = "Некорректный email адрес. Пример: your@email.com";
  }

  if (data.website && data.website.trim()) {
    try {
      const url = new URL(data.website.trim());
      if (!url.protocol.match(/^https?:$/)) {
        errors.website = "Ссылка должна начинаться с http:// или https://";
      }
    } catch {
      errors.website = "Введите корректную ссылку. Пример: https://example.com";
    }
  }

  if (!data.format || data.format.trim() === "") {
    errors.format = "Пожалуйста, выберите формат размещения";
  }

  const durationNum = parseInt(data.duration || "0", 10);
  if (!data.duration || !durationNum || durationNum < 1 || durationNum > 365) {
    errors.duration = "Укажите срок размещения от 1 до 365 дней";
  }

  const comment = data.message.trim();
  if (!comment) {
    errors.message = "Пожалуйста, заполните это поле";
  } else if (comment.length > 400) {
    errors.message = "Максимум 400 символов";
  }

  return errors;
}

export function scrollToFirstError(fieldNames: string[]): void {
  const first = fieldNames[0];
  if (!first) return;
  const el = document.querySelector(`[name="${first}"]`) as HTMLElement;
  if (el) {
    el.focus();
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

const baseInput =
  "w-full px-6 py-4 bg-[#001e1d]/40 border-2 text-[#fffffe] text-lg focus:outline-none placeholder-[#abd1c6]/50 rounded-xl transition-all duration-300 hover:border-[#abd1c6]/25";
const errorInput =
  "border-red-400/60 focus:border-red-400 shadow-lg shadow-red-400/20";
const normalInput =
  "border-[#abd1c6]/15 focus:border-[#f9bc60] focus:shadow-lg focus:shadow-[#f9bc60]/20";

/** Класс для инпутов формы заявки на рекламу */
export function getAdRequestInputClassName(hasError: boolean): string {
  return `${baseInput} ${hasError ? errorInput : normalInput}`;
}
