// app/admin/ads/components/ad-requests/AdRequestCard.tsx
"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { AdRequest } from "./types";
import { formatLabels, statusLabels, statusColors } from "./constants";

interface AdRequestCardProps {
  request: AdRequest;
  onProcess: (request: AdRequest) => void;
  onDelete: (id: string) => void;
}

export default function AdRequestCard({
  request,
  onProcess,
  onDelete,
}: AdRequestCardProps) {
  const imageCount =
    (request.imageUrls && Array.isArray(request.imageUrls)
      ? request.imageUrls.length
      : request.bannerUrl
        ? 1
        : 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-5 sm:p-6 bg-gradient-to-br from-[#001e1d] via-[#001e1d] to-[#00312b] rounded-xl border border-[#abd1c6]/20 hover:border-[#f9bc60]/50 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6 mb-4">
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h3 className="text-xl font-bold text-[#fffffe] break-words max-w-full">
              {request.companyName}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border shrink-0 ${statusColors[request.status]}`}
            >
              {statusLabels[request.status]}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            {/* Основная информация */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 min-w-0">
                <div className="break-words">
                  <span className="font-medium text-[#fffffe] block mb-1">
                    Имя / Название компании:
                  </span>
                  <span className="text-[#abd1c6]">{request.companyName}</span>
                </div>
                <div className="break-words">
                  <span className="font-medium text-[#fffffe] block mb-1">
                    Email:
                  </span>
                  <a
                    href={`mailto:${request.email}`}
                    className="text-[#f9bc60] hover:underline break-all"
                  >
                    {request.email}
                  </a>
                </div>
                {request.website && (
                  <div className="break-words">
                    <span className="font-medium text-[#fffffe] block mb-1">
                      Ссылка на сайт/товар:
                    </span>
                    <a
                      href={request.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f9bc60] hover:underline break-all"
                    >
                      {request.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <span className="font-medium text-[#fffffe] block mb-1">
                    Формат размещения:
                  </span>
                  <span className="text-[#abd1c6]">
                    {formatLabels[request.format] || request.format}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-[#fffffe] block mb-1">
                    Срок:
                  </span>
                  <span className="text-[#abd1c6]">
                    {request.duration} дней
                  </span>
                </div>
                <div>
                  <span className="font-medium text-[#fffffe] block mb-1">
                    Дата создания:
                  </span>
                  <span className="text-xs text-[#94b3aa]">
                    {new Date(request.createdAt).toLocaleString("ru-RU")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Изображения */}
          {imageCount > 0 && (
            <div className="mt-4">
              <div className="text-xs uppercase tracking-wide text-[#7fb2a7] mb-2">
                Изображения ({imageCount})
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {request.imageUrls && Array.isArray(request.imageUrls)
                  ? request.imageUrls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group"
                      >
                        <img
                          src={url}
                          alt={`Изображение ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-[#abd1c6]/20 hover:border-[#f9bc60] transition-colors"
                        />
                      </a>
                    ))
                  : request.bannerUrl && (
                      <a
                        href={request.bannerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group"
                      >
                        <img
                          src={request.bannerUrl}
                          alt="Баннер"
                          className="w-full h-32 object-cover rounded-lg border border-[#abd1c6]/20 hover:border-[#f9bc60] transition-colors"
                        />
                      </a>
                    )}
              </div>
            </div>
          )}

          {/* Мобильные баннеры */}
          {request.mobileBannerUrls &&
            Array.isArray(request.mobileBannerUrls) &&
            request.mobileBannerUrls.length > 0 && (
              <div className="mt-4">
                <div className="text-xs uppercase tracking-wide text-[#7fb2a7] mb-2">
                  Мобильные баннеры ({request.mobileBannerUrls.length})
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {request.mobileBannerUrls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group"
                    >
                      <img
                        src={url}
                        alt={`Мобильный баннер ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-[#abd1c6]/20 hover:border-[#f9bc60] transition-colors"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

          {request.comment && (
            <div className="mt-4 rounded-2xl bg-[#002724] border border-[#0b3b33]/70 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-[#7fb2a7] mb-1">
                Комментарий
              </div>
              <div className="text-sm text-[#e5f5f1] whitespace-pre-wrap break-words overflow-wrap-anywhere">
                {request.comment}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-row md:flex-col gap-2 md:items-end shrink-0">
          <button
            onClick={() => onProcess(request)}
            className="px-4 py-2.5 bg-[#001e1d] hover:bg-[#abd1c6] text-[#abd1c6] hover:text-[#001e1d] font-medium rounded-xl border border-[#abd1c6]/30 hover:border-[#abd1c6] transition-all duration-200 flex items-center gap-2 text-sm hover:shadow-lg hover:shadow-[#abd1c6]/10"
          >
            <LucideIcons.Edit size="sm" />
            Обработать
          </button>
          <button
            onClick={() => onDelete(request.id)}
            className="px-4 py-2.5 bg-[#001e1d] hover:bg-red-600 text-[#abd1c6] hover:text-white font-medium rounded-xl border border-[#abd1c6]/30 hover:border-red-600 transition-all duration-200 flex items-center gap-2 text-sm hover:shadow-lg hover:shadow-red-600/20"
          >
            <LucideIcons.Trash2 size="sm" />
            Удалить
          </button>
        </div>
      </div>

      {request.adminComment && (
        <div className="mt-3 p-4 bg-[#002724] rounded-2xl border border-[#f9bc60]/40">
          <div className="text-xs text-[#f9bc60] mb-1 uppercase tracking-wide">
            Комментарий администратора
          </div>
          <div className="text-sm text-[#fffffe] whitespace-pre-wrap break-words overflow-wrap-anywhere">
            {request.adminComment}
          </div>
        </div>
      )}
    </motion.div>
  );
}
