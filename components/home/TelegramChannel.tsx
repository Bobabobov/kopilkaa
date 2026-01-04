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
          href="https://t.me/kkopilka"
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-opacity duration-200 hover:opacity-90 w-full sm:w-[280px]"
        >
          <Image
            src="/buttontg.png"
            alt="Подписывайся на Telegram канал @kkopilka"
            width={560}
            height={315}
            sizes="(min-width: 640px) 280px, 100vw"
            quality={80}
            className="w-full h-auto rounded-2xl"
          />
        </Link>
        <Link
          href="https://kick.com/koponline"
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-opacity duration-200 hover:opacity-90 w-full sm:w-[280px]"
        >
          <Image
            src="/buttonkick.png"
            alt="Подписывайся на Kick стрим koponline"
            width={560}
            height={315}
            sizes="(min-width: 640px) 280px, 100vw"
            quality={80}
            className="w-full h-auto rounded-2xl"
          />
        </Link>
      </div>
    </motion.div>
  );
}

