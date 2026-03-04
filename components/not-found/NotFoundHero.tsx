"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function NotFoundHero() {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-center justify-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px]"
    >
      {/* Основное изображение */}
      <motion.div
        animate={{
          y: [0, -30, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10"
      >
        {!imageError ? (
          <Image
            src="/404.png"
            alt="404"
            width={600}
            height={600}
            className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto drop-shadow-2xl"
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto aspect-square flex items-center justify-center bg-gradient-to-br from-[#001e1d]/60 to-[#004643]/60 rounded-3xl border-2 border-[#abd1c6]/30 backdrop-blur-sm">
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mb-4 flex justify-center"
              >
                <LucideIcons.Help className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 text-[#f9bc60]" />
              </motion.div>
              <div className="text-7xl sm:text-8xl md:text-9xl font-black text-[#f9bc60] mb-2">
                404
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
