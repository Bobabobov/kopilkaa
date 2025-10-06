"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface TipsSidebarProps {
  title: string;
  summary: string;
  story: string;
  photos: File[];
}

export default function TipsSidebar({
  title,
  summary,
  story,
  photos,
}: TipsSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="xl:col-span-1 space-y-6"
    >
      {/* Tips Section */}
      <div className="backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/30 shadow-lg">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
          <LucideIcons.HelpCircle size="sm" className="text-emerald-500" />
          Советы
        </h3>
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start gap-3">
            <LucideIcons.CheckCircle
              size="sm"
              className="text-green-500 mt-0.5 flex-shrink-0"
            />
            <span>Будьте честными и конкретными в описании ситуации</span>
          </div>
          <div className="flex items-start gap-3">
            <LucideIcons.CheckCircle
              size="sm"
              className="text-green-500 mt-0.5 flex-shrink-0"
            />
            <span>Добавьте фотографии для лучшего понимания</span>
          </div>
          <div className="flex items-start gap-3">
            <LucideIcons.CheckCircle
              size="sm"
              className="text-green-500 mt-0.5 flex-shrink-0"
            />
            <span>Укажите точную сумму и цель сбора</span>
          </div>
          <div className="flex items-start gap-3">
            <LucideIcons.CheckCircle
              size="sm"
              className="text-green-500 mt-0.5 flex-shrink-0"
            />
            <span>Проверьте реквизиты перед отправкой</span>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      {(title || summary || story) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/30 shadow-lg"
        >
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
            <LucideIcons.Eye size="sm" className="text-emerald-500" />
            Предварительный просмотр
          </h3>
          <div className="space-y-3 text-sm">
            {title && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Заголовок:
                </div>
                <div className="text-gray-900 dark:text-white font-medium line-clamp-2">
                  {title}
                </div>
              </div>
            )}
            {summary && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Описание:
                </div>
                <div className="text-gray-700 dark:text-gray-300 line-clamp-3">
                  {summary}
                </div>
              </div>
            )}
            {story && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  История:
                </div>
                <div className="text-gray-700 dark:text-gray-300 line-clamp-4">
                  {story}
                </div>
              </div>
            )}
            {photos.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <LucideIcons.Image size="sm" />
                <span>{photos.length} фото добавлено</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
