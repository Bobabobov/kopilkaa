'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowLeft, MessageCircle } from 'lucide-react';
import type { Route } from 'next';
import { cn } from '@/lib/utils';
import { FAQ_ITEMS } from '@/lib/content/faq';
import {
  KOPI_APPLICATION_STEPS,
  KOPI_MAIN_ACTIONS,
  KOPI_NAV_ITEMS,
  KOPI_WELCOME,
  KOPI_WELCOME_AUTH,
  type KopiMenuId,
} from '@/lib/kopi/kopiScenarios';
import { shouldShowMobileBottomNav } from '@/lib/navigation/mobileBottomNav';
import {
  KOPI_TOUR_FINISH_MESSAGE,
  useKopiTourActions,
  useKopiTourState,
} from '@/components/kopi/KopiTourContext';
import { KOPI_TOUR_FINISHED_EVENT, hasCompletedTour } from '@/lib/kopi/tourStorage';
import { shouldShowKopi } from '@/lib/kopi/visibility';

interface ChatMessage {
  id: string;
  role: 'kopi' | 'user';
  text: string;
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function KopiAssistant() {
  const pathname = usePathname();
  const router = useRouter();
  const { isGuest, authLoading, isAssistantOpen, isTourActive } =
    useKopiTourState();
  const { toggleAssistant, closeAssistant, startTour } = useKopiTourActions();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [menu, setMenu] = useState<KopiMenuId>('main');
  const [selectedFaqIndex, setSelectedFaqIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'kopi', text: KOPI_WELCOME },
  ]);

  const hasBottomNav = shouldShowMobileBottomNav(pathname);

  useEffect(() => {
    if (!isAssistantOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, menu, isAssistantOpen, selectedFaqIndex]);

  useEffect(() => {
    if (!isAssistantOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAssistant();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isAssistantOpen, closeAssistant]);

  const appendMessages = useCallback((next: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...next]);
  }, []);

  useEffect(() => {
    const onTourFinished = () => {
      appendMessages([
        {
          id: createId(),
          role: 'kopi',
          text: KOPI_TOUR_FINISH_MESSAGE,
        },
      ]);
    };

    window.addEventListener(KOPI_TOUR_FINISHED_EVENT, onTourFinished);
    return () => window.removeEventListener(KOPI_TOUR_FINISHED_EVENT, onTourFinished);
  }, [appendMessages]);

  const resetToMain = () => {
    setMenu('main');
    setSelectedFaqIndex(null);
  };

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'kopi',
        text: isGuest ? KOPI_WELCOME : KOPI_WELCOME_AUTH,
      },
    ]);
    setMenu('main');
    setSelectedFaqIndex(null);
  }, [isGuest]);

  const handleStartTour = () => {
    appendMessages([
      { id: createId(), role: 'user', text: 'Пройти экскурсию' },
      {
        id: createId(),
        role: 'kopi',
        text: 'Отлично! Сейчас проведу вас по основным разделам — просто следуйте подсказкам.',
      },
    ]);
    closeAssistant();
    startTour();
  };

  const handleMainAction = (actionId: (typeof KOPI_MAIN_ACTIONS)[number]['id']) => {
    const action = KOPI_MAIN_ACTIONS.find((item) => item.id === actionId);
    if (!action) return;

    if (actionId === 'start-tour') {
      handleStartTour();
      return;
    }

    appendMessages([{ id: createId(), role: 'user', text: action.label }]);

    if (actionId === 'go-applications') {
      appendMessages([
        {
          id: createId(),
          role: 'kopi',
          text: 'Отлично! Сейчас перенесу вас на страницу заявки.',
        },
      ]);
      closeAssistant();
      router.push('/applications');
      return;
    }

    if (actionId === 'application') {
      setMenu('application');
      appendMessages([
        {
          id: createId(),
          role: 'kopi',
          text: 'Вот пошаговая инструкция — следуйте ей, и заявка будет готова:',
        },
      ]);
      return;
    }

    if (actionId === 'navigation') {
      setMenu('navigation');
      appendMessages([
        {
          id: createId(),
          role: 'kopi',
          text: 'Выберите раздел — я подскажу, зачем он нужен, и перенесу вас туда:',
        },
      ]);
      return;
    }

    if (actionId === 'faq') {
      setMenu('faq');
      appendMessages([
        {
          id: createId(),
          role: 'kopi',
          text: 'Выберите вопрос — отвечу коротко и по делу:',
        },
      ]);
    }
  };

  const handleNavigate = (href: Route, label: string) => {
    appendMessages([
      { id: createId(), role: 'user', text: label },
      {
        id: createId(),
        role: 'kopi',
        text: `Переходим в раздел «${label}». Удачи!`,
      },
    ]);
    closeAssistant();
    router.push(href);
  };

  const handleFaqSelect = (index: number) => {
    const item = FAQ_ITEMS[index];
    if (!item) return;

    setSelectedFaqIndex(index);
    setMenu('faq-answer');
    appendMessages([
      { id: createId(), role: 'user', text: item.question },
      { id: createId(), role: 'kopi', text: item.answer },
    ]);
  };

  if (!shouldShowKopi(pathname)) return null;
  if (authLoading) return null;

  const fabBottomClass = hasBottomNav
    ? 'max-[1199px]:bottom-[calc(var(--bottom-nav-offset)+0.75rem)] min-[1200px]:bottom-6'
    : 'bottom-6';

  const mainActions = KOPI_MAIN_ACTIONS.map((action) =>
    action.id === 'start-tour' && !isGuest && hasCompletedTour()
      ? { ...action, label: 'Повторить экскурсию' }
      : action,
  );

  const applicationSteps = isGuest
    ? KOPI_APPLICATION_STEPS
    : KOPI_APPLICATION_STEPS.slice(1);

  return (
    <>
      <div
        data-kopi-assistant
        className={cn(
          'fixed left-4 sm:left-6 z-[45] flex flex-col items-start gap-3',
          fabBottomClass,
          isTourActive && 'pointer-events-none opacity-80',
        )}
      >
        <motion.button
          type="button"
          onClick={toggleAssistant}
          aria-label={
            isAssistantOpen ? 'Закрыть помощника Копи' : 'Открыть помощника Копи'
          }
          aria-expanded={isAssistantOpen}
          disabled={isTourActive}
          className={cn(
            'relative group flex flex-shrink-0 items-center gap-2.5 rounded-full border-2 py-1 pl-1 pr-3 sm:gap-3 sm:pr-4 shadow-2xl transition-shadow',
            'group-hover:shadow-[0_0_28px_rgba(249,188,96,0.45)]',
            isTourActive && 'cursor-default',
          )}
          style={{
            borderColor: 'rgba(249, 188, 96, 0.45)',
            background:
              'linear-gradient(145deg, rgba(0,78,67,0.95) 0%, rgba(0,30,29,0.98) 100%)',
          }}
          whileHover={isTourActive ? undefined : { scale: 1.02 }}
          whileTap={isTourActive ? undefined : { scale: 0.98 }}
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-full opacity-20"
            style={{ background: '#f9bc60' }}
            aria-hidden
          />
          <span className="relative flex h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center rounded-full border border-[#f9bc60]/30 bg-[#004643]/80">
            <Image
              src="/FAQ.png"
              alt=""
              width={56}
              height={56}
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain drop-shadow-lg"
              loading="lazy"
            />
            <span
              className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold shadow-md"
              style={{ background: '#f9bc60', color: '#001e1d' }}
            >
              ?
            </span>
          </span>
          <span className="relative min-w-0 text-left leading-tight">
            <span className="block text-sm font-bold text-[#fffffe] sm:text-base">
              Копи
            </span>
            <span className="block text-[10px] text-[#abd1c6] sm:text-xs">
              Помощник «Копилки»
            </span>
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isAssistantOpen && !isTourActive && (
          <>
            <motion.button
              type="button"
              aria-label="Закрыть панель помощника"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[46] bg-black/40 backdrop-blur-[2px]"
              onClick={closeAssistant}
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-labelledby="kopi-assistant-title"
              aria-modal="true"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className={cn(
                'fixed z-[47] flex w-[min(100vw-2rem,24rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl',
                'left-4 sm:left-6',
                hasBottomNav
                  ? 'max-[1199px]:bottom-[calc(var(--bottom-nav-offset)+5.75rem)] min-[1200px]:bottom-28'
                  : 'bottom-28',
                'max-h-[min(70vh,32rem)]',
              )}
              style={{
                background: 'rgba(0, 30, 29, 0.98)',
                borderColor: 'rgba(171, 209, 198, 0.25)',
              }}
            >
              <div
                className="flex items-center gap-3 border-b px-4 py-3"
                style={{ borderColor: 'rgba(171, 209, 198, 0.15)' }}
              >
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-[#f9bc60]/40 bg-[#004643]">
                  <Image
                    src="/FAQ.png"
                    alt=""
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2
                    id="kopi-assistant-title"
                    className="truncate text-base font-bold"
                    style={{ color: '#fffffe' }}
                  >
                    Копи
                  </h2>
                  <p className="truncate text-xs" style={{ color: '#abd1c6' }}>
                    Амбасадор «Копилки»
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeAssistant}
                  className="rounded-lg p-2 transition-colors hover:bg-white/10"
                  aria-label="Закрыть"
                >
                  <X className="h-5 w-5 text-[#abd1c6]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start',
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line',
                        message.role === 'user'
                          ? 'rounded-br-md'
                          : 'rounded-bl-md',
                      )}
                      style={
                        message.role === 'user'
                          ? {
                              background: '#f9bc60',
                              color: '#001e1d',
                            }
                          : {
                              background: 'rgba(171, 209, 198, 0.12)',
                              color: '#fffffe',
                              border: '1px solid rgba(171, 209, 198, 0.15)',
                            }
                      }
                    >
                      {message.text}
                    </div>
                  </div>
                ))}

                {menu === 'application' && (
                  <div className="space-y-2 pt-1">
                    {applicationSteps.map((step, index) => (
                      <div
                        key={step.title}
                        className="rounded-xl border px-3 py-2.5"
                        style={{
                          borderColor: 'rgba(249, 188, 96, 0.2)',
                          background: 'rgba(249, 188, 96, 0.06)',
                        }}
                      >
                        <p
                          className="text-xs font-bold uppercase tracking-wide mb-1"
                          style={{ color: '#f9bc60' }}
                        >
                          Шаг {index + 1}
                        </p>
                        <p className="text-sm font-semibold text-[#fffffe]">
                          {step.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-[#abd1c6]">
                          {step.text}
                        </p>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleMainAction('go-applications')}
                      className="mt-2 w-full rounded-xl px-4 py-2.5 text-sm font-bold transition-opacity hover:opacity-90"
                      style={{ background: '#f9bc60', color: '#001e1d' }}
                    >
                      Перейти к заявке →
                    </button>
                  </div>
                )}

                {menu === 'navigation' && (
                  <div className="space-y-2 pt-1">
                    {KOPI_NAV_ITEMS.map((item) => (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() => handleNavigate(item.href, item.label)}
                        className="w-full rounded-xl border px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                        style={{ borderColor: 'rgba(171, 209, 198, 0.15)' }}
                      >
                        <p className="text-sm font-semibold text-[#fffffe]">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-xs text-[#abd1c6]">
                          {item.description}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {menu === 'faq' && (
                  <div className="space-y-2 pt-1">
                    {FAQ_ITEMS.map((item, index) => (
                      <button
                        key={item.question}
                        type="button"
                        onClick={() => handleFaqSelect(index)}
                        className="w-full rounded-xl border px-3 py-2.5 text-left text-sm text-[#fffffe] transition-colors hover:bg-white/5"
                        style={{ borderColor: 'rgba(171, 209, 198, 0.15)' }}
                      >
                        {item.question}
                      </button>
                    ))}
                    <Link
                      href="/#faq"
                      onClick={closeAssistant}
                      className="block w-full rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition-colors hover:bg-white/5"
                      style={{
                        borderColor: 'rgba(249, 188, 96, 0.25)',
                        color: '#f9bc60',
                      }}
                    >
                      Все вопросы на главной →
                    </Link>
                  </div>
                )}

                {menu === 'faq-answer' && selectedFaqIndex !== null && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        resetToMain();
                        appendMessages([
                          {
                            id: createId(),
                            role: 'kopi',
                            text: 'Выберите, чем ещё могу помочь:',
                          },
                        ]);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#f9bc60] hover:underline"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      К списку вопросов
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {menu === 'main' && (
                <div
                  className="border-t px-3 py-3 space-y-2"
                  style={{ borderColor: 'rgba(171, 209, 198, 0.15)' }}
                >
                  <p className="flex items-center gap-1.5 text-xs font-medium text-[#abd1c6]">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Быстрые действия
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {mainActions.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => handleMainAction(action.id)}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90',
                          action.id === 'go-applications' ||
                            action.id === 'start-tour'
                            ? 'text-[#001e1d]'
                            : 'text-[#fffffe] border',
                        )}
                        style={
                          action.id === 'go-applications' ||
                          action.id === 'start-tour'
                            ? { background: '#f9bc60' }
                            : {
                                borderColor: 'rgba(171, 209, 198, 0.25)',
                                background: 'rgba(171, 209, 198, 0.08)',
                              }
                        }
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {menu !== 'main' && menu !== 'faq-answer' && (
                <div
                  className="border-t px-3 py-2.5"
                  style={{ borderColor: 'rgba(171, 209, 198, 0.15)' }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      resetToMain();
                      appendMessages([
                        {
                          id: createId(),
                          role: 'kopi',
                          text: 'Вернёмся в начало. Чем могу помочь?',
                        },
                      ]);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#f9bc60] hover:underline"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    В главное меню
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
