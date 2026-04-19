export type TaskStatus = "PENDING" | "APPROVED" | "REJECTED" | null;

export type GoodDeedsResponse = {
  week: { key: string; label: string };
  tasks: {
    id: string;
    title: string;
    description: string;
    reward: number;
    submissionStatus: TaskStatus;
    adminComment: string | null;
  }[];
  stats: {
    approvedCount: number;
    pendingCount: number;
    /** Сумма бонусов по всем одобренным отчётам. */
    totalEarnedBonuses: number;
    /** Доступно с учётом уже выведенного и заявок в работе. */
    availableBonuses: number;
    /** Сумма в заявках на вывод со статусом «на проверке». */
    pendingWithdrawalBonuses: number;
    /** Уже одобрено к выплате (выплачено). */
    withdrawnBonuses: number;
    hasPendingWithdrawal: boolean;
  };
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
  viewer: { isAuthenticated: boolean; rerollUsed: boolean };
};
