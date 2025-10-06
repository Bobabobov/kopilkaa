// app/admin/applications/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { statusRu, statusColor } from "@/lib/status";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import UserTimeStatsNew from "@/components/applications/UserTimeStatsNew";

type Item = {
  id: string;
  title: string;
  summary: string;
  story: string;
  amount: number;
  payment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminComment: string | null;
  createdAt: string;
  user: { email: string; id: string };
  images: { url: string; sort: number }[];
};

function Badge({ s }: { s: Item["status"] }) {
  return (
    <span className={`px-2 py-1 rounded-xl text-xs ${statusColor(s)}`}>
      {statusRu[s]}
    </span>
  );
}

export default function AdminApplicationPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const { showToast, ToastComponent } = useBeautifulToast();

  const deleteApplication = async () => {
    try {
      const r = await fetch(`/api/admin/applications/${item?.id}`, {
        method: "DELETE",
      });
      if (r.ok) {
        showToast("success", "Заявка удалена", "Заявка была успешно удалена");
        router.push("/admin");
      } else {
        showToast("error", "Ошибка удаления", "Не удалось удалить заявку");
      }
    } catch (error) {
      showToast(
        "error",
        "Ошибка удаления",
        "Произошла ошибка при удалении заявки",
      );
    }
  };

  useEffect(() => {
    fetch(`/api/admin/applications/${id}`, { cache: "no-store" })
      .then(async (r) => {
        if (r.status === 403) {
          router.push("/");
          return;
        }
        const d = await r.json();
        if (r.ok && d?.item) {
          setItem(d.item);
        } else {
          setErr(d?.error || "Не найдено");
        }
      })
      .catch(() => setErr("Ошибка загрузки"))
      .finally(() => setLoading(false));
  }, [id, router]);

  useEffect(() => {
    if (!lbOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLbOpen(false);
      if (e.key === "ArrowLeft")
        setLbIndex(
          (i) =>
            (i - 1 + (item?.images.length || 1)) % (item?.images.length || 1),
        );
      if (e.key === "ArrowRight")
        setLbIndex((i) => (i + 1) % (item?.images.length || 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lbOpen, item?.images.length]);

  if (loading)
    return (
      <motion.div className="card p-6 mx-auto max-w-4xl text-center">
        Загрузка...
      </motion.div>
    );

  if (err)
    return (
      <motion.div className="card p-6 mx-auto max-w-4xl text-center text-red-600 dark:text-red-400">
        {err}
      </motion.div>
    );

  if (!item) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-lime-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-br from-green-500/10 to-lime-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-2xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-4xl grid gap-6 force-wrap overflow-x-hidden relative z-10 pt-32 pb-6 px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Назад к списку
          </button>
          <Badge s={item.status} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-lime-500/5"></div>

          <div className="relative space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-bold break-all text-anywhere text-gray-900 dark:text-white">
                {item.title}
              </h1>
              <Badge s={item.status} />
            </div>

            {/* Сумма запроса - выделенная */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-2xl border border-emerald-200 dark:border-emerald-700/50 w-fit">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-2xl">
                ₽{item.amount.toLocaleString()}
              </span>
              <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                Сумма запроса
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-medium">Автор:</span>
              <button
                onClick={() => {
                  const email = item.user.email;
                  navigator.clipboard
                    .writeText(email)
                    .then(() => {
                      showToast(
                        "success",
                        "Email скопирован!",
                        "Адрес автора добавлен в буфер обмена",
                      );
                    })
                    .catch(() => {
                      // Fallback - показываем email в prompt
                      prompt("Email автора:", email);
                    });
                }}
                className="group relative flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all duration-200"
                title="Нажмите чтобы скопировать email"
              >
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {item.user.email.replace(/(.{2}).*(@.*)/, "$1***$2")}
                </span>
                <svg
                  className="w-3 h-3 text-emerald-500 group-hover:scale-110 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>

            <div className="text-lg text-gray-700 dark:text-gray-300 break-all text-anywhere leading-relaxed bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
              {item.summary}
            </div>

            {/* Реквизиты */}
            <details className="toggle">
              <summary className="flex items-center gap-2 cursor-pointer select-none text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 font-medium transition-colors text-lg mb-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                <span className="label-closed">Показать реквизиты</span>
                <span className="label-open">Скрыть реквизиты</span>
              </summary>
              <div className="open-only rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 relative group">
                <div className="px-6 py-4 break-all text-anywhere pr-16">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">
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
                            .replace("hover:bg-emerald-100", "bg-green-100")
                            .replace(
                              "hover:text-emerald-700",
                              "text-green-700",
                            );
                          setTimeout(() => {
                            icon.textContent = "📋";
                            text.textContent = "Копировать";
                            btn.className = btn.className
                              .replace("bg-green-100", "hover:bg-emerald-100")
                              .replace(
                                "text-green-700",
                                "hover:text-emerald-700",
                              );
                          }, 1500);
                        }
                      })
                      .catch(() => {
                        showToast(
                          "error",
                          "Ошибка копирования",
                          "Выделите текст вручную",
                        );
                      });
                  }}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1 px-3 py-1 rounded-lg text-xs bg-white/90 dark:bg-slate-800/90 border border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:text-emerald-700 dark:hover:text-emerald-300 backdrop-blur-sm shadow-sm"
                  title="Копировать реквизиты"
                >
                  <span className="copy-icon">📋</span>
                  <span className="copy-text">Копировать</span>
                </button>
              </div>
            </details>

            {/* Фотографии */}
            <div>
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Фотографии ({item.images.length})
              </h3>

              {item.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {item.images.map((img, i) => (
                    <div
                      key={i}
                      className="group relative overflow-hidden rounded-2xl cursor-zoom-in"
                      onClick={() => {
                        setLbIndex(i);
                        setLbOpen(true);
                      }}
                    >
                      <img
                        src={img.url}
                        alt={`Фото ${i + 1}`}
                        className="w-full h-40 object-cover rounded-2xl border border-gray-200 dark:border-gray-700 group-hover:scale-105 transition-transform duration-300"
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
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-lg font-medium">
                    Фотографии не прикреплены
                  </p>
                  <p className="text-sm">
                    Автор не добавил изображения к заявке
                  </p>
                </div>
              )}
            </div>

            {/* История */}
            <div>
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                История
              </h3>
              <div className="whitespace-pre-line break-all text-anywhere text-base leading-relaxed bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                {item.story}
              </div>
            </div>

            {/* Комментарий модератора */}
            {item.adminComment && (
              <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-6">
                <h3 className="flex items-center gap-2 font-semibold mb-3 text-amber-800 dark:text-amber-200">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Комментарий модератора
                </h3>
                <div className="break-all text-anywhere text-gray-800 dark:text-gray-200">
                  {item.adminComment}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
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
                <span>
                  Отправлено: {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Кнопка "Посмотреть историю" - только для одобренных заявок */}
                {item.status === "APPROVED" && (
                  <a
                    href={`/stories/${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl"
                  >
                    <svg
                      className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>Посмотреть историю</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}

                {/* Кнопка удаления */}
                <button
                  onClick={() => {
                    if (
                      confirm(
                        "Вы уверены, что хотите удалить эту заявку? Это действие нельзя отменить.",
                      )
                    ) {
                      deleteApplication();
                    }
                  }}
                  className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl"
                >
                  <svg
                    className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
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
                  <span>Удалить заявку</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Лайтбокс */}
      {lbOpen && item.images.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLbOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setLbOpen(false)}
            >
              ✕
            </button>
            {item.images.length > 1 && (
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                onClick={() =>
                  setLbIndex(
                    (i) => (i - 1 + item.images.length) % item.images.length,
                  )
                }
              >
                ‹
              </button>
            )}
            {item.images.length > 1 && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                onClick={() => setLbIndex((i) => (i + 1) % item.images.length)}
              >
                ›
              </button>
            )}
            <img
              src={item.images[lbIndex]?.url}
              alt=""
              className="w-full h-full object-contain select-none"
              draggable={false}
            />
            {item.images.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 text-center text-white/80 text-sm">
                {lbIndex + 1} / {item.images.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Красивый Toast */}
      <ToastComponent />
    </div>
  );
}
