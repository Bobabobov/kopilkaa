'use client';

import { MapPin } from 'lucide-react';
import {
  getFeedbackOriginBadgeClass,
  getFeedbackOriginLabel,
  type FeedbackOriginInput,
} from '@/lib/feedback/originBadge';
import { cn } from '@/lib/utils';

interface FeedbackOriginBadgeProps extends FeedbackOriginInput {
  className?: string;
}

export function FeedbackOriginBadge({
  topic,
  topicLabel,
  source,
  pagePath,
  className,
}: FeedbackOriginBadgeProps) {
  const label = getFeedbackOriginLabel({ topic, topicLabel, source, pagePath });
  const styleClass = getFeedbackOriginBadgeClass(topic);

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide sm:text-sm',
        styleClass,
        className,
      )}
    >
      <MapPin className='h-3.5 w-3.5 shrink-0 opacity-80' aria-hidden />
      <span className='truncate'>{label}</span>
    </span>
  );
}
