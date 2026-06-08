'use client';

import {
  CookieConsentBanner,
  KopiAssistant,
  KopiTourInviteModal,
  KopiTourOverlay,
} from '@/components/kopi/KopiDynamicImports';

export default function KopiExperienceContent() {
  return (
    <>
      <KopiAssistant />
      <KopiTourInviteModal />
      <KopiTourOverlay />
      <CookieConsentBanner />
    </>
  );
}
