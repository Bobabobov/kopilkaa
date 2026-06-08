"use client";

export function StoriesLoading() {
  return (
    <div
      className="container mx-auto max-w-6xl px-4 py-6"
      role="status"
      aria-label="Загрузка списка историй"
    >
      <div className="rounded-2xl border border-white/[0.1] bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6">
        <div className="h-5 w-40 rounded-lg bg-white/10 animate-pulse mb-6" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0">
          {[...Array(9)].map((_, index) => {
            const delayClass =
              index % 3 === 0
                ? "animate-fade-in-up"
                : index % 3 === 1
                  ? "animate-fade-in-up-delay-1"
                  : "animate-fade-in-up-delay-2";

            return (
              <li key={index} className={delayClass} aria-hidden>
                <div className="rounded-2xl border border-white/[0.1] bg-white/[0.04] overflow-hidden flex flex-col">
                  <div className="aspect-[4/3] bg-white/[0.06] animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-white/10 rounded animate-pulse w-full" />
                    <div className="h-4 bg-white/10 rounded animate-pulse w-4/5" />
                    <div className="h-3 bg-white/[0.06] rounded animate-pulse w-2/3" />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
