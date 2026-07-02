import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { cn } from "@/lib/utils";
import type { UserStatus } from "../hooks/useUserStatus";

interface HeaderIdentityProps {
  name?: string | null;
  role: "USER" | "ADMIN";
  status: UserStatus;
  tone?: "light" | "dark";
}

export function HeaderIdentity({
  name,
  role,
  status: _status,
  tone = "dark",
}: HeaderIdentityProps) {
  const titleClass =
    tone === "light" ? "text-[#1C3A27]" : "text-white";

  return (
    <div className="flex flex-wrap items-start gap-2 sm:gap-3 mb-0 mt-0 sm:-mt-10 md:-mt-12 min-w-0">
      <motion.h1
        className={cn(
          "text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold leading-tight break-words",
          titleClass,
        )}
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
    </div>
  );
}
