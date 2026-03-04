"use client";

import { motion } from "framer-motion";
import { HeroSectionHeadline } from "./hero-section/HeroSectionHeadline";
import { HeroSectionForWho } from "./hero-section/HeroSectionForWho";
import { HeroSectionCta } from "./hero-section/HeroSectionCta";
import { HeroSectionAds } from "./hero-section/HeroSectionAds";
import { HeroSectionStats } from "./hero-section/HeroSectionStats";
import type { HeroSectionProps } from "./hero-section/types";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection({ stats, loading }: HeroSectionProps) {
  return (
    <section className="relative px-4 pt-12 pb-8 sm:pt-16 sm:pb-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={item}>
            <HeroSectionHeadline />
          </motion.div>
          <motion.div className="mb-10" variants={item}>
            <HeroSectionStats stats={stats} loading={loading} />
          </motion.div>
          <motion.div variants={item}>
            <HeroSectionForWho />
          </motion.div>
          <motion.div variants={item}>
            <HeroSectionCta />
          </motion.div>
          <motion.div variants={item}>
            <HeroSectionAds />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
