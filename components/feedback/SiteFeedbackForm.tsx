'use client';

import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  Star,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/Card';
import PhotoUpload from '@/components/applications/PhotoUpload';
import {
  FEEDBACK_TOPICS,
  type FeedbackTopicId,
  isFeedbackTopicId,
} from '@/lib/feedback/config';
import { FEEDBACK_MAX_PHOTOS } from '@/lib/feedback/constants';
import { getMessageFromApiJson } from '@/lib/api/parseApiError';
import { markFeedbackSubmitted } from '@/lib/feedback/promptStorage';
import { uploadFeedbackPhotos } from '@/hooks/feedback/uploadPhotos';
import { cn } from '@/lib/utils';

type FeedbackPhoto = { file: File; url: string };

export interface SiteFeedbackFormProps {
  initialTopic?: FeedbackTopicId;
  source?: 'popup' | 'page' | 'games_link';
  pagePath?: string;
  lockTopic?: boolean;
  /** Встроенная форма внутри GlassModal — без своей шапки и обёртки Card */
  embedded?: boolean;
  compact?: boolean;
  onSubmitted?: () => void;
  onSubmittingChange?: (isSubmitting: boolean) => void;
  onCancel?: () => void;
  className?: string;
}

function StarRating({
  rating,
  onChange,
}: {
  rating: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <div className='flex flex-wrap items-center gap-2'>
      {[1, 2, 3, 4, 5].map((value) => {
        const active = rating !== null && value <= rating;
        return (
          <button
            key={value}
            type='button'
            onClick={() => onChange(rating === value ? null : value)}
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl border transition-all',
              active
                ? 'border-[#f9bc60]/60 bg-[#f9bc60]/20 text-[#f9bc60] shadow-[0_0_20px_rgba(249,188,96,0.15)]'
                : 'border-white/10 bg-white/[0.04] text-[#abd1c6]/60 hover:border-white/20 hover:bg-white/[0.08] hover:text-[#abd1c6]',
            )}
            aria-label={`Оценка ${value} из 5`}
          >
            <Star
              className={cn('h-5 w-5', active && 'fill-current')}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}

const fieldLabelClass =
  'text-xs font-semibold uppercase tracking-[0.12em] text-[#abd1c6]';

const fieldControlClass =
  'w-full rounded-xl border border-white/12 bg-[#001e1d]/80 px-3.5 py-3 text-sm text-[#fffffe] outline-none transition-colors placeholder:text-[#abd1c6]/35 focus:border-[#f9bc60]/45 focus:ring-2 focus:ring-[#f9bc60]/15';

export function SiteFeedbackForm({
  initialTopic = 'general',
  source = 'page',
  pagePath,
  lockTopic = false,
  embedded = false,
  compact = false,
  onSubmitted,
  onSubmittingChange,
  onCancel,
  className,
}: SiteFeedbackFormProps) {
  const [topic, setTopic] = useState<FeedbackTopicId>(initialTopic);
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [photos, setPhotos] = useState<FeedbackPhoto[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const topicOptions = useMemo(
    () =>
      Object.entries(FEEDBACK_TOPICS) as Array<
        [FeedbackTopicId, (typeof FEEDBACK_TOPICS)[FeedbackTopicId]]
      >,
    [],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setPhotoError(null);
    setIsSubmitting(true);
    onSubmittingChange?.(true);

    try {
      let imageUrls: string[] = [];
      if (photos.length > 0) {
        imageUrls = await uploadFeedbackPhotos(photos);
      }

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          message,
          topic,
          source,
          pagePath: pagePath ?? null,
          imageUrls,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(getMessageFromApiJson(data, 'Не удалось отправить отзыв'));
        return;
      }

      setIsSuccess(true);
      markFeedbackSubmitted();
      onSubmitted?.();
    } catch (uploadOrNetworkError) {
      const messageText =
        uploadOrNetworkError instanceof Error
          ? uploadOrNetworkError.message
          : 'Не удалось отправить отзыв. Проверьте соединение.';
      if (photos.length > 0 && messageText.includes('фото')) {
        setPhotoError(messageText);
      } else {
        setError(messageText);
      }
    } finally {
      setIsSubmitting(false);
      onSubmittingChange?.(false);
    }
  };

  if (isSuccess) {
    const successBody = (
      <div className='py-4 text-center sm:py-6'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/15 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.12)]'>
          <CheckCircle2 className='h-8 w-8' aria-hidden />
        </div>
        <h3 className='text-xl font-bold text-white'>Спасибо за отзыв!</h3>
        <p className='mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#abd1c6]/90'>
          Мы читаем все сообщения и используем их, чтобы улучшать платформу.
        </p>
      </div>
    );

    if (embedded) {
      return <div className={className}>{successBody}</div>;
    }

    return (
      <Card
        variant='darkGlass'
        padding={compact ? 'md' : 'lg'}
        className={cn('text-center', className)}
      >
        {successBody}
      </Card>
    );
  }

  const formFields = (
    <form
      id='site-feedback-form'
      onSubmit={(event) => void handleSubmit(event)}
      className='space-y-5'
    >
      <div className='space-y-2'>
        <label htmlFor='feedback-topic' className={fieldLabelClass}>
          Тема
        </label>
        <select
          id='feedback-topic'
          value={topic}
          disabled={lockTopic}
          onChange={(event) => {
            const value = event.target.value;
            if (isFeedbackTopicId(value)) setTopic(value);
          }}
          className={cn(fieldControlClass, lockTopic && 'opacity-70')}
        >
          {topicOptions.map(([id, meta]) => (
            <option key={id} value={id}>
              {meta.label}
            </option>
          ))}
        </select>
        <p className='text-xs leading-relaxed text-[#abd1c6]/75'>
          {FEEDBACK_TOPICS[topic].description}
        </p>
      </div>

      <div className='space-y-2.5'>
        <span className={fieldLabelClass}>Оценка сайта (необязательно)</span>
        <StarRating rating={rating} onChange={setRating} />
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between gap-2'>
          <label htmlFor='feedback-message' className={fieldLabelClass}>
            Сообщение
          </label>
          <span className='text-xs tabular-nums text-[#abd1c6]/50'>
            {message.length}/4000
          </span>
        </div>
        <textarea
          id='feedback-message'
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={embedded ? 5 : compact ? 4 : 6}
          maxLength={4000}
          placeholder='Опишите баг, идею или неудобство…'
          className={cn(fieldControlClass, 'min-h-[120px] resize-y')}
          required
        />
      </div>

      <PhotoUpload
        photos={photos}
        onPhotosChange={setPhotos}
        maxPhotos={FEEDBACK_MAX_PHOTOS}
        inputId='feedback-photo-upload'
        variant='dark'
        title={`Фотографии (необязательно, до ${FEEDBACK_MAX_PHOTOS})`}
        error={photoError ?? undefined}
      />

      {error && (
        <p
          className='rounded-xl border border-orange-500/25 bg-orange-500/10 px-3 py-2 text-sm text-orange-300'
          role='alert'
        >
          {error}
        </p>
      )}

      {!embedded && (
        <div className='flex flex-wrap gap-2 pt-1'>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='rounded-xl bg-[#f9bc60] px-6 text-[#001e1d] hover:bg-[#f9bc60]/90'
          >
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Отправка…
              </>
            ) : (
              'Отправить'
            )}
          </Button>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              className='rounded-xl border-[#abd1c6]/30 bg-transparent text-[#abd1c6] hover:bg-white/5 hover:text-white'
            >
              Закрыть
            </Button>
          )}
        </div>
      )}
    </form>
  );

  if (embedded) {
    return <div className={className}>{formFields}</div>;
  }

  return (
    <Card variant='darkGlass' padding={compact ? 'md' : 'lg'} className={className}>
      <div className='mb-5 flex items-start justify-between gap-3'>
        <div>
          <h3 className='text-lg font-bold text-[#fffffe]'>Обратная связь</h3>
          <p className='mt-1 text-sm text-[#abd1c6]/85'>
            Расскажите, что понравилось или что стоит улучшить.
          </p>
        </div>
        {onCancel && (
          <button
            type='button'
            onClick={onCancel}
            className='rounded-lg p-2 text-[#abd1c6]/70 transition-colors hover:bg-white/5 hover:text-[#fffffe]'
            aria-label='Закрыть'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>
      {formFields}
    </Card>
  );
}

export function SiteFeedbackSubmitButton({
  isSubmitting,
  className,
  onClick,
}: {
  isSubmitting?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      type='button'
      form='site-feedback-form'
      onClick={onClick}
      disabled={isSubmitting}
      className={cn(
        'w-full rounded-xl bg-[#f9bc60] py-2.5 text-[#001e1d] shadow-[0_8px_24px_rgba(249,188,96,0.25)] hover:bg-[#f9bc60]/90 sm:w-auto sm:min-w-[160px]',
        className,
      )}
    >
      {isSubmitting ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Отправка…
        </>
      ) : (
        'Отправить'
      )}
    </Button>
  );
}
