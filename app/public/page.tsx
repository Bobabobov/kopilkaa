"use client";
import { motion } from "framer-motion";

export default function PublicPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-3xl card p-6"
    >
      <h1 className="text-2xl font-semibold mb-2">/public</h1>
      <p className="text-black/70 dark:text-white/70">
        Страница в разработке. Здесь появится функционал раздела «public».
      </p>
    </motion.div>
  );
}
