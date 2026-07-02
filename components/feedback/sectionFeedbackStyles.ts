import type { FeedbackTopicId } from '@/lib/feedback/config';

export type SectionFeedbackVariant =
  | 'stories'
  | 'reviews'
  | 'applications'
  | 'good-deeds'
  | 'games'
  | 'vyzhivanie'
  | 'heroes'
  | 'advertising'
  | 'support'
  | 'profile'
  | 'footer';

export const SECTION_FEEDBACK_TOPIC: Record<
  SectionFeedbackVariant,
  FeedbackTopicId
> = {
  stories: 'stories',
  reviews: 'reviews',
  applications: 'applications',
  'good-deeds': 'good_deeds',
  games: 'games',
  vyzhivanie: 'vyzhivanie',
  heroes: 'heroes',
  advertising: 'advertising',
  support: 'support',
  profile: 'profile',
  footer: 'general',
};

export const SECTION_FEEDBACK_COPY: Record<
  SectionFeedbackVariant,
  { title: string; description: string; button: string }
> = {
  stories: {
    title: 'Нашли ошибку или есть идея?',
    description: 'Расскажите, что улучшить в разделе историй.',
    button: 'Написать в поддержку',
  },
  reviews: {
    title: 'Что-то не так с отзывами?',
    description: 'Сообщите о баге или предложите улучшение.',
    button: 'Написать в поддержку',
  },
  applications: {
    title: 'Проблема с подачей заявки?',
    description: 'Опишите неудобство — мы разберёмся и поправим.',
    button: 'Написать в поддержку',
  },
  'good-deeds': {
    title: 'Нужна помощь по добрым делам?',
    description: 'Баг, вопрос по заданию или идея — напишите нам.',
    button: 'Написать в поддержку',
  },
  games: {
    title: 'Раздел в разработке',
    description:
      'Возможны баги и неполная адаптивность. Если что-то сломалось — сообщите.',
    button: 'Написать',
  },
  vyzhivanie: {
    title: 'Баг в игре?',
    description: 'Опишите проблему с «Выживанием».',
    button: 'Написать',
  },
  heroes: {
    title: 'Вопрос по разделу героев?',
    description: 'Сообщите, если что-то отображается неверно.',
    button: 'Написать в поддержку',
  },
  advertising: {
    title: 'Вопрос по рекламе?',
    description: 'Техническая проблема или предложение по разделу.',
    button: 'Написать в поддержку',
  },
  support: {
    title: 'Техническая проблема?',
    description: 'Если что-то не работает на сайте — дайте знать.',
    button: 'Написать в поддержку',
  },
  profile: {
    title: 'Проблема в кабинете?',
    description: 'Бонусы, профиль, настройки — опишите, что не так.',
    button: 'Написать в поддержку',
  },
  footer: {
    title: 'Обратная связь',
    description: 'Сообщите о баге или предложите улучшение платформы.',
    button: 'Написать в поддержку',
  },
};

interface SectionFeedbackTheme {
  banner: string;
  icon: string;
  title: string;
  text: string;
  button: string;
  buttonHover: string;
}

export const SECTION_FEEDBACK_THEME: Record<
  SectionFeedbackVariant,
  SectionFeedbackTheme
> = {
  stories: {
    banner:
      'border-white/12 bg-white/[0.05] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
    icon: 'border-[#f9bc60]/30 bg-[#f9bc60]/15 text-[#f9bc60]',
    title: 'text-[#fffffe]',
    text: 'text-[#abd1c6]/85',
    button:
      'border-[#f9bc60]/35 bg-[#f9bc60]/12 text-[#f9bc60] hover:border-[#f9bc60]/55 hover:bg-[#f9bc60]/20',
    buttonHover: '',
  },
  reviews: {
    banner:
      'border-[#f9bc60]/25 bg-[#f9bc60]/8 backdrop-blur-sm shadow-[0_8px_32px_rgba(249,188,96,0.08)]',
    icon: 'border-[#f9bc60]/35 bg-[#f9bc60]/20 text-[#f9bc60]',
    title: 'text-[#fffffe]',
    text: 'text-[#abd1c6]/90',
    button:
      'bg-gradient-to-r from-[#e8a545] to-[#f9bc60] text-[#001e1d] shadow-[0_8px_24px_rgba(249,188,96,0.22)] hover:opacity-90',
    buttonHover: '',
  },
  applications: {
    banner:
      'border-[#abd1c6]/20 bg-[#004643]/40 backdrop-blur-md',
    icon: 'border-[#f9bc60]/30 bg-[#f9bc60]/15 text-[#f9bc60]',
    title: 'text-[#fffffe]',
    text: 'text-[#abd1c6]',
    button:
      'border border-[#f9bc60]/40 bg-[#f9bc60] text-[#001e1d] hover:bg-[#f7b24a]',
    buttonHover: '',
  },
  'good-deeds': {
    banner:
      'border-[#f9bc60]/20 bg-[#f9bc60]/6 backdrop-blur-md',
    icon: 'border-[#f9bc60]/30 bg-[#f9bc60]/12 text-[#f9bc60]',
    title: 'text-[#fffffe]',
    text: 'text-[#abd1c6]/88',
    button:
      'border-[#f9bc60]/35 bg-[#f9bc60] text-[#001e1d] hover:bg-[#f7b24a]',
    buttonHover: '',
  },
  games: {
    banner: 'border-amber-500/25 bg-amber-500/5 backdrop-blur-md',
    icon: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    title: 'text-amber-400',
    text: 'text-zinc-400',
    button:
      'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:border-amber-400/50 hover:bg-amber-500/15',
    buttonHover: '',
  },
  vyzhivanie: {
    banner:
      'border-cyan-400/30 bg-black/55 backdrop-blur-sm shadow-[0_0_24px_rgba(34,211,238,0.08)]',
    icon: 'border-cyan-300/40 bg-cyan-400/10 text-cyan-300',
    title: 'text-cyan-100',
    text: 'text-[#94a3b8]',
    button:
      'border-cyan-300/45 bg-cyan-400/10 text-cyan-100 hover:border-cyan-200/60 hover:bg-cyan-400/18',
    buttonHover: '',
  },
  heroes: {
    banner: 'border-white/10 bg-white/[0.04] backdrop-blur-sm',
    icon: 'border-[#f9bc60]/35 bg-[#f9bc60]/15 text-[#f9bc60]',
    title: 'text-[#fffffe]',
    text: 'text-[#abd1c6]',
    button:
      'bg-gradient-to-r from-[#e8a545] to-[#f9bc60] text-[#001e1d] shadow-[0_8px_24px_rgba(249,188,96,0.2)] hover:opacity-90',
    buttonHover: '',
  },
  advertising: {
    banner: 'border-[#f9bc60]/20 bg-[#f9bc60]/6',
    icon: 'border-[#f9bc60]/30 bg-[#f9bc60]/12 text-[#f9bc60]',
    title: 'text-[#fffffe]',
    text: 'text-[#abd1c6]',
    button:
      'border border-[#f9bc60]/40 text-[#f9bc60] hover:bg-[#f9bc60]/12',
    buttonHover: '',
  },
  support: {
    banner: 'border-[#f9bc60]/25 bg-[#f9bc60]/8',
    icon: 'border-[#f9bc60]/35 bg-[#f9bc60]/18 text-[#f9bc60]',
    title: 'text-[#fffffe]',
    text: 'text-[#abd1c6]',
    button:
      'bg-[#f9bc60] text-[#001e1d] hover:bg-[#f7b24a] shadow-[0_8px_24px_rgba(249,188,96,0.2)]',
    buttonHover: '',
  },
  profile: {
    banner:
      'border-emerald-400/20 bg-emerald-500/8 backdrop-blur-md shadow-[0_8px_32px_rgba(16,185,129,0.06)]',
    icon: 'border-emerald-400/30 bg-emerald-500/12 text-emerald-300',
    title: 'text-emerald-50',
    text: 'text-emerald-100/75',
    button:
      'border-emerald-400/35 bg-emerald-500/15 text-emerald-200 hover:border-emerald-300/50 hover:bg-emerald-500/22',
    buttonHover: '',
  },
  footer: {
    banner:
      'border-[#abd1c6]/20 bg-[#abd1c6]/5 hover:border-[#f9bc60]/30',
    icon: 'border-[#f9bc60]/30 bg-[#f9bc60]/15 text-[#f9bc60]',
    title: 'text-[#fffffe]',
    text: 'text-[#abd1c6]',
    button:
      'bg-[#f9bc60] text-[#001e1d] hover:bg-[#f7b24a]',
    buttonHover: '',
  },
};
