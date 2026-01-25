// components/layout/DonateButton.tsx
"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import Link from "next/link";

interface DonateButtonProps {
  /**
   * default: обычная кнопка (desktop/header)
   * mobileMenu: полноширинная кнопка внутри бургер-меню
   * mobileHeader: компактная кнопка рядом с бургером (иконка)
   */
  variant?: "default" | "mobileMenu" | "mobileHeader";
  onLinkClick?: () => void;
}

export default function DonateButton({
  variant,
  onLinkClick,
}: DonateButtonProps) {
  const resolvedVariant = variant ?? "default";

  const commonAnimation = {
    borderColor: [
      "rgba(249, 188, 96, 0.35)",
      "rgba(249, 188, 96, 0.75)",
      "rgba(249, 188, 96, 0.35)",
    ],
    boxShadow: [
      "0 0 0 0 rgba(249, 188, 96, 0.00)",
      "0 10px 30px -16px rgba(249, 188, 96, 0.55)",
      "0 0 0 0 rgba(249, 188, 96, 0.00)",
    ],
  };

  const baseClass =
    "relative inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-semibold tracking-wide transition-all duration-200 select-none overflow-hidden " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#001e1d]";

  if (resolvedVariant === "mobileHeader") {
    return (
      <Link
        href="/support"
        onClick={onLinkClick}
        className="block"
        aria-label="Стать героем"
      >
        <motion.span
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.97 }}
          animate={commonAnimation}
          transition={{
            borderColor: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          className={`${baseClass} w-10 h-10`}
          title="Стать героем"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(249, 188, 96, 0.16), rgba(249, 188, 96, 0.05))",
            borderColor: "rgba(249, 188, 96, 0.42)",
            color: "#fffffe",
          }}
        >
          {/* glow */}
          <span
            aria-hidden
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200"
            style={{
              background:
                "radial-gradient(120% 90% at 10% 10%, rgba(249,188,96,0.22), transparent 55%), radial-gradient(120% 90% at 90% 0%, rgba(171,209,198,0.14), transparent 50%)",
            }}
          />
          <motion.span
            aria-hidden
            whileHover={{ scale: 1.12, rotate: -10 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="relative text-[#f9bc60]"
          >
            <LucideIcons.Heart size="sm" />
          </motion.span>
          <span className="sr-only">Стать героем</span>
        </motion.span>
      </Link>
    );
  }

  if (resolvedVariant === "mobileMenu") {
    return (
      <Link href="/support" onClick={onLinkClick} className="block">
        <motion.span
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          animate={commonAnimation}
          transition={{
            borderColor: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          className={`${baseClass} w-full px-4 py-3`}
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(249, 188, 96, 0.18), rgba(249, 188, 96, 0.06))",
            borderColor: "rgba(249, 188, 96, 0.55)",
            color: "#fff",
          }}
        >
          {/* glow */}
          <span
            aria-hidden
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200"
            style={{
              background:
                "radial-gradient(120% 90% at 10% 10%, rgba(249,188,96,0.25), transparent 50%), radial-gradient(120% 90% at 90% 0%, rgba(171,209,198,0.18), transparent 45%)",
            }}
          />
          <span
            aria-hidden
            className="absolute -left-1/3 top-0 h-full w-1/2 rotate-12 opacity-0 hover:opacity-100 transition-opacity duration-200"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
            }}
          />
          <span className="relative inline-flex items-center gap-2">
            <motion.span
              aria-hidden
              whileHover={{ scale: 1.12, rotate: -8 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className="text-[#f9bc60]"
            >
              <LucideIcons.Heart size="sm" />
            </motion.span>
            <span className="text-[#fffffe]">Стать героем</span>
          </span>
        </motion.span>
      </Link>
    );
  }

  return (
    <Link href="/support" onClick={onLinkClick} className="block">
      <motion.span
        whileHover={{
          scale: 1.04,
          y: -1,
          boxShadow: "0 18px 44px -26px rgba(249, 188, 96, 0.75)",
        }}
        whileTap={{ scale: 0.97 }}
        animate={commonAnimation}
        transition={{
          borderColor: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        className={`${baseClass} px-4 py-2 whitespace-nowrap`}
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(249, 188, 96, 0.16), rgba(249, 188, 96, 0.05))",
          borderColor: "rgba(249, 188, 96, 0.4)",
          color: "#fffffe",
        }}
      >
        {/* glow */}
        <span
          aria-hidden
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200"
          style={{
            background:
              "radial-gradient(120% 90% at 10% 10%, rgba(249,188,96,0.22), transparent 55%), radial-gradient(120% 90% at 90% 0%, rgba(171,209,198,0.14), transparent 50%)",
          }}
        />
        {/* subtle shine */}
        <span
          aria-hidden
          className="absolute -left-1/3 top-0 h-full w-1/2 rotate-12 opacity-0 hover:opacity-100 transition-opacity duration-200"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)",
          }}
        />
        <span className="relative inline-flex items-center gap-2">
          <motion.span
            aria-hidden
            whileHover={{ scale: 1.12, rotate: -8 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="text-[#f9bc60]"
          >
            <LucideIcons.Heart size="sm" />
          </motion.span>
          <span className="text-[#fffffe]">Стать героем</span>
        </span>
      </motion.span>
    </Link>
  );
}
