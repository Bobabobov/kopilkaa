"use client";

const SECTIONS = [
  { id: "section-profile", label: "Профиль" },
  { id: "section-applications", label: "Заявки" },
  { id: "section-economy", label: "Бонусы" },
  { id: "section-good-deeds", label: "Добрые дела" },
  { id: "section-links", label: "Связи" },
  { id: "section-reviews", label: "Отзывы" },
  { id: "section-referrals", label: "Рефералы" },
  { id: "section-social", label: "Соц." },
  { id: "section-actions", label: "Управление" },
] as const;

export function AdminUserSectionNav() {
  return (
    <nav
      className="mb-4 flex gap-2 overflow-x-auto pb-1"
      aria-label="Разделы карточки пользователя"
    >
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="shrink-0 rounded-xl border-2 border-[#abd1c6]/20 bg-[#001e1d]/50 px-3 py-2 text-xs font-bold text-[#abd1c6] transition-all hover:border-[#f9bc60]/40 hover:bg-[#f9bc60]/10 hover:text-[#fffffe]"
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}
