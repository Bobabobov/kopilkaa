// app/admin/applications/[id]/_components/AdminSectionNav.tsx
"use client";

const sections = [
  { id: "section-context", label: "Контекст", labelShort: "Контекст" },
  { id: "section-payment", label: "Реквизиты", labelShort: "Реквизиты" },
  { id: "section-previous-review", label: "Прошлый отзыв", labelShort: "Прошлый отзыв" },
  { id: "section-tech", label: "IP и повторы", labelShort: "IP" },
  { id: "section-images", label: "Фото", labelShort: "Фото" },
  { id: "section-story", label: "История", labelShort: "История" },
  { id: "section-review", label: "Отзыв", labelShort: "Отзыв" },
  { id: "section-actions", label: "Действия", labelShort: "Действия" },
] as const;

export default function AdminSectionNav() {
  return (
    <nav
      className="sticky top-14 sm:top-20 lg:top-24 z-20 py-2 sm:py-4 mb-4 sm:mb-6 min-w-0 w-full"
      style={{
        background: "linear-gradient(180deg, rgba(0,30,29,0.97) 0%, rgba(0,30,29,0.9) 70%, transparent)",
      }}
      aria-label="Навигация по разделам"
    >
      <div className="flex flex-wrap gap-2 w-full">
        {sections.map(({ id, label, labelShort }) => (
          <a
            key={id}
            href={`#${id}`}
            className="inline-flex shrink-0 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors touch-manipulation"
            style={{
              color: "#abd1c6",
              backgroundColor: "rgba(171, 209, 198, 0.1)",
              border: "1px solid rgba(171, 209, 198, 0.2)",
            }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{labelShort}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
