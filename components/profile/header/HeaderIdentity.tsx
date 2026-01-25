import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { HeroBadge } from "@/components/ui/HeroBadge";
import type { HeroBadge as HeroBadgeType } from "@/lib/heroBadges";
import type { UserStatus } from "../hooks/useUserStatus";

interface HeaderIdentityProps {
  name?: string | null;
  role: "USER" | "ADMIN";
  heroBadge?: HeroBadgeType | null;
  status: UserStatus;
}

export function HeaderIdentity({
  name,
  role,
  heroBadge,
  status,
}: HeaderIdentityProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-0 -mt-8 sm:-mt-10 md:-mt-12">
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {name || "Пользователь"}
      </motion.h1>
      {role === "ADMIN" && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
          <LucideIcons.Shield className="w-3 h-3" />
          <span className="hidden xs:inline">ADMIN</span>
        </span>
      )}
      <HeroBadge badge={heroBadge} size="sm" />
    </div>
  );
}
