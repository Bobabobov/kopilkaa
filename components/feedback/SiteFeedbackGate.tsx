'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { GlassModal } from '@/components/ui/GlassModal';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  FEEDBACK_MEANINGFUL_ACTION_EVENT,
  FEEDBACK_PROMPT_CONFIG,
  isFeedbackPathExcluded,
  type FeedbackTopicId,
} from '@/lib/feedback/config';
import {
  getFeedbackPromptSnapshot,
  hasPendingFeedbackAfterAction,
  markFeedbackDismissed,
  markFeedbackLater,
  markFeedbackPromptShown,
  markFeedbackSubmitted,
  shouldShowFeedbackPrompt,
  trackFeedbackPageView,
} from '@/lib/feedback/promptStorage';
import {
  SiteFeedbackForm,
  SiteFeedbackSubmitButton,
} from './SiteFeedbackForm';

function resolveFeedbackTopic(pathname: string): FeedbackTopicId {
  if (pathname.startsWith('/games')) return 'games';
  if (pathname.startsWith('/applications')) return 'applications';
  if (pathname.startsWith('/good-deeds')) return 'good_deeds';
  if (pathname.startsWith('/stories')) return 'stories';
  if (pathname.startsWith('/reviews')) return 'reviews';
  if (pathname.startsWith('/heroes')) return 'heroes';
  if (pathname.startsWith('/advertising')) return 'advertising';
  if (pathname.startsWith('/vyzhivanie')) return 'vyzhivanie';
  if (pathname.startsWith('/profile')) return 'profile';
  if (pathname.startsWith('/support')) return 'support';
  return 'general';
}

export default function SiteFeedbackGate() {
  const pathname = usePathname() ?? '/';
  const { isAuthenticated, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const retryStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const topicRef = useRef<FeedbackTopicId>('general');

  const clearTimers = useCallback(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (retryStopTimerRef.current) {
      clearTimeout(retryStopTimerRef.current);
      retryStopTimerRef.current = null;
    }
  }, []);

  const attemptOpen = useCallback(
    (trigger: 'passive' | 'after_action'): boolean => {
      if (loading || !isAuthenticated) return false;
      if (isFeedbackPathExcluded(pathname)) return false;

      const snapshot = getFeedbackPromptSnapshot();
      if (!shouldShowFeedbackPrompt(snapshot, trigger)) return false;

      topicRef.current = resolveFeedbackTopic(pathname);
      markFeedbackPromptShown();
      setOpen(true);
      clearTimers();
      return true;
    },
    [clearTimers, isAuthenticated, loading, pathname],
  );

  const tryOpenPassive = useCallback(() => {
    attemptOpen('passive');
  }, [attemptOpen]);

  const scheduleAfterActionPrompt = useCallback(() => {
    if (loading || !isAuthenticated || isFeedbackPathExcluded(pathname)) {
      return;
    }

    clearTimers();

    const tryAfterAction = () => {
      attemptOpen('after_action');
    };

    delayTimerRef.current = setTimeout(
      tryAfterAction,
      FEEDBACK_PROMPT_CONFIG.postActionDelayMs,
    );

    pollTimerRef.current = setInterval(
      tryAfterAction,
      FEEDBACK_PROMPT_CONFIG.postActionRetryMs,
    );

    retryStopTimerRef.current = setTimeout(() => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    }, FEEDBACK_PROMPT_CONFIG.postActionRetryWindowMs);
  }, [attemptOpen, clearTimers, isAuthenticated, loading, pathname]);

  useEffect(() => {
    if (loading || !isAuthenticated || isFeedbackPathExcluded(pathname)) {
      return;
    }

    trackFeedbackPageView(pathname);
    tryOpenPassive();

    if (hasPendingFeedbackAfterAction()) {
      scheduleAfterActionPrompt();
    }

    const passivePoll = setInterval(tryOpenPassive, 15_000);

    return () => {
      clearTimers();
      clearInterval(passivePoll);
    };
  }, [
    clearTimers,
    isAuthenticated,
    loading,
    pathname,
    scheduleAfterActionPrompt,
    tryOpenPassive,
  ]);

  useEffect(() => {
    const onMeaningfulAction = () => {
      scheduleAfterActionPrompt();
    };

    window.addEventListener(
      FEEDBACK_MEANINGFUL_ACTION_EVENT,
      onMeaningfulAction,
    );
    return () => {
      window.removeEventListener(
        FEEDBACK_MEANINGFUL_ACTION_EVENT,
        onMeaningfulAction,
      );
    };
  }, [scheduleAfterActionPrompt]);

  useEffect(() => {
    if (open) {
      setCompleted(false);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleClose = () => {
    markFeedbackDismissed();
    setOpen(false);
    setIsSubmitting(false);
  };

  const handleLater = () => {
    markFeedbackLater();
    setOpen(false);
    setIsSubmitting(false);
  };

  const handleSubmitted = () => {
    setCompleted(true);
    markFeedbackSubmitted();
    window.setTimeout(() => {
      setOpen(false);
      setIsSubmitting(false);
      setCompleted(false);
    }, 2200);
  };

  return (
    <GlassModal
      open={open}
      onClose={handleClose}
      title='Обратная связь'
      subtitle='Помогите нам стать лучше — это займёт пару минут.'
      icon={<MessageSquare className='h-5 w-5 text-[#f9bc60]' />}
      size='md'
      zIndex={220}
      align='center'
      maxHeight='min(92dvh, 640px)'
      footer={
        completed ? null : (
          <div className='flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <button
              type='button'
              onClick={handleLater}
              className='text-center text-sm text-[#abd1c6]/75 transition-colors hover:text-[#abd1c6] sm:text-left'
            >
              Спросить позже
            </button>
            <SiteFeedbackSubmitButton isSubmitting={isSubmitting} />
          </div>
        )
      }
    >
      <SiteFeedbackForm
        embedded
        source='popup'
        pagePath={pathname}
        initialTopic={topicRef.current}
        lockTopic={topicRef.current !== 'general'}
        onSubmitted={handleSubmitted}
        onSubmittingChange={setIsSubmitting}
      />
    </GlassModal>
  );
}
