"use client";

import { motion } from "framer-motion";

interface GamesInfoCardProps {
  icon: string;
  title: string;
  description: string;
  index: number;
}

export default function GamesInfoCard({ icon, title, description, index }: GamesInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -8 }}
      className="relative overflow-hidden group"
    >
      <div className="relative bg-gradient-to-br from-[#001e1d] via-[#004643]/90 to-[#001e1d] backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#abd1c6]/20 hover:border-[#f9bc60]/40 transition-all duration-500 group-hover:shadow-[#f9bc60]/20">
        
        <div className="relative z-10 text-center">
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-5xl sm:text-6xl mb-5 inline-block"
          >
            {icon}
          </motion.div>
          <h3 className="text-xl sm:text-2xl font-black text-[#fffffe] mb-3 group-hover:text-[#f9bc60] transition-colors">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-[#abd1c6] leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

