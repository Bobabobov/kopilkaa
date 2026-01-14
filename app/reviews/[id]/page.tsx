"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import { StoryLightbox } from "@/components/stories/StoryLightbox";
import type { ReviewItem } from "@/hooks/reviews/useReviews";

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [review, setReview] = useState<ReviewItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/reviews/${id}`, { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Не удалось загрузить отзыв");
        setReview(json.review);
      })
      .catch(() => setReview(null))
      .finally(() => setLoading(false));
  }, [id]);

  const formattedDate = useMemo(() => {
    if (!review) return "";
    return new Date(review.createdAt).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [review]);

  if (loading) {
    return (
      <main className="min-h-screen px-4 sm:px-6 lg:px-10 py-10 flex items-center justify-center text-[#abd1c6]">
        <div className="flex items-center gap-2 text-sm">
          <LucideIcons.Loader2 className="h-5 w-5 animate-spin" />
          Загружаем отзыв...
        </div>
      </main>
    );
  }

  if (!review) {
    return (
      <main className="min-h-screen px-4 sm:px-6 lg:px-10 py-10 flex items-center justify-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg px-6 py-4 text-white/80 shadow-2xl">
          Отзыв не найден
        </div>
      </main>
    );
  }

  const { user } = review;
  const avatar = user?.avatar || "/default-avatar.png";
  const heroImage = review.images?.[0]?.url;
  const trustLevelNumber = user?.trust?.status?.split("_")[1];
  const trustTitle = trustLevelNumber ? `Уровень одобрения ${trustLevelNumber}` : "Уровень одобрения";
  const profileHref = user?.id ? `/profile/${user.id}` : null;

  return (
    <main className="min-h-screen px-3 xs:px-4 sm:px-6 lg:px-10 py-4 sm:py-6 md:py-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4 md:space-y-5 w-full">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white/80 hover:text-white hover:border-white/30 hover:bg-white/10 transition-colors"
        >
          <LucideIcons.ArrowLeft size="sm" />
          <span className="hidden xs:inline">Назад к отзывам</span>
          <span className="xs:hidden">Назад</span>
        </button>

        <article className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.85)] w-full">
          {/* Подсветки */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-10 w-40 sm:w-60 h-40 sm:h-60 bg-[#f9bc60]/15 blur-3xl" />
            <div className="absolute right-0 -bottom-16 w-48 sm:w-72 h-48 sm:h-72 bg-[#abd1c6]/20 blur-3xl" />
          </div>

          {/* Хедер с картинкой */}
          <div className="relative">
            {review.images && review.images.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }}
                className="aspect-[2/1] sm:aspect-[16/7] w-full overflow-hidden bg-gradient-to-br from-[#001e1d] via-[#0b2f2c] to-[#102b2a] relative group cursor-pointer"
              >
                <img
                  src={heroImage || "/stories-preview.jpg"}
                  alt="Обложка отзыва"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "/stories-preview.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
                    <LucideIcons.ZoomIn size="sm" className="text-white" />
                    <span className="text-xs text-white font-medium">Открыть фото</span>
                  </div>
                </div>
              </button>
            ) : (
              <div className="aspect-[2/1] sm:aspect-[16/7] w-full overflow-hidden bg-gradient-to-br from-[#001e1d] via-[#0b2f2c] to-[#102b2a]">
                <img
                  src="/stories-preview.jpg"
                  alt="Обложка отзыва"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/stories-preview.jpg";
                  }}
                />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000cc] via-[#00000066] to-transparent" />

            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex flex-col gap-2 sm:gap-3 md:gap-4 md:flex-row md:items-end md:justify-between w-auto min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1 max-w-full">
                {profileHref ? (
                  <Link
                    href={profileHref}
                    className="relative block focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/70 rounded-xl sm:rounded-2xl transition-transform hover:-translate-y-0.5 flex-shrink-0"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-white/5">
                      <img
                        src={avatar}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/default-avatar.png";
                        }}
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-white/5">
                      <img
                        src={avatar}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/default-avatar.png";
                        }}
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1 max-w-full">
                  {profileHref ? (
                    <Link
                      href={profileHref}
                      className="block text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white hover:text-[#f9bc60] transition-colors break-words w-full"
                    >
                      {user?.name || "Аноним"}
                    </Link>
                  ) : (
                    <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white break-words w-full">{user?.name || "Аноним"}</h1>
                  )}
                  {user?.username && (
                    profileHref ? (
                      <Link
                        href={profileHref}
                        className="block text-xs sm:text-sm text-white/70 hover:text-white transition-colors break-all w-full"
                      >
                        @{user.username}
                      </Link>
                    ) : (
                      <p className="text-xs sm:text-sm text-white/70 break-all w-full">@{user.username}</p>
                    )
                  )}
                  {user?.trust && (
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] xs:text-xs text-white/85 bg-white/10 border border-white/15 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg backdrop-blur flex-wrap max-w-full">
                      <LucideIcons.Shield size="xs" className="text-[#f9bc60] flex-shrink-0" />
                      <span className="font-semibold break-words min-w-0">{trustTitle}</span>
                      <span className="opacity-80 whitespace-nowrap flex-shrink-0">· {user.trust.supportRange}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[10px] xs:text-xs text-white/75 bg-white/10 border border-white/15 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 backdrop-blur-md inline-flex items-center gap-1.5 sm:gap-2 self-start md:self-auto flex-shrink-0 whitespace-nowrap">
                <LucideIcons.Calendar size="xs" />
                <span className="hidden sm:inline">{formattedDate}</span>
                <span className="sm:hidden">
                  {new Date(review.createdAt).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Контент */}
          <div className="relative z-10 space-y-4 sm:space-y-5 md:space-y-6 px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-8 w-full min-w-0">
            <section className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#001e1d]/60 p-3 sm:p-4 md:p-5 lg:p-6 text-white shadow-[0_15px_40px_-30px_rgba(0,0,0,0.9)] w-full min-w-0">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Опыт участника</h2>
              <p className="text-sm sm:text-base leading-relaxed text-white/85 whitespace-pre-line force-wrap w-full max-w-full min-w-0">{review.content}</p>
            </section>

            {review.images?.length > 0 && (
              <section className="space-y-2 sm:space-y-3 w-full min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-white/80">Фото</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 w-full">
                  {review.images.map((img, index) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => {
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                      }}
                      className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 shadow-lg w-full cursor-pointer hover:border-white/20 transition-all"
                    >
                      <img
                        src={img.url}
                        alt="Фото отзыва"
                        className="w-full h-40 xs:h-44 sm:h-48 md:h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent pointer-events-none group-hover:from-black/50 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
                          <LucideIcons.ZoomIn size="sm" className="text-white" />
                          <span className="text-xs text-white font-medium">Открыть</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {(user?.vkLink || user?.telegramLink || user?.youtubeLink) && (
              <section className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3 w-full min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-white/80">Социальные сети</h3>
                <div className="flex flex-wrap gap-2 sm:gap-2.5 w-full">
                  {user.vkLink && (
                    <SocialChip href={user.vkLink} label="VK" color="#4c75a3">
                      <VKIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </SocialChip>
                  )}
                  {user.telegramLink && (
                    <SocialChip href={user.telegramLink} label="Telegram" color="#229ED9">
                      <TelegramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </SocialChip>
                  )}
                  {user.youtubeLink && (
                    <SocialChip href={user.youtubeLink} label="YouTube" color="#ff4f45">
                      <YouTubeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </SocialChip>
                  )}
                </div>
              </section>
            )}
          </div>
        </article>
      </div>

      {/* Lightbox для фото */}
      {review.images && review.images.length > 0 && (
        <StoryLightbox
          isOpen={lightboxOpen}
          images={review.images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrevious={() => {
            setLightboxIndex((prev) => (prev > 0 ? prev - 1 : review.images.length - 1));
          }}
          onNext={() => {
            setLightboxIndex((prev) => (prev < review.images.length - 1 ? prev + 1 : 0));
          }}
        />
      )}
    </main>
  );
}

function SocialChip({
  href,
  label,
  color,
  children,
}: {
  href: string;
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-3 md:px-3.5 py-1.5 sm:py-2 text-[10px] xs:text-xs font-semibold text-white hover:text-white/90 transition-colors border border-transparent"
      style={{
        backgroundColor: `${color}22`,
        borderColor: `${color}55`,
        boxShadow: `0 10px 30px -18px ${color}dd`,
      }}
    >
      {children}
      <span className="tracking-wide whitespace-nowrap">{label}</span>
    </a>
  );
}
