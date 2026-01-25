// components/heroes/HeroesLoading.tsx
"use client";
import { motion } from "framer-motion";

export default function HeroesLoading() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 md:pt-14 pb-16">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10 md:space-y-12">
        {/* Hero skeleton */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5/60 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="text-5xl mb-6"
          >
            ⭐
          </motion.div>
          <div className="animate-pulse space-y-4">
            <div className="h-10 sm:h-12 w-[70%] rounded-2xl bg-white/10" />
            <div className="h-6 w-[85%] rounded-xl bg-white/8" />
            <div className="h-6 w-[72%] rounded-xl bg-white/8" />
            <div className="flex gap-3 pt-2">
              <div className="h-11 w-40 rounded-full bg-[#f9bc60]/40" />
              <div className="h-11 w-40 rounded-full bg-white/10" />
            </div>
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="rounded-[28px] border border-white/10 bg-white/5/60 backdrop-blur-xl p-6 sm:p-7 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
          <div className="animate-pulse">
            <div className="h-7 w-44 rounded-xl bg-white/10 mb-5" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5"
                >
                  <div className="h-4 w-24 rounded bg-white/10 mb-2" />
                  <div className="h-7 w-28 rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="rounded-[28px] border border-white/10 bg-white/5/60 backdrop-blur-xl p-6 sm:p-7 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
          <div className="animate-pulse space-y-5">
            <div className="h-12 rounded-2xl bg-white/8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="h-5 w-20 rounded bg-white/10 mb-3" />
                  <div className="flex gap-3 items-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-40 rounded bg-white/10" />
                      <div className="h-3 w-28 rounded bg-white/8" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 rounded-xl bg-white/8" />
                    <div className="h-16 rounded-xl bg-white/8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
