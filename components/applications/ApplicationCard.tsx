"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { statusRu, statusColor } from "@/lib/status";
import { ImageGallery } from "./ImageGallery";

export interface ApplicationItem {
  id: string;
  title: string;
  summary: string;
  story: string;
  amount: number;
  payment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminComment: string | null;
  createdAt: string;
  images: { url: string; sort: number }[];
}

interface ApplicationCardProps {
  item: ApplicationItem;
  index: number;
  isExpanded: boolean;
  onToggleExpanded: (id: string) => void;
}

export function ApplicationCard({
  item,
  index,
  isExpanded,
  onToggleExpanded,
}: ApplicationCardProps) {
  const storyShort =
    item.story.length > 260 ? item.story.slice(0, 260) + "…" : item.story;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        scale: 1.01,
        y: -2,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700/50 shadow-md hover:shadow-lg transition-all duration-300"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start gap-2 justify-between mb-2 sm:mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1 break-words overflow-wrap-anywhere">
            {item.title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 break-words overflow-wrap-anywhere">
            {item.summary}
          </p>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${statusColor(item.status)}`}
        >
          {statusRu[item.status]}
        </div>
      </div>

      {/* Story */}
      <div className="mb-2 sm:mb-3">
        <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed break-words overflow-wrap-anywhere">
          {isExpanded ? item.story : storyShort}
          {item.story.length > 260 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-2 text-emerald-500 hover:text-emerald-600 font-medium transition-colors text-xs whitespace-nowrap"
              onClick={() => onToggleExpanded(item.id)}
            >
              {isExpanded ? "Свернуть" : "Показать полностью"}
            </motion.button>
          )}
        </div>
      </div>

      {/* Images */}
      <ImageGallery images={item.images} title={item.title} />

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <LucideIcons.Calendar size="xs" />
          <span className="hidden sm:inline">
            {new Date(item.createdAt).toLocaleDateString("ru-RU")}
          </span>
          <span className="sm:hidden">
            {new Date(item.createdAt).toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {item.images.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <LucideIcons.Image size="xs" />
              <span>{item.images.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Admin Comment */}
      {item.adminComment && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 sm:mt-3 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <div className="flex items-start gap-2">
            <LucideIcons.MessageCircle
              size="xs"
              className="text-emerald-500 mt-0.5 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                Комментарий модератора:
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 break-words overflow-wrap-anywhere">
                {item.adminComment}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
