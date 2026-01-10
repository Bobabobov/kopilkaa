import { LucideIcons } from "@/components/ui/LucideIcons";

interface PersonalStatsErrorProps {
  message: string;
}

export function PersonalStatsError({ message }: PersonalStatsErrorProps) {
  return (
    <div className="p-6 bg-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20">
      <div className="text-center py-8">
        <LucideIcons.AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-4" />
        <p className="text-red-400">Ошибка загрузки: {message}</p>
      </div>
    </div>
  );
}
