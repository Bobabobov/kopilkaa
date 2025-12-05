// components/layout/DonateButton.tsx
"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import Link from "next/link";

interface DonateButtonProps {
  isMobile?: boolean;
}

export default function DonateButton({ isMobile = false }: DonateButtonProps) {

  const commonAnimation = {
    borderColor: [
      "rgba(249, 188, 96, 0.4)",
      "rgba(249, 188, 96, 0.8)",
      "rgba(249, 188, 96, 0.4)",
    ],
  };

  const baseClass =
    "block rounded-lg border transition-all duration-300 text-sm font-medium";

  if (isMobile) {
    return (
      <Link href="/support" className="block">
        <motion.span
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={commonAnimation}
          transition={{
            borderColor: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          className={`${baseClass} w-full px-4 py-3`}
          style={{
            backgroundColor: "rgba(249, 188, 96, 0.05)",
            borderColor: "rgba(249, 188, 96, 0.6)",
            color: "#f9bc60",
          }}
        >
          <span className="inline-flex items-center gap-1">
            <LucideIcons.Heart size="sm" />
            Помочь проекту
          </span>
        </motion.span>
      </Link>
    );
  }

  return (
    <Link href="/support" className="block">
      <motion.span
        whileHover={{
          scale: 1.03,
          backgroundColor: "rgba(249, 188, 96, 0.1)",
        }}
        whileTap={{ scale: 0.97 }}
        animate={commonAnimation}
        transition={{
          borderColor: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        className={`${baseClass} px-4 py-2 whitespace-nowrap`}
        style={{
          backgroundColor: "rgba(249, 188, 96, 0.05)",
          borderColor: "rgba(249, 188, 96, 0.4)",
          color: "#f9bc60",
        }}
      >
        <span className="inline-flex items-center gap-1">
          <LucideIcons.Heart size="sm" />
          Поддержать
        </span>
      </motion.span>
    </Link>
  );
}
