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

  const getCardStyle = (index: number) => {
    const styles = [
      { bg: "from-[#f9bc60]/10 to-[#e8a545]/10", border: "border-[#f9bc60]/30", icon: "from-[#f9bc60] to-[#e8a545]", value: "text-[#f9bc60]" },
      { bg: "from-[#abd1c6]/10 to-[#94c4b8]/10", border: "border-[#abd1c6]/30", icon: "from-[#abd1c6] to-[#94c4b8]", value: "text-[#abd1c6]" },
      { bg: "from-[#f9bc60]/10 to-[#e8a545]/10", border: "border-[#f9bc60]/30", icon: "from-[#f9bc60] to-[#e8a545]", value: "text-[#f9bc60]" },
      { bg: "from-[#10B981]/10 to-[#059669]/10", border: "border-[#10B981]/30", icon: "from-[#10B981] to-[#059669]", value: "text-[#10B981]" },
      { bg: "from-[#e16162]/10 to-[#dc2626]/10", border: "border-[#e16162]/30", icon: "from-[#e16162] to-[#dc2626]", value: "text-[#e16162]" },
    ];
    return styles[index % styles.length];
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
      {cards.map((card, index) => {
        const style = getCardStyle(index);
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: card.delay }}
            className={`group relative overflow-hidden bg-gradient-to-br ${style.bg} rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border ${style.border}`}
          >
            <div className="relative">
              <div
                className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-r ${style.icon} rounded-lg sm:rounded-xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <span className="text-xl sm:text-2xl md:text-3xl">{card.icon}</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#abd1c6] mb-1 sm:mb-2 uppercase tracking-wide">
                {card.title}
              </div>
              <div className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black ${style.value} mb-1 sm:mb-2`}>
                {card.value}
              </div>
              <div className="text-xs text-[#abd1c6]/70">
                {card.description}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
