// components/layout/DonateButton.tsx
"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import Link from "next/link";

interface DonateButtonProps {
  isMobile?: boolean;
}

export default function DonateButton({ isMobile = false }: DonateButtonProps) {

  if (isMobile) {
    return (
      <Link href="/support">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            borderColor: [
              "rgba(249, 188, 96, 0.6)",
              "rgba(249, 188, 96, 1)",
              "rgba(249, 188, 96, 0.6)"
            ]
          }}
          transition={{
            borderColor: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-full px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-300"
          style={{
            backgroundColor: "rgba(249, 188, 96, 0.05)",
            borderColor: "rgba(249, 188, 96, 0.6)",
            color: "#f9bc60"
          }}
        >
          <div className="flex items-center gap-1">
            <LucideIcons.Heart size="sm" />
            Помочь проекту
          </div>
        </motion.button>
      </Link>
    );
  }

  return (
    <Link href="/support">
      <motion.button
        whileHover={{ 
          scale: 1.03,
          backgroundColor: "rgba(249, 188, 96, 0.1)"
        }}
        whileTap={{ scale: 0.97 }}
        animate={{
          borderColor: [
            "rgba(249, 188, 96, 0.4)",
            "rgba(249, 188, 96, 0.8)",
            "rgba(249, 188, 96, 0.4)"
          ]
        }}
        transition={{
          borderColor: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className="px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-300 whitespace-nowrap"
        style={{
          backgroundColor: "rgba(249, 188, 96, 0.05)",
          borderColor: "rgba(249, 188, 96, 0.4)",
          color: "#f9bc60"
        }}
      >
        <div className="flex items-center gap-1">
          <LucideIcons.Heart size="sm" />
          Поддержать
        </div>
      </motion.button>
    </Link>
  );
}
