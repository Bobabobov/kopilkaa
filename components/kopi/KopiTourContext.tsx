'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { shouldShowKopi } from '@/lib/kopi/visibility';
import {
  hasCompletedTour,
  hasSeenTourOffer,
  markTourCompleted,
  markTourOfferSeen,
  resetTourProgress,
  KOPI_TOUR_FINISHED_EVENT,
} from '@/lib/kopi/tourStorage';
import {
  KOPI_TOUR_FINISH_MESSAGE,
  KOPI_TOUR_STEPS,
} from '@/lib/kopi/tourSteps';

const GUEST_TOUR_INVITE_MS = 900;

export interface KopiTourStateValue {
  isGuest: boolean;
  authLoading: boolean;
  isAssistantOpen: boolean;
  showInviteModal: boolean;
  isTourActive: boolean;
  isFirstVisit: boolean;
  tourStepIndex: number;
  tourStep: (typeof KOPI_TOUR_STEPS)[number] | null;
  tourProgress: number;
  canResumeTour: boolean;
}

export interface KopiTourActionsValue {
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  startTour: () => void;
  declineTour: () => void;
  dismissInvite: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  skipTour: () => void;
  finishTour: () => void;
}

export type KopiTourContextValue = KopiTourStateValue & KopiTourActionsValue;

const KopiTourStateContext = createContext<KopiTourStateValue | null>(null);
const KopiTourActionsContext = createContext<KopiTourActionsValue | null>(null);

export function KopiTourProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [isGuest, setIsGuest] = useState<boolean | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [canResumeTour, setCanResumeTour] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(() => !hasSeenTourOffer());

  const inviteTimerRef = useRef<number | null>(null);

  const clearInviteTimer = useCallback(() => {
    if (inviteTimerRef.current !== null) {
      window.clearTimeout(inviteTimerRef.current);
      inviteTimerRef.current = null;
    }
  }, []);

  const openAssistant = useCallback(() => {
    setIsAssistantOpen(true);
  }, []);

  const closeAssistant = useCallback(() => {
    setIsAssistantOpen(false);
  }, []);

  const toggleAssistant = useCallback(() => {
    setIsAssistantOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (authLoading) return;

    const guest = !isAuthenticated;
    setIsGuest(guest);
    setCanResumeTour(!hasCompletedTour());

    if (!guest) {
      clearInviteTimer();
      setShowInviteModal(false);
      return;
    }

    if (!shouldShowKopi(pathname)) {
      clearInviteTimer();
      setShowInviteModal(false);
      return;
    }

    if (
      isTourActive ||
      hasCompletedTour() ||
      hasSeenTourOffer() ||
      showInviteModal
    ) {
      if (isTourActive || hasCompletedTour() || hasSeenTourOffer()) {
        clearInviteTimer();
      }
      return;
    }

    if (inviteTimerRef.current !== null) return;

    inviteTimerRef.current = window.setTimeout(() => {
      inviteTimerRef.current = null;
      setShowInviteModal(true);
    }, GUEST_TOUR_INVITE_MS);
  }, [
    authLoading,
    isAuthenticated,
    pathname,
    isTourActive,
    showInviteModal,
    clearInviteTimer,
  ]);

  useEffect(() => {
    const onAuthChange = (event: Event) => {
      const authenticated = (
        event as CustomEvent<{ isAuthenticated?: boolean }>
      ).detail?.isAuthenticated;

      if (typeof authenticated !== 'boolean') return;

      const guest = !authenticated;
      setIsGuest(guest);

      if (guest) {
        if (
          !isTourActive &&
          !hasCompletedTour() &&
          !hasSeenTourOffer() &&
          shouldShowKopi(pathname) &&
          inviteTimerRef.current === null &&
          !showInviteModal
        ) {
          inviteTimerRef.current = window.setTimeout(() => {
            inviteTimerRef.current = null;
            setShowInviteModal(true);
          }, GUEST_TOUR_INVITE_MS);
        }
      } else {
        clearInviteTimer();
        setShowInviteModal(false);
      }
    };

    window.addEventListener('auth-status-change', onAuthChange);
    return () => window.removeEventListener('auth-status-change', onAuthChange);
  }, [isTourActive, pathname, showInviteModal, clearInviteTimer]);

  useEffect(() => () => clearInviteTimer(), [clearInviteTimer]);

  const navigateToStep = useCallback(
    (index: number) => {
      const step = KOPI_TOUR_STEPS[index];
      if (!step) return;
      // В экскурсии всегда демо-маршруты из конфига (в т.ч. /applications/demo).
      const route = step.route;
      setTourStepIndex(index);
      if (pathname !== route) {
        router.push(route);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [pathname, router],
  );

  const startTour = useCallback(() => {
    markTourOfferSeen();
    setIsFirstVisit(false);
    resetTourProgress();
    setCanResumeTour(true);
    setShowInviteModal(false);
    clearInviteTimer();
    setIsTourActive(true);
    setIsAssistantOpen(false);
    setTourStepIndex(0);
    navigateToStep(0);
  }, [navigateToStep, clearInviteTimer]);

  const dismissInvite = useCallback(() => {
    markTourOfferSeen();
    setIsFirstVisit(false);
    setShowInviteModal(false);
    clearInviteTimer();
  }, [clearInviteTimer]);

  const declineTour = dismissInvite;

  const finishTour = useCallback(() => {
    markTourCompleted();
    setCanResumeTour(true);
    setIsTourActive(false);
    setShowInviteModal(false);
    window.dispatchEvent(new CustomEvent(KOPI_TOUR_FINISHED_EVENT));
    if (pathname !== '/') {
      router.push('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, router]);

  const nextTourStep = useCallback(() => {
    const nextIndex = tourStepIndex + 1;
    if (nextIndex >= KOPI_TOUR_STEPS.length) {
      finishTour();
      return;
    }
    navigateToStep(nextIndex);
  }, [tourStepIndex, navigateToStep, finishTour]);

  const prevTourStep = useCallback(() => {
    if (tourStepIndex <= 0) return;
    navigateToStep(tourStepIndex - 1);
  }, [tourStepIndex, navigateToStep]);

  const skipTour = useCallback(() => {
    markTourCompleted();
    setCanResumeTour(true);
    setIsTourActive(false);
    setShowInviteModal(false);
    window.dispatchEvent(new CustomEvent(KOPI_TOUR_FINISHED_EVENT));
  }, []);

  const tourStep = isTourActive ? KOPI_TOUR_STEPS[tourStepIndex] ?? null : null;
  const tourProgress = isTourActive
    ? ((tourStepIndex + 1) / KOPI_TOUR_STEPS.length) * 100
    : 0;

  const stateValue = useMemo<KopiTourStateValue>(
    () => ({
      isGuest: isGuest === true,
      authLoading,
      isAssistantOpen,
      showInviteModal,
      isTourActive,
      isFirstVisit,
      tourStepIndex,
      tourStep,
      tourProgress,
      canResumeTour,
    }),
    [
      isGuest,
      authLoading,
      isAssistantOpen,
      showInviteModal,
      isTourActive,
      isFirstVisit,
      tourStepIndex,
      tourStep,
      tourProgress,
      canResumeTour,
    ],
  );

  const actionsValue = useMemo<KopiTourActionsValue>(
    () => ({
      openAssistant,
      closeAssistant,
      toggleAssistant,
      startTour,
      declineTour,
      dismissInvite,
      nextTourStep,
      prevTourStep,
      skipTour,
      finishTour,
    }),
    [
      openAssistant,
      closeAssistant,
      toggleAssistant,
      startTour,
      declineTour,
      dismissInvite,
      nextTourStep,
      prevTourStep,
      skipTour,
      finishTour,
    ],
  );

  return (
    <KopiTourStateContext.Provider value={stateValue}>
      <KopiTourActionsContext.Provider value={actionsValue}>
        {children}
      </KopiTourActionsContext.Provider>
    </KopiTourStateContext.Provider>
  );
}

export function useKopiTourState(): KopiTourStateValue {
  const context = useContext(KopiTourStateContext);
  if (!context) {
    throw new Error('useKopiTourState должен использоваться внутри KopiTourProvider');
  }
  return context;
}

export function useKopiTourActions(): KopiTourActionsValue {
  const context = useContext(KopiTourActionsContext);
  if (!context) {
    throw new Error('useKopiTourActions должен использоваться внутри KopiTourProvider');
  }
  return context;
}

export function useKopiTour(): KopiTourContextValue {
  return { ...useKopiTourState(), ...useKopiTourActions() };
}

export { KOPI_TOUR_FINISH_MESSAGE };
