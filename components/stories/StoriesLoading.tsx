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
                className="h-full rounded-2xl overflow-hidden flex flex-col border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
                style={{
                  background: "linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                }}
              >
                <div className="h-px bg-white/10 shrink-0" aria-hidden />

                <div className="relative w-full aspect-[4/3] shrink-0 overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 animate-pulse" />
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="h-5 bg-white/15 rounded-lg animate-pulse w-full" />
                    <div className="h-5 bg-white/10 rounded-lg animate-pulse w-4/5" />
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/10 rounded animate-pulse w-full" />
                    <div className="h-4 bg-white/10 rounded animate-pulse w-full" />
                    <div className="h-4 bg-white/10 rounded animate-pulse w-2/3" />
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="h-4 bg-white/15 rounded-full animate-pulse w-24" />
                    <div className="h-8 w-16 bg-white/10 rounded-full animate-pulse" />
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <div className="h-3 bg-white/10 rounded w-20 animate-pulse" />
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
