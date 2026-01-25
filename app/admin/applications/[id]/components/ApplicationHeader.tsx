// app/admin/applications/[id]/components/ApplicationHeader.tsx
"use client";
import { motion } from "framer-motion";
import { statusRu, statusColor } from "@/lib/status";

type Status = "PENDING" | "APPROVED" | "REJECTED";

interface ApplicationHeaderProps {
  status: Status;
  onBack: () => void;
}

function Badge({ s }: { s: Status }) {
  return (
    <span className={`px-2 py-1 rounded-xl text-xs ${statusColor(s)}`}>
      {statusRu[s]}
    </span>
  );
}

export default function ApplicationHeader({
  status,
  onBack,
}: ApplicationHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-wrap items-center gap-4 mb-8"
    >
      <button
        onClick={onBack}
        className="group flex items-center gap-2 px-4 py-2 bg-[#001e1d]/60 backdrop-blur-sm border border-[#abd1c6]/20 rounded-xl hover:bg-[#001e1d] hover:border-[#f9bc60] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        style={{ color: "#abd1c6" }}
      >
        <svg
          className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Назад к списку
      </button>
      <Badge s={status} />
    </motion.div>
  );
}
