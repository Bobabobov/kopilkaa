import { Card } from "@/components/ui/Card";

type Props = {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
};

export function ModerationStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <Card variant="darkGlass" className="py-3">
        <p className="text-xs text-[#94a1b2]">Всего</p>
        <p className="text-2xl font-bold text-[#fffffe]">{stats.total}</p>
      </Card>
      <Card variant="darkGlass" className="py-3 border border-[#f9bc60]/30">
        <p className="text-xs text-[#94a1b2]">Требуют решения</p>
        <p className="text-2xl font-bold text-[#f9bc60]">{stats.pending}</p>
      </Card>
      <Card variant="darkGlass" className="py-3">
        <p className="text-xs text-[#94a1b2]">Подтверждено</p>
        <p className="text-2xl font-bold text-[#10B981]">{stats.approved}</p>
      </Card>
      <Card variant="darkGlass" className="py-3">
        <p className="text-xs text-[#94a1b2]">Отклонено</p>
        <p className="text-2xl font-bold text-[#e16162]">{stats.rejected}</p>
      </Card>
    </div>
  );
}
