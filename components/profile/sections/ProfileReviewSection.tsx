"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";

type ReviewData = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  images: { url: string; sort: number }[];
  user: {
    id: string;
    name: string;
    username?: string | null;
    avatar?: string | null;
    trust: {
      status: string;
      approved: number;
      supportRange: string;
    };
  };
};

interface ProfileReviewSectionProps {
  userId: string;
  isOwner?: boolean;
}

export default function ProfileReviewSection({
  userId,
  isOwner = false,
}: ProfileReviewSectionProps) {
  const [review, setReview] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const { ToastComponent } = useBeautifulToast();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/reviews/user/${userId}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (res.ok && json.review) {
          setReview(json.review);
        } else {
          setReview(null);
        }
      } catch (error) {
        console.error("Failed to load review:", error);
        setReview(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [userId]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 sm:p-5"
      >
        <div className="flex items-center gap-2 text-white/60">
          <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Загрузка отзыва...</span>
        </div>
      </motion.div>
    );
  }

  if (!review) {
    return null;
  }

  const formattedDate = new Date(review.createdAt).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-lg"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-white/10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f9bc60]/20 to-[#f9bc60]/10 border border-[#f9bc60]/40 flex items-center justify-center">
              <LucideIcons.MessageCircle className="w-5 h-5 text-[#f9bc60]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Отзыв участника
              </h3>
              <p className="text-xs text-white/60 mt-0.5">
                {isOwner ? "Ваш отзыв" : "Отзыв пользователя"}
              </p>
            </div>
          </div>
          <Link
            href={`/reviews/${review.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#f9bc60]/40 text-xs font-medium text-white/80 hover:text-[#f9bc60] transition-all"
          >
            <span>Открыть</span>
            <LucideIcons.ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Cover image if exists */}
        {review.images && review.images.length > 0 && (
          <Link href={`/reviews/${review.id}`} className="block">
            <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-white/10 group cursor-pointer">
              <img
                src={review.images[0].url}
                alt="Обложка отзыва"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              {review.images.length > 1 && (
                <div className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-1.5 text-white text-xs font-medium">
                    <LucideIcons.Image className="w-3.5 h-3.5" />
                    <span>+{review.images.length - 1}</span>
                  </div>
                </div>
              )}
            </div>
          </Link>
        )}

        {/* Text content */}
        <div>
          <p className="text-sm sm:text-base leading-relaxed text-white/90 whitespace-pre-line line-clamp-4">
            {review.content}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <LucideIcons.Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f9bc60]/15 border border-[#f9bc60]/30 text-xs font-medium text-[#f9bc60]">
              <LucideIcons.Shield className="w-3 h-3" />
              <span>
                Уровень {review.user.trust.status.split("_")[1] || ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ToastComponent />
    </motion.div>
  );
}
