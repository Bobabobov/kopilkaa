import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { ActivityItem } from "../hooks/useRecentActivity";

interface RecentActivityItemProps {
  activity: ActivityItem;
  index: number;
}

export function RecentActivityItem({
  activity,
  index,
}: RecentActivityItemProps) {
  const IconComponent =
    (LucideIcons as any)[activity.icon] || LucideIcons.Activity;
  const card = (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-2 xs:gap-3 p-2.5 xs:p-3 sm:p-4 bg-[#001e1d]/30 rounded-lg border transition-colors"
      style={{ borderColor: "rgba(171, 209, 198, 0.1)" }}
    >
      <div
        className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: `${activity.color}20`,
          color: activity.color,
        }}
      >
        <IconComponent size="sm" className="text-current" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs xs:text-sm sm:text-base font-semibold text-[#fffffe] mb-0.5 truncate">
          {activity.title}
        </div>
        <div className="text-[10px] xs:text-xs sm:text-sm text-[#abd1c6] mb-0.5 xs:mb-1 line-clamp-2">
          {activity.description}
        </div>
        <div className="text-[9px] xs:text-[10px] sm:text-xs text-[#abd1c6]/60">
          {activity.date}
        </div>
      </div>
    </motion.div>
  );

  if (activity.link) {
    return (
      <Link key={activity.id} href={activity.link}>
        {card}
      </Link>
    );
  }
  return <div key={activity.id}>{card}</div>;
}
