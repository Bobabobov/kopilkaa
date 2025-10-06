"use client";

export default function SettingsHeader() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-white/90 via-white/80 to-white/90 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/90 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20">
      <div className="relative z-10 w-full px-6 pt-32 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <a
              href="/profile"
              className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105"
              title="Назад к профилю"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </a>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Настройки профиля
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Управление вашими данными и предпочтениями
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
