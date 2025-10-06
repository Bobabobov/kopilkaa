"use client";

export function StoriesLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <div
              key={index}
              className={`bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 h-full ${getAnimationClass()}`}
              style={{ borderColor: "#abd1c6/30" }}
            >
              {/* Изображение скелетон */}
              <div className="mb-4 rounded-xl overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
              </div>

              {/* Контент скелетон */}
              <div className="space-y-4">
                {/* Заголовок */}
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>

                {/* Описание */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>

                {/* Метаданные */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                </div>

                {/* Дата */}
                <div
                  className="pt-2 border-t"
                  style={{ borderColor: "#abd1c6/50" }}
                >
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
