'use client';

import { Compass } from 'lucide-react';
import { GlassModal, GlassModalCloseButton } from '@/components/ui/GlassModal';
import { KopiAvatar } from '@/components/kopi/KopiAssistantParts';
import { useKopiTourActions, useKopiTourState } from '@/components/kopi/KopiTourContext';
import { KopiTourStepBadge } from '@/components/kopi/KopiTourCenterShell';

export default function KopiTourInviteModal() {
  const { showInviteModal, isTourActive, isFirstVisit } = useKopiTourState();
  const { startTour, declineTour, dismissInvite } = useKopiTourActions();

  return (
    <GlassModal
      open={showInviteModal && !isTourActive}
      onClose={dismissInvite}
      size="lg"
      zIndex={120}
      hideHeader
      showCloseButton={false}
      bodyClassName="p-0"
      backdropClassName="bg-[#001e1d]/15 backdrop-blur-none"
      ariaLabelledBy="kopi-tour-invite-title"
      header={
        <div className="relative shrink-0 px-6 pt-6 sm:px-8 sm:pt-8">
          <div className="absolute right-4 top-4 z-10">
            <GlassModalCloseButton onClose={dismissInvite} />
          </div>
          <div className="flex justify-center">
            <KopiAvatar size="lg" showOnline animate />
          </div>
        </div>
      }
    >
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
          подать историю, где смотреть отзывы и как устроен личный кабинет.
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
    </GlassModal>
  );
}
