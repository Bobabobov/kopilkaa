import { AdminStatGrid } from '@/app/admin/_components/admin-ui';

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
    <AdminStatGrid
      className="mb-4"
      items={[
        { label: 'Всего', value: stats.total },
        {
          label: 'Требуют решения',
          value: stats.pending,
          tone: 'pending',
          highlight: stats.pending > 0,
        },
        { label: 'Подтверждено', value: stats.approved, tone: 'success' },
        { label: 'Отклонено', value: stats.rejected, tone: 'danger' },
      ]}
    />
  );
}
