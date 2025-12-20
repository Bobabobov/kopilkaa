// app/admin/ads/components/ad-requests/constants.ts
export const formatLabels: Record<string, string> = {
  banner: "Большой баннер наверху",
  side: "Блок сбоку",
  story: "Рекламная история",
  tg: "Telegram пост",
  post: "Рекламный пост",
  telegram: "Telegram",
  other: "Другое",
};

export const statusLabels: Record<string, string> = {
  new: "Новая",
  processing: "В обработке",
  approved: "Одобрена",
  rejected: "Отклонена",
};

export const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-300 border-blue-500/50",
  processing: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
  approved: "bg-green-500/20 text-green-300 border-green-500/50",
  rejected: "bg-red-500/20 text-red-300 border-red-500/50",
};


