"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function NotFoundHero() {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-center justify-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px]"
    >
      {/* Декоративные градиенты */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f9bc60] rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#abd1c6] rounded-full blur-3xl"
        />
      </div>

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
        <div className="absolute inset-0 bg-gradient-to-r from-[#f9bc60]/30 to-[#abd1c6]/30 rounded-full blur-3xl scale-150" />
        
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
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-9xl sm:text-[12rem] md:text-[14rem] mb-4"
              >
                🐷
              </motion.div>
              <div className="text-7xl sm:text-8xl md:text-9xl font-black text-[#f9bc60] mb-2">
                404
              </div>
            </div>
          </div>
        )}

        {/* Декоративные монетки */}
        {!imageError && (
          <>
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-8 -right-8 sm:-top-12 sm:-right-12 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-2xl border-4 border-[#001e1d] z-20"
            >
              ₽
            </motion.div>
            <motion.div
              animate={{
                rotate: [360, 0],
                scale: [1, 1.15, 1],
                y: [0, 15, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -bottom-8 -left-8 sm:-bottom-12 sm:-left-12 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#abd1c6] to-[#94c4b8] rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-2xl border-4 border-[#001e1d] z-20"
            >
              💰
            </motion.div>
            <motion.div
              animate={{
                rotate: [0, -360],
                scale: [1, 1.1, 1],
                x: [0, 20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute top-1/2 -right-16 sm:-right-20 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-xl border-4 border-[#001e1d] z-20"
            >
              💎
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}


