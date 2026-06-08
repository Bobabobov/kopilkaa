'use client';

import { useEffect, useState } from 'react';
import { KopiTourProvider } from '@/components/kopi/KopiTourContext';
import KopiExperienceContent from '@/components/kopi/KopiExperienceContent';

export default function KopiExperience() {
  const [isDeferredReady, setIsDeferredReady] = useState(false);

  useEffect(() => {
    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(() => setIsDeferredReady(true));
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(() => setIsDeferredReady(true), 1);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <KopiTourProvider>
      {isDeferredReady ? <KopiExperienceContent /> : null}
    </KopiTourProvider>
  );
}
