export type GoodDeedTaskTemplate = {
  id: string;
  title: string;
  description: string;
  reward: number;
};

export type WeekInfo = {
  key: string;
  label: string;
};

export const TASKS_PER_WEEK = 3;

/** Минимальная длина рассказа при отправке отчёта о добром деле. */
export const MIN_GOOD_DEED_STORY_CHARS = 100;
/** Максимальная длина рассказа (защита от злоупотреблений). */
export const MAX_GOOD_DEED_STORY_CHARS = 10000;

/** 1 бонус на сайте эквивалентен 1 ₽ при оплате/списании. */
export const BONUS_RUB_RATE = 1;

/** Минимум бонусов для заявки на вывод на карту / по реквизитам. */
export const MIN_WITHDRAWAL_BONUSES = 100;

/** Лимиты полей заявки на вывод. */
export const MAX_WITHDRAWAL_BANK_LEN = 160;
export const MAX_WITHDRAWAL_DETAILS_LEN = 2500;

/**
 * Экономика наград (середина между «слишком мало» и фармом):
 * — Лёгкие задания ≈ 70–76 бон.: короткое действие без существенных затрат.
 * — Обычные ≈ 80–96: заметное время/усилие или умеренные траты.
 * — Тяжёлые ≈ 100–112: час+ времени, поездка, донорство, заметные затраты.
 *
 * В неделю максимум 3 одобренных отчёта → типичная сумма при полном закрытии
 * недели порядка ~220–310 ₽, без экстремальных разбросов «в ноль» или «джекпот».
 */
export const GOOD_DEED_TASK_POOL: GoodDeedTaskTemplate[] = [
  {
    id: "help-neighbor",
    title: "Помочь соседу",
    description: "Помогите пожилому соседу донести сумки или с бытовыми делами.",
    reward: 88,
  },
  {
    id: "eco-walk",
    title: "Эко-прогулка",
    description: "Соберите мусор в парке или во дворе не менее 20 минут.",
    reward: 84,
  },
  {
    id: "good-review",
    title: "Добрый отзыв",
    description: "Оставьте развёрнутый позитивный отзыв о полезном сервисе или человеке.",
    reward: 74,
  },
  {
    id: "share-food",
    title: "Поделиться едой",
    description: "Передайте продукты тем, кому они сейчас особенно нужны.",
    reward: 92,
  },
  {
    id: "volunteer-hour",
    title: "Час волонтерства",
    description: "Посвятите минимум 1 час волонтерской активности по месту или онлайн.",
    reward: 104,
  },
  {
    id: "kind-message",
    title: "Сообщение поддержки",
    description: "Напишите человеку искренние слова поддержки в трудный момент.",
    reward: 72,
  },
  {
    id: "donate-things",
    title: "Передать вещи",
    description: "Передайте ненужные, но аккуратные вещи в приют, фонд или отдам даром.",
    reward: 88,
  },
  {
    id: "help-animal",
    title: "Помощь животным",
    description: "Купите корм, лекарства или помогите приюту для животных делом.",
    reward: 102,
  },
  {
    id: "blood-donation",
    title: "Донорство крови",
    description: "Сдайте кровь или плазму в пункте переливания (если позволяет здоровье).",
    reward: 112,
  },
  {
    id: "mentor-help",
    title: "Наставничество",
    description: "Помогите ученику, коллеге или знакомому разобраться в теме 30+ минут.",
    reward: 86,
  },
  {
    id: "community-space",
    title: "Уборка общего места",
    description: "Приведите в порядок подъезд, лестницу или зону отдыха во дворе.",
    reward: 82,
  },
  {
    id: "care-package",
    title: "Набор первой необходимости",
    description: "Соберите и передайте гигиену, еду или тёплые вещи нуждающимся.",
    reward: 96,
  },
  {
    id: "transport-help",
    title: "Подвезти по делу",
    description: "Бесплатно подвезите человека к врачу, на работу или на важную встречу.",
    reward: 94,
  },
  {
    id: "plant-tree",
    title: "Посадить или полить",
    description: "Посадите дерево/куст или полейте уже посаженное городское озеленение.",
    reward: 80,
  },
  {
    id: "library-books",
    title: "Книги в библиотеку",
    description: "Передайте хорошие книги в библиотеку, школу или книжный обменник.",
    reward: 70,
  },
];

export function getWeekInfo(date: Date): WeekInfo {
  const currentDate = new Date(date);
  const day = (currentDate.getDay() + 6) % 7;

  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - day);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const utcDate = new Date(
    Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    ),
  );
  const utcDay = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - utcDay);

  const weekYear = utcDate.getUTCFullYear();
  const yearStart = new Date(Date.UTC(weekYear, 0, 1));
  const weekNumber = Math.ceil(
    ((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );

  return {
    key: `${weekYear}-W${String(weekNumber).padStart(2, "0")}`,
    label: `${weekStart.toLocaleDateString("ru-RU")} - ${weekEnd.toLocaleDateString("ru-RU")}`,
  };
}

function hashWeekKeyToSeed(weekKey: string): number {
  let h = 2166136261;
  for (const char of weekKey) {
    h = Math.imul(h ^ char.charCodeAt(0), 16777619);
  }
  return h >>> 0;
}

/** Детерминированный RNG для стабильного набора заданий по неделе. */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Три разных задания на неделю: Fisher–Yates с семенем из ключа недели,
 * чтобы наборы по неделям отличались равномернее.
 */
export function pickTasksForWeek(weekKey: string): GoodDeedTaskTemplate[] {
  const n = GOOD_DEED_TASK_POOL.length;
  const order = Array.from({ length: n }, (_, i) => i);
  const rnd = mulberry32(hashWeekKeyToSeed(weekKey));

  for (let i = n - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = order[i];
    order[i] = order[j]!;
    order[j] = tmp!;
  }

  return order.slice(0, TASKS_PER_WEEK).map((idx) => GOOD_DEED_TASK_POOL[idx]!);
}

export function getTaskById(taskId: string): GoodDeedTaskTemplate | undefined {
  return GOOD_DEED_TASK_POOL.find((task) => task.id === taskId);
}

export function pickReplacementTask(
  weekKey: string,
  userId: string,
  excludedTaskIds: string[],
): GoodDeedTaskTemplate | null {
  const candidates = GOOD_DEED_TASK_POOL.filter(
    (task) => !excludedTaskIds.includes(task.id),
  );
  if (!candidates.length) return null;

  let hash = 0;
  const seed = `${weekKey}:${userId}`;
  for (const char of seed) {
    hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  }

  const index = hash % candidates.length;
  return candidates[index];
}

export function isSafeUploadUrl(url: string): boolean {
  if (typeof url !== "string" || !url.trim()) return false;
  const trimmed = url.trim();
  return trimmed.startsWith("/api/uploads/") && !trimmed.includes("..");
}

export function inferMediaTypeFromUrl(url: string): "IMAGE" | "VIDEO" {
  const lower = url.toLowerCase();
  if (lower.endsWith(".mp4") || lower.endsWith(".webm")) {
    return "VIDEO";
  }
  return "IMAGE";
}
