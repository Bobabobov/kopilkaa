"use client";

export function StoriesLoading() {
  return (
    <div className="container mx-auto px-4 py-8" role="status" aria-label="Загрузка списка историй">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 list-none p-0 m-0">
        {[...Array(12)].map((_, index) => {
          const getAnimationClass = () => {
            const delay = index * 0.1;
            if (delay <= 0.1) return "animate-fade-in-up";
            if (delay <= 0.2) return "animate-fade-in-up-delay-1";
            if (delay <= 0.3) return "animate-fade-in-up-delay-2";
            if (delay <= 0.4) return "animate-fade-in-up-delay-3";
            if (delay <= 0.5) return "animate-fade-in-up-delay-4";
            return "animate-fade-in-up-delay-5";
          };

          return (
            <li
              key={index}
              className={`h-full ${getAnimationClass()}`}
              aria-hidden
            >
              <div
                className="h-full rounded-3xl overflow-hidden flex flex-col bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-2xl border border-[#abd1c6]/40 shadow-[0_20px_25px_-5px_rgba(0,70,67,0.08)]"
                style={{
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 70, 67, 0.1), 0 10px 10px -5px rgba(0, 70, 67, 0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
                }}
              >
                {/* Блик по верхнему краю */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#abd1c6]/30 to-transparent shrink-0" />

                {/* Изображение скелетон — как у карточки (aspect ~ 4/3) */}
                <div className="relative w-full aspect-[4/3] shrink-0 overflow-hidden">
                  <div className="absolute inset-0 bg-[#abd1c6]/25 animate-pulse" />
                </div>

                {/* Контент скелетон */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-4">
                  {/* Заголовок */}
                  <div className="space-y-2">
                    <div className="h-5 bg-[#abd1c6]/30 rounded-lg animate-pulse w-full" />
                    <div className="h-5 bg-[#abd1c6]/25 rounded-lg animate-pulse w-4/5" />
                  </div>

                  {/* Описание */}
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-[#abd1c6]/20 rounded animate-pulse w-full" />
                    <div className="h-4 bg-[#abd1c6]/20 rounded animate-pulse w-full" />
                    <div className="h-4 bg-[#abd1c6]/20 rounded animate-pulse w-2/3" />
                  </div>

                  {/* Метаданные (автор, лайки) */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="h-4 bg-[#abd1c6]/25 rounded-full animate-pulse w-24" />
                    <div className="h-8 w-16 bg-[#abd1c6]/20 rounded-full animate-pulse" />
                  </div>

                  {/* Нижняя граница и дата */}
                  <div className="pt-3 border-t border-[#abd1c6]/30">
                    <div className="h-3 bg-[#abd1c6]/20 rounded w-20 animate-pulse" />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
