'use client';

import { AnimatePresence } from 'framer-motion';
import { Compass, X } from 'lucide-react';
import { useKopiTourActions, useKopiTourState } from '@/components/kopi/KopiTourContext';
import {
  KopiTourCenterShell,
  KopiTourStepBadge,
} from '@/components/kopi/KopiTourCenterShell';

export default function KopiTourInviteModal() {
  const { showInviteModal, isTourActive, isFirstVisit } = useKopiTourState();
  const { startTour, declineTour, dismissInvite } = useKopiTourActions();

  return (
    <AnimatePresence>
      {showInviteModal && !isTourActive && (
        <KopiTourCenterShell key="kopi-tour-invite" showKopiAvatar>
          <button
            type="button"
            onClick={dismissInvite}
            className="absolute right-4 top-4 z-10 rounded-xl p-2 text-[#abd1c6] transition-colors hover:bg-white/10 hover:text-[#fffffe]"
            aria-label="Закрыть приглашение"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
            <KopiTourStepBadge>
              {isFirstVisit ? 'Первый визит' : 'Экскурсия по сайту'}
            </KopiTourStepBadge>

            <h2
              id="kopi-tour-invite-title"
              className="mb-3 text-center text-2xl font-bold text-[#fffffe] sm:text-3xl"
            >
              Привет! Я Копи
            </h2>

            <p className="mb-6 text-center text-sm leading-relaxed text-[#abd1c6] sm:text-base">
              Я помогу разобраться с «Копилкой»: покажу, где читать истории, как
              подать заявку, где смотреть отзывы и как устроен личный кабинет.
              Экскурсия займёт пару минут.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={startTour}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-transform hover:scale-[1.02]"
                style={{
                  background:
                    'linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)',
                  color: '#001e1d',
                  boxShadow: '0 10px 30px rgba(249, 188, 96, 0.28)',
                }}
              >
                <Compass className="h-4 w-4" />
                Начать экскурсию
              </button>
              <button
                type="button"
                onClick={declineTour}
                className="inline-flex flex-1 items-center justify-center rounded-xl border px-5 py-3.5 text-sm font-semibold text-[#fffffe] transition-colors hover:bg-white/5"
                style={{ borderColor: 'rgba(171, 209, 198, 0.25)' }}
              >
                Позже
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-[#abd1c6]/80">
              Экскурсию можно начать позже через Копи в левом нижнем углу
            </p>
          </div>
        </KopiTourCenterShell>
      )}
    </AnimatePresence>
  );
}
