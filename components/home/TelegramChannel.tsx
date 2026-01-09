"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function TelegramChannel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="https://t.me/+mhQEjSa6H341NTZi"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block w-full sm:w-[280px] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
        >
          <Image
            src="/buttontg.png"
            alt="Подписывайся на Telegram канал @kkopilka"
            width={560}
            height={315}
            sizes="(min-width: 640px) 280px, 100vw"
            quality={90}
            className="w-full h-auto rounded-2xl transition-transform duration-300 group-hover:brightness-110"
            unoptimized
          />
          {/* Overlay при hover */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300 rounded-2xl pointer-events-none" />
        </Link>
        
        <Link
          href="https://kick.com/koponline"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block w-full sm:w-[280px] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
        >
          <Image
            src="/buttonkick.png"
            alt="Подписывайся на Kick стрим koponline"
            width={560}
            height={315}
            sizes="(min-width: 640px) 280px, 100vw"
            quality={90}
            className="w-full h-auto rounded-2xl transition-transform duration-300 group-hover:brightness-110"
            unoptimized
          />
          {/* Overlay при hover */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300 rounded-2xl pointer-events-none" />
        </Link>
      </div>
    </motion.div>
  );
}

