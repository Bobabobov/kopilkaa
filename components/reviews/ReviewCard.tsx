"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import { cn } from "@/lib/utils";
import { UserPublicBadges } from "@/components/users/UserPublicBadges";
import type { ReviewItem } from "@/hooks/reviews/useReviews";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";

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
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
      style={{
        color,
        borderColor: `${color}55`,
        backgroundColor: `${color}12`,
        borderWidth: 1,
      }}
    >
      {children}
      <span>{label}</span>
    </a>
  );
}

export function ReviewCard({ review }: { review: ReviewItem }) {
  const router = useRouter();
  const { user } = review;
  const avatarUrl = resolveAvatarUrl(user.avatar);
  const trust = user.trust;
  const trustLevelNumber = trust.status.split("_")[1] || "";
  const trustTitle = trustLevelNumber
    ? `Уровень одобрения ${trustLevelNumber}`
    : "Уровень одобрения";
  const trustLabel =
    trust.nextRequirement ??
    `Одобрено заявок: ${trust.approved.toLocaleString("ru-RU")}`;
  const profileHref = user.id ? `/profile/${user.id}` : null;

  const href = `/reviews/${review.id}`;

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (profileHref) {
      router.push(profileHref);
    }
  };

  const hasSocial =
    user.vkLink || user.telegramLink || user.youtubeLink;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-300 group hover:border-white/15 hover:shadow-lg hover:shadow-black/20"
      style={{
        background: "linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
      }}
    >
      <Link
        href={href}
        className={cn(
          "block focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/70 rounded-t-2xl focus:rounded-2xl",
          hasSocial ? "rounded-b-none" : "rounded-b-2xl",
        )}
      >
        {/* Cover image or avatar */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
          <img
            src={review.images?.[0]?.url || "/stories-preview.jpg"}
            alt={review.content.slice(0, 40)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = "/stories-preview.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent group-hover:from-black/60 transition-colors duration-300" />
          <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
            <div className="relative">
              {profileHref ? (
                <button
                  onClick={handleProfileClick}
                  className="block rounded-full focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/70 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/60 shadow-lg">
                    <img
                      src={avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR;
                      }}
                    />
                  </div>
                </button>
              ) : (
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/60 shadow-lg">
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_AVATAR;
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              {profileHref ? (
                <button
                  onClick={handleProfileClick}
                  className="flex items-center gap-1.5 text-sm font-semibold leading-tight hover:text-[#f9bc60] transition-colors text-left cursor-pointer"
                >
                  <span>{user.name}</span>
                  <UserPublicBadges markedAsDeceiver={user.markedAsDeceiver} />
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-semibold leading-tight">
                  <span>{user.name}</span>
                  <UserPublicBadges markedAsDeceiver={user.markedAsDeceiver} />
                </span>
              )}
              {user.username &&
                (profileHref ? (
                  <button
                    onClick={handleProfileClick}
                    className="text-[11px] text-white/85 hover:text-white transition-colors text-left cursor-pointer"
                  >
                    @{user.username}
                  </button>
                ) : (
                  <span className="text-[11px] text-white/85">
                    @{user.username}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div
              className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 font-semibold"
              style={{ background: "rgba(249, 188, 96, 0.15)", color: "#f9bc60" }}
            >
              <LucideIcons.Shield size="xs" />
              {trustTitle}
            </div>
          </div>

          <p className="text-base leading-relaxed text-[#abd1c6] whitespace-pre-line line-clamp-3 group-hover:text-[#fffffe] transition-colors duration-200">
            {review.content}
          </p>

          {review.images?.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {review.images.slice(0, 2).map((img) => (
                <div
                  key={img.url}
                  className="relative overflow-hidden rounded-xl border border-white/10 group/image"
                >
                  <img
                    src={img.url}
                    alt="Фото отзыва"
                    className="w-full h-24 sm:h-28 object-cover transition-transform duration-300 group-hover/image:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          )}

          {!hasSocial && (
            <div className="pt-1 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-[#94a1b2]">
                <LucideIcons.Clock size="xs" className="text-[#f9bc60]" />
                <span>
                  {new Date(review.createdAt).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>

      {hasSocial && (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 border-t border-white/10 rounded-b-2xl bg-gradient-to-b from-transparent to-black/5">
          <div className="flex flex-wrap gap-2">
            {user.vkLink && (
              <SocialChip href={user.vkLink} label="VK" color="#4c75a3">
                <VKIcon className="w-4 h-4" />
              </SocialChip>
            )}
            {user.telegramLink && (
              <SocialChip
                href={user.telegramLink}
                label="Telegram"
                color="#229ED9"
              >
                <TelegramIcon className="w-4 h-4" />
              </SocialChip>
            )}
            {user.youtubeLink && (
              <SocialChip
                href={user.youtubeLink}
                label="YouTube"
                color="#ff4f45"
              >
                <YouTubeIcon className="w-4 h-4" />
              </SocialChip>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#94a1b2] mt-3 pt-1 border-t border-white/10">
            <LucideIcons.Clock size="xs" className="text-[#f9bc60]" />
            <span>
              {new Date(review.createdAt).toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      )}
    </motion.article>
  );
}
