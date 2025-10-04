// app/admin/components/ApplicationCard.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ApplicationItem, ApplicationStatus } from "../types";
import Badge from "./Badge";
import { getAvatarFrame } from "@/lib/header-customization";

interface ApplicationCardProps {
  application: ApplicationItem;
  index: number;
  visibleEmails: Set<string>;
  onToggleEmail: (id: string) => void;
  onEdit: (id: string, status: ApplicationStatus, comment: string) => void;
  onQuickApprove: (id: string, status: ApplicationStatus, comment: string) => void;
  onQuickReject: (id: string, status: ApplicationStatus, comment: string) => void;
  onDelete: (id: string, title: string) => void;
}

export default function ApplicationCard({
  application: it,
  index,
  visibleEmails,
  onToggleEmail,
  onEdit,
  onQuickApprove,
  onQuickReject,
  onDelete,
}: ApplicationCardProps) {
  const shownEmails = visibleEmails;
  
  // Обрезаем текст истории если слишком длинный
  const truncatedStory = it.story.length > 260 ? it.story.slice(0, 260) + "…" : it.story;

  return (
    <motion.div
      key={it.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-lime-500/5 group-hover:from-emerald-500/10 group-hover:via-green-500/10 group-hover:to-lime-500/10 transition-all duration-500"></div>

      <div className="relative">
        {/* Шапка */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4 sm:mb-6">
          <div className="min-w-0 flex-1 basis-0">
            <a
              href={`/admin/applications/${it.id}`}
              className="text-lg sm:text-xl font-bold clamp-2 break-words max-w-full text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline transition-colors cursor-pointer"
              title="Открыть полную заявку"
            >
              {it.title}
            </a>
            
            {/* Сумма запроса - выделенная */}
            <div className="mt-3 mb-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-2xl border border-emerald-200 dark:border-emerald-700/50">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                  ₽{it.amount.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  Сумма запроса
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-2">
              {/* Аватарка автора */}
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                {(() => {
                  const frame = getAvatarFrame(it.user.avatarFrame || 'none');
                  const frameKey = it.user.avatarFrame || 'none';
                  
                  if (frame.type === 'image') {
                    // Рамка-картинка
                    return (
                      <div className="w-full h-full rounded-full overflow-hidden relative">
                        {/* Рамка как фон */}
                        <div
                          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat rounded-full"
                          style={{ backgroundImage: `url(${(frame as any).imageUrl || '/default-avatar.png'})` }}
                        />
                        {/* Аватар поверх рамки */}
                        <div className="absolute inset-0.5 rounded-full overflow-hidden">
                          {it.user.avatar ? (
                            <img
                              src={it.user.avatar}
                              alt={it.user.name || "Автор"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600 text-white font-bold text-xs">
                              {(it.user.name || (!it.user.hideEmail ? it.user.email : 'Пользователь'))[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  } else {
                    // CSS рамка (only 'none' remains now)
                    return (
                      <div className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs ${frame.className} ${
                        it.user.avatar ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600'
                      }`}>
                        {it.user.avatar ? (
                          <img
                            src={it.user.avatar}
                            alt={it.user.name || "Автор"}
                            className={`w-full h-full object-cover rounded-full ${frameKey === 'rainbow' ? 'rounded-full' : ''}`}
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center rounded-full ${frameKey === 'rainbow' ? 'rounded-full' : ''}`}>
                            {(it.user.name || (!it.user.hideEmail ? it.user.email : 'Пользователь'))[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                    );
                  }
                })()}
              </div>
              
              {/* Информация об авторе */}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-500 dark:text-gray-400 break-words">
                  <span className="font-medium">Автор:</span>{" "}
                  <Link 
                    href={`/profile/${it.user.id}`}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 hover:underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {it.user.name || (!it.user.hideEmail ? it.user.email.split('@')[0] : 'Пользователь')}
                  </Link>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {shownEmails.has(it.id) ? (
                    <span>{!it.user.hideEmail ? it.user.email : 'Email скрыт'}</span>
                  ) : (
                    <button
                      onClick={() => onToggleEmail(it.id)}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      {!it.user.hideEmail ? 'Показать email' : 'Email скрыт'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 w-full lg:w-auto">
            <Badge status={it.status} />
            
            {/* Кнопки действий */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                className="group px-3 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                onClick={() => onEdit(it.id, it.status, it.adminComment || "")}
              >
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
                <span className="hidden sm:inline">Изменить</span>
              </button>

              <button
                className="group px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                onClick={() => onQuickApprove(it.id, "APPROVED", it.adminComment || "")}
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden sm:inline">Одобрить</span>
              </button>
              
              <button
                className="group px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                onClick={() => onQuickReject(it.id, "REJECTED", it.adminComment || "")}
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="hidden sm:inline">Отказать</span>
              </button>

              <button
                className="group px-3 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                onClick={() => onDelete(it.id, it.title)}
                title="Удалить заявку"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline">Удалить</span>
              </button>
            </div>
          </div>
        </div>

        {/* Кратко */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="text-gray-700 dark:text-gray-300 clamp-2 break-words max-w-full leading-relaxed">
            {it.summary}
          </div>
        </div>

        {/* Реквизиты */}
        <details className="toggle text-sm mb-4 sm:mb-6">
          <summary className="flex items-center gap-2 cursor-pointer select-none text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 font-medium transition-colors">
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
            Показать реквизиты
          </summary>
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="text-gray-700 dark:text-gray-300 break-words">
              {it.paymentDetails}
            </div>
          </div>
        </details>

        {/* История */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="text-gray-700 dark:text-gray-300 break-words max-w-full leading-relaxed">
            {truncatedStory}
          </div>
        </div>

        {/* Футер */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Отправлено: {new Date(it.createdAt).toLocaleString('ru-RU')}</span>
          </div>
          
          <a
            href={`/admin/applications/${it.id}`}
            className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl"
          >
            <span>Подробнее</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
