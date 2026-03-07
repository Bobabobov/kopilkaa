// app/admin/applications/[id]/components/ApplicationTitle.tsx
"use client";
import { motion } from "framer-motion";

interface ApplicationTitleProps {
  title: string;
}

export default function ApplicationTitle({ title }: ApplicationTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-4 sm:mb-6 min-w-0"
    >
      <h1
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold break-words leading-tight"
        style={{ color: "#fffffe" }}
      >
        {title}
      </h1>
    </motion.div>
  );
}
