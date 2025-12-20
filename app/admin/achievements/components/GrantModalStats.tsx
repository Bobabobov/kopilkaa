// app/admin/achievements/components/GrantModalStats.tsx
"use client";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface GrantModalStatsProps {
  achievementsCount: number;
  usersCount: number;
}

export default function GrantModalStats({
  achievementsCount,
  usersCount,
}: GrantModalStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <LucideIcons.Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {achievementsCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Найдено достижений
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <LucideIcons.Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {usersCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Найдено пользователей
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


