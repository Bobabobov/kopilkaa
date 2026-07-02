'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
} from 'lucide-react';
import { AdminPage } from '../_components/AdminPage';
import {
  AdminPanel,
  AdminStatGrid,
  adminFieldClass,
} from '../_components/admin-ui';
import ImageLightbox from '../_components/ImageLightbox';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import {
  FEEDBACK_STATUS_LABELS,
  FEEDBACK_TOPICS,
  type FeedbackTopicId,
} from '@/lib/feedback/config';
import { getMessageFromApiJson } from '@/lib/api/parseApiError';
import {
  FeedbackCard,
  type FeedbackCardItem,
} from './_components/FeedbackCard';

type FeedbackStatus = 'new' | 'read' | 'resolved';

interface FeedbackStats {
  new: number;
  read: number;
  resolved: number;
}

const STAT_TONES = {
  new: 'pending' as const,
  read: 'default' as const,
  resolved: 'success' as const,
};

export default function AdminFeedbackClient() {
  const [items, setItems] = useState<FeedbackCardItem[]>([]);
  const [stats, setStats] = useState<FeedbackStats>({
    new: 0,
    read: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [topicFilter, setTopicFilter] = useState<string>('ALL');
  const [query, setQuery] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
  }>({ isOpen: false, images: [], currentIndex: 0 });

  const topicOptions = useMemo(
    () =>
      Object.entries(FEEDBACK_TOPICS) as Array<
        [FeedbackTopicId, (typeof FEEDBACK_TOPICS)[FeedbackTopicId]]
      >,
    [],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (topicFilter !== 'ALL') params.set('topic', topicFilter);
      if (query.trim()) params.set('q', query.trim());

      const response = await fetch(`/api/admin/feedback?${params.toString()}`, {
        cache: 'no-store',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          getMessageFromApiJson(data, 'Не удалось загрузить отзывы'),
        );
      }

      const payload = data.data as {
        items: FeedbackCardItem[];
        stats: FeedbackStats;
      };
      setItems(payload.items);
      setStats(payload.stats);
      setNotes(
        Object.fromEntries(
          payload.items.map((item) => [item.id, item.adminNote ?? '']),
        ),
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Не удалось загрузить отзывы',
      );
    } finally {
      setLoading(false);
    }
  }, [query, statusFilter, topicFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (id: string, status: FeedbackStatus) => {
    setBusyId(id);
    setError(null);
    try {
      const response = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminNote: notes[id]?.trim() || null,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          getMessageFromApiJson(data, 'Не удалось обновить отзыв'),
        );
      }
      await load();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Не удалось обновить отзыв',
      );
    } finally {
      setBusyId(null);
    }
  };

  const openLightbox = (images: string[], index: number) => {
    setLightbox({ isOpen: true, images, currentIndex: index });
  };

  return (
    <AdminPage
      title="Обратная связь"
      description="Отзывы с сайта: попап, страница /feedback и кнопки в разделах."
      actions={
        <Button
          asChild
          variant='outline'
          className='rounded-xl border-[#abd1c6]/35 text-[#abd1c6] hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/10 hover:text-[#fffffe]'
        >
          <Link href='/feedback' target='_blank' rel='noopener noreferrer'>
            Открыть форму
            <ExternalLink className='ml-2 h-4 w-4' />
          </Link>
        </Button>
      }
    >
        <AdminStatGrid
          className="mb-6"
          columns={3}
          items={(['new', 'read', 'resolved'] as const).map((key) => ({
            label: FEEDBACK_STATUS_LABELS[key],
            value: stats[key],
            tone: STAT_TONES[key],
            highlight: key === 'new' && stats.new > 0,
          }))}
        />

        <AdminPanel
          title="Фильтры"
          subtitle="Поиск по тексту, статусу и теме"
          className="mb-6"
          accent="neutral"
        >
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <div className="relative lg:col-span-5">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#abd1c6]/50"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Текст, email, имя…"
                className={`${adminFieldClass} pl-10`}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={`${adminFieldClass} lg:col-span-3`}
            >
              <option value="ALL">Все статусы</option>
              <option value="new">Новые</option>
              <option value="read">Прочитанные</option>
              <option value="resolved">Решённые</option>
            </select>
            <select
              value={topicFilter}
              onChange={(event) => setTopicFilter(event.target.value)}
              className={`${adminFieldClass} lg:col-span-3`}
            >
              <option value="ALL">Все темы</option>
              {topicOptions.map(([id, meta]) => (
                <option key={id} value={id}>
                  {meta.label}
                </option>
              ))}
            </select>
            <Button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className="h-[44px] rounded-xl bg-[#f9bc60] text-[#001e1d] hover:bg-[#e8a545] lg:col-span-1"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="sr-only">Обновить</span>
            </Button>
          </div>
        </AdminPanel>

        {error ? (
          <Card
            variant='darkGlass'
            padding='md'
            className='mb-4 border-orange-500/30'
          >
            <p className='text-sm text-orange-300'>{error}</p>
          </Card>
        ) : null}

        {loading ? (
          <div className='flex items-center justify-center py-20 text-[#abd1c6]'>
            <Loader2 className='mr-2 h-5 w-5 animate-spin' />
            Загрузка отзывов…
          </div>
        ) : items.length === 0 ? (
          <Card variant='darkGlass' padding='lg' className='text-center'>
            <MessageSquare className='mx-auto mb-3 h-10 w-10 text-[#abd1c6]/30' />
            <p className='text-[#abd1c6]/80'>
              Пока нет отзывов по выбранным фильтрам.
            </p>
          </Card>
        ) : (
          <div className='space-y-4 sm:space-y-5'>
            {items.map((item) => (
              <FeedbackCard
                key={item.id}
                item={item}
                busy={busyId === item.id}
                note={notes[item.id] ?? ''}
                onNoteChange={(value) =>
                  setNotes((prev) => ({ ...prev, [item.id]: value }))
                }
                onStatusChange={(status) => void updateStatus(item.id, status)}
                onImageClick={openLightbox}
              />
            ))}
          </div>
        )}
      <ImageLightbox
        isOpen={lightbox.isOpen}
        images={lightbox.images}
        currentIndex={lightbox.currentIndex}
        onClose={() =>
          setLightbox((prev) => ({ ...prev, isOpen: false }))
        }
        onIndexChange={(index) =>
          setLightbox((prev) => ({ ...prev, currentIndex: index }))
        }
      />
    </AdminPage>
  );
}
