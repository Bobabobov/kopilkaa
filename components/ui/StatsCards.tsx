"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

type ApplicationsStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

type AdminStats = {
  total: number;
  totalAmount?: number | null;
  pending: number;
  approved: number;
  rejected: number;
  contest?: number | null;
};

type StatsCardsProps =
  | {
      variant: "applications";
      stats: ApplicationsStats;
    }
  | {
      variant: "admin";
      stats: AdminStats;
    };

export default function StatsCards({ variant, stats }: StatsCardsProps) {
  if (variant === "applications") {
    const statItems = [
      { label: "Всего", value: stats.total, icon: "FileText" },
      {
        label: "На рассмотрении",
        value: stats.pending,
        icon: "Clock",
      },
      {
        label: "Одобрено",
        value: stats.approved,
        icon: "CheckCircle",
      },
      {
        label: "Отклонено",
        value: stats.rejected,
        icon: "XCircle",
      },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6"
      >
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            className="rounded-lg p-4 text-center transition-all duration-200 hover:bg-opacity-20"
            style={{
              backgroundColor: "rgba(171, 209, 198, 0.1)",
              border: "1px solid rgba(171, 209, 198, 0.2)",
            }}
          >
            <div
              className="w-8 h-8 mx-auto mb-3 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#f9bc60" }}
            >
              {stat.icon === "FileText" && (
                <LucideIcons.FileText size="sm" className="text-[#001e1d]" />
              )}
              {stat.icon === "Clock" && (
                <LucideIcons.Clock size="sm" className="text-[#001e1d]" />
              )}
              {stat.icon === "CheckCircle" && (
                <LucideIcons.CheckCircle size="sm" className="text-[#001e1d]" />
              )}
              {stat.icon === "XCircle" && (
                <LucideIcons.XCircle size="sm" className="text-[#001e1d]" />
              )}
            </div>

            <div
              className="text-xl font-semibold mb-1"
              style={{ color: "#fffffe" }}
            >
              {stat.value}
            </div>

            <div className="text-xs" style={{ color: "#abd1c6" }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

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
      value: `₽${stats.totalAmount?.toLocaleString() || "0"}`,
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
    {
      icon: "🏆",
      title: "Конкурс",
      value: stats.contest ?? 0,
      description: "Помечены для конкурса",
      gradient:
        "from-violet-500/10 to-purple-500/10 group-hover:from-violet-500/20 group-hover:to-purple-500/20",
      iconGradient: "from-violet-500 to-purple-500",
      valueColor: "text-violet-600 dark:text-violet-400",
      delay: 0.65,
    },
  ];

  const getCardStyle = (index: number) => {
    const styles = [
      {
        bg: "from-[#f9bc60]/10 to-[#e8a545]/10",
        border: "border-[#f9bc60]/30",
        icon: "from-[#f9bc60] to-[#e8a545]",
        value: "text-[#f9bc60]",
      },
      {
        bg: "from-[#abd1c6]/10 to-[#94c4b8]/10",
        border: "border-[#abd1c6]/30",
        icon: "from-[#abd1c6] to-[#94c4b8]",
        value: "text-[#abd1c6]",
      },
      {
        bg: "from-[#f9bc60]/10 to-[#e8a545]/10",
        border: "border-[#f9bc60]/30",
        icon: "from-[#f9bc60] to-[#e8a545]",
        value: "text-[#f9bc60]",
      },
      {
        bg: "from-[#10B981]/10 to-[#059669]/10",
        border: "border-[#10B981]/30",
        icon: "from-[#10B981] to-[#059669]",
        value: "text-[#10B981]",
      },
      {
        bg: "from-[#e16162]/10 to-[#dc2626]/10",
        border: "border-[#e16162]/30",
        icon: "from-[#e16162] to-[#dc2626]",
        value: "text-[#e16162]",
      },
      {
        bg: "from-[#9b87f5]/10 to-[#7c6fdc]/10",
        border: "border-[#9b87f5]/30",
        icon: "from-[#9b87f5] to-[#7c6fdc]",
        value: "text-[#9b87f5]",
      },
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
                <span className="text-xl sm:text-2xl md:text-3xl">
                  {card.icon}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#abd1c6] mb-1 sm:mb-2 uppercase tracking-wide">
                {card.title}
              </div>
              <div
                className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black ${style.value} mb-1 sm:mb-2`}
              >
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
