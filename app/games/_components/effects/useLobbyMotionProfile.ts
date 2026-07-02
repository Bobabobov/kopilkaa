'use client';

import { useEffect, useState } from 'react';

export interface LobbyMotionProfile {
  /** Плавающие частицы фона — только десктоп без reduced-motion */
  enableParticles: boolean;
  /** backdrop-blur-xl на десктопе, md на мобильных */
  heavyBlur: boolean;
}

const MOBILE_MAX_WIDTH_PX = 767;

export function useLobbyMotionProfile(): LobbyMotionProfile {
  const [profile, setProfile] = useState<LobbyMotionProfile>({
    enableParticles: false,
    heavyBlur: false,
  });

  useEffect(() => {
    const mobileMq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH_PX}px)`);
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => {
      const isMobile = mobileMq.matches;
      const prefersReduced = reduceMq.matches;
      setProfile({
        enableParticles: !isMobile && !prefersReduced,
        heavyBlur: !isMobile,
      });
    };

    sync();
    mobileMq.addEventListener('change', sync);
    reduceMq.addEventListener('change', sync);

    return () => {
      mobileMq.removeEventListener('change', sync);
      reduceMq.removeEventListener('change', sync);
    };
  }, []);

  return profile;
}
