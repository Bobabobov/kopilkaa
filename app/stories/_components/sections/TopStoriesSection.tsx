"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Story as StoryItem } from "@/hooks/stories/useStories";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { formatAmount } from "@/lib/format";

interface TopStoriesSectionProps {
  topStories: StoryItem[];
  readStoryIds: Set<string>;
}

const RANK_CONFIG = [
  {
    label: "#1",
    gradient: "from-[#f9bc60] via-[#e8a545] to-[#d4942a]",
    shadow: "shadow-[0_0_20px_rgba(249,188,96,0.35)]",
    ring: "ring-[#f9bc60]/50",
    text: "text-[#001e1d]",
    star: true,
  },
  {
    label: "#2",
    gradient: "from-[#c8d5d2] via-[#abd1c6] to-[#8fb8ad]",
    shadow: "shadow-[0_0_16px_rgba(171,209,198,0.3)]",
    ring: "ring-[#abd1c6]/50",
    text: "text-[#001e1d]",
    star: true,
  },
  {
    label: "#3",
    gradient: "from-[#e8a545] via-[#d4942a] to-[#b87a1f]",
    shadow: "shadow-[0_0_14px_rgba(232,165,69,0.3)]",
    ring: "ring-[#e8a545]/50",
    text: "text-[#001e1d]",
    star: false,
  },
] as const;

export function TopStoriesSection({
  topStories,
  readStoryIds,
}: TopStoriesSectionProps) {
  const router = useRouter();

  return (
    <section className="container mx-auto px-4 pt-2 pb-10 sm:pb-12" aria-labelledby="top-stories-heading">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-[#abd1c6]/25 bg-gradient-to-br from-[#004643]/60 via-[#003d3a]/50 to-[#001e1d]/70 backdrop-blur-xl shadow-[0_25px_60px_-20px_rgba(0,0,0,0.4),0_0_0_1px_rgba(171,209,198,0.08)]">
        {/* Декоративная полоска сверху */}
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-[1.75rem] bg-gradient-to-r from-[#f9bc60]/80 via-[#abd1c6]/60 to-[#f9bc60]/80" />

        {/* Фоновые блики */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#f9bc60]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#abd1c6]/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-96 rounded-full bg-[#004643]/30 blur-3xl" />
        {/* Тонкий узор точек */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #abd1c6 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative p-6 sm:p-8 md:p-10">
          {/* Заголовок секции */}
          <header className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-10 text-center">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f9bc60]/35 to-[#e8a545]/25 border border-[#f9bc60]/50 text-[#f9bc60] shadow-[0_4px_24px_rgba(249,188,96,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]">
                <LucideIcons.Trophy size="md" />
                {/* Маленькие «звёздочки» у кубка */}
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#f9bc60]/80" />
                <span className="absolute -bottom-0.5 -left-0.5 h-1.5 w-1.5 rounded-full bg-[#abd1c6]/80" />
              </span>
              <div>
                <h2 id="top-stories-heading" className="text-2xl sm:text-3xl font-black text-[#fffffe] tracking-tight">
                  Топ историй
                </h2>
                <p className="mt-0.5 text-xs font-medium text-[#abd1c6]/80 uppercase tracking-wider">
                  Лучшие по лайкам
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#abd1c6]/15 border border-[#abd1c6]/40 px-4 py-2.5 text-sm font-semibold text-[#abd1c6] shadow-[0_2px_8px_rgba(0,30,29,0.2)]">
              <LucideIcons.Heart
                size="sm"
                className="text-[#e16162] fill-[#e16162]/60 shrink-0"
              />
              по лайкам
            </span>
          </header>

          {/* Декоративная линия под заголовком */}
          <div className="flex items-center justify-center gap-3 mb-8 sm:mb-10">
            <span className="h-px flex-1 max-w-[80px] sm:max-w-[120px] bg-gradient-to-r from-transparent to-[#abd1c6]/40 rounded-full" />
            <span className="text-[#abd1c6]/50">
              <LucideIcons.Star size="xs" className="w-4 h-4" />
            </span>
            <span className="h-px flex-1 max-w-[80px] sm:max-w-[120px] bg-gradient-to-l from-transparent to-[#abd1c6]/40 rounded-full" />
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 list-none p-0 m-0">
            {topStories.map((story, index) => {
              const amountText = formatAmount(story.amount);
              const imageUrl = story.images?.[0]?.url || "/stories-preview.jpg";
              const avatarUrl = story.user?.avatar || "/default-avatar.png";
              const authorName =
                story.user?.name || story.user?.email || "Неизвестный автор";
              const rank = RANK_CONFIG[Math.min(index, 2)];
              const isRead = readStoryIds.has(story.id);

              return (
                <li
                  key={story.id}
                  className={`animate-fade-in-up ${
                    index === 0
                      ? "animate-fade-in-up"
                      : index === 1
                        ? "animate-fade-in-up-delay-1"
                        : "animate-fade-in-up-delay-2"
                  }`}
                >
                  <article
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/stories/${story.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push(`/stories/${story.id}`);
                      }
                    }}
                    aria-label={`Открыть историю: ${story.title}`}
                    className="group relative overflow-hidden rounded-2xl border border-[#abd1c6]/20 bg-[#001e1d]/70 transition-all duration-300 hover:border-[#f9bc60]/50 hover:shadow-[0_20px_50px_-15px_rgba(249,188,96,0.25),0_0_0_1px_rgba(249,188,96,0.1)] hover:-translate-y-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#001e1d]"
                  >
                  {/* Лёгкий блик по верхнему краю карточки */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[#abd1c6]/30 to-transparent rounded-t-2xl" />

                  {/* Область изображения */}
                  <div className="relative h-44 sm:h-52 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={story.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = "/stories-preview.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001e1d]/95 via-[#001e1d]/40 to-transparent" />
                    {/* Бейдж ранга */}
                    <div
                      className={`absolute top-4 left-4 inline-flex items-center justify-center gap-1 rounded-xl bg-gradient-to-br ${rank.gradient} ${rank.shadow} ring-2 ${rank.ring} px-3 py-1.5 text-sm font-bold ${rank.text}`}
                    >
                      {rank.star && (
                        <LucideIcons.Star size="xs" className="w-3.5 h-3.5 shrink-0" />
                      )}
                      {rank.label}
                    </div>
                    {/* Автор поверх изображения */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                      {story.user?.id ? (
                        <Link
                          href={`/profile/${story.user.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 text-sm font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] hover:text-[#f9bc60] transition-colors truncate min-w-0"
                        >
                          <img
                            src={avatarUrl}
                            alt=""
                            loading="lazy"
                            className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-[#001e1d]/90"
                            onError={(e) => {
                              e.currentTarget.src = "/default-avatar.png";
                            }}
                          />
                          <span className="truncate">{authorName}</span>
                        </Link>
                      ) : (
                        <>
                          <img
                            src={avatarUrl}
                            alt=""
                            loading="lazy"
                            className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-[#001e1d]/90"
                            onError={(e) => {
                              e.currentTarget.src = "/default-avatar.png";
                            }}
                          />
                          <span className="text-sm font-semibold text-white truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            {authorName}
                          </span>
                        </>
                      )}
                    </div>
                    {/* CTA при наведении */}
                    <div className="absolute inset-0 flex items-center justify-center bg-[#001e1d]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#f9bc60] px-5 py-2.5 text-sm font-bold text-[#001e1d] shadow-lg ring-2 ring-[#001e1d]/20">
                        Читать
                        <LucideIcons.ArrowRight size="sm" />
                      </span>
                    </div>
                  </div>

                  {/* Контент карточки */}
                  <div className="relative p-5 sm:p-6">
                    {/* Декоративная линия внизу карточки */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-gradient-to-r from-transparent via-[#f9bc60]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <h3 className="text-lg font-bold text-[#fffffe] line-clamp-2 leading-snug group-hover:text-[#f9bc60] transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-sm text-[#abd1c6]/95 mt-2 line-clamp-2 leading-relaxed">
                      {story.summary}
                    </p>
                    <div className="flex items-center justify-between gap-3 mt-5 flex-wrap">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center gap-2 rounded-lg border border-[#abd1c6]/25 bg-[#001e1d]/50 px-2.5 py-1.5 text-sm font-semibold text-[#abd1c6] shadow-[0_0_0_1px_rgba(171,209,198,0.1)]">
                          <LucideIcons.Heart
                            size="sm"
                            className="text-[#e16162] fill-[#e16162]/60 shrink-0"
                          />
                          <span className="tabular-nums">{story._count?.likes ?? 0}</span>
                        </span>
                        {amountText && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#f9bc60]/25 bg-[#f9bc60]/10 px-2.5 py-1.5 text-sm font-bold text-[#f9bc60]">
                            <LucideIcons.Ruble size="sm" className="shrink-0" />
                            {amountText} ₽
                          </span>
                        )}
                        {isRead && (
                          <span className="inline-flex items-center gap-1 rounded-lg border border-[#abd1c6]/40 bg-[#abd1c6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#001e1d]">
                            <LucideIcons.Check size="xs" className="w-3 h-3 shrink-0" />
                            прочитано
                          </span>
                        )}
                      </div>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f9bc60]/15 text-[#f9bc60] opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden>
                        <LucideIcons.ArrowRight size="sm" />
                      </span>
                    </div>
                  </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
