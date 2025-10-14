// app/admin/components/StatsCards.tsx
import { motion } from "framer-motion";
import { Stats } from "../types";

interface StatsCardsProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      icon: "📊",
      title: "Всего заявок",
      value: stats.total,
      description: "За всё время",
      gradient:
        "from-blue-500/10 to-indigo-500/10 group-hover:from-blue-500/20 group-hover:to-indigo-500/20",
      iconGradient: "from-blue-500 to-indigo-600",
      valueColor: "text-gray-900 dark:text-white",
      delay: 0.3,
    },
    {
      icon: "💰",
      title: "Общая сумма",
      value: `₽${stats.totalAmount?.toLocaleString() || '0'}`,
      description: "Запрошено всего",
      gradient:
        "from-emerald-500/10 to-green-500/10 group-hover:from-emerald-500/20 group-hover:to-green-500/20",
      iconGradient: "from-emerald-500 to-green-600",
      valueColor: "text-emerald-600 dark:text-emerald-400",
      delay: 0.35,
    },
    {
      icon: "⏳",
      title: "В обработке",
      value: stats.pending,
      description: "Требуют внимания",
      gradient:
        "from-yellow-500/10 to-orange-500/10 group-hover:from-yellow-500/20 group-hover:to-orange-500/20",
      iconGradient: "from-yellow-500 to-orange-500",
      valueColor: "text-yellow-600 dark:text-yellow-400",
      delay: 0.4,
    },
    {
      icon: "✅",
      title: "Одобрено",
      value: stats.approved,
      description: "Успешно обработано",
      gradient:
        "from-green-500/10 to-emerald-500/10 group-hover:from-green-500/20 group-hover:to-emerald-500/20",
      iconGradient: "from-green-500 to-emerald-600",
      valueColor: "text-green-600 dark:text-green-400",
      delay: 0.5,
    },
    {
      icon: "❌",
      title: "Отказано",
      value: stats.rejected,
      description: "Не прошли модерацию",
      gradient:
        "from-red-500/10 to-pink-500/10 group-hover:from-red-500/20 group-hover:to-pink-500/20",
      iconGradient: "from-red-500 to-pink-500",
      valueColor: "text-red-600 dark:text-red-400",
      delay: 0.6,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: card.delay }}
          className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.gradient} transition-all duration-500`}
          ></div>
          <div className="relative">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${card.iconGradient} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              <span className="text-3xl">{card.icon}</span>
            </div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
              {card.title}
            </div>
            <div className={`text-4xl font-bold ${card.valueColor} mb-2`}>
              {card.value}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              {card.description}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
