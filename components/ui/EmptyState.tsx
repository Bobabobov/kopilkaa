"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card } from "@/components/ui/Card";

type EmptyStateProps =
  | {
      variant: "applications";
      search: string;
      filter: "ALL" | "PENDING" | "APPROVED" | "REJECTED";
    }
  | {
      variant: "stories";
      hasQuery: boolean;
    }
  | {
      variant: "heroes";
    }
  | {
      variant: "admin-applications";
      hasFilters: boolean;
    };

export default function EmptyState(props: EmptyStateProps) {
  if (props.variant === "applications") {
    const hasFilters = props.search || props.filter !== "ALL";
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#003533] to-[#001e1d] backdrop-blur-2xl rounded-3xl p-10 sm:p-12 text-center border border-[#abd1c6]/25 shadow-2xl"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-8 -right-6 w-32 h-32 rounded-full bg-[#f9bc60]/10 blur-3xl" />
          <div className="absolute -bottom-12 -left-10 w-36 h-36 rounded-full bg-[#abd1c6]/10 blur-3xl" />
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            type: "spring",
            stiffness: 200,
          }}
          className="relative z-10 w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#f9bc60] to-[#e8a545] flex items-center justify-center shadow-[0_20px_60px_rgba(249,188,96,0.25)]"
        >
          <LucideIcons.FileText size="xl" className="text-[#001e1d]" />
        </motion.div>

        <h3 className="relative z-10 text-2xl font-bold text-[#fffffe] mb-4">
          {hasFilters ? "Заявки не найдены" : "Пока нет заявок"}
        </h3>

        <p className="relative z-10 text-[#abd1c6] mb-6 max-w-lg mx-auto leading-relaxed">
          {hasFilters
            ? "Попробуйте изменить фильтры или поисковый запрос"
            : "Станьте первым, кто поделится своей историей помощи!"}
        </p>

        {!hasFilters && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10"
          >
            <a
              href="/applications"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#f9bc60] to-[#e8a545] hover:from-[#e8a545] hover:to-[#f9bc60] text-[#001e1d] font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-[#f9bc60]/40 border border-[#f9bc60]/40"
            >
              <LucideIcons.Plus size="md" />
              Создать заявку
            </a>
          </motion.div>
        )}
      </motion.div>
    );
  }

  if (props.variant === "stories") {
    return (
      <div className="text-center py-16 px-4 animate-fade-in-up">
        <div className="container mx-auto max-w-2xl">
          <Card variant="glass" padding="lg" className="border-[#abd1c6]/20 text-center">
            {props.hasQuery ? (
              <>
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LucideIcons.Search size="xl" className="text-[#abd1c6]" />
                </div>

                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#fffffe" }}
                >
                  Ничего не найдено
                </h3>

                <p
                  className="mb-8 leading-relaxed"
                  style={{ color: "#abd1c6" }}
                >
                  По вашему запросу не найдено ни одной истории. Попробуйте
                  изменить поисковый запрос или посмотрите все доступные
                  истории.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    style={{
                      background:
                        "linear-gradient(135deg, #f9bc60 0%, #e8a94a 100%)",
                    }}
                  >
                    Показать все истории
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LucideIcons.BookOpen size="xl" className="text-[#f9bc60]" />
                </div>

                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#fffffe" }}
                >
                  Истории скоро появятся
                </h3>

                <p
                  className="mb-8 leading-relaxed"
                  style={{ color: "#abd1c6" }}
                >
                  Мы работаем над созданием вдохновляющих историй о помощи.
                  Скоро здесь появятся первые истории людей, которые получили
                  поддержку через нашу платформу.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/applications"
                    className="px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    style={{
                      background:
                        "linear-gradient(135deg, #f9bc60 0%, #e8a94a 100%)",
                    }}
                  >
                    Подать заявку
                  </a>
                  <a
                    href="/profile"
                    className="px-6 py-3 bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
                    style={{ borderColor: "#abd1c6/30" }}
                  >
                    Мой профиль
                  </a>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    );
  }

  if (props.variant === "heroes") {
    return (
      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-12 rounded-3xl backdrop-blur-sm border"
            style={{
              backgroundColor: "rgba(0, 70, 67, 0.6)",
              borderColor: "rgba(171, 209, 198, 0.3)",
            }}
          >
            <div className="text-6xl mb-6">🌟</div>

            <h3
              className="text-3xl font-bold mb-4"
              style={{ color: "#fffffe" }}
            >
              Пока здесь пусто
            </h3>

            <p
              className="text-lg mb-8 leading-relaxed"
              style={{ color: "#abd1c6" }}
            >
              В этом разделе отображаются пользователи, которые добровольно
              поддержали развитие проекта. Здесь мы публично говорим “спасибо”
              за вклад и участие.
            </p>

            <div className="space-y-4">
              <Link
                href="/support"
                className="inline-block px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: "#f9bc60",
                  color: "#001e1d",
                }}
              >
                💛 Поддержать проект
              </Link>

              <div>
                <Link
                  href="/"
                  className="text-sm transition-colors duration-200 hover:underline"
                  style={{ color: "#abd1c6" }}
                >
                  ← Вернуться на главную
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-12 text-center"
    >
      <div className="text-8xl mb-6">📝</div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Заявки не найдены
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {props.hasFilters
          ? "Попробуйте изменить поисковый запрос или фильтры"
          : "Пока нет заявок для модерации"}
      </p>
    </motion.div>
  );
}
