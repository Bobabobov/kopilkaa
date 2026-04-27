export type GoodDeedTaskTemplate = {
  id: string;
  difficulty: GoodDeedDifficulty;
  title: string;
  description: string;
  reward: number;
};

export type GoodDeedDifficulty = "EASY" | "MEDIUM" | "HARD";

export type WeekInfo = {
  key: string;
  label: string;
};

export const TASKS_PER_WEEK = 3;
export const GOOD_DEED_COMPLETION_BONUS: Record<GoodDeedDifficulty, number> = {
  EASY: 50,
  MEDIUM: 70,
  HARD: 180,
};

/** Тексты по умолчанию для поля отчёта в UI (конкретные задания — см. GOOD_DEED_STORY_EXTRA_HELP). */
export const DEFAULT_GOOD_DEED_STORY_PLACEHOLDER =
  "Что сделали и как прошло — не короче 100 символов.";

/**
 * Доп. подсказки для заданий, где участники часто путают «отчёт на Копилке» с самим действием.
 * Ключ — task id из GOOD_DEED_TASK_POOL.
 */
export const GOOD_DEED_STORY_EXTRA_HELP: Partial<
  Record<
    string,
    {
      /** Короткий блок над полем рассказа */
      notice?: string;
      /** Плейсхолдер textarea */
      placeholder?: string;
      /** Строка под подписью «Фото или видео» */
      fileUploadHint?: string;
    }
  >
> = {
  "easy-good-review": {
    placeholder: "Где оставили отзыв и про что (не отзыв на Копилку).",
    fileUploadHint: "Скрин того отзыва, что уже висит на площадке.",
  },
};

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
 * — Тяжёлые ≈ 180–230: заметно больше времени и ответственности.
 *
 * В неделю максимум 3 одобренных отчёта → типичная сумма при полном закрытии
 * недели порядка ~220–410 ₽, без экстремальных разбросов «в ноль» или «джекпот».
 */
export const GOOD_DEED_TASK_POOL: GoodDeedTaskTemplate[] = [
  {
    id: "easy-kind-message",
    difficulty: "EASY",
    title: "Сообщение поддержки",
    description:
      "Напишите человеку искренние слова поддержки в трудный момент и объясните, почему он справится.",
    reward: 58,
  },
  {
    id: "easy-good-review",
    difficulty: "EASY",
    title: "Добрый отзыв",
    description:
      "Оставьте развернутый позитивный отзыв во внешнем месте: приложение — в Google Play или App Store, локальный бизнес — в карточке на Яндекс Картах / 2ГИС / Google Maps, сервис — на его странице отзывов или в соцсети компании. Приложите скрин или фото экрана с опубликованным отзывом.",
    reward: 62,
  },
  {
    id: "easy-library-books",
    difficulty: "EASY",
    title: "Книги в библиотеку",
    description:
      "Передайте хорошие книги в библиотеку, школу или книжный обменник, чтобы они приносили пользу другим.",
    reward: 66,
  },
  {
    id: "medium-help-neighbor",
    difficulty: "MEDIUM",
    title: "Помочь соседу",
    description:
      "Помогите пожилому соседу с бытовыми делами: покупки, доставка сумок, мелкая домашняя помощь.",
    reward: 92,
  },
  {
    id: "medium-community-space",
    difficulty: "MEDIUM",
    title: "Уборка общего места",
    description:
      "Приведите в порядок подъезд, лестницу, двор или общее пространство и покажите результат до/после.",
    reward: 98,
  },
  {
    id: "medium-transport-help",
    difficulty: "MEDIUM",
    title: "Сопроводить по делу",
    description:
      "Сопроводите человека к врачу, в МФЦ или на важную встречу, чтобы он не оставался один в сложной ситуации.",
    reward: 106,
  },
  {
    id: "hard-volunteer-hour",
    difficulty: "HARD",
    title: "Час волонтерства",
    description:
      "Посвятите минимум 1 час реальной волонтерской активности (офлайн или онлайн) с доказательствами участия.",
    reward: 190,
  },
  {
    id: "hard-help-animal",
    difficulty: "HARD",
    title: "Помощь животным",
    description:
      "Помогите приюту делом и временем: выгул, уборка, перевозка или другая реальная помощь без обязательных трат.",
    reward: 210,
  },
  {
    id: "hard-blood-donation",
    difficulty: "HARD",
    title: "Донорство крови",
    description:
      "Сдайте кровь или плазму в пункте переливания (если позволяет здоровье) и приложите подтверждение.",
    reward: 230,
  },
];

export function getDifficultyLabel(difficulty: GoodDeedDifficulty): string {
  if (difficulty === "EASY") return "Легкие";
  if (difficulty === "MEDIUM") return "Средние";
  return "Тяжелые";
}

export function getDifficultyDescription(
  difficulty: GoodDeedDifficulty,
): string {
  if (difficulty === "EASY") {
    return "Проще задания, меньше времени.";
  }
  if (difficulty === "MEDIUM") {
    return "Середина по силам и времени.";
  }
  return "Больше времени и ответственности, выше бонус.";
}

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
  return getTasksForDifficulty("MEDIUM");
}

export function getTasksForDifficulty(
  difficulty: GoodDeedDifficulty,
): GoodDeedTaskTemplate[] {
  return GOOD_DEED_TASK_POOL.filter((task) => task.difficulty === difficulty);
}

const TASK_EXAMPLE_BLURBS: Record<string, string> = {
  "easy-kind-message":
    "Поддержать человека словами и объяснить, почему он справится.",
  "easy-good-review":
    "Оставить реальный отзыв вне Копилки и приложить скрин как подтверждение.",
  "easy-library-books":
    "Передать книги в библиотеку, школу или пункт книжного обмена.",
  "medium-help-neighbor":
    "Помочь соседу с бытовыми делами: покупки, сумки, мелкая помощь.",
  "medium-community-space":
    "Убрать общее место и показать результат формата до/после.",
  "medium-transport-help":
    "Сопроводить человека к врачу или по важному делу, чтобы он не был один.",
  "hard-volunteer-hour":
    "Посвятить минимум час волонтерству и подтвердить участие.",
  "hard-help-animal":
    "Помочь приюту делом и временем (без обязательной покупки).",
  "hard-blood-donation":
    "Сдать кровь или плазму (если позволяет здоровье) и приложить подтверждение.",
};

function compactDescriptionBlurb(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  const softCut = text.slice(0, maxChars);
  const stopChars = [".", ":", ";"];
  for (const ch of stopChars) {
    const idx = softCut.lastIndexOf(ch);
    if (idx >= 28) return softCut.slice(0, idx + 1).trim();
  }
  const lastSpace = softCut.lastIndexOf(" ");
  const base = lastSpace > 28 ? softCut.slice(0, lastSpace) : softCut;
  return base.trim();
}

/** Короткие примеры заданий для UI (модалка): из пула `GOOD_DEED_TASK_POOL`. */
export function getDifficultyTaskExamples(
  difficulty: GoodDeedDifficulty,
): { title: string; blurb: string }[] {
  return getTasksForDifficulty(difficulty).map((t) => ({
    title: t.title,
    blurb:
      TASK_EXAMPLE_BLURBS[t.id] ?? compactDescriptionBlurb(t.description, 98),
  }));
}

export function getTasksByDifficulty() {
  return {
    EASY: getTasksForDifficulty("EASY"),
    MEDIUM: getTasksForDifficulty("MEDIUM"),
    HARD: getTasksForDifficulty("HARD"),
  };
}

export function getTaskById(taskId: string): GoodDeedTaskTemplate | undefined {
  return GOOD_DEED_TASK_POOL.find((task) => task.id === taskId);
}

export function getTaskDifficulty(taskId: string): GoodDeedDifficulty | null {
  const task = getTaskById(taskId);
  return task?.difficulty ?? null;
}

export function getCompletionBonusForDifficulty(
  difficulty: GoodDeedDifficulty,
): number {
  return GOOD_DEED_COMPLETION_BONUS[difficulty];
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
