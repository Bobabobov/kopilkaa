// app/admin/applications/[id]/_components/ApplicationPreviousReviewBlock.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { PreviousApprovedWithReview } from "../types";

interface ApplicationPreviousReviewBlockProps {
  data: PreviousApprovedWithReview | null | undefined;
  /** Показывать заголовок блока (если секция уже имеет свой заголовок — false) */
  showTitle?: boolean;
}

export default function ApplicationPreviousReviewBlock({
  data,
  showTitle = true,
}: ApplicationPreviousReviewBlockProps) {
  if (data === undefined) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={showTitle ? "mb-6" : ""}
    >
      {showTitle && (
        <h3
          className="flex items-center gap-2 text-lg sm:text-xl font-semibold mb-3"
          style={{ color: "#fffffe" }}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          Проверка: отчёт по прошлой заявке
        </h3>
      )}

      {!data ? (
        <div
          className="rounded-2xl p-3 sm:p-4 border min-w-0 bg-gradient-to-br from-[#004643]/80 via-[#004643]/70 to-[#001e1d]/80"
          style={{
            borderColor: "rgba(171, 209, 198, 0.4)",
            color: "#94a1b2",
          }}
        >
          <span className="text-xs sm:text-sm">
            Нет прошлой одобренной заявки (первая заявка пользователя или ещё не было одобрений).
          </span>
        </div>
      ) : !data.review ? (
        <div
          className="rounded-2xl p-3 sm:p-4 border min-w-0 bg-gradient-to-br from-[#f9bc60]/15 via-[#004643]/70 to-[#001e1d]/85"
          style={{
            borderColor: "rgba(249, 188, 96, 0.7)",
            color: "#f9bc60",
          }}
        >
          <p className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
            По прошлой одобренной заявке отзыв не оставлен.
          </p>
          <Link
            href={`/admin/applications/${data.id}`}
            className="text-xs underline hover:no-underline"
            style={{ color: "#abd1c6" }}
          >
            Открыть прошлую заявку: {data.title.slice(0, 50)}
            {data.title.length > 50 ? "…" : ""}
          </Link>

          {data.reportImages && data.reportImages.length > 0 && (
            <div className="mt-3">
              <p
                className="text-xs sm:text-sm font-medium mb-2"
                style={{ color: "#abd1c6" }}
              >
                Фото-отчёт по прошлой заявке
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {data.reportImages
                  .slice()
                  .sort((a, b) => a.sort - b.sort)
                  .map((img, idx) => (
                    <a
                      key={`${img.url}-${idx}`}
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg overflow-hidden border-2 hover:opacity-90 transition-opacity shrink-0"
                      style={{ borderColor: "rgba(171, 209, 198, 0.5)" }}
                    >
                      <img
                        src={img.url}
                        alt={`Фото-отчёт ${idx + 1}`}
                        className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover"
                      />
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div
            className="rounded-xl p-2.5 sm:p-3 mb-2 sm:mb-3 border flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0 bg-gradient-to-r from-[#004643]/80 to-[#001e1d]/85"
            style={{
              borderColor: "rgba(171, 209, 198, 0.5)",
              color: "#abd1c6",
            }}
          >
            <Link
              href={`/admin/applications/${data.id}`}
              className="text-xs sm:text-sm font-medium underline hover:no-underline break-words min-w-0"
              style={{ color: "#f9bc60" }}
            >
              Заявка: <span className="line-clamp-2">{data.title}</span>
            </Link>
            <span className="text-xs opacity-80">
              {new Date(data.createdAt).toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="text-xs opacity-80">
              Отзыв: {new Date(data.review.createdAt).toLocaleString("ru-RU")}
            </span>
          </div>
          <div
            className="rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-6 border mb-2 sm:mb-3 whitespace-pre-wrap break-words text-sm sm:text-[15px] lg:text-base leading-relaxed min-w-0 overflow-hidden bg-gradient-to-br from-[#f9bc60]/18 via-[#004643]/80 to-[#001e1d]/90"
            style={{
              borderColor: "rgba(249, 188, 96, 0.7)",
              color: "#f8fbfa",
            }}
          >
            {data.review.content}
          </div>
          {data.review.images && data.review.images.length > 0 && (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {data.review.images
                .sort((a, b) => a.sort - b.sort)
                .map((img, idx) => (
                  <a
                    key={`${img.url}-${idx}`}
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg overflow-hidden border-2 hover:opacity-90 transition-opacity shrink-0"
                    style={{ borderColor: "rgba(249, 188, 96, 0.4)" }}
                  >
                    <img
                      src={img.url}
                      alt={`Фото отзыва ${idx + 1}`}
                      className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover"
                    />
                  </a>
                ))}
            </div>
          )}
          {data.reportImages && data.reportImages.length > 0 && (
            <div className="mt-3">
              <p className="text-xs sm:text-sm font-medium mb-2" style={{ color: "#abd1c6" }}>
                Фото-отчёт по прошлой заявке
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {data.reportImages
                  .slice()
                  .sort((a, b) => a.sort - b.sort)
                  .map((img, idx) => (
                    <a
                      key={`${img.url}-${idx}`}
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg overflow-hidden border-2 hover:opacity-90 transition-opacity shrink-0"
                      style={{ borderColor: "rgba(171, 209, 198, 0.5)" }}
                    >
                      <img
                        src={img.url}
                        alt={`Фото-отчёт ${idx + 1}`}
                        className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover"
                      />
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
