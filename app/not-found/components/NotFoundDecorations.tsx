"use client";

import { motion } from "framer-motion";

export default function NotFoundDecorations() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Большие градиентные круги */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] md:w-[1000px] md:h-[1000px] bg-[#f9bc60] rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.08, 0.18, 0.08],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-0 right-0 w-[700px] h-[700px] sm:w-[900px] sm:h-[900px] md:w-[1100px] md:h-[1100px] bg-[#abd1c6] rounded-full blur-3xl"
      />

      {/* Средние декоративные элементы */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.05, 0.12, 0.05],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-gradient-to-br from-[#f9bc60] to-[#abd1c6] rounded-full blur-3xl"
      />

      {/* Маленькие точки */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.6, 0.3],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
          className="absolute"
          style={{
            top: `${10 + i * 15}%`,
            left: `${15 + i * 12}%`,
            width: "8px",
            height: "8px",
            backgroundColor: "#f9bc60",
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  );
}


