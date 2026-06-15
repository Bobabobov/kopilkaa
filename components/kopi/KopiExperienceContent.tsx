'use client';

import {
  CookieConsentBanner,
  KopiAssistant,
  KopiTourInviteModal,
  KopiTourOverlay,
  KopiTourSpotlight,
} from '@/components/kopi/KopiDynamicImports';

export default function KopiExperienceContent() {
  return (
    <>
      <KopiAssistant />
      <KopiTourInviteModal />
      <KopiTourSpotlight />
      <KopiTourOverlay />
      <CookieConsentBanner />
    </>
  );
}
