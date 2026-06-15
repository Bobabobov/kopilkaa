'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  MessageCircle,
  Search,
  Send,
  Home,
  ClipboardList,
  BookOpen,
  Star,
  Heart,
  Trophy,
  HandHeart,
  User,
  Megaphone,
  Compass,
  Map,
  HelpCircle,
  ArrowRight,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import type { Route } from 'next';
import { cn } from '@/lib/utils';
import { FAQ_ITEMS } from '@/lib/content/faq';
import {
  KOPI_APPLICATION_STEPS,
  KOPI_NAV_ITEMS,
  type KopiMenuId,
  type KopiQuickAction,
} from '@/lib/kopi/kopiScenarios';
import {
  getContextualActions,
  getContextualWelcome,
  resolveKopiQuery,
  filterFaqByQuery,
  getRelatedFaqIndices,
  KOPI_ACTION_ICONS,
  KOPI_NAV_ICONS,
  type KopiConversationState,
  type KopiQueryResult,
} from '@/lib/kopi/kopiIntelligence';
import { shouldShowMobileBottomNav } from '@/lib/navigation/mobileBottomNav';
import {
  KOPI_TOUR_FINISH_MESSAGE,
  useKopiTourActions,
  useKopiTourState,
} from '@/components/kopi/KopiTourContext';
import {
  KopiAvatar,
  KopiBackButton,
  KopiFabButton,
  KopiMessageBubble,
  KopiTypingIndicator,
} from '@/components/kopi/KopiAssistantParts';
import { KOPI_TOUR_FINISHED_EVENT, hasCompletedTour } from '@/lib/kopi/tourStorage';
import {
  sanitizeKopiExternalLink,
  sanitizeKopiNavigateTarget,
  sanitizeKopiUserQuery,
  KOPI_MAX_QUERY_LENGTH,
} from '@/lib/kopi/kopiSecurity';
import { shouldShowKopi } from '@/lib/kopi/visibility';

interface ChatMessage {
  id: string;
  role: 'kopi' | 'user';
  text: string;
}

const NAV_ICON_MAP: Record<string, LucideIcon> = {
  Home,
  ClipboardList,
  BookOpen,
  Star,
  Heart,
  Trophy,
  HandHeart,
  User,
  Megaphone,
  Shield,
};

const ACTION_ICON_MAP: Record<string, LucideIcon> = {
  Compass,
  ClipboardList,
  Map,
  HelpCircle,
  ArrowRight,
};

const TYPING_DELAY_MS = 600;

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const EMPTY_CONVERSATION: KopiConversationState = {
  lastFaqIndex: null,
  lastIntent: null,
  lastReply: null,
};

export default function KopiAssistant() {
  const pathname = usePathname();
  const router = useRouter();
  const { isGuest, authLoading, isAssistantOpen, isTourActive } = useKopiTourState();
  const { toggleAssistant, closeAssistant, startTour } = useKopiTourActions();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [menu, setMenu] = useState<KopiMenuId>('main');
  const [selectedFaqIndex, setSelectedFaqIndex] = useState<number | null>(null);
  const [relatedFaqIndices, setRelatedFaqIndices] = useState<number[]>([]);
  const [faqSearch, setFaqSearch] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [conversation, setConversation] = useState<KopiConversationState>(EMPTY_CONVERSATION);
  const [externalLink, setExternalLink] = useState<{ href: string; label: string } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'kopi', text: getContextualWelcome(pathname, true) },
  ]);

  const hasBottomNav = shouldShowMobileBottomNav(pathname);

  useEffect(() => {
    if (!isAssistantOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, menu, isAssistantOpen, selectedFaqIndex, isTyping, externalLink]);

  useEffect(() => {
    if (!isAssistantOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAssistant();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isAssistantOpen, closeAssistant]);

  useEffect(() => {
    if (isAssistantOpen) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 200);
      return () => window.clearTimeout(timer);
    }
  }, [isAssistantOpen, menu]);

  const appendMessages = useCallback((next: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...next]);
  }, []);

  useEffect(() => {
    const onTourFinished = () => {
      appendMessages([{ id: createId(), role: 'kopi', text: KOPI_TOUR_FINISH_MESSAGE }]);
    };
    window.addEventListener(KOPI_TOUR_FINISHED_EVENT, onTourFinished);
    return () => window.removeEventListener(KOPI_TOUR_FINISHED_EVENT, onTourFinished);
  }, [appendMessages]);

  useEffect(() => {
    setMessages([{ id: 'welcome', role: 'kopi', text: getContextualWelcome(pathname, isGuest) }]);
    setMenu('main');
    setSelectedFaqIndex(null);
    setRelatedFaqIndices([]);
    setFaqSearch('');
    setExternalLink(null);
    setConversation(EMPTY_CONVERSATION);
  }, [isGuest, pathname]);

  const resetToMain = useCallback(() => {
    setMenu('main');
    setSelectedFaqIndex(null);
    setRelatedFaqIndices([]);
    setFaqSearch('');
    setExternalLink(null);
  }, []);

  const replyAsKopi = useCallback(
    (text: string, onDone?: () => void) => {
      setIsTyping(true);
      window.setTimeout(() => {
        appendMessages([{ id: createId(), role: 'kopi', text }]);
        setIsTyping(false);
        onDone?.();
      }, TYPING_DELAY_MS);
    },
    [appendMessages],
  );

  const handleStartTour = () => {
    appendMessages([{ id: createId(), role: 'user', text: 'Пройти экскурсию' }]);
    replyAsKopi('Отлично! Сейчас проведу вас по основным разделам — просто следуйте подсказкам.', () => {
      closeAssistant();
      startTour();
    });
  };

  const applyQueryResult = useCallback(
    (query: string, result: KopiQueryResult) => {
      const patchConversationState = (patch?: Partial<KopiConversationState>) => {
        if (!patch) return;
        setConversation((prev) => ({
          ...prev,
          ...patch,
          lastReply: result.reply,
        }));
      };

      if (result.openMenu) setMenu(result.openMenu);

      if (result.faqIndex !== undefined) {
        setSelectedFaqIndex(result.faqIndex);
        setRelatedFaqIndices(result.relatedFaqIndices ?? getRelatedFaqIndices(result.faqIndex));
        if (result.openMenu === 'faq') setFaqSearch(query);
      }

      if (result.intent === 'start_tour') {
        patchConversationState(result.conversationPatch);
        replyAsKopi(result.reply, () => {
          closeAssistant();
          startTour();
        });
        return;
      }

      if (result.intent === 'navigate' && result.navigateTo && result.navigateLabel) {
        const target = sanitizeKopiNavigateTarget(result.navigateTo, result.navigateLabel);
        patchConversationState(result.conversationPatch);
        if (target) {
          replyAsKopi(result.reply, () => {
            closeAssistant();
            router.push(target.route);
          });
        } else {
          replyAsKopi('Не могу перейти по этому адресу — выберите раздел в меню навигации.');
        }
        return;
      }

      setExternalLink(sanitizeKopiExternalLink(result.externalLink ?? undefined));
      patchConversationState(result.conversationPatch);
      replyAsKopi(result.reply);
    },
    [replyAsKopi, closeAssistant, startTour, router],
  );

  const handleUserQuery = (query: string) => {
    const trimmed = sanitizeKopiUserQuery(query);
    if (!trimmed || isTyping) return;

    appendMessages([{ id: createId(), role: 'user', text: trimmed }]);
    setQuestionInput('');
    setExternalLink(null);

    const result = resolveKopiQuery(trimmed, { pathname, isGuest, conversation });
    applyQueryResult(trimmed, result);
  };

  const handleMainAction = (actionId: KopiQuickAction['id']) => {
    const mainActions = getContextualActions(pathname, isGuest, hasCompletedTour());
    const action = mainActions.find((item) => item.id === actionId);
    if (!action) return;

    if (actionId === 'start-tour') {
      handleStartTour();
      return;
    }

    appendMessages([{ id: createId(), role: 'user', text: action.label }]);

    if (actionId === 'go-applications') {
      replyAsKopi('Отлично! Сейчас перенесу вас на страницу заявки.', () => {
        closeAssistant();
        router.push('/applications');
      });
      return;
    }

    if (actionId === 'application') {
      setMenu('application');
      replyAsKopi('Вот пошаговая инструкция — следуйте ей, и заявка будет готова:');
      return;
    }

    if (actionId === 'navigation') {
      setMenu('navigation');
      replyAsKopi('Выберите раздел — я подскажу, зачем он нужен, и перенесу вас туда:');
      return;
    }

    if (actionId === 'faq') {
      setMenu('faq');
      replyAsKopi('Выберите вопрос или введите свой — отвечу коротко и по делу:');
    }
  };

  const handleNavigate = (href: Route, label: string) => {
    const target = sanitizeKopiNavigateTarget(href, label);
    if (!target) return;

    appendMessages([{ id: createId(), role: 'user', text: target.label }]);
    replyAsKopi(`Переходим в раздел «${target.label}». Удачи!`, () => {
      closeAssistant();
      router.push(target.route);
    });
  };

  const handleFaqSelect = (index: number) => {
    const item = FAQ_ITEMS[index];
    if (!item) return;

    setSelectedFaqIndex(index);
    setRelatedFaqIndices(getRelatedFaqIndices(index));
    setMenu('faq-answer');
    appendMessages([
      { id: createId(), role: 'user', text: item.question },
    ]);
    replyAsKopi(item.answer);
    setConversation((prev) => ({
      ...prev,
      lastFaqIndex: index,
      lastIntent: 'faq_answer',
      lastReply: item.answer,
    }));
  };

  const handleDismissKopi = useCallback(() => {
    closeAssistant();
    setIsDismissed(true);
  }, [closeAssistant]);

  const handleQuestionSubmit = () => {
    handleUserQuery(questionInput);
  };

  if (!shouldShowKopi(pathname)) return null;
  if (authLoading) return null;
  if (isDismissed) return null;

  const fabBottomClass = hasBottomNav
    ? 'max-[1199px]:bottom-[calc(var(--bottom-nav-offset)+0.75rem)] min-[1200px]:bottom-6'
    : 'bottom-[max(0.75rem,env(safe-area-inset-bottom))] sm:bottom-6';

  const panelBottomClass = hasBottomNav
    ? 'bottom-[calc(var(--bottom-nav-offset)+0.75rem)]'
    : 'bottom-[max(0.75rem,env(safe-area-inset-bottom))] sm:bottom-6';

  const mainActions = getContextualActions(pathname, isGuest, hasCompletedTour());
  const applicationSteps = isGuest
    ? KOPI_APPLICATION_STEPS
    : KOPI_APPLICATION_STEPS.slice(1);
  const faqIndices = filterFaqByQuery(faqSearch);

  return (
    <>
      {!isAssistantOpen && (
        <div
          data-kopi-assistant
          className={cn(
            'fixed left-4 z-[45] sm:left-6',
            fabBottomClass,
            isTourActive && 'pointer-events-none opacity-80',
          )}
        >
          <KopiFabButton
            isOpen={isAssistantOpen}
            isTourActive={isTourActive}
            showPulse={!hasCompletedTour()}
            onClick={toggleAssistant}
            onDismiss={handleDismissKopi}
          />
        </div>
      )}

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
                'fixed z-[47] flex w-[min(100vw-1.5rem,24rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl',
                'left-3 right-3 mx-auto sm:left-6 sm:right-auto sm:mx-0',
                panelBottomClass,
                hasBottomNav
                  ? 'max-[1199px]:max-h-[min(72dvh,32rem)] min-[1200px]:max-h-[min(70vh,32rem)]'
                  : 'max-h-[min(78dvh,34rem)] sm:max-h-[min(70vh,32rem)]',
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
                <KopiAvatar size="md" showOnline />
                <div className="min-w-0 flex-1">
                  <h2 id="kopi-assistant-title" className="truncate text-base font-bold text-[#fffffe]">
                    Копи
                  </h2>
                  <p className="truncate text-xs text-[#abd1c6]">Амбасадор «Копилки»</p>
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

              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
                  {messages.map((message, index) => (
                    <KopiMessageBubble
                      key={message.id}
                      role={message.role}
                      text={message.text}
                      index={index}
                    />
                  ))}

                  <AnimatePresence>
                    {isTyping && <KopiTypingIndicator />}
                  </AnimatePresence>

                  {externalLink && !isTyping && (
                    <div className="flex justify-start pl-10">
                      <a
                        href={externalLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-[#f9bc60]/35 bg-[#f9bc60]/10 px-3.5 py-2 text-sm font-semibold text-[#f9bc60] transition-colors hover:bg-[#f9bc60]/20"
                      >
                        {externalLink.label}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  )}

                  {menu === 'application' && !isTyping && (
                    <div className="space-y-2 pt-1">
                      {applicationSteps.map((step, index) => (
                        <div
                          key={step.title}
                          className="rounded-xl border border-[#f9bc60]/20 bg-[#f9bc60]/6 px-3 py-2.5"
                        >
                          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[#f9bc60]">
                            Шаг {index + 1}
                          </p>
                          <p className="text-sm font-semibold text-[#fffffe]">{step.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-[#abd1c6]">{step.text}</p>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleMainAction('go-applications')}
                        className="mt-2 w-full rounded-xl bg-[#f9bc60] px-4 py-2.5 text-sm font-bold text-[#001e1d] transition-opacity hover:opacity-90"
                      >
                        Перейти к заявке →
                      </button>
                    </div>
                  )}

                  {menu === 'navigation' && !isTyping && (
                    <div className="space-y-2 pt-1">
                      {KOPI_NAV_ITEMS.map((item) => {
                        const iconKey = KOPI_NAV_ICONS[item.href];
                        const Icon = iconKey ? NAV_ICON_MAP[iconKey] : Home;
                        return (
                          <button
                            key={item.href}
                            type="button"
                            onClick={() => handleNavigate(item.href, item.label)}
                            className="flex w-full items-start gap-3 rounded-xl border border-[#abd1c6]/15 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                          >
                            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#f9bc60]" />
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-[#fffffe]">
                                {item.label}
                              </span>
                              <span className="mt-0.5 block text-xs text-[#abd1c6]">
                                {item.description}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {menu === 'faq' && !isTyping && (
                    <div className="space-y-2 pt-1">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#abd1c6]/60" />
                        <input
                          type="search"
                          value={faqSearch}
                          onChange={(event) => setFaqSearch(event.target.value)}
                          placeholder="Поиск по вопросам..."
                          className="w-full rounded-xl border border-[#abd1c6]/20 bg-white/5 py-2 pl-9 pr-3 text-sm text-[#fffffe] placeholder:text-[#abd1c6]/50 focus:border-[#f9bc60]/40 focus:outline-none"
                        />
                      </div>
                      {faqIndices.map((index) => {
                        const item = FAQ_ITEMS[index];
                        if (!item) return null;
                        return (
                          <button
                            key={item.question}
                            type="button"
                            onClick={() => handleFaqSelect(index)}
                            className="w-full rounded-xl border border-[#abd1c6]/15 px-3 py-2.5 text-left text-sm text-[#fffffe] transition-colors hover:bg-white/5"
                          >
                            {item.question}
                          </button>
                        );
                      })}
                      <Link
                        href="/#faq"
                        onClick={closeAssistant}
                        className="block w-full rounded-xl border border-[#f9bc60]/25 px-3 py-2.5 text-center text-sm font-medium text-[#f9bc60] transition-colors hover:bg-white/5"
                      >
                        Все вопросы на главной →
                      </Link>
                    </div>
                  )}

                  {menu === 'faq-answer' && selectedFaqIndex !== null && !isTyping && (
                    <div className="space-y-2 pt-1">
                      {relatedFaqIndices.length > 0 && (
                        <div>
                          <p className="mb-2 text-xs font-medium text-[#abd1c6]">Похожие вопросы</p>
                          <div className="flex flex-wrap gap-2">
                            {relatedFaqIndices.map((index) => {
                              const item = FAQ_ITEMS[index];
                              if (!item) return null;
                              return (
                                <button
                                  key={item.question}
                                  type="button"
                                  onClick={() => handleFaqSelect(index)}
                                  className="rounded-full border border-[#abd1c6]/25 bg-white/5 px-3 py-1 text-xs text-[#fffffe] transition-colors hover:bg-white/10"
                                >
                                  {item.question}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div
                  className="border-t px-3 py-2.5"
                  style={{ borderColor: 'rgba(171, 209, 198, 0.15)' }}
                >
                  <div className="relative flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={questionInput}
                      onChange={(event) => setQuestionInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                          event.preventDefault();
                          handleQuestionSubmit();
                        }
                      }}
                      placeholder="Спросите Копи..."
                      maxLength={KOPI_MAX_QUERY_LENGTH}
                      disabled={isTyping}
                      className="min-w-0 flex-1 rounded-xl border border-[#abd1c6]/20 bg-white/5 py-2.5 pl-3 pr-10 text-sm text-[#fffffe] placeholder:text-[#abd1c6]/50 focus:border-[#f9bc60]/40 focus:outline-none disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={handleQuestionSubmit}
                      disabled={isTyping || !questionInput.trim()}
                      className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-lg text-[#f9bc60] transition-colors hover:bg-white/10 disabled:opacity-40"
                      aria-label="Отправить"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {menu === 'main' && (
                  <div
                    className="border-t px-3 py-3"
                    style={{ borderColor: 'rgba(171, 209, 198, 0.15)' }}
                  >
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[#abd1c6]">
                      <MessageCircle className="h-3.5 w-3.5" />
                      Быстрые действия
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {mainActions.map((action) => {
                        const iconKey = KOPI_ACTION_ICONS[action.id];
                        const Icon = iconKey ? ACTION_ICON_MAP[iconKey] : HelpCircle;
                        const isPrimary =
                          action.id === 'go-applications' || action.id === 'start-tour';
                        return (
                          <button
                            key={action.id}
                            type="button"
                            onClick={() => handleMainAction(action.id)}
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90',
                              isPrimary
                                ? 'bg-[#f9bc60] text-[#001e1d]'
                                : 'border border-[#abd1c6]/25 bg-[#abd1c6]/8 text-[#fffffe]',
                            )}
                          >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            {action.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {menu !== 'main' && (
                  <div
                    className="border-t px-3 py-2.5"
                    style={{ borderColor: 'rgba(171, 209, 198, 0.15)' }}
                  >
                    <KopiBackButton
                      label="В главное меню"
                      disabled={isTyping}
                      onClick={() => {
                        resetToMain();
                        replyAsKopi('Вернёмся в начало. Чем могу помочь?');
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
