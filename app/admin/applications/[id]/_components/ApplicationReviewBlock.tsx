// app/admin/applications/[id]/_components/ApplicationReviewBlock.tsx
"use client";

import { motion } from "framer-motion";
import type { ApplicationReview } from "../types";

interface ApplicationReviewBlockProps {
  review: ApplicationReview;
}

export default function ApplicationReviewBlock({ review }: ApplicationReviewBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.75 }}
      className="mb-6 min-w-0 overflow-hidden"
    >
      <h3
        className="flex flex-wrap items-center gap-2 text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4"
        style={{ color: "#fffffe" }}
      >
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        Отзыв
        <span className="text-sm font-normal opacity-80">
          ({new Date(review.createdAt).toLocaleString("ru-RU")})
        </span>
      </h3>
      <div
        className="rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-5 lg:p-7 border mb-3 sm:mb-4 whitespace-pre-wrap break-words text-sm sm:text-[15px] lg:text-base leading-relaxed min-w-0"
        style={{
          backgroundColor: "rgba(249, 188, 96, 0.08)",
          borderColor: "rgba(249, 188, 96, 0.35)",
          color: "#f8fbfa",
        }}
      >
        {review.content}
      </div>
      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {review.images
            .sort((a, b) => a.sort - b.sort)
            .map((img, idx) => (
              <a
                key={`${img.url}-${idx}`}
                href={img.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden border-2 hover:opacity-90 transition-opacity shrink-0"
                style={{ borderColor: "rgba(249, 188, 96, 0.4)" }}
              >
                <img
                  src={img.url}
                  alt={`Фото отзыва ${idx + 1}`}
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover"
                />
              </a>
            ))}
        </div>
      )}
    </motion.div>
  );
}
