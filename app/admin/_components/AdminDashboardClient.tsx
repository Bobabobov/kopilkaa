'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Gift,
  Heart,
  MessageSquare,
  Megaphone,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import type { AdminDashboardCounts } from '@/lib/admin/dashboardStats';
import { AdminPage } from './AdminPage';
import { AdminSectionLabel } from './admin-ui';
import { cn } from '@/lib/utils';

type DashboardCard = {
  title: string;
  description: string;
  href: string;
  countKey: keyof AdminDashboardCounts;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
};

const CARDS: DashboardCard[] = [
  {
    title: 'Заявки на поддержку',
    description: 'Ожидают решения',
    href: '/admin/applications?status=PENDING',
    countKey: 'applicationsPending',
    icon: MessageSquare,
    accent: 'border-amber-500/30 bg-amber-500/5',
  },
  {
    title: 'Добрые дела',
    description: 'На модерации',
    href: '/admin/good-deeds?status=PENDING',
    countKey: 'goodDeedsPending',
    icon: Heart,
    accent: 'border-rose-500/30 bg-rose-500/5',
  },
  {
    title: 'Вывод бонусов',
    description: 'Заявки в очереди',
    href: '/admin/bonuses?tab=withdrawals',
    countKey: 'withdrawalsPending',
    icon: Gift,
    accent: 'border-violet-500/30 bg-violet-500/5',
  },
  {
    title: 'Реклама',
    description: 'Новые заявки',
    href: '/admin/ads?tab=requests',
    countKey: 'adRequestsNew',
    icon: Megaphone,
    accent: 'border-sky-500/30 bg-sky-500/5',
  },
  {
    title: 'Отзывы',
    description: 'Непрочитанные',
    href: '/admin/feedback',
    countKey: 'feedbackNew',
    icon: MessageSquare,
    accent: 'border-emerald-500/30 bg-emerald-500/5',
  },
];

const QUICK_LINKS = [
  { href: '/admin/users', label: 'Пользователи' },
  { href: '/admin/referrals', label: 'Рефералы' },
  { href: '/admin/balance', label: 'Баланс копилки', icon: Wallet },
  { href: '/admin/heroes', label: 'Герои' },
];

export function AdminDashboardClient() {
  const [counts, setCounts] = useState<AdminDashboardCounts | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats', { cache: 'no-store' });
      const json = await res.json();
      setCounts(json?.data?.dashboard ?? null);
    } catch {
      setCounts(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const totalQueue =
    counts == null
      ? null
      : counts.applicationsPending +
        counts.goodDeedsPending +
        counts.withdrawalsPending +
        counts.adRequestsNew +
        counts.feedbackNew;

  return (
    <AdminPage
      title="Обзор"
      description="Сводка по очередям и быстрые переходы"
      actions={
        <button
          type="button"
          onClick={() => load()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-[#abd1c6]/20 px-3 py-1.5 text-sm text-[#abd1c6] hover:bg-[#004643]/40 hover:text-[#fffffe] disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          Обновить
        </button>
      }
    >
      {totalQueue === 0 && !loading ? (
        <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-200">
          Все очереди пусты — можно отдохнуть.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((card) => {
          const Icon = card.icon;
          const count = counts ? counts[card.countKey] : null;
          return (
            <Link
              key={card.href}
              href={card.href}
              className={cn(
                'group flex flex-col rounded-2xl border-2 p-4 transition-colors hover:border-[#f9bc60]/40',
                card.accent,
              )}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#001e1d]/50">
                  <Icon className="h-4 w-4 text-[#f9bc60]" />
                </div>
                <span
                  className={cn(
                    'text-2xl font-bold tabular-nums',
                    count && count > 0 ? 'text-[#f9bc60]' : 'text-[#abd1c6]/50',
                  )}
                >
                  {loading ? '…' : (count ?? '—')}
                </span>
              </div>
              <p className="font-semibold text-[#fffffe]">{card.title}</p>
              <p className="mt-0.5 text-xs text-[#abd1c6]/70">{card.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#abd1c6] group-hover:text-[#f9bc60] transition-colors">
                Открыть
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <AdminSectionLabel accent="gold" className="mb-3">
          Разделы
        </AdminSectionLabel>
        <div className="flex flex-wrap gap-2">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border-2 border-[#abd1c6]/20 px-3 py-2 text-sm font-medium text-[#abd1c6] transition-colors hover:border-[#f9bc60]/35 hover:bg-[#f9bc60]/10 hover:text-[#fffffe]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
