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
    const ctaStyle = {
      background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
      color: "#001e1d",
      boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
    };
    return (
      <div className="text-center py-16 px-4 animate-fade-in-up">
        <div className="container mx-auto max-w-2xl">
          <Card variant="darkGlass" padding="lg" className="text-center">
            {props.hasQuery ? (
              <>
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: "rgba(249, 188, 96, 0.12)" }}
                >
                  <LucideIcons.Search size="xl" className="text-[#f9bc60]" />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-[#fffffe]">
                  Ничего не найдено
                </h3>

                <p className="mb-8 leading-relaxed text-[#abd1c6]">
                  По вашему запросу не найдено ни одной истории. Попробуйте
                  изменить поисковый запрос или посмотрите все доступные
                  истории.
                </p>

                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 font-semibold rounded-xl transition-all hover:opacity-90"
                  style={ctaStyle}
                >
                  Показать все истории
                </button>
              </>
            ) : (
              <>
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: "rgba(249, 188, 96, 0.12)" }}
                >
                  <LucideIcons.BookOpen size="xl" className="text-[#f9bc60]" />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-[#fffffe]">
                  Истории скоро появятся
                </h3>

                <p className="mb-8 leading-relaxed text-[#abd1c6]">
                  Мы работаем над созданием вдохновляющих историй о помощи.
                  Скоро здесь появятся первые истории людей, которые получили
                  поддержку через нашу платформу.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/applications"
                    className="inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl transition-all hover:opacity-90"
                    style={ctaStyle}
                  >
                    Подать заявку
                  </a>
                  <a
                    href="/profile"
                    className="inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl border border-white/20 text-[#abd1c6] hover:text-[#fffffe] hover:border-white/30 rounded-xl transition-all bg-white/5"
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
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <Card variant="darkGlass" padding="lg">
              <div className="mb-6 flex justify-center">
                <LucideIcons.Star className="w-14 h-14 sm:w-16 sm:h-16 text-[#f9bc60]" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-[#fffffe]">Пока здесь пусто</h3>

              <p className="text-lg mb-8 leading-relaxed text-[#abd1c6]">
                В этом разделе отображаются пользователи, которые добровольно
                поддержали развитие проекта. Здесь мы публично говорим “спасибо”
                за вклад и участие.
              </p>

              <div className="space-y-4">
                <Link
                  href="/support"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                    color: "#001e1d",
                    boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
                  }}
                >
                  <LucideIcons.Heart className="w-5 h-5 mr-2" />
                  Поддержать проект
                </Link>
                <div>
                  <Link href="/" className="text-sm text-[#abd1c6] hover:text-[#f9bc60] transition-colors hover:underline">
                    ← Вернуться на главную
                  </Link>
                </div>
              </div>
            </Card>
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
      <div className="mb-6 flex justify-center">
        <LucideIcons.Document className="w-16 h-16 sm:w-20 sm:h-20 text-gray-500 dark:text-gray-400" />
      </div>
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
