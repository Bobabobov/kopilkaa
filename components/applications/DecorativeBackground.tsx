"use client";

import { motion } from "framer-motion";

export default function DecorativeBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated background overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-lime-500/5 animate-pulse"
        style={{ animationDuration: "8s" }}
      ></div>
      {/* Large background gradients with motion */}
      <motion.div
        className="absolute left-0 top-0 w-[60vw] h-[60vh] bg-gradient-to-br from-emerald-500/8 to-green-500/8 rounded-full blur-[100px]"
        animate={{
          x: [0, 20, 0],
          y: [0, -10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
      <motion.div
        className="absolute right-0 top-0 w-[60vw] h-[60vh] bg-gradient-to-bl from-lime-500/8 to-green-500/8 rounded-full blur-[100px]"
        animate={{
          x: [0, -15, 0],
          y: [0, 15, 0],
          scale: [1, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      ></motion.div>
      <motion.div
        className="absolute left-1/2 top-1/2 w-[50vw] h-[50vh] bg-gradient-to-tr from-green-500/6 to-emerald-500/6 rounded-full blur-[120px]"
        animate={{
          x: [0, 10, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      ></motion.div>
      <motion.div
        className="absolute left-1/4 top-1/4 w-[40vw] h-[40vh] bg-gradient-to-br from-lime-500/5 to-emerald-500/5 rounded-full blur-[80px]"
        animate={{
          x: [0, -10, 0],
          y: [0, 10, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      ></motion.div>
      <motion.div
        className="absolute right-1/4 bottom-1/4 w-[45vw] h-[45vh] bg-gradient-to-tl from-green-500/5 to-lime-500/5 rounded-full blur-[90px]"
        animate={{
          x: [0, 15, 0],
          y: [0, -15, 0],
          scale: [1, 0.92, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      ></motion.div>

      {/* Medium decorative elements */}
      <div className="absolute left-1/4 top-1/3 w-64 h-64 bg-gradient-to-br from-emerald-500/6 to-green-500/6 rounded-full blur-2xl"></div>
      <div className="absolute right-1/4 top-2/3 w-48 h-48 bg-gradient-to-tl from-lime-500/6 to-green-500/6 rounded-full blur-2xl"></div>
      <div className="absolute left-1/2 top-1/4 w-32 h-32 bg-gradient-to-br from-lime-500/8 to-green-500/8 rounded-full blur-xl"></div>
      <div className="absolute left-1/6 bottom-1/3 w-40 h-40 bg-gradient-to-tr from-green-500/5 to-emerald-500/5 rounded-full blur-2xl"></div>
      <div className="absolute right-1/6 top-1/6 w-36 h-36 bg-gradient-to-bl from-lime-500/5 to-green-500/5 rounded-full blur-2xl"></div>
      <div className="absolute left-1/3 bottom-1/6 w-28 h-28 bg-gradient-to-br from-emerald-500/5 to-lime-500/5 rounded-full blur-xl"></div>

      {/* Small floating particles with enhanced animation */}
      <motion.div
        className="absolute top-20 left-1/6 w-3 h-3 bg-emerald-400/20 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
      <motion.div
        className="absolute top-32 right-1/5 w-2 h-2 bg-lime-400/25 rounded-full"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
          opacity: [0.25, 0.9, 0.25],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      ></motion.div>
      <motion.div
        className="absolute top-48 left-1/3 w-2.5 h-2.5 bg-green-400/18 rounded-full"
        animate={{
          y: [0, -25, 0],
          opacity: [0.18, 0.7, 0.18],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      ></motion.div>
      <motion.div
        className="absolute top-64 right-1/3 w-1.5 h-1.5 bg-lime-400/22 rounded-full"
        animate={{
          y: [0, -18, 0],
          x: [0, -8, 0],
          opacity: [0.22, 0.8, 0.22],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      ></motion.div>
      <motion.div
        className="absolute top-80 left-1/5 w-2 h-2 bg-pink-400/20 rounded-full"
        animate={{
          y: [0, -22, 0],
          opacity: [0.2, 0.85, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      ></motion.div>
      <motion.div
        className="absolute top-96 right-1/6 w-1 h-1 bg-emerald-400/25 rounded-full"
        animate={{
          y: [0, -12, 0],
          x: [0, 5, 0],
          opacity: [0.25, 0.9, 0.25],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      ></motion.div>
      <motion.div
        className="absolute top-1/4 left-1/12 w-2 h-2 bg-green-400/15 rounded-full"
        animate={{
          y: [0, -16, 0],
          opacity: [0.15, 0.6, 0.15],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      ></motion.div>
      <motion.div
        className="absolute top-3/4 right-1/8 w-1.5 h-1.5 bg-lime-400/18 rounded-full"
        animate={{
          y: [0, -14, 0],
          x: [0, -6, 0],
          opacity: [0.18, 0.75, 0.18],
        }}
        transition={{
          duration: 5.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5,
        }}
      ></motion.div>
      <motion.div
        className="absolute top-1/2 left-1/8 w-2.5 h-2.5 bg-emerald-400/12 rounded-full"
        animate={{
          y: [0, -28, 0],
          opacity: [0.12, 0.65, 0.12],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3.5,
        }}
      ></motion.div>
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-green-400/20 rounded-full"
        animate={{
          y: [0, -10, 0],
          x: [0, 8, 0],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4.5,
        }}
      ></motion.div>

      {/* Enhanced animated geometric shapes - only circles */}
      <motion.div
        className="absolute top-80 left-1/8 w-4 h-4 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.6, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
      <motion.div
        className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-gradient-to-br from-lime-400/8 to-emerald-400/8 rounded-full"
        animate={{
          x: [0, 20, 0],
          y: [0, -15, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      ></motion.div>

      {/* Enhanced floating lines */}
      <motion.div
        className="absolute top-1/4 left-1/12 w-16 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent"
        animate={{
          rotate: [12, 15, 12],
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.4, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
      <motion.div
        className="absolute top-1/2 right-1/12 w-12 h-0.5 bg-gradient-to-r from-transparent via-lime-400/15 to-transparent"
        animate={{
          rotate: [-12, -15, -12],
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.5, 0.15],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      ></motion.div>
      <motion.div
        className="absolute top-3/4 left-1/6 w-8 h-0.5 bg-gradient-to-r from-transparent via-green-400/15 to-transparent"
        animate={{
          rotate: [45, 50, 45],
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      ></motion.div>
      <motion.div
        className="absolute top-1/6 right-1/6 w-10 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/12 to-transparent"
        animate={{
          rotate: [-45, -50, -45],
          scale: [1, 1.4, 1],
          opacity: [0.12, 0.3, 0.12],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      ></motion.div>
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-14 h-0.5 bg-gradient-to-r from-transparent via-lime-400/12 to-transparent"
        animate={{
          rotate: [30, 35, 30],
          scale: [1, 1.2, 1],
          opacity: [0.12, 0.4, 0.12],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5,
        }}
      ></motion.div>
      <motion.div
        className="absolute top-2/3 right-1/4 w-6 h-0.5 bg-gradient-to-r from-transparent via-green-400/12 to-transparent"
        animate={{
          rotate: [-30, -35, -30],
          scale: [1, 1.5, 1],
          opacity: [0.12, 0.45, 0.12],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3.5,
        }}
      ></motion.div>
    </div>
  );
}
