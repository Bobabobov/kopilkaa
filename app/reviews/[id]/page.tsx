"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import type { ReviewItem } from "@/hooks/reviews/useReviews";

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [review, setReview] = useState<ReviewItem | null>(null);
  const [loading, setLoading] = useState(true);

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
    <main className="min-h-screen px-4 sm:px-6 lg:px-10 py-8">
      <div className="max-w-6xl mx-auto space-y-5">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:text-white hover:border-white/30 hover:bg-white/10 transition-colors"
        >
          <LucideIcons.ArrowLeft size="sm" />
          Назад к отзывам
        </button>

        <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.85)]">
          {/* Подсветки */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-10 w-60 h-60 bg-[#f9bc60]/15 blur-3xl" />
            <div className="absolute right-0 -bottom-16 w-72 h-72 bg-[#abd1c6]/20 blur-3xl" />
          </div>

          {/* Хедер с картинкой */}
          <div className="relative">
            <div className="aspect-[16/7] w-full overflow-hidden bg-gradient-to-br from-[#001e1d] via-[#0b2f2c] to-[#102b2a]">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt="Обложка отзыва"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(249,188,96,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(161,231,197,0.12),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(225,97,98,0.12),transparent_35%)]" />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000cc] via-[#00000066] to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex items-center gap-4">
                {profileHref ? (
                  <Link
                    href={profileHref}
                    className="relative block focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/70 rounded-2xl transition-transform hover:-translate-y-0.5"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-white/5">
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
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-white/5">
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
                <div className="space-y-1">
                  {profileHref ? (
                    <Link
                      href={profileHref}
                      className="text-xl sm:text-2xl font-semibold text-white hover:text-[#f9bc60] transition-colors"
                    >
                      {user?.name || "Аноним"}
                    </Link>
                  ) : (
                    <h1 className="text-xl sm:text-2xl font-semibold text-white">{user?.name || "Аноним"}</h1>
                  )}
                  {user?.username && (
                    profileHref ? (
                      <Link
                        href={profileHref}
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        @{user.username}
                      </Link>
                    ) : (
                      <p className="text-sm text-white/70">@{user.username}</p>
                    )
                  )}
                  {user?.trust && (
                    <div className="inline-flex items-center gap-2 text-xs text-white/85 bg-white/10 border border-white/15 px-3 py-1 rounded-full shadow-lg backdrop-blur">
                      <LucideIcons.Shield size="xs" className="text-[#f9bc60]" />
                      <span className="font-semibold">{trustTitle}</span>
                      <span className="opacity-80">· {user.trust.supportRange}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs text-white/75 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 backdrop-blur-md inline-flex items-center gap-2 self-start md:self-auto">
                <LucideIcons.Calendar size="xs" />
                {formattedDate}
              </div>
            </div>
          </div>

          {/* Контент */}
          <div className="relative z-10 space-y-6 px-4 sm:px-6 md:px-8 py-6 md:py-8">
            <section className="rounded-2xl border border-white/10 bg-[#001e1d]/60 p-5 sm:p-6 text-white shadow-[0_15px_40px_-30px_rgba(0,0,0,0.9)]">
              <h2 className="text-lg font-semibold mb-3">Опыт участника</h2>
              <p className="text-base leading-relaxed text-white/85 whitespace-pre-line">{review.content}</p>
            </section>

            {review.images?.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-white/80">Фото</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {review.images.map((img) => (
                    <div
                      key={img.url}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg"
                    >
                      <img
                        src={img.url}
                        alt="Фото отзыва"
                        className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent pointer-events-none" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(user?.vkLink || user?.telegramLink || user?.youtubeLink) && (
              <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 sm:p-5 space-y-3">
                <h3 className="text-sm font-semibold text-white/80">Социальные сети</h3>
                <div className="flex flex-wrap gap-2.5">
                  {user.vkLink && (
                    <SocialChip href={user.vkLink} label="VK" color="#4c75a3">
                      <VKIcon className="w-4 h-4" />
                    </SocialChip>
                  )}
                  {user.telegramLink && (
                    <SocialChip href={user.telegramLink} label="Telegram" color="#229ED9">
                      <TelegramIcon className="w-4 h-4" />
                    </SocialChip>
                  )}
                  {user.youtubeLink && (
                    <SocialChip href={user.youtubeLink} label="YouTube" color="#ff4f45">
                      <YouTubeIcon className="w-4 h-4" />
                    </SocialChip>
                  )}
                </div>
              </section>
            )}
          </div>
        </article>
      </div>
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
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold text-white hover:text-white/90 transition-colors border border-transparent"
      style={{
        backgroundColor: `${color}22`,
        borderColor: `${color}55`,
        boxShadow: `0 10px 30px -18px ${color}dd`,
      }}
    >
      {children}
      <span className="tracking-wide">{label}</span>
    </a>
  );
}
