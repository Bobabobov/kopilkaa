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
    title: "Зарегистрируйтесь",
    description: "Быстро и без лишних формальностей",
    details:
      "Создайте аккаунт, заполните базовую информацию и получите доступ к подаче истории.",
    color: "#22c55e",
  },
  {
    icon: "FileText",
    title: "Расскажите свою ситуацию",
    description: "Кратко и по делу",
    details:
      "Опишите, зачем вам нужна финансовая помощь. Это может быть любая жизненная ситуация, в которой вам сейчас неоткуда взять деньги.",
    color: "#22c55e",
  },
  {
    icon: "Clock",
    title: "Ожидайте решения",
    description: "Решение принимает платформа",
    details:
      "Каждая история рассматривается индивидуально. Сайт самостоятельно принимает решение о возможности финансовой поддержки.",
    color: "#22c55e",
  },
  {
    icon: "DollarSign",
    title: "Получите помощь",
    description: "Без возврата и обязательств",
    details:
      "Если история одобрена — вы получаете деньги. Возвращать средства не нужно.",
    color: "#22c55e",
  },
];
