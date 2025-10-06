// app/admin/components/ApplicationsList.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { ApplicationItem } from "../types";
import Badge from "./Badge";

interface ApplicationsListProps {
  items: ApplicationItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  status: "ALL" | "PENDING" | "APPROVED" | "REJECTED";
  onStatusChange: (
    id: string,
    status: ApplicationItem["status"],
    comment?: string,
  ) => void;
  onQuickUpdate: (
    id: string,
    status: ApplicationItem["status"],
    comment?: string,
  ) => void;
  onImageClick: (images: string[], index: number) => void;
  onDelete: (id: string) => void;
}

export default function ApplicationsList({
  items,
  loading,
  error,
  searchQuery,
  status,
  onStatusChange,
  onQuickUpdate,
  onImageClick,
  onDelete,
}: ApplicationsListProps) {
  // показанные email'ы
  const [shownEmails, setShownEmails] = useState<Set<string>>(new Set());

  // переключение показа email'а
  const toggleEmail = (id: string) => {
    setShownEmails((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card p-12 text-center"
      >
        <div className="text-6xl mb-4">⏳</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Загружаем заявки...
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Пожалуйста, подождите
        </p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 text-center"
      >
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
          Ошибка загрузки
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </motion.div>
    );
  }

  if (items.length === 0) {
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
          {searchQuery || status !== "ALL"
            ? "Попробуйте изменить поисковый запрос или фильтры"
            : "Пока нет заявок для модерации"}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6">
      {items.map((item, index) => {
        const preview =
          item.story.length > 260 ? item.story.slice(0, 260) + "…" : item.story;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-indigo-500/10 transition-all duration-500"></div>

            <div className="relative">
              {/* Шапка */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div className="min-w-0 flex-1 basis-0">
                  <a
                    href={`/admin/applications/${item.id}`}
                    className="text-xl font-bold clamp-2 break-words max-w-full text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors cursor-pointer group-hover:scale-105 transform duration-300"
                    title="Открыть полную заявку"
                  >
                    {item.title}
                  </a>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 break-words">
                      Автор:
                      {shownEmails.has(item.id) ? (
                        <span className="ml-1">
                          {!item.user.hideEmail
                            ? item.user.email
                            : "Email скрыт"}
                        </span>
                      ) : (
                        <button
                          onClick={() => toggleEmail(item.id)}
                          className="ml-1 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          {!item.user.hideEmail
                            ? "Показать email"
                            : "Email скрыт"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Сумма запроса */}
                  <div className="mt-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full border border-green-200 dark:border-green-700/50">
                      <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                        ₽{item.amount.toLocaleString()}
                      </span>
                      <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                        Сумма запроса
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge status={item.status} />
                  <button
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
                    onClick={() =>
                      onStatusChange(
                        item.id,
                        item.status,
                        item.adminComment || "",
                      )
                    }
                  >
                    Изменить статус
                  </button>

                  {/* Быстрые действия */}
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl"
                    onClick={() =>
                      onQuickUpdate(
                        item.id,
                        "APPROVED",
                        item.adminComment || "",
                      )
                    }
                  >
                    Одобрить
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl"
                    onClick={() =>
                      onQuickUpdate(
                        item.id,
                        "REJECTED",
                        item.adminComment || "",
                      )
                    }
                  >
                    Отказать
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl"
                    onClick={() => {
                      if (
                        confirm(
                          "Вы уверены, что хотите удалить эту заявку? Это действие нельзя отменить.",
                        )
                      ) {
                        onDelete(item.id);
                      }
                    }}
                    title="Удалить заявку"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Кратко */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-6">
                <div className="text-gray-700 dark:text-gray-300 clamp-2 break-words max-w-full leading-relaxed">
                  {item.summary}
                </div>
              </div>

              {/* Реквизиты */}
              <details className="toggle text-sm mb-6">
                <summary className="flex items-center gap-2 cursor-pointer select-none text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="label-closed">Показать реквизиты</span>
                  <span className="label-open">Скрыть реквизиты</span>
                </summary>
                <div className="open-only rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 mt-3 relative group">
                  <div className="px-4 py-3 break-words pr-16">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      Реквизиты:{" "}
                    </span>
                    <span className="select-all text-gray-900 dark:text-white">
                      {item.payment}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard
                        .writeText(item.payment)
                        .then(() => {
                          const btn = e.target as HTMLButtonElement;
                          const icon = btn.querySelector(
                            ".copy-icon",
                          ) as HTMLElement;
                          const text = btn.querySelector(
                            ".copy-text",
                          ) as HTMLElement;
                          if (icon && text) {
                            icon.textContent = "✓";
                            text.textContent = "Скопировано";
                            btn.className = btn.className
                              .replace("hover:bg-blue-100", "bg-green-100")
                              .replace("hover:text-blue-700", "text-green-700");
                            setTimeout(() => {
                              icon.textContent = "📋";
                              text.textContent = "Копировать";
                              btn.className = btn.className
                                .replace("bg-green-100", "hover:bg-blue-100")
                                .replace(
                                  "text-green-700",
                                  "hover:text-blue-700",
                                );
                            }, 1500);
                          }
                        })
                        .catch(() => {
                          alert("Ошибка копирования. Выделите текст вручную.");
                        });
                    }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1 px-3 py-1 rounded-lg text-xs bg-white/90 dark:bg-slate-800/90 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 backdrop-blur-sm shadow-sm"
                    title="Копировать реквизиты"
                  >
                    <span className="copy-icon">📋</span>
                    <span className="copy-text">Копировать</span>
                  </button>
                </div>
              </details>

              {/* Картинки */}
              {item.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {item.images.map((img, i) => (
                    <div
                      key={i}
                      className="group relative overflow-hidden rounded-2xl"
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-32 object-cover rounded-2xl border border-gray-200 dark:border-gray-600 cursor-zoom-in transition-all duration-300 group-hover:scale-105"
                        onClick={() =>
                          onImageClick(
                            item.images.map((x) => x.url),
                            i,
                          )
                        }
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-2xl flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Отправлено: {new Date(item.createdAt).toLocaleString()}
                </div>
                <a
                  href={`/admin/applications/${item.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium text-sm"
                >
                  <span>Подробнее</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>

              {item.adminComment && (
                <div className="text-sm rounded-xl bg-black/5 dark:bg-white/10 px-3 py-2 break-words mt-4">
                  <span className="opacity-70">Комментарий модератора: </span>
                  {item.adminComment}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
