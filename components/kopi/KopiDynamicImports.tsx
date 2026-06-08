'use client';

import dynamic from 'next/dynamic';

export const KopiAssistant = dynamic(() => import('@/components/kopi/KopiAssistant'), {
  ssr: false,
});

export const KopiTourInviteModal = dynamic(
  () => import('@/components/kopi/KopiTourInviteModal'),
  { ssr: false },
);

export const KopiTourOverlay = dynamic(
  () => import('@/components/kopi/KopiTourOverlay'),
  { ssr: false },
);

export const CookieConsentBanner = dynamic(
  () => import('@/components/layout/CookieConsentBanner'),
  { ssr: false },
);
