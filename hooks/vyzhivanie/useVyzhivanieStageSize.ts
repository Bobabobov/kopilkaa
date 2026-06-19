'use client';

import { useEffect, useState } from 'react';
import {
  computeFullscreenStageSize,
  prefersCoarsePointer,
  type GameStageSize,
} from '@/lib/vyzhivanie/viewport';

const DEFAULT_STAGE: GameStageSize = {
  width: 320,
  height: 480,
  compact: true,
  minimapSize: 56,
};

export function useVyzhivanieStageSize(shellRef: React.RefObject<HTMLElement | null>) {
  const [stage, setStage] = useState<GameStageSize>(DEFAULT_STAGE);
  const [touchControls, setTouchControls] = useState(false);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const update = () => {
      const rect = shell.getBoundingClientRect();
      const next = computeFullscreenStageSize(rect.width, rect.height);
      setStage(next);
      setTouchControls(next.compact || prefersCoarsePointer());
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(shell);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, [shellRef]);

  return { stage, touchControls };
}
