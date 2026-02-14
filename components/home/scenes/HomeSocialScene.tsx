"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import GlareHover from "@/components/ui/glare-hover";

export default function HomeSocialScene() {
  return (
    <section className="relative py-12 px-4 sm:py-14">
      <div className="pointer-events-none absolute right-8 top-6 h-48 w-48 rounded-full bg-[#f9bc60]/10 blur-[100px]" />
      <div className="w-full lg:pr-10 xl:pr-16">
        <motion.div
          className="max-w-2xl text-right ml-auto"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#abd1c6]">
            Соцсети
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#fffffe] sm:text-4xl">
            Мы в Telegram и на Kick
          </h2>
          <p className="mt-3 text-base text-[#abd1c6] sm:text-lg">
            Подписывайтесь на новости и стримы
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:pl-12">
          <GlareHover
            className="rounded-3xl border border-[#abd1c6]/20 bg-[#001e1d]/70 p-4 shadow-lg backdrop-blur-sm lg:translate-y-4 transition-transform duration-300 hover:-translate-y-1"
            borderRadius="24px"
            glareOpacity={0.2}
          >
            <Link
              href="https://t.me/+8iwXRABVt5tkMmVi"
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-2xl"
            >
              <Image
                src="/buttontg.png"
                alt="Подписаться на Telegram канал @kkopilka"
                width={560}
                height={315}
                sizes="(min-width: 768px) 50vw, 100vw"
                quality={85}
                className="h-auto w-full object-cover"
              />
            </Link>
          </GlareHover>

          <GlareHover
            className="rounded-3xl border border-[#abd1c6]/20 bg-[#001e1d]/70 p-4 shadow-lg backdrop-blur-sm lg:-translate-y-2 transition-transform duration-300 hover:-translate-y-1"
            borderRadius="24px"
            glareOpacity={0.2}
          >
            <Link
              href="https://kick.com/koponline"
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-2xl"
            >
              <Image
                src="/buttonkick.png"
                alt="Смотреть стрим на Kick koponline"
                width={560}
                height={315}
                sizes="(min-width: 768px) 50vw, 100vw"
                quality={85}
                className="h-auto w-full object-cover"
              />
            </Link>
          </GlareHover>
        </div>
      </div>
    </section>
  );
}
