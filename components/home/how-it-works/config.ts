export interface HowItWorksStep {
  icon: string;
  title: string;
  description: string;
  details: string;
  color: string;
}

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    icon: "User",
    title: "Регистрация в клубе",
    description: "Игровой профиль за 30 секунд",
    details:
      "Создайте свой игровой профиль через Google почту или Telegram.",
    color: "#22c55e",
  },
  {
    icon: "FileText",
    title: "Напишите ваш рассказ",
    description: "Честная история из жизни",
    details:
      "Расскажите честную, смешную или грустную ситуацию из жизни, которой вам хочется поделиться.",
    color: "#22c55e",
  },
  {
    icon: "Clock",
    title: "Пройдите модерацию",
    description: "Проверка на уникальность",
    details:
      "Редакция проверит ваш текст на уникальность. Качественные и живые истории публикуются в общей ленте и начинают копить лайки читателей.",
    color: "#22c55e",
  },
  {
    icon: "DollarSign",
    title: "Получите награду",
    description: "Бонусы, уровень и выплаты по СБП",
    details:
      "Копите внутренние бонусы за активность на платформе, развивайте уровень своего профиля и выводите реальные рубли по СБП за лучшие материалы.",
    color: "#22c55e",
  },
];
