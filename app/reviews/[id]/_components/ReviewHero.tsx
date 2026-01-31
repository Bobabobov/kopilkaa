import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { ReviewItem } from "@/hooks/reviews/useReviews";

interface ReviewHeroProps {
  review: ReviewItem;
  formattedDate: string;
  onOpenLightbox: (index: number) => void;
}

export function ReviewHero({
  review,
  formattedDate,
  onOpenLightbox,
}: ReviewHeroProps) {
  const { user } = review;
  const avatar = user?.avatar || "/default-avatar.png";
  const heroImage = review.images?.[0]?.url;
  const trustLevelNumber = user?.trust?.status?.split("_")[1];
  const trustTitle = trustLevelNumber
    ? `Уровень одобрения ${trustLevelNumber}`
    : "Уровень одобрения";
  const profileHref = user?.id ? `/profile/${user.id}` : null;

  return (
    <div className="relative">
      {review.images && review.images.length > 0 ? (
        <button
          type="button"
          onClick={() => onOpenLightbox(0)}
          className="relative aspect-[2/1] w-full cursor-pointer overflow-hidden bg-gradient-to-br from-[#001e1d] via-[#0b2f2c] to-[#102b2a] transition-transform duration-300 group hover:scale-[1.02] sm:aspect-[16/7]"
        >
          <img
            src={heroImage || "/stories-preview.jpg"}
            alt="Обложка отзыва"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/stories-preview.jpg";
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <LucideIcons.ZoomIn size="sm" className="text-white" />
              <span className="text-xs font-medium text-white">
                Открыть фото
              </span>
            </div>
          </div>
        </button>
      ) : (
        <div className="aspect-[2/1] w-full overflow-hidden bg-gradient-to-br from-[#001e1d] via-[#0b2f2c] to-[#102b2a] sm:aspect-[16/7]">
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

      <div className="absolute bottom-2 left-2 right-2 flex w-auto min-w-0 flex-col gap-2 md:flex-row md:items-end md:justify-between sm:bottom-4 sm:left-4 sm:right-4 sm:gap-3 md:gap-4">
        <div className="flex min-w-0 max-w-full flex-1 flex-shrink-0 items-center gap-2 sm:gap-3 md:gap-4">
          {profileHref ? (
            <Link
              href={profileHref}
              className="relative block flex-shrink-0 rounded-xl transition-transform focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/70 hover:-translate-y-0.5 sm:rounded-2xl"
            >
              <div className="h-12 w-12 overflow-hidden rounded-xl border border-white/20 bg-white/5 shadow-2xl sm:h-16 sm:w-16 md:h-20 md:w-20 sm:rounded-2xl">
                <img
                  src={avatar}
                  alt={user?.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                />
              </div>
            </Link>
          ) : (
            <div className="relative flex-shrink-0">
              <div className="h-12 w-12 overflow-hidden rounded-xl border border-white/20 bg-white/5 shadow-2xl sm:h-16 sm:w-16 md:h-20 md:w-20 sm:rounded-2xl">
                <img
                  src={avatar}
                  alt={user?.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                />
              </div>
            </div>
          )}
          <div className="min-w-0 max-w-full flex-1 space-y-0.5 sm:space-y-1">
            {profileHref ? (
              <Link
                href={profileHref}
                className="block w-full break-words text-base font-semibold text-white transition-colors hover:text-[#f9bc60] sm:text-lg md:text-xl lg:text-2xl"
              >
                {user?.name || "Аноним"}
              </Link>
            ) : (
              <h1 className="w-full break-words text-base font-semibold text-white sm:text-lg md:text-xl lg:text-2xl">
                {user?.name || "Аноним"}
              </h1>
            )}
            {user?.username &&
              (profileHref ? (
                <Link
                  href={profileHref}
                  className="block w-full break-all text-xs text-white/70 transition-colors hover:text-white sm:text-sm"
                >
                  @{user.username}
                </Link>
              ) : (
                <p className="w-full break-all text-xs text-white/70 sm:text-sm">
                  @{user.username}
                </p>
              ))}
            {user?.trust && (
              <div className="inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] text-white/85 shadow-lg backdrop-blur xs:text-xs sm:gap-2 sm:px-3 sm:py-1">
                <LucideIcons.Shield
                  size="xs"
                  className="flex-shrink-0 text-[#f9bc60]"
                />
                <span className="min-w-0 break-words font-semibold">
                  {trustTitle}
                </span>
                <span className="flex-shrink-0 whitespace-nowrap opacity-80">
                  · {user.trust.supportRange}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="inline-flex flex-shrink-0 items-center gap-1.5 self-start rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[10px] text-white/75 backdrop-blur-md whitespace-nowrap sm:gap-2 sm:px-3 sm:py-1.5 xs:text-xs md:self-auto">
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
  );
}
