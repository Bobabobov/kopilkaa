"use client";

import { motion } from "framer-motion";
import { HeroBadge } from "@/components/ui/HeroBadge";
import type { HeroBadge as HeroBadgeType } from "@/lib/heroBadges";

type Tier = {
  minAmount: number;
  badge: HeroBadgeType;
  title: string;
  description: string;
};

const tiers: Tier[] = [
  {
    minAmount: 100,
    badge: "observer",
    title: "Наблюдатель",
    description: "Стартовый статус размещения.",
  },
  {
    minAmount: 300,
    badge: "member",
    title: "Участник",
    description: "Повышенный статус в списках и в профиле.",
  },
  {
    minAmount: 500,
    badge: "active",
    title: "Активный участник",
    description: "Выделяется заметнее в ленте пользователей.",
  },
  {
    minAmount: 1000,
    badge: "hero",
    title: "Герой",
    description: "Высокий статус размещения в проекте.",
  },
  {
    minAmount: 2000,
    badge: "honor",
    title: "Почётный герой",
    description: "Редкий статус — сразу видно уровень.",
  },
  {
    minAmount: 5000,
    badge: "legend",
    title: "Легенда",
    description: "Топ‑уровень среди стандартных статусов.",
  },
  {
    minAmount: 5001,
    badge: "custom",
    title: "Уникальный",
    description: "Выдаётся вручную администрацией для платежей свыше 5000 ₽.",
  },
];

export default function HeroBadgesShowcase() {
  return (
    <section className="py-8 sm:py-10 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h3
            className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 sm:mb-4"
            style={{ color: "#fffffe" }}
          >
            🏷️ Витрина бейджей
          </h3>
          <p
            className="text-sm sm:text-base max-w-3xl mx-auto px-2"
            style={{ color: "#abd1c6" }}
          >
            Бейдж — это статус оплаченного размещения профиля в разделе «Герои». Он показывается в
            профиле и в списках пользователей.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {tiers.map((t, idx) => (
            <motion.div
              key={t.badge}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-[#004643]/20 backdrop-blur-sm border border-[#abd1c6]/15 rounded-2xl p-5 sm:p-6 hover:border-[#abd1c6]/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm text-[#abd1c6]">
                    от <span className="font-semibold text-[#f9bc60]">{t.minAmount} ₽</span>
                  </div>
                  <div className="mt-1 text-lg sm:text-xl font-semibold text-[#fffffe] truncate">
                    {t.title}
                  </div>
                </div>
                <HeroBadge badge={t.badge} size="md" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#abd1c6]">{t.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <div className="bg-[#001e1d]/35 border border-[#abd1c6]/15 rounded-2xl p-5 sm:p-6">
            <h4 className="text-base sm:text-lg font-semibold text-[#fffffe] mb-2">
              Как получить бейдж
            </h4>
            <ul className="text-sm text-[#abd1c6] space-y-2 leading-relaxed">
              <li>
                - Оплатите размещение профиля в разделе «Герои» через форму выше.
              </li>
              <li>
                - Бейдж определяется по <span className="text-[#f9bc60] font-semibold">максимальному разовому платежу</span>, а не по
                количеству платежей.
              </li>
              <li>
                - После оплаты статус появится в профиле и в списках (может потребоваться обновление страницы).
              </li>
            </ul>
          </div>

          <div className="bg-[#001e1d]/35 border border-[#abd1c6]/15 rounded-2xl p-5 sm:p-6">
            <h4 className="text-base sm:text-lg font-semibold text-[#fffffe] mb-2">
              Про “Уникальный” статус
            </h4>
            <p className="text-sm text-[#abd1c6] leading-relaxed">
              Платежи свыше 5000 ₽ могут получить отдельный уникальный бейдж. Он назначается вручную
              администрацией (например, по обращению), чтобы дизайн был действительно эксклюзивным.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}



