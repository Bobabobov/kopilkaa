"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import GamesLoading from "./components/GamesLoading";

export default function GamesPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/profile/me", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setIsAuthorized(true);
          } else {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <GamesLoading />;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-12 sm:pb-16 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
          {/* Картинка */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 sm:mb-10 md:mb-12 relative"
          >
            <div
              className="rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-[#001e1d]/40 to-[#004643]/40 border border-[#f9bc60]/20"
              style={{ willChange: 'auto' }}
            >
              <Image
                src="/game.png"
                alt="Игры"
                width={600}
                height={600}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto rounded-2xl"
                priority
                loading="eager"
              />
            </div>
          </motion.div>

          {/* Надпись */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-center"
          >
            <span
              className="bg-gradient-to-r from-[#fffffe] via-[#f9bc60] to-[#fffffe] bg-clip-text text-transparent inline-block"
            >
              Раздел в разработке
            </span>
          </motion.h1>
        </div>
      </div>
    </div>
  );
}
