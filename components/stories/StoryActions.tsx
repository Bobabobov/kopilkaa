// components/stories/StoryActions.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface StoryActionsProps {
  isAd?: boolean;
  advertiserLink?: string;
}

export default function StoryActions({
  isAd = false,
  advertiserLink,
}: StoryActionsProps) {
  return (
    <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
      {isAd && advertiserLink ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <a
              href={advertiserLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-10 py-5 text-white font-bold rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-[#f9bc60]/50 transform hover:-translate-y-2 hover:scale-105 group text-lg"
              style={{
                background: "linear-gradient(135deg, #f9bc60 0%, #e8a94a 100%)",
              }}
            >
              <LucideIcons.ExternalLink
                size="lg"
                className="mr-3 group-hover:rotate-12 transition-transform duration-300"
              />
              Перейти на сайт
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/advertising"
              className="inline-flex items-center px-8 py-4 bg-white/95 backdrop-blur-xl hover:bg-white font-semibold rounded-2xl transition-all duration-300 border-2 border-[#f9bc60]/40 shadow-lg hover:shadow-xl group text-[#001e1d]"
            >
              <LucideIcons.Megaphone
                size="md"
                className="mr-3 group-hover:scale-110 transition-transform duration-300 text-[#f9bc60]"
              />
              Разместить рекламу
            </Link>
          </motion.div>
        </>
      ) : (
        <>
          <div>
            <Link
              href="/stories"
              className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-xl hover:bg-gray-50 font-semibold rounded-2xl transition-all duration-300 border shadow-lg hover:shadow-xl group"
              style={{
                borderColor: "#abd1c6/30",
                color: "#2d5a4e",
              }}
            >
              <LucideIcons.BookOpen
                size="md"
                className="mr-3 group-hover:rotate-12 transition-transform duration-300"
              />
              Все истории
            </Link>
          </div>

          <div>
            <Link
              href="/applications"
              className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
              style={{
                background: "linear-gradient(135deg, #f9bc60 0%, #e8a94a 100%)",
              }}
            >
              <LucideIcons.Plus
                size="md"
                className="mr-3 group-hover:rotate-90 transition-transform duration-300"
              />
              Подать заявку
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
