// app/admin/ads/components/AdPlacementCard.tsx
"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { Advertisement } from "./types";

interface AdPlacementCardProps {
  ad: Advertisement;
  onEdit: (ad: Advertisement) => void;
  onDelete: (id: string) => void;
}

export default function AdPlacementCard({
  ad,
  onEdit,
  onDelete,
}: AdPlacementCardProps) {
  const getPlacementLabel = (placement?: string) => {
    switch (placement) {
      case "home_sidebar":
        return "Главная • блок под кнопками";
      case "home_banner":
        return "Главная • баннер";
      case "stories":
        return "Истории";
      case "other":
        return "Другое";
      default:
        return placement || "Не указано";
    }
  };

  return (
    <>
      <style jsx global>{`
        .ad-content-html ul,
        .ad-content-html ol {
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          padding-left: 0;
        }
        .ad-content-html ul {
          list-style-type: disc;
        }
        .ad-content-html ol {
          list-style-type: decimal;
        }
        .ad-content-html li {
          margin-bottom: 0.25rem;
          display: list-item;
        }
        .ad-content-html h3 {
          font-size: 1.125rem;
          font-weight: bold;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
          color: #fffffe;
        }
        .ad-content-html p {
          margin-bottom: 0.5rem;
        }
        .ad-content-html [style*="text-align: left"] {
          text-align: left;
        }
        .ad-content-html [style*="text-align: center"] {
          text-align: center;
        }
        .ad-content-html [style*="text-align: right"] {
          text-align: right;
        }
      `}</style>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group p-5 sm:p-6 bg-gradient-to-br from-[#001e1d] to-[#002724] rounded-xl border border-[#abd1c6]/20 hover:border-[#abd1c6]/40 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/20"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h3 className="text-lg sm:text-xl font-bold text-[#fffffe] break-words">{ad.title}</h3>
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap border ${
                    ad.isActive
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }`}
                >
                  {ad.isActive ? "Активно" : "Выключено"}
                </span>
                {ad.expiresAt && new Date(ad.expiresAt) > new Date() && (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 whitespace-nowrap">
                    Истекает: {new Date(ad.expiresAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Контент с поддержкой HTML форматирования */}
            <div className="mb-4 max-h-32 overflow-y-auto">
              {ad.placement === "stories" && ad.config?.storyText ? (
                <div
                  className="ad-content-html text-sm text-[#abd1c6] break-words line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: ad.config.storyText }}
                />
              ) : ad.content ? (
                <div
                  className="ad-content-html text-sm text-[#abd1c6] break-words line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: ad.content }}
                />
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#abd1c6]/70">
              <div className="flex items-center gap-1.5">
                <LucideIcons.Calendar size="xs" className="opacity-50" />
                <span className="whitespace-nowrap">{new Date(ad.createdAt).toLocaleDateString()}</span>
              </div>
              {ad.placement && (
                <span className="px-2 py-0.5 rounded-md bg-[#004643]/50 text-[#abd1c6] border border-[#0b3b33]/50 text-[10px] uppercase tracking-wide whitespace-nowrap">
                  {getPlacementLabel(ad.placement)}
                </span>
              )}
              {ad.linkUrl && (
                <a
                  href={ad.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f9bc60] hover:text-[#e8a545] transition-colors whitespace-nowrap flex items-center gap-1"
                >
                  <LucideIcons.ExternalLink size="xs" />
                  Ссылка
                </a>
              )}
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(ad)}
              className="p-2.5 bg-[#001e1d] hover:bg-[#f9bc60] text-[#abd1c6] hover:text-[#001e1d] rounded-lg border border-[#abd1c6]/20 hover:border-[#f9bc60] transition-all duration-200 hover:shadow-lg hover:shadow-[#f9bc60]/20"
              title="Редактировать"
            >
              <LucideIcons.Edit size="sm" />
            </button>
            <button
              onClick={() => onDelete(ad.id)}
              className="p-2.5 bg-[#001e1d] hover:bg-red-600 text-[#abd1c6] hover:text-white rounded-lg border border-[#abd1c6]/20 hover:border-red-600 transition-all duration-200 hover:shadow-lg hover:shadow-red-600/20"
              title="Удалить"
            >
              <LucideIcons.Trash2 size="sm" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

