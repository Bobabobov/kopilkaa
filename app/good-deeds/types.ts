export type TaskStatus = "PENDING" | "APPROVED" | "REJECTED" | null;
export type GoodDeedDifficulty = "EASY" | "MEDIUM" | "HARD";

export type GoodDeedTaskView = {
  id: string;
  difficulty: GoodDeedDifficulty;
  title: string;
  description: string;
  reward: number;
  submissionStatus: TaskStatus;
  adminComment: string | null;
};

export type GoodDeedsResponse = {
  /** Текущий цикл заданий (меняется вручную в админке). */
  cycle: {
    key: string;
    version: number;
    label: string;
    lastRotatedAt: string;
  };
  /** По одному активному заданию на уровень: лёгкое → среднее → сложное. */
  weeklyTasks: GoodDeedTaskView[];
  stats: {
    approvedCount: number;
    pendingCount: number;
    /** Сумма бонусов по всем одобренным отчётам. */
    totalEarnedBonuses: number;
    /** Опыт, вложенный в уровень (всё начисленное минус выведенное и старые заявки). */
    bonusesInLevel: number;
    /** @deprecated Используйте bonusesInLevel. */
    availableBonuses: number;
    /** Сумма в заявках на вывод со статусом «на проверке». */
    pendingWithdrawalBonuses: number;
    /** Уже одобрено к выплате (выплачено). */
    withdrawnBonuses: number;
    hasPendingWithdrawal: boolean;
    withdrawalBlocked: boolean;
    withdrawalsDisabled?: boolean;
  };
  /** Уровень профиля зрителя (если авторизован). */
  profileLevel?: number;
  feed: {
    id: string;
    taskTitle: string;
    taskDescription: string;
    /** Полный текст рассказа участника (в ленте можно показывать превью). */
    storyText: string;
    reward: number;
    createdAt: string;
    updatedAt: string;
    media: { url: string; type: "IMAGE" | "VIDEO" }[];
    user: {
      id: string;
      name: string;
      username?: string | null;
      avatar?: string | null;
      vkLink?: string | null;
      telegramLink?: string | null;
      youtubeLink?: string | null;
    };
  }[];
  viewer: {
    isAuthenticated: boolean;
  };
  /** Прогресс по трём слотам текущего набора. */
  weeklyProgress: {
    approved: number;
    pending: number;
    rejected: number;
    total: number;
  };
};
