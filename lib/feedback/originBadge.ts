import {
  FEEDBACK_TOPICS,
  type FeedbackTopicId,
  isFeedbackTopicId,
} from './config';

export interface FeedbackOriginInput {
  topic: string;
  topicLabel: string | null;
  source: string;
  pagePath: string | null;
}

const TOPIC_BADGE_CLASS: Record<FeedbackTopicId, string> = {
  general:
    'border-[#abd1c6]/35 bg-[#abd1c6]/10 text-[#c8e6df] shadow-[0_0_12px_rgba(171,209,198,0.08)]',
  games:
    'border-amber-400/45 bg-amber-500/15 text-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.12)]',
  applications:
    'border-[#f9bc60]/45 bg-[#f9bc60]/14 text-[#ffd89a] shadow-[0_0_14px_rgba(249,188,96,0.14)]',
  good_deeds:
    'border-emerald-400/40 bg-emerald-500/14 text-emerald-200 shadow-[0_0_14px_rgba(16,185,129,0.1)]',
  stories:
    'border-violet-400/40 bg-violet-500/14 text-violet-200 shadow-[0_0_14px_rgba(139,92,246,0.12)]',
  reviews:
    'border-[#f9bc60]/50 bg-[#f9bc60]/16 text-[#ffe4b5] shadow-[0_0_14px_rgba(249,188,96,0.16)]',
  heroes:
    'border-orange-400/40 bg-orange-500/14 text-orange-200 shadow-[0_0_14px_rgba(249,115,22,0.12)]',
  advertising:
    'border-yellow-400/40 bg-yellow-500/12 text-yellow-100 shadow-[0_0_14px_rgba(234,179,8,0.1)]',
  vyzhivanie:
    'border-cyan-400/45 bg-cyan-500/14 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.12)]',
  profile:
    'border-teal-400/40 bg-teal-500/14 text-teal-200 shadow-[0_0_14px_rgba(45,212,191,0.1)]',
  support:
    'border-sky-400/40 bg-sky-500/14 text-sky-200 shadow-[0_0_14px_rgba(56,189,248,0.12)]',
  other:
    'border-white/25 bg-white/8 text-[#abd1c6] shadow-[0_0_12px_rgba(255,255,255,0.04)]',
};

function shortenTopicLabel(label: string): string {
  return label.replace(/^Раздел:\s*/i, '').trim() || label;
}

function resolveTopicId(topic: string): FeedbackTopicId {
  return isFeedbackTopicId(topic) ? topic : 'other';
}

/** Один понятный ярлык «откуда пришёл отзыв». */
export function getFeedbackOriginLabel(input: FeedbackOriginInput): string {
  const topicId = resolveTopicId(input.topic);
  const section =
    shortenTopicLabel(
      input.topicLabel ?? FEEDBACK_TOPICS[topicId]?.label ?? input.topic,
    );

  if (topicId === 'general') {
    if (input.source === 'popup') return 'Попап на сайте';
    if (input.pagePath) return input.pagePath;
    return section;
  }

  if (input.source === 'popup') return `${section} · попап`;
  return section;
}

export function getFeedbackOriginBadgeClass(topic: string): string {
  const topicId = resolveTopicId(topic);
  return TOPIC_BADGE_CLASS[topicId];
}
